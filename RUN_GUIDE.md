# TVC Preset Studio 실행 가이드

이 문서는 새 PC에서 프로젝트를 내려받아 V1, V2, V3를 실행하고 API 설정과 이미지 자산을 관리하는 방법을 설명합니다.

## 1. 준비 사항

- Windows 10 또는 11
- Python 3.10 이상
- Chrome, Edge 등 최신 웹 브라우저
- 실제 AI 생성 테스트 시 Anthropic API 키와 WaveSpeed API 키

별도의 `pip install` 또는 `npm install`은 필요하지 않습니다. 서버는 Python 표준 라이브러리만 사용합니다.

Python 설치 여부는 명령 프롬프트에서 다음 명령으로 확인할 수 있습니다.

```powershell
python --version
```

## 2. API 설정

API 키는 브라우저 코드가 아니라 로컬 서버에서만 읽습니다. `.env`는 Git에 업로드되지 않습니다.

기존 `AI-Video-Studio` 폴더가 이 프로젝트와 나란히 있고 그 안의 `.env`에 키가 있다면, V3가 누락된 키를 서버 측에서 자동으로 공유해 사용합니다.

```text
D:\
├─ AI-Video-Studio\
│  └─ .env
└─ TVC-Preset-Studio\
   └─ START-TVC-STUDIO.cmd
```

공유할 설정이 없으면 프로젝트 폴더에서 `.env.example`을 `.env`로 복사한 뒤 아래 두 값을 입력합니다.

```dotenv
WAVESPEED_API_KEY=
ANTHROPIC_API_KEY=
```

키를 문서, 소스 코드, 브라우저 개발자 도구 또는 Git 커밋에 넣지 마세요. V3 실행 시 Anthropic 키가 어디에도 없으면 콘솔에서 가려진 입력창을 한 번 표시합니다.

## 3. 가장 쉬운 실행 방법

1. `START-TVC-STUDIO.cmd`를 더블 클릭합니다.
2. 콘솔에서 실행할 버전의 숫자를 누릅니다.
3. 서버가 시작되면 브라우저가 자동으로 열립니다.

| 선택 | 버전 | 주소 | 용도 |
|---|---|---|---|
| 1 | V1 | `http://127.0.0.1:8065/index-v1.html` | 초기 버전 확인 |
| 2 | V2 | `http://127.0.0.1:8066/` | 보존된 V2 스냅샷 확인 |
| 3 | V3 | `http://127.0.0.1:8065/` | 현재 테스트 작업선 |

V1과 V3는 같은 8065 포트를 사용하므로 동시에 실행하지 않는 것을 권장합니다. V2는 8066 포트를 사용합니다.

## 4. 명령어로 직접 실행

프로젝트 폴더에서 PowerShell 또는 명령 프롬프트를 열고 실행합니다.

### V1 또는 V3 서버

```powershell
python server.py
```

- V1: <http://127.0.0.1:8065/index-v1.html>
- V3: <http://127.0.0.1:8065/>

### V2 서버

```powershell
$env:TVC_STUDIO_PORT='8066'
python versions\v2\server.py
```

- V2: <http://127.0.0.1:8066/>

서버를 종료하려면 서버가 실행 중인 콘솔에서 `Ctrl+C`를 누릅니다.

## 5. V3 영상 생성 흐름

1. 프리셋 카드를 선택합니다.
2. 제품 이미지, 모델, 비율, 나레이션 링크, 스타일, 로고를 설정합니다.
3. 5초부터 15초까지 영상 길이를 선택합니다.
4. 짧은 요청 문장을 입력하고 AI 확장 기능을 켜거나 끕니다.
5. `영상 만들기`를 누릅니다.
6. 테스트용 확장 결과를 확인하고 720p 또는 1080p를 선택합니다.
7. 최종 동의 후 WaveSpeed 생성 요청을 보냅니다.
8. 생성이 완료되면 결과 영상을 화면에서 확인합니다.

AI 확장을 끄면 사용자가 입력한 프롬프트 원문이 그대로 WaveSpeed 요청에 사용됩니다. 확장을 켜면 서버가 Claude를 호출해 선택한 길이와 제품에 맞는 TVC 프롬프트로 확장합니다. 최종 동의 전까지 WaveSpeed 영상 생성 비용은 발생하지 않습니다.

현재 테스트 기본 모델은 비용과 속도를 우선한 Seedance 2.0 Fast Turbo입니다.

## 6. 설정 변경

`.env`에서 다음 설정을 바꿀 수 있습니다.

```dotenv
TVC_PROMPT_LLM_MODEL=claude-sonnet-5
TVC_PROMPT_LLM_EFFORT=medium
WAVESPEED_SEEDANCE_TEXT_MODEL=bytedance/seedance-2.0-fast/text-to-video-turbo
WAVESPEED_SEEDANCE_IMAGE_MODEL=bytedance/seedance-2.0-fast/image-to-video-turbo
```

Claude 확장 규칙은 프로젝트 루트의 `LLM-SYSTEM-PROMPT.md`에서 직접 편집합니다. 저장한 변경은 다음 확장 요청부터 적용됩니다. 이 파일은 웹 경로에서 열리지 않도록 서버가 차단합니다.

## 7. 이미지 자산 추가

### 출연 모델

- 여성: `assets/tvc-models/female/`
- 남성: `assets/tvc-models/male/`
- 지원 형식: PNG, JPEG, WebP
- 파일명이 모델 선택 화면의 이름으로 표시됩니다.

파일을 넣은 뒤 모델 선택창의 목록 새로고침을 누릅니다. 모델을 선택하지 않으면 선택한 프리셋 썸네일의 모델을 사용합니다.

### 프리셋

- 프리셋 이미지: `assets/tvc-presets/`
- 권장 비율: 16:9
- 권장 해상도: 960×540 이상

세부 파일명 규칙은 각 자산 폴더의 `README.md`를 확인하세요.

## 8. 문제 해결

### Python을 찾을 수 없다고 나올 때

Python 설치 시 `Add Python to PATH`를 선택했는지 확인하고 새 명령 프롬프트를 연 뒤 다시 실행합니다.

### 8065 또는 8066 포트가 이미 사용 중일 때

같은 프로젝트 서버가 이미 실행 중인지 확인합니다. V3 실행기는 8065에서 이 프로젝트의 `server.py`가 실행 중인 경우에만 안전하게 재시작합니다. 다른 프로그램이 포트를 사용 중이면 그 프로그램을 종료하거나 다른 포트를 지정합니다.

### Anthropic 키를 계속 묻거나 확장이 실패할 때

- 프로젝트 루트 `.env` 또는 `../AI-Video-Studio/.env`에 `ANTHROPIC_API_KEY`가 있는지 확인합니다.
- 키 앞뒤에 불필요한 따옴표나 공백이 없는지 확인합니다.
- 변경 후 V3를 다시 실행해 서버 환경을 새로 읽습니다.

### WaveSpeed가 이미지 확장자 오류를 반환할 때

지원되는 PNG, JPEG 또는 WebP 파일인지 확인합니다. 서버는 업로드 파일의 MIME 형식에 맞춰 확장자를 보정하지만, 실제 파일 형식이 잘못된 경우에는 다시 저장한 이미지를 사용해야 합니다.

## 9. 안전한 Git 업로드

다음 파일은 저장소에 올리지 않습니다.

- `.env`
- `*.log`
- `__pycache__/`
- `*.pyc`

업로드 전에는 반드시 `git status`로 포함 파일을 확인하고 API 키가 들어간 파일이 없는지 점검하세요.

제품 방향, 배포 원칙과 향후 개발 순서는 `PROJECT_GUIDE.md`를 기준으로 합니다.
