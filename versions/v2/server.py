import base64
import binascii
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = int(os.environ.get("TVC_STUDIO_PORT", "8065"))
BASE_URL = "https://api.wavespeed.ai/api/v3"
MAX_BODY = 200 * 1024 * 1024

def load_env():
    path = ROOT / ".env"
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "="not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length < 1 or length > MAX_BODY:
            raise ValueError("요청 크기가 올바르지 않습니다.")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def wavespeed(self, path, method="GET", payload=None, timeout=180):
        key = os.environ.get("WAVESPEED_API_KEY", "").strip()
        if not key:
            raise ValueError(".env에 WAVESPEED_API_KEY를 설정해 주세요.")
        request = urllib.request.Request(
            f"{BASE_URL}{path}",
            data=None if payload is None else json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "Accept": "application/json"},
            method=method,
        )
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)
        if path == "/api/health":
            self.send_json(200, {"ok": True, "wavespeedConfigured": bool(os.environ.get("WAVESPEED_API_KEY"))})
            return
        if path == "/api/tvc/models":
            folder = ROOT / "assets" / "tvc-models"
            folder.mkdir(parents=True, exist_ok=True)
            models = []
            for gender in ("female", "male"):
                gender_folder = folder / gender
                if not gender_folder.exists():
                    continue
                for item in sorted(gender_folder.iterdir(), key=lambda value: value.name.lower()):
                    if not item.is_file() or item.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                        continue
                    relative = f"{gender}/{item.name}"
                    models.append({
                        "id": relative,
                        "gender": gender,
                        "name": re.sub(r"[-_]+", " ", item.stem).strip(),
                        "url": f"/assets/tvc-models/{urllib.parse.quote(relative)}",
                    })
            self.send_json(200, {"models": models})
            return
        if path == "/api/wavespeed/predictions":
            job_id = urllib.parse.parse_qs(parsed.query).get("id", [""])[0]
            if not re.fullmatch(r"[A-Za-z0-9._-]+", job_id):
                self.send_json(400, {"error": "작업 ID가 올바르지 않습니다."}); return
            try:
                result = self.wavespeed(f"/predictions/{urllib.parse.quote(job_id)}/result")
                self.send_json(200, result.get("data", result))
            except Exception as error:
                self.send_json(502, {"error": str(error)})
            return
        super().do_GET()

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path != "/api/wavespeed/videos/generations":
            self.send_json(404, {"error": "지원하지 않는 경로입니다."}); return
        try:
            data = self.read_json()
            prompt = str(data.get("prompt") or "").strip()
            images = data.get("images") or []
            duration = int(data.get("duration") or 15)
            resolution = str(data.get("resolution") or "720p")
            ratio = str(data.get("aspectRatio") or "16:9")
            if not prompt or len(prompt) > 10000:
                raise ValueError("프롬프트는 1~10,000자여야 합니다.")
            if not isinstance(images, list) or not 1 <= len(images) <= 30:
                raise ValueError("참조 이미지는 1~30장이어야 합니다.")
            if duration not in {10, 15, 20, 30} or resolution not in {"720p", "1080p"}:
                raise ValueError("영상 설정을 확인해 주세요.")
            if ratio not in {"16:9", "9:16", "1:1"}:
                raise ValueError("화면비를 확인해 주세요.")
            urls = [self.upload_image(image, index + 1) for index, image in enumerate(images)]
            multi = len(urls) > 1
            model = "bytedance/seedance-2.5/text-to-video" if multi else "bytedance/seedance-2.5/image-to-video"
            payload = {"prompt": prompt, "resolution": resolution, "duration": duration, "generate_audio": bool(data.get("generateAudio", True)), "enable_safety_checker": True}
            if multi:
                payload.update({"reference_images": urls, "aspect_ratio": ratio})
            else:
                payload["image"] = urls[0]
            result = self.wavespeed(f"/{model}", "POST", payload)
            task = result.get("data", result)
            if not task.get("id"):
                raise ValueError("WaveSpeed가 작업 ID를 반환하지 않았습니다.")
            self.send_json(200, {"id": task["id"], "status": task.get("status"), "effectiveModel": model, "imageCount": len(urls)})
        except urllib.error.HTTPError as error:
            self.send_json(error.code, {"error": error.read().decode("utf-8", errors="replace")})
        except (ValueError, json.JSONDecodeError, binascii.Error) as error:
            self.send_json(400, {"error": str(error)})
        except Exception as error:
            self.send_json(502, {"error": str(error)})

    def upload_image(self, image, index):
        match = re.fullmatch(r"data:(image/[A-Za-z0-9.+-]+);base64,(.+)", str((image or {}).get("dataUrl") or ""), re.DOTALL)
        if not match:
            raise ValueError(f"@image{index} 데이터가 올바르지 않습니다.")
        content_type, encoded = match.groups()
        content = base64.b64decode(encoded, validate=True)
        if not content or len(content) > 200 * 1024 * 1024:
            raise ValueError(f"@image{index} 크기가 올바르지 않습니다.")
        name = re.sub(r"[^A-Za-z0-9._-]", "-", str((image or {}).get("name") or f"reference-{index}.png"))
        result = self.wavespeed("/media/uploads", "POST", {"filename": name, "size": len(content), "content_type": content_type})
        ticket = result.get("data", result)
        upload = ticket.get("upload") or {}
        if not upload.get("url") or not ticket.get("download_url"):
            raise ValueError(f"@image{index} 업로드 주소를 받지 못했습니다.")
        request = urllib.request.Request(upload["url"], data=content, headers={str(k): str(v) for k, v in (upload.get("headers") or {}).items()}, method=str(upload.get("method") or "PUT"))
        with urllib.request.urlopen(request, timeout=300):
            pass
        return ticket["download_url"]

if __name__ == "__main__":
    load_env()
    print(f"TVC Preset Studio: http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()

