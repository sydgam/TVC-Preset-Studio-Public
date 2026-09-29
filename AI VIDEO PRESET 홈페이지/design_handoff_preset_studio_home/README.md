# Handoff: PRESET STUDIO 홈페이지 (AI VIDEO PRESET)

## Overview
소상공인·사업자·마케터를 대상으로 하는 AI 영상 제작 서비스의 랜딩 페이지입니다.
핵심 제안은 두 가지 프리셋 라인 — **TVC 프리셋**(16:9, 15~20초, 방송 광고 질감)과
**쇼츠 프리셋**(9:16, 9~12초, 릴스/쇼츠) — 이며, 페이지의 1차 목표는
**프리셋 갤러리 탐색 유도**입니다. 가격 표기 금액은 확정 정책이 아닌 **가안**입니다.

## About the Design Files
이 번들의 HTML 파일은 **HTML로 만든 디자인 레퍼런스**입니다. 의도한 화면과 동작을
보여주는 프로토타입이지, 그대로 이식할 프로덕션 코드가 아닙니다.
작업은 이 디자인을 **타깃 코드베이스의 기존 환경(React/Next.js/Vue/Svelte 등)과
기존 패턴·라이브러리로 다시 구현**하는 것입니다. 아직 환경이 없다면 프로젝트에 가장
적합한 프레임워크를 고르고 그 위에 구현하세요.

`*.dc.html`은 자체 런타임(`support.js`)에서 도는 스트리밍 컴포넌트 포맷입니다.
브라우저로 직접 열면 렌더는 되지만, **이 포맷을 그대로 프로덕션에 가져가지 마세요.**
읽을 때는 두 부분만 보면 됩니다.
- `<x-dc>` 안의 마크업 = 화면 구조 (인라인 스타일이 스펙 그 자체)
- 파일 하단 `class Component extends DCLogic` = 데이터와 상태
  (`PRESETS` 배열, `renderVals()`, `turn2()`)
- `<sc-for list as>` = 리스트 반복, `<sc-if value>` = 조건부 렌더, `{{ x }}` = 값 바인딩

## Fidelity
**High-fidelity.** 색·타이포·간격·인터랙션이 확정된 목업입니다. 디자인 시스템
토큰(아래 Design Tokens, `design-system/styles.css`)을 그대로 쓰고, 레이아웃은
픽셀 단위로 재현하세요. 단, **이미지는 모두 자리표시자**입니다(사선 패턴 + 모노스페이스
라벨). 실제 소재가 들어갈 슬롯 위치와 비율만 지켜주세요.

## 구현 대상 = `2a` 하나
파일 안에는 히스토리로 세 개의 안이 들어 있습니다. 캔버스 위에 위에서부터
`2a`(Turn 2) → `1a`, `1b`(Turn 1) 순서로 배치되어 있습니다.

- **`#2a` = 확정안. 이것만 구현하세요.**
- `#1a`(갤러리 우선), `#1b`(쇼케이스 우선)는 채택되지 않은 1차 안입니다. 참고용.

각 안은 `width: 1240px` 아트보드로 감싸져 있습니다. 이 1240px 래퍼와 바깥의
`<section>`/배지(`2A`, `1A`, `1B`)는 **디자인 캔버스용 장치이므로 구현하지 않습니다.**
실제 페이지는 폭 100%, 내부 컨텐츠 가로 패딩 `56px`(1240px 기준)으로 잡으면 됩니다.

## Screens / Views

### PRESET STUDIO — 홈 (단일 페이지, 위→아래 8블록)

전역: 배경 `#161826`, 본문 텍스트 `#e9e9ed`, 폰트 Inter + Noto Sans KR
(한글), 좌측 정렬·비대칭 레이아웃. 모든 헤딩 `font-weight: 500` 고정(그 이상 굵게
쓰지 않음). 섹션 가로 패딩 `56px`.

#### 1. 헤더 (`.nav`)
- 히어로 위에 겹쳐 놓인 투명 헤더. 패딩 `22px 56px`, `display:flex`, `gap: 11.2px`.
- 브랜드 `PRESET STUDIO` — 18px / 500 / `letter-spacing: -0.01em`, `margin-right:auto`.
- 링크: `TVC 프리셋`, `쇼츠 프리셋`, `사례`, `가격` — 14px, `color: inherit`,
  hover 시 `#9184d9`.
- 우측 버튼 2개: `로그인`(`.btn.btn-secondary`), `무료로 시작`(`.btn.btn-primary`) — 13px.
  **버튼은 채우지 않습니다** — 1px 아웃라인. primary는 accent 테두리+accent 텍스트,
  hover 시 accent 12% 틴트, active 22%.

#### 2. 히어로 (전면 이미지)
- 높이 `660px`, `position: relative`.
- 배경: 전면 이미지 슬롯(`<image-slot id="ps-2a-hero">`, 16:9 아님 — 컨테이너 꽉 채움,
  `object-fit: cover` 상당). 자리표시자 문구: "전면 히어로 영상 스틸 (검정 배경 소재 권장)".
- 스크림: `linear-gradient(to top, #161826 0%, color-mix(in srgb,#161826 60%, transparent) 48%, transparent 88%)`,
  `pointer-events: none`.
- 좌하단 카피 블록(`left/right: 56px; bottom: 60px`), 우측 하단에 CTA 1개.
  - 키커: `TVC preset · Shorts preset` — 11px, `letter-spacing:.2em`, uppercase, `#9184d9`
  - H1: `촬영 없이,` / `광고가 됩니다.` (2줄, `<br>`) — **68px / 500 /
    line-height 1.02 / letter-spacing -0.03em**
  - 영문 서브(토글 가능): `Ad-film texture, straight out of a preset.` — 16px, `#cfd3e5`
  - 본문: `업종만 고르면 연출·카메라·조명·컷·자막이 이미 짜여 있습니다. 제품 사진 한 장과 한 줄이면 됩니다.`
    — 17px / line-height 1.6 / `#cfd3e5` / `max-width: 38ch`
  - CTA: `프리셋 둘러보기 →` (`.btn.btn-primary`, 패딩 `14px 26px`, 15px)
- 카피/스크림은 `pointer-events:none`, CTA 래퍼만 `pointer-events:auto`.

#### 3. 프리셋 레일 (핵심 섹션)
- 섹션 헤더: 키커 `Preset rails`, H2 `업종을 고르면 연출이 정해집니다` (32px/500/-0.02em),
  영문 서브 `Pick your business — the direction is already written.` (14px, `#9397ab`),
  우측에 `전체 128종 →` (`.btn.btn-ghost`).
- **업종 필터 칩**: `전체 / 음식·카페 / 뷰티 / 패션 / 리빙 / 헬스 / 교육`
  - 칩: `padding: 7px 15px`, `border-radius: 999px`, 13px, `transition: color .12s, border-color .12s, background .12s`
  - 비활성: `1px solid rgba(233,233,237,.16)` 테두리, 텍스트 `#b2b6ca`, 배경 투명
  - 활성: 테두리·텍스트 `#9184d9`, 배경 `color-mix(in srgb, #9184d9 14%, transparent)`
  - 칩 선택은 **TVC·쇼츠 두 레일을 동시에 필터**합니다.
- **TVC 레일**: 서브헤딩 `TVC 프리셋` (20px/500) + 모노 메타 `16:9 · 15–20초` (12px, `#9397ab`).
  가로 스크롤(`overflow-x:auto`), 카드 `gap: 18px`, 카드 폭 **340px**, 썸네일 `aspect-ratio: 16/9`.
- **쇼츠 레일**: 서브헤딩 `쇼츠 프리셋` + `9:16 · 9–12초`. 카드 폭 **196px**,
  썸네일 `aspect-ratio: 9/16`.
- **카드 구성**(공통)
  - 썸네일: `border-radius: 8px`, `box-shadow: 0 0 0 1px #3f424d`,
    자리표시자 배경 `repeating-linear-gradient(135deg, #292b31 0 7px, #232532 7px 14px)`,
    좌하단 모노 라벨 10px `#9397ab` (예: `[ preset still — pour macro ]`)
  - 제목: 16px(쇼츠 15px) / 500 / -0.01em
  - 메타: 12px `#9397ab` — `업종 · 길이 · 컷수`
  - **hover 미리보기 오버레이**: 카드에 마우스가 올라가면 썸네일 위에 오버레이가
    `opacity 0 → 1` (`transition: opacity .16s`)로 나타남.
    오버레이 = `position:absolute; inset:0; flex-direction:column; justify-content:flex-end; gap:9px; padding:18px`,
    배경 `linear-gradient(to top, #161826 0%, color-mix(in srgb,#161826 72%, transparent) 60%, transparent 100%)`.
    내용: `Preview` 키커(11px, .16em, accent) + 컷 구성 한 줄(13px, `#e4e7f5`) +
    TVC 카드에만 `이 프리셋으로 만들기` 버튼(`.btn.btn-primary`, 12px, `padding: 7px 14px`).
    컷 구성 문구는 포맷별로 생성:
    - TVC: `{컷수} · 무드 인트로 → 제품 클로즈업 → 사용 장면 → 로고 아웃`
    - 쇼츠: `{컷수} · 훅 3초 → 제품 → 자막 CTA`
  - 마우스가 벗어나면 `pointer-events: none`으로 되돌림(비활성 오버레이가 클릭을 먹지 않게).

#### 4. 3단계 사용법
- 3열 그리드, 위아래 `1px solid rgba(233,233,237,.16)` 라인, 좌우 마진 `56px`.
- 각 칸: 패딩 `36px 28px 40px 0`, 모노 번호(13px, accent) → 제목(20px/500) →
  설명(14px / line-height 1.6 / `#b2b6ca`).
- 카피(그대로 사용):
  1. `01 업종과 프리셋 고르기` — 카페·뷰티·패션·리빙 등 업종을 고르면 그 업종에서 잘 팔린 연출만 남습니다.
  2. `02 사진과 한 줄 넣기` — 제품 사진 한 장, 매장 이름, 하고 싶은 말 한 줄. 나레이션과 자막은 자동으로 붙습니다.
  3. `03 받아서 바로 올리기` — 16:9와 9:16을 함께 내보냅니다. 인스타·유튜브·네이버 규격에 맞춰 바로 업로드.

#### 5. 업종별 사례
- 키커 `In the wild`, H2 `이렇게 쓰고 있습니다` (32px).
- 행 리스트, 각 행 `grid-template-columns: 200px 1fr 200px`, `gap: 28px`,
  `padding: 22px 0`, 위쪽 `1px` 디바이더.
- 좌: 16:10 자리표시자 썸네일 / 중앙: 업종 키커(`.card-kicker` 10px uppercase accent) +
  제목(19px/500) + 본문(14px, `#b2b6ca`, `max-width: 56ch`) / 우: 지표(13px, `#d2cefd`, 우측 정렬)
- 내용 3건: 카페·성수 / 뷰티·자사몰 / 패션·스마트스토어 (파일의 `cases` 배열 참조).

#### 6. 가격 (`background: #232532`)
- 헤더: 키커 `Pricing`, H2 `쓰는 만큼만`, 우측에 `금액은 가안` 태그(`.tag.tag-neutral`).
- 3열 카드, `gap: 20px`. 카드: `padding: 24px`, `border-radius: 8px`,
  배경 `#161826`, 그림자 — 1·3번째 `--shadow-sm`, 가운데(추천) `--shadow-md`.
- 카드 내부: 플랜명(`.card-kicker`) → 가격(30px/500/-0.02em) → 단위 주석(12px `#9397ab`) →
  기능 3줄(13px `#cfd3e5`) → `.btn.btn-primary.btn-block`.
- 플랜(**금액 가안 — 확정 정책으로 교체 필요**)
  | 플랜 | 가격 | 주석 | 내용 | CTA |
  | --- | --- | --- | --- | --- |
  | 무료 체험 | ₩0 | 카드 등록 없이 | 프리셋 3종 / 720p·워터마크 / 월 3편 | 무료로 시작 |
  | 사장님 | ₩29,000 | 월 / 부가세 별도 | 프리셋 전체 128종 / 1080p·워터마크 없음 / 월 20편 · 16:9 + 9:16 | 14일 체험 |
  | 브랜드 | 문의 | 연 단위 계약 | 브랜드 전용 프리셋 제작 / 4K·팀 계정 / 제작 담당자 배정 | 상담 요청 |

#### 7. FAQ
- `grid-template-columns: 0.7fr 1.3fr`, `gap: 48px`. 좌측에 키커 `FAQ` + H2 `자주 묻는 질문`.
- 우측 아코디언: 각 행 위쪽 `1px` 디바이더, 질문 버튼 `padding: 20px 0`, 16px,
  배경/테두리 없음, 우측에 모노 부호 `+` / 열림 시 `−` (accent).
- 답변: 14px / line-height 1.7 / `#b2b6ca` / `max-width: 64ch` / `padding-bottom: 22px`.
- **한 번에 하나만 열림**(같은 항목 재클릭 시 닫힘). 질문 5개는 파일의 `faqs` 배열 참조.

#### 8. 하단 CTA
- 위쪽 `1px` 디바이더, `padding: 72px 56px 88px`, 좌우 양끝 정렬(`align-items: flex-end`).
- H2 `첫 광고는 무료로.` — 44px / 500 / -0.03em / line-height 1.06
- 영문 서브(토글): `Free to start. No card, no crew.` (14px `#9397ab`)
- 버튼 2개: `무료로 시작하기`(primary), `상담 요청`(secondary) — `padding: 14px 26px`, 15px.

## Interactions & Behavior
- **업종 칩 필터** — 선택된 업종으로 TVC/쇼츠 레일을 동시에 필터. `전체`는 전량 표시.
  (프로토타입에는 12종만 들어 있어 일부 업종은 카드 1~2개만 나옵니다. 실제로는 128종.)
- **카드 hover 미리보기** — `opacity` 0→1, `.16s`. 터치 디바이스에서는 hover가 없으므로
  탭 시 오버레이 표시 또는 메타 상시 노출로 대체하세요.
- **FAQ 아코디언** — 단일 오픈, 즉시 토글(애니메이션 미지정; 높이 트랜지션을 넣으려면 `.2s ease` 권장).
- **레일 가로 스크롤** — 네이티브 `overflow-x: auto`. 스크롤바 트랙 8px, thumb `#3f424d`.
  화살표 버튼은 프로토타입에 없음 — 데스크톱에서 필요하면 추가 논의.
- **버튼/링크 상태** — 디자인 시스템 규칙을 따릅니다. hover 틴트 + pressed 상태 + 포커스는
  `:focus-visible { outline: 2px solid #9184d9; outline-offset: 2px }`. 브라우저 기본 파란
  포커스 링을 남기지 마세요.
- **모든 CTA는 현재 링크 없음**(`#`) — 라우팅은 구현 시 정의 필요(가입/갤러리/상담 폼).
- **반응형** — 프로토타입은 1240px 데스크톱 고정입니다. 반응형 스펙은 아직 만들지 않았습니다.
  구현 전 브레이크포인트 논의를 권합니다(권장 처리: 히어로 높이 `660px → 72vh`,
  H1 `68px → clamp(38px, 8vw, 68px)`, 3단계 3열 → 1열, 사례 3열 그리드 → 1열,
  가격 3열 → 1열, 레일은 그대로 가로 스크롤 유지).

## State Management
로컬 UI 상태만 필요합니다. 서버 데이터 페칭 없음.

| 상태 | 타입 | 초기값 | 트리거 |
| --- | --- | --- | --- |
| `railInd` | string | `"전체"` | 업종 칩 클릭 |
| `hover` | string \| null | `null` | 카드 `mouseenter` / `mouseleave` |
| `faq` | number \| null | `null` | 질문 클릭(같은 인덱스 재클릭 시 `null`) |

프리셋 목록은 정적 배열(`PRESETS`)입니다. 실제 서비스에서는 API에서
`{ ko, en, ind, fmt, dur, cuts, thumbnailUrl, previewVideoUrl }` 형태로 받게 될 것으로 보입니다.

## Design Tokens
Nocturne 디자인 시스템. **원본은 `design-system/styles.css`의 `:root`이며, 이 파일을
그대로 쓰거나 토큰을 타깃 코드베이스 테마로 옮기세요.** 하드코딩 금지.

**Color**
- ground `--color-bg: #161826` · surface `--color-surface: #232532` · text `--color-text: #e9e9ed`
- accent `--color-accent: #9184d9` (단일 accent. accent-2는 동일 역할의 스탠드인)
- divider `--color-divider: color-mix(in srgb, #e9e9ed 16%, transparent)`
- neutral 100→900: `#f3f5fe #e4e7f5 #cfd3e5 #b2b6ca #9397ab #75798c #595d6c #3f424d #292b31`
- accent 100→900: `#f5f4ff #e7e5fe #d2cefd #b5abfc #968ae0 #796cbf #5d5294 #423a6a #2b2741`
- 본문 크기의 accent 텍스트는 `--color-accent-300 (#d2cefd)`를 사용(명암비).
- accent를 넓은 면적에 채우지 않습니다 — 선·마크·글자색으로만.

**Spacing** (density 0.70×) — `2.8 / 5.6 / 8.4 / 11.2 / 16.8 / 22.4 px`
(`--space-1..8`). 섹션 레벨 여백은 이 위에서 `24 / 32 / 56 / 64 / 72 / 88px`로 씀.

**Radius** — `--radius-sm: 4px` · `--radius-md: 8px` · `--radius-lg: 14px` · 칩 `999px`

**Shadow** — `--shadow-sm: 0 0 0 1px #3f424d` ·
`--shadow-md: 0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,.55)` ·
`--shadow-lg: 0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,.65)` (겹쳐 쓰지 않음)

**Typography**
- 라틴 `Inter` (400/500/600), 한글 `Noto Sans KR` (400/500/700) — Google Fonts
- 모노(자리표시자 라벨·번호·메타): `ui-monospace, Menlo, monospace`
- 헤딩 weight는 **항상 500**
- 스케일(이 페이지에서 실제로 쓴 값): 68 / 44 / 32 / 30 / 20 / 19 / 17 / 16 / 15 / 14 / 13 / 12 / 11 / 10px
- letter-spacing: 대형 헤딩 `-0.03em`, 섹션 헤딩 `-0.02em`, 카드 제목 `-0.01em`, 키커 `+0.2em`

**Component classes** (`design-system/styles.css`에 정의됨 — 병렬 구현하지 말고 이걸 쓰세요)
`.btn` + `.btn-primary/-secondary/-ghost/-icon/-block`, `.tag` + `.tag-accent/-neutral/-outline`,
`.card` + `.card-kicker/-title/-body/-meta`, `.elev-sm/-md/-lg`, `.nav` + `.nav-brand`,
`.input`/`.field`/`.radio`/`.seg`, `.table`, `.dialog`, `.lighten`

## Assets
- **이미지 없음.** 모든 이미지 자리는 자리표시자입니다.
  - 히어로 1개: 드롭 가능한 이미지 슬롯(`image-slot.js`). 구현 시에는 일반 `<img>`/`<video>`로 대체.
  - 프리셋 썸네일·사례 썸네일: 사선 패턴 배경 + 모노스페이스 라벨. 라벨 텍스트가 그 자리에
    무엇이 들어가야 하는지 설명합니다(`[ preset still — … ]`, `[ case still — … ]`).
- **아이콘 없음** — 화살표는 텍스트 문자(`→`), FAQ 부호도 텍스트(`+` / `−`).
  아이콘이 필요해지면 디자인 시스템 지정대로 **Phosphor Icons**를 사용하세요.
- 히어로/인라인 사진은 어두운·검정 배경 소재를 권장합니다(시스템의 `.lighten` 블렌드 전제).

## Files
| 파일 | 내용 |
| --- | --- |
| `AI Video Preset - Home.dc.html` | 디자인 소스. `#2a`가 확정안, `#1a`/`#1b`는 미채택 1차 안. 하단 `class Component`에 데이터(`PRESETS`, `cases`, `plans`, `faqs`)와 상태 로직. |
| `support.js` | 프로토타입 런타임. 브라우저에서 열어보기 위해 필요할 뿐, 이식 대상 아님. |
| `image-slot.js` | 히어로 자리표시자 컴포넌트. 이식 대상 아님. |
| `design-system/styles.css` | Nocturne 토큰 + 컴포넌트 레이어. **이건 그대로 가져가세요.** |
| `design-system/nocturne-guide.md` | 디자인 시스템 사용 규칙(색·타이포·상태·금지사항). |

## 미결 사항 (구현 전 확인 필요)
1. 가격 3티어 금액·제한은 **가안** — 확정 정책 필요.
2. 프리셋 실제 개수/분류(현재 "128종 · 12업종"은 예시 숫자).
3. 반응형 브레이크포인트 스펙 미작성.
4. 프리셋 상세 페이지 / 가입 플로우 / 상담 폼 미디자인.
5. 서비스명 `PRESET STUDIO`는 가제.
