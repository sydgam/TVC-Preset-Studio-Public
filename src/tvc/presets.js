export const categories = [
  {id: 'beauty', name: '뷰티', help: '화장품 · 스킨케어 · 향수'},
  {id: 'product', name: '제품', help: '전자제품 · 생활용품 · 패키지'},
  {id: 'food', name: '음식', help: '식품 · 음료 · 카페 메뉴'}
];

export const presets = [
  {id: 'beauty-luminous', category: 'beauty', name: '루미너스 세럼', mood: '맑은 유리 · 수분광', thumbnail: './assets/tvc-presets/beauty/luminous-serum.webp', color: '#dbcaff', icon: '✦', description: '투명한 빛과 물결 반사로 깨끗하고 촉촉한 인상을 만듭니다.', shots: ['투명한 받침 위 제품에 물결 반사가 천천히 흐른다. 29° FOV의 매크로 구도로 전면 라벨을 향해 이동한다.', '제품 표면의 응결과 제형 한 방울을 18° FOV로 담는다. 유체의 점성과 접촉 그림자가 실제처럼 이어진다.', '밝은 아이보리 배경 중앙에 제품을 세우고 47° FOV로 정착한다. 부드러운 측면광이 패키지 윤곽을 분리한다.']},
  {id: 'beauty-noir', category: 'beauty', name: '블랙 퍼퓸', mood: '검은 유리 · 골드 림라이트', thumbnail: './assets/tvc-presets/beauty/noir-perfume.webp', color: '#d7aa62', icon: '◆', description: '짙은 그림자와 금빛 가장자리로 고급스럽고 묵직하게 연출합니다.', shots: ['검은 석재 위 제품의 실루엣을 금빛 림라이트가 드러낸다. 18° FOV로 낮게 접근한다.', '유리 모서리와 캡의 재질을 12° FOV INSERT CUT으로 보여준다. 반사는 제품 형상을 따라 고정된다.', '검은 배경 중앙의 제품 뒤로 헤이즈 20%가 빛을 받는다. 29° FOV의 정적인 히어로 컷으로 끝낸다.']},
  {id: 'beauty-botanical', category: 'beauty', name: '보태니컬 케어', mood: '식물 · 아침 자연광', thumbnail: './assets/tvc-presets/beauty/botanical-care.webp', color: '#9bd5ad', icon: '❋', description: '잎사귀와 자연광을 사용해 편안하고 건강한 질감을 보여줍니다.', shots: ['아침 창가의 전경 잎사귀 사이로 제품이 보인다. 63° FOV로 천천히 제품에 접근한다.', '손이 제품을 들어 실제 사용 동작을 보여준다. 피부와 용기의 접촉, 그림자와 무게가 자연스럽다.', '밝은 목재 위 제품과 원료를 정돈해 배치한다. 47° FOV, 5600K 자연광으로 마무리한다.']},
  {id: 'product-tech', category: 'product', name: '테크 리빌', mood: '정밀한 빛 · 미래적', thumbnail: './assets/tvc-presets/product/tech-reveal.webp', color: '#87c8ff', icon: '▰', description: '기능과 마감 디테일을 정밀한 카메라 움직임으로 드러냅니다.', shots: ['어두운 스튜디오에서 얇은 청백색 빛이 제품 외곽을 따라 이동한다. 29° FOV로 천천히 접근한다.', '버튼, 단자, 표면 마감을 12° FOV의 짧은 INSERT CUT으로 보여준다.', '제품을 중앙에 두고 카메라가 20도 호를 그리며 이동한다. 형태와 로고가 모든 구간에서 동일하다.']},
  {id: 'product-minimal', category: 'product', name: '미니멀 오브젝트', mood: '밝은 배경 · 정돈된 형태', thumbnail: './assets/tvc-presets/product/minimal-object.webp', color: '#e6e4df', icon: '○', description: '군더더기 없는 배경과 부드러운 그림자로 제품 자체에 집중합니다.', shots: ['밝은 회백색 배경의 낮은 받침 위에 제품이 놓여 있다. 47° FOV의 정면 구도로 시작한다.', '카메라가 제품 옆으로 시속 2km로 이동하며 비례와 표면 질감을 보여준다.', '제품과 패키지를 나란히 정렬한다. 넓고 부드러운 상단광과 깨끗한 접촉 그림자로 끝낸다.']},
  {id: 'product-dynamic', category: 'product', name: '다이내믹 런치', mood: '강한 색 · 빠른 전환', thumbnail: './assets/tvc-presets/product/dynamic-launch.webp', color: '#ff7d91', icon: '➤', description: '강한 색면과 빠른 컷으로 출시 광고 같은 에너지를 냅니다.', shots: ['제품이 선명한 색면 앞에 등장한다. 84° FOV의 낮은 카메라가 시속 5km로 접근한다.', 'MATCH CUT으로 제품의 핵심 기능 사용 장면을 보여준다. 손과 제품의 접촉을 실제 용도에 맞춘다.', '색면이 브랜드 색으로 정리되고 제품이 중앙에 멈춘다. 마지막 2초는 읽기 쉬운 정적인 구도다.']},
  {id: 'food-fresh', category: 'food', name: '프레시 테이블', mood: '신선함 · 밝은 자연광', thumbnail: './assets/tvc-presets/food/fresh-table.webp', color: '#f4d37b', icon: '●', description: '재료의 색과 갓 준비된 순간을 밝고 생생하게 보여줍니다.', shots: ['밝은 테이블 위 제품과 실제 재료를 63° FOV로 보여준다. 창가 측면광이 표면 수분을 드러낸다.', '제품의 실제 섭취·서빙 방식에 맞는 손동작을 29° FOV로 담는다. 부스러기와 유체가 중력을 따른다.', '완성된 음식과 패키지를 함께 정돈한다. 따뜻한 하이라이트와 자연스러운 식감을 유지한다.']},
  {id: 'food-macro', category: 'food', name: '시즐 매크로', mood: '열기 · 극접사 질감', thumbnail: './assets/tvc-presets/food/sizzle-macro.webp', color: '#ff965c', icon: '◉', description: '김, 기포, 소스처럼 먹음직스러운 물리적 변화를 가까이 담습니다.', shots: ['음식 표면의 열기와 수분을 12° FOV로 담는다. 증기는 위로 흐르고 조리 표면의 기포가 실제처럼 터진다.', '소스나 음료가 제품에 맞는 방식으로 움직인다. 점성, 무게, 튀는 입자와 접촉 그림자를 유지한다.', '29° FOV로 완성된 제품 전체를 드러낸다. 따뜻한 4000K 측면광이 질감과 패키지를 함께 살린다.']},
  {id: 'food-cafe', category: 'food', name: '무드 카페', mood: '우드 · 따뜻한 여유', thumbnail: './assets/tvc-presets/food/moody-cafe.webp', color: '#c99c78', icon: '◒', description: '카페의 따뜻한 공기와 느긋한 사용 순간을 제품에 연결합니다.', shots: ['오후 카페의 전경 컵과 중경 제품, 배경 창가를 47° FOV로 구성한다. 카메라는 그림자 쪽에 위치한다.', '손이 제품을 자연스럽게 준비하고 즐기는 과정을 29° FOV로 따라간다. 동작은 실제 사용법을 따른다.', '제품 옆에 완성된 한 잔이나 플레이팅을 놓는다. 따뜻한 목재 반사와 4000K 빛으로 마무리한다.']}
];

Object.assign(presets.find(preset => preset.id === 'beauty-luminous'), {
  thumbnail: './assets/tvc-presets/beauty/luminous-serum.png',
  hasPerson: true,
});
Object.assign(presets.find(preset => preset.id === 'product-tech'), {
  thumbnail: './assets/tvc-presets/product/tech-reveal.png',
  hasPerson: false,
});
Object.assign(presets.find(preset => preset.id === 'food-fresh'), {
  thumbnail: './assets/tvc-presets/food/fresh-table.png',
  hasPerson: false,
});

export const presetsFor = category => presets.filter(preset => preset.category === category);

export function createShots(id, product, benefits) {
  const preset = presets.find(p => p.id === id);
  if (!preset) throw new Error('광고 스타일을 먼저 선택해 주세요.');
  return preset.shots.map((text, i) => `${text}\n활성 참조: @image1 ${product.trim()} 제품, 참조 이미지와 100% 일치.${i === 1 && benefits.trim() ? `\n표현할 특장점: ${benefits.trim()}` : ''}`);
}

function buildPromptLegacy(draft, shots, imageCount) {
  if (!draft.preset) throw new Error('광고 스타일을 먼저 선택해 주세요.');
  if (!draft.product.trim() || !draft.benefits.trim()) throw new Error('제품명과 특장점을 입력해 주세요.');
  if (shots.length !== 3 || shots.some(s => !s.trim())) throw new Error('세 장면의 내용을 모두 입력해 주세요.');
  const duration = Number(draft.duration);
  if (![10, 15, 20, 30].includes(duration)) throw new Error('영상 길이를 확인해 주세요.');
  const cuts = shots.map((shot, i) => {
    const start = Math.round(duration * i / 3), end = Math.round(duration * (i + 1) / 3);
    return `${start}.0s to ${end}.0s — ${shot}${i < 2 ? `\n${end}.0s HARD CUT` : ''}`;
  });
  const prompt = [
    `씬 설명\n${draft.product}의 세 장면 TV 광고. 사용자가 제공한 특장점은 ${draft.benefits}.`,
    `활성 참조\n${Array.from({length: imageCount}, (_, i) => `@image${i + 1}`).join(' ')}: 사용자가 제공한 동일 제품. 형상, 비례, 패키지 색상과 기존 로고는 참조 이미지와 100% 일치.`,
    `포맷 모드\n타임코드 있는 멀티샷. 지정된 HARD CUT에서만 컷한다.`,
    `액션\n${cuts.join('\n')}`,
    `물리\n제품의 질량, 손과 표면의 접촉, 액체와 입자는 실제 중력과 관성을 따른다.`,
    `오디오\n${draft.audio ? '장면의 재질과 동작에 맞는 자연음과 절제된 광고 음악.' : '정돈된 무음.'}`,
    `스타일\n포토리얼 상업 광고, 정교한 재질, 부드러운 하이라이트 롤오프.`,
    `출력 설정\n${draft.resolution}, ${draft.ratio}, 전체 구간 리얼타임.`,
    `포지티브 락\n모든 샷에서 하나의 동일한 제품과 동일한 패키지 디자인이 유지된다.${draft.title.trim() ? ` 마지막 제품 컷에 정확한 문구 “${draft.title}”가 또렷하게 표시된다.` : ''}`
  ].join('\n\n');
  if (prompt.length > 10000) throw new Error('장면 설명이 너무 깁니다. 최종 프롬프트를 10,000자 이하로 줄여주세요.');
  return prompt;
}

export function buildPrompt(draft, shots, references = {}) {
  if (!draft.preset) throw new Error('광고 스타일을 먼저 선택해 주세요.');
  if (!draft.product?.trim() || !draft.benefits?.trim()) throw new Error('제품명과 특징을 입력해 주세요.');
  if (shots.length !== 3 || shots.some(shot => !shot?.trim())) throw new Error('세 장면의 내용을 모두 입력해 주세요.');
  const duration = Number(draft.duration);
  if (![10, 15, 20, 30].includes(duration)) throw new Error('영상 길이를 확인해 주세요.');

  const ref = typeof references === 'number' ? {productCount: references} : references;
  const productCount = Math.max(0, Number(ref.productCount) || 0);
  const productTags = Array.from({length: productCount}, (_, index) => `@image${index + 1}`);
  const productRefs = productTags.length ? productTags.join(' ') : '@image1';
  const modelRule = ref.modelTag
    ? `출연 인물의 얼굴, 연령대, 헤어와 전체 인상은 ${ref.modelTag}의 인물로 고정한다. 의상은 광고 장면에 자연스럽게 맞추되 인물 정체성은 유지한다.`
    : ref.modelMode === 'none'
      ? '출연 인물을 만들지 않고 제품 중심으로 구성한다.'
      : ref.presetHasPerson && ref.moodTag
        ? `출연 인물은 ${ref.moodTag} 속 인물의 얼굴과 전체 인상을 일관되게 유지한다.`
        : '인물이 꼭 필요한 장면이 아니면 제품 중심으로 구성한다.';
  const moodRule = ref.moodTag
    ? `${ref.moodTag}는 광고 무드 참조다. 이 이미지에서 조명, 배경, 색감, 구도와 카메라 리듬을 가져온다. 프리셋 참조 속 샘플 제품 대신 ${productRefs}의 사용자 제품이 같은 역할과 위치를 차지한다.`
    : '선택한 프리셋의 조명, 배경, 색감, 구도와 카메라 리듬을 따른다.';
  const cuts = shots.map((shot, index) => {
    const start = Math.round(duration * index / 3);
    const end = Math.round(duration * (index + 1) / 3);
    return `${start}.0s to ${end}.0s — ${shot.trim()}${index < 2 ? `\n${end}.0s HARD CUT` : ''}`;
  });
  const brandRule = draft.brand?.trim() ? `브랜드는 ${draft.brand.trim()}이다.` : '';
  const titleRule = draft.title?.trim() ? `마지막 제품 컷에 문구 “${draft.title.trim()}”가 명료하게 보인다.` : '';
  const prompt = [
    `씬 설명\n${draft.product.trim()}을 위한 ${duration}초 TV 광고. 핵심 특징은 ${draft.benefits.trim()}. ${brandRule}`,
    `제품 참조 · 최우선 규칙\n광고 대상 제품은 모든 샷에서 ${productRefs}의 사용자 제품 하나로 고정된다. 제품의 형태, 비율, 재질, 패키지 색상, 라벨과 기존 로고를 참조 이미지와 일치시킨다. 썸네일 속 다른 제품이나 패키지는 결과에 남기지 않는다.`,
    `광고 무드 참조\n${moodRule}`,
    `출연 모델\n${modelRule}`,
    `포맷 모드\n타임코드가 있는 멀티샷. 지정한 HARD CUT에서만 컷을 전환한다.`,
    `액션\n${cuts.join('\n')}`,
    '물리\n제품의 질량, 표면 접촉, 액체와 입자는 실제 중력과 관성을 따른다. 손과 제품의 접촉은 자연스럽다.',
    `오디오\n${draft.audio ? '장면의 움직임과 맞는 자연스러운 효과음과 절제된 광고 음악.' : '정돈된 무음.'}`,
    '스타일\n포토리얼 상업 광고, 정교한 조명, 깨끗한 하이라이트 롤오프.',
    `출력 설정\n${draft.resolution || '720p'}, ${draft.ratio || '16:9'}, 전체 구간 리얼리즘 유지.`,
    `포지티브 락\n모든 컷에서 동일한 사용자 제품과 동일한 패키지 디자인을 유지한다. ${titleRule}`,
  ].join('\n\n');
  if (prompt.length > 10000) throw new Error('장면 설명이 너무 깁니다. 최종 프롬프트를 10,000자 이하로 줄여 주세요.');
  return prompt;
}
