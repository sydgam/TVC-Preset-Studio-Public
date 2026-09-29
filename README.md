# TVC Preset Studio · Public Demo

AI Video Studio에서 TVC_Preset 기능만 분리한 독립 프로젝트입니다. 원본 프로젝트와 별도로 실행됩니다.

처음 실행하거나 다른 PC에 설치하려면 [RUN_GUIDE.md](RUN_GUIDE.md)를 확인하세요.

## 실행

1. 기존 `../AI-Video-Studio/.env`에 API 키가 있으면 그대로 공유해 사용합니다. 없을 때만 `.env.example`을 `.env`로 복사해 설정합니다.
2. `START-TVC-STUDIO.cmd`를 실행합니다.
3. V1, 보존된 V2, 작업 중인 V3 가운데 실행할 버전을 선택합니다.

- V1: <http://127.0.0.1:8065/index-v1.html>
- V2 스냅샷: <http://127.0.0.1:8066>
- V3 테스트 버전: <http://127.0.0.1:8065>

V2 전체 스냅샷은 `versions/v2`에 보존합니다. 현재 루트의 `index.html`, `src`, `styles`는 V3 테스트 작업선입니다.
V2 실행 시 API 설정은 백업에 복사하지 않고 프로젝트 루트의 `.env`를 실행 중에만 읽습니다.

프리셋 썸네일은 `assets/tvc-presets`, 선택할 출연 모델 이미지는 `assets/tvc-models`에 넣습니다.
장면 초안과 화면 확인은 무료이며, **광고 영상 생성** 버튼을 누를 때만 WaveSpeed 비용이 발생합니다.

V3는 사용자의 짧은 문장을 서버의 Claude Sonnet 5(`medium`)로 확장해 결과 팝업에 보여줍니다. 모델과 effort는 `.env`의 `TVC_PROMPT_LLM_MODEL`, `TVC_PROMPT_LLM_EFFORT`로 변경할 수 있습니다. 최종 확인에서 동의한 경우에만 WaveSpeed Seedance 유료 생성 API를 호출합니다.
현재 V3 테스트 생성 기본값은 비용과 속도를 우선한 WaveSpeed Seedance 2.0 Fast Turbo입니다. `WAVESPEED_SEEDANCE_TEXT_MODEL`, `WAVESPEED_SEEDANCE_IMAGE_MODEL`로 언제든 다른 모델로 교체할 수 있습니다.
Claude의 확장 지침은 프로젝트 최상단 `LLM-SYSTEM-PROMPT.md`에서 직접 확인하고 수정할 수 있습니다. 저장한 변경은 다음 AI 확장 요청부터 적용되며 웹 브라우저에는 파일 내용이 공개되지 않습니다.
V3는 TVC 폴더의 `.env`를 우선하고 누락된 공급사 키는 기존 AI Video Studio의 `.env`에서 서버 측으로만 읽습니다. 두 곳 모두에 Anthropic 키가 없을 때만 가려진 보안 입력을 표시합니다. 키는 브라우저 코드나 로그에 노출하지 않으며, 새 설정이 즉시 적용되도록 기존 8065 TVC 서버를 확인 후 재시작합니다.

제품 방향과 개발 기준은 PROJECT_GUIDE.md를 먼저 확인하세요.


## 공개본 안내

이 공개본에는 API 키와 개인 생성 결과가 포함되지 않습니다. 실제 AI 호출은 본인의 `.env` 설정과 공급사 사용료가 필요합니다.
