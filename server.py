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
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
PROMPT_SYSTEM_PATH = ROOT / "LLM-SYSTEM-PROMPT.md"
MAX_BODY = 200 * 1024 * 1024
MAX_CLAUDE_IMAGE = 5 * 1024 * 1024
IMAGE_EXTENSIONS = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
IMAGE_ALLOWED_EXTENSIONS = {
    "image/png": {".png"},
    "image/jpeg": {".jpg", ".jpeg"},
    "image/webp": {".webp"},
    "image/gif": {".gif"},
}

def safe_upload_filename(raw_name, content_type, index):
    extension = IMAGE_EXTENSIONS.get(content_type.lower())
    if not extension:
        raise ValueError(f"@image{index} 이미지 형식을 지원하지 않습니다.")
    sanitized = re.sub(r"[^A-Za-z0-9._-]", "-", str(raw_name or "")).strip(".-_")
    stem, current_extension = os.path.splitext(sanitized)
    if current_extension.lower() not in IMAGE_ALLOWED_EXTENSIONS[content_type.lower()]:
        stem = stem or sanitized
        current_extension = extension
    if not stem:
        stem = f"reference-{index}"
    return f"{stem}{current_extension.lower()}"

def load_env_file(path):
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "="not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if not value or value.lower().startswith(("your_", "replace_", "change_me", "example")):
            continue
        os.environ.setdefault(key, value)

def load_env():
    # Local TVC settings take priority. Missing provider credentials can fall
    # back to the sibling AI Video Studio without copying secrets.
    load_env_file(ROOT / ".env")
    shared_path = os.environ.get("TVC_SHARED_ENV_FILE", "").strip()
    if shared_path:
        shared_env = Path(shared_path).expanduser()
        if not shared_env.is_absolute():
            shared_env = (ROOT / shared_env).resolve()
    else:
        shared_env = ROOT.parent / "AI-Video-Studio" / ".env"
    if shared_env != ROOT / ".env":
        load_env_file(shared_env)

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

    def anthropic(self, payload, timeout=180):
        key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
        if not key:
            raise ValueError(".env에 ANTHROPIC_API_KEY를 설정해 주세요.")
        request = urllib.request.Request(
            ANTHROPIC_URL,
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)
        if path == "/api/health":
            self.send_json(200, {
                "ok": True,
                "wavespeedConfigured": bool(os.environ.get("WAVESPEED_API_KEY")),
                "anthropicConfigured": bool(os.environ.get("ANTHROPIC_API_KEY")),
                "promptModel": os.environ.get("TVC_PROMPT_LLM_MODEL", "claude-sonnet-5"),
                "promptEffort": os.environ.get("TVC_PROMPT_LLM_EFFORT", "medium"),
            })
            return
        if path.lower() == "/llm-system-prompt.md" or path == "/server-prompts" or path.startswith("/server-prompts/"):
            self.send_json(404, {"error": "지원하지 않는 경로입니다."})
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
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/tvc/prompts/expand":
            try:
                self.handle_prompt_expansion(self.read_json())
            except urllib.error.HTTPError as error:
                detail = error.read().decode("utf-8", errors="replace")
                self.send_json(error.code, {"error": self.provider_error(detail, "Claude 프롬프트 확장에 실패했습니다.")})
            except (ValueError, json.JSONDecodeError, binascii.Error) as error:
                self.send_json(400, {"error": str(error)})
            except Exception as error:
                self.send_json(502, {"error": str(error)})
            return
        if path != "/api/wavespeed/videos/generations":
            self.send_json(404, {"error": "지원하지 않는 경로입니다."}); return
        try:
            data = self.read_json()
            prompt = str(data.get("prompt") or "").strip()
            images = data.get("images") or []
            duration = int(data.get("duration") or 10)
            resolution = str(data.get("resolution") or "720p")
            ratio = str(data.get("aspectRatio") or "16:9")
            if not prompt or len(prompt) > 10000:
                raise ValueError("프롬프트는 1~10,000자여야 합니다.")
            if not isinstance(images, list) or len(images) > 30:
                raise ValueError("참조 이미지는 최대 30장입니다.")
            if duration not in range(5, 16) or resolution not in {"720p", "1080p"}:
                raise ValueError("영상 설정을 확인해 주세요.")
            if ratio not in {"16:9", "9:16", "1:1"}:
                raise ValueError("화면비를 확인해 주세요.")
            urls = [self.upload_image(image, index + 1) for index, image in enumerate(images)]
            text_model = os.environ.get("WAVESPEED_SEEDANCE_TEXT_MODEL", "bytedance/seedance-2.0-fast/text-to-video-turbo").strip()
            image_model = os.environ.get("WAVESPEED_SEEDANCE_IMAGE_MODEL", "bytedance/seedance-2.0-fast/image-to-video-turbo").strip()
            if not re.fullmatch(r"[A-Za-z0-9._/-]+", text_model) or not re.fullmatch(r"[A-Za-z0-9._/-]+", image_model):
                raise ValueError("WaveSpeed 모델 설정이 올바르지 않습니다.")
            model = image_model if len(urls) == 1 else text_model
            payload = {"prompt": prompt, "resolution": resolution, "duration": duration, "aspect_ratio": ratio, "generate_audio": bool(data.get("generateAudio", True)), "enable_web_search": False}
            if len(urls) > 1:
                payload.update({"reference_images": urls, "aspect_ratio": ratio})
            elif len(urls) == 1:
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

    def handle_prompt_expansion(self, data):
        brief = str(data.get("userBrief") or "").strip()
        if len(brief) > 4000:
            raise ValueError("간단 프롬프트는 4,000자 이하여야 합니다.")
        ratio = str(data.get("aspectRatio") or "16:9")
        if ratio not in {"16:9", "9:16", "1:1"}:
            raise ValueError("화면비를 확인해 주세요.")
        duration = int(data.get("durationSeconds") or 10)
        if duration not in range(5, 16):
            raise ValueError("영상 길이는 5초부터 15초까지 선택해 주세요.")
        style = str(data.get("style") or "변경하지 않음").strip()[:100]
        narration = str(data.get("narrationSource") or "").strip()
        if len(narration) > 2048:
            raise ValueError("나레이션 링크가 너무 깁니다.")
        images = data.get("images") or []
        if not isinstance(images, list) or len(images) > 7:
            raise ValueError("프롬프트 확장용 이미지는 최대 7장입니다.")
        content = []
        image_manifest = []
        for index, image in enumerate(images, 1):
            media_type, encoded, size = self.parse_image_data(image, index, MAX_CLAUDE_IMAGE)
            content.append({"type": "image", "source": {"type": "base64", "media_type": media_type, "data": encoded}})
            image_manifest.append({"tag": f"@image{index}", "role": str(image.get("role") or "reference")[:40], "name": str(image.get("name") or f"image-{index}")[:160], "bytes": size})
        request_input = {
            "user_brief": brief,
            "images": image_manifest,
            "aspect_ratio": ratio,
            "duration_seconds": duration,
            "narration_source": narration or None,
            "style": style,
            "logo": "있음" if bool(data.get("logo")) else "없음",
            "preset_name": str(data.get("presetName") or "광고 프리셋")[:160],
        }
        content.append({"type": "text", "text": "아래 JSON 입력을 시스템 지침에 따라 완성된 시댄스 TVC 프롬프트 하나로 확장하세요. 사용자에게 질문하지 마세요.\n\n" + json.dumps(request_input, ensure_ascii=False, indent=2)})
        if not PROMPT_SYSTEM_PATH.exists():
            raise ValueError("서버용 프롬프트 확장 지침 파일을 찾지 못했습니다.")
        model = os.environ.get("TVC_PROMPT_LLM_MODEL", "claude-sonnet-5").strip()
        effort = os.environ.get("TVC_PROMPT_LLM_EFFORT", "medium").strip().lower()
        if not re.fullmatch(r"[A-Za-z0-9._-]+", model):
            raise ValueError("Claude 모델 설정이 올바르지 않습니다.")
        if effort not in {"low", "medium", "high", "xhigh", "max"}:
            raise ValueError("Claude effort 설정이 올바르지 않습니다.")
        response = self.anthropic({
            "model": model,
            "max_tokens": 7000,
            "system": [{"type": "text", "text": PROMPT_SYSTEM_PATH.read_text(encoding="utf-8-sig"), "cache_control": {"type": "ephemeral"}}],
            "messages": [{"role": "user", "content": content}],
            "output_config": {"effort": effort},
        })
        output = "\n".join(block.get("text", "") for block in response.get("content", []) if block.get("type") == "text").strip()
        match = re.fullmatch(r"```[^\n]*\n(.*?)\n```", output, re.DOTALL)
        expanded = (match.group(1) if match else output).strip()
        if not expanded:
            raise ValueError("Claude가 확장된 프롬프트를 반환하지 않았습니다.")
        self.send_json(200, {"expandedPrompt": expanded, "model": response.get("model", model), "effort": effort, "imageCount": len(images)})

    def parse_image_data(self, image, index, max_size):
        match = re.fullmatch(r"data:(image/(?:jpeg|png|webp|gif));base64,(.+)", str((image or {}).get("dataUrl") or ""), re.DOTALL | re.IGNORECASE)
        if not match:
            raise ValueError(f"@image{index} 데이터가 올바르지 않습니다.")
        media_type, encoded = match.groups()
        content = base64.b64decode(encoded, validate=True)
        if not content or len(content) > max_size:
            raise ValueError(f"@image{index} 크기는 {max_size // (1024 * 1024)}MB 이하여야 합니다.")
        return media_type.lower(), encoded, len(content)

    def provider_error(self, detail, fallback):
        try:
            payload = json.loads(detail)
            return str((payload.get("error") or {}).get("message") or payload.get("message") or fallback)
        except Exception:
            return fallback

    def upload_image(self, image, index):
        match = re.fullmatch(r"data:(image/(?:jpeg|png|webp|gif));base64,(.+)", str((image or {}).get("dataUrl") or ""), re.DOTALL | re.IGNORECASE)
        if not match:
            raise ValueError(f"@image{index} 데이터가 올바르지 않습니다.")
        content_type, encoded = match.groups()
        content_type = content_type.lower()
        content = base64.b64decode(encoded, validate=True)
        if not content or len(content) > 200 * 1024 * 1024:
            raise ValueError(f"@image{index} 크기가 올바르지 않습니다.")
        name = safe_upload_filename((image or {}).get("name"), content_type, index)
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

