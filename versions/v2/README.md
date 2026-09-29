# TVC Preset Studio

AI Video Studio에서 TVC_Preset 기능만 분리한 독립 프로젝트입니다. 원본 프로젝트와 별도로 실행됩니다.

## 실행

1. `.env.example`을 `.env`로 복사하고 WaveSpeed API 키를 입력합니다.
2. `START-TVC-STUDIO.cmd`를 실행합니다.
3. 브라우저에서 <http://127.0.0.1:8065>를 엽니다.

프리셋 썸네일은 `assets/tvc-presets`, 선택할 출연 모델 이미지는 `assets/tvc-models`에 넣습니다.
장면 초안과 화면 확인은 무료이며, **광고 영상 생성** 버튼을 누를 때만 WaveSpeed 비용이 발생합니다.

제품 방향과 개발 기준은 PROJECT_GUIDE.md를 먼저 확인하세요.
