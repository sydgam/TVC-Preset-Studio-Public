const PRESETS = [
  {ko:'카페 시그니처 드링크', ind:'음식·카페', fmt:'TVC', dur:'15초', cuts:'6컷', image:'./assets/tvc-presets/food/fresh-table.png', slot:'pour macro'},
  {ko:'야간 포차 무드', ind:'음식·카페', fmt:'TVC', dur:'20초', cuts:'8컷', slot:'neon night'},
  {ko:'글로우 스킨 클로즈업', ind:'뷰티', fmt:'TVC', dur:'15초', cuts:'5컷', image:'./assets/tvc-presets/beauty/luminous-serum.png', slot:'skin macro'},
  {ko:'샴푸 광고 프리셋', ind:'뷰티', fmt:'TVC', dur:'15초', cuts:'6컷', image:'./assets/tvc-presets/beauty/shampoo-ref.png', slot:'shampoo beauty film'},
  {ko:'룩북 워크 360', ind:'패션', fmt:'TVC', dur:'20초', cuts:'7컷', slot:'runway walk'},
  {ko:'린넨 소재 정물', ind:'리빙', fmt:'TVC', dur:'15초', cuts:'5컷', image:'./assets/tvc-presets/product/tech-reveal.png', slot:'fabric'},
  {ko:'PT 첫 세션 컷', ind:'헬스', fmt:'TVC', dur:'20초', cuts:'8컷', slot:'gym rig'},
  {ko:'웜 브런치 플레이팅', ind:'음식·카페', fmt:'쇼츠', dur:'9초', cuts:'4컷', image:'./assets/tvc-presets/food/fresh-table.png', slot:'plating'},
  {ko:'세럼 텍스처 슬로우', ind:'뷰티', fmt:'쇼츠', dur:'9초', cuts:'3컷', image:'./assets/tvc-presets/beauty/luminous-serum.png', slot:'texture'},
  {ko:'데일리 코디 스와이프', ind:'패션', fmt:'쇼츠', dur:'12초', cuts:'6컷', slot:'outfit swipe'},
  {ko:'홈카페 아침 햇살', ind:'리빙', fmt:'쇼츠', dur:'9초', cuts:'4컷', slot:'window light'},
  {ko:'3개월 변화 비포애프터', ind:'헬스', fmt:'쇼츠', dur:'12초', cuts:'5컷', slot:'before after'},
  {ko:'원데이 클래스 초대', ind:'교육', fmt:'쇼츠', dur:'12초', cuts:'5컷', slot:'studio desk'},
];
const INDUSTRIES = ['인기','음식·카페','뷰티','패션','리빙','헬스','교육'];
const CASES = [
  {ind:'카페 · 성수', title:'오픈 3주차 매장의 첫 광고', body:'메뉴 사진 4장으로 15초 TVC와 9초 쇼츠를 함께 만들어 로컬 타겟 광고에 사용했습니다.', metric:'제작 시간 7분', image:'./assets/tvc-presets/food/fresh-table.png'},
  {ind:'뷰티 · 자사몰', title:'신제품 세럼 런칭 소재', body:'같은 프리셋으로 톤만 바꿔 소재 6종을 만들고 A/B 테스트에 그대로 투입했습니다.', metric:'소재 6종 / 하루', image:'./assets/tvc-presets/beauty/luminous-serum.png'},
  {ind:'패션 · 스마트스토어', title:'주 2회 신상 업로드', body:'촬영 없이 상품컷만으로 코디 쇼츠를 매주 올리는 루틴을 만들었습니다.', metric:'촬영비 0원', image:'./assets/tvc-presets/product/tech-reveal.png'},
];
const PLANS = [
  {name:'무료 체험', price:'₩0', note:'카드 등록 없이', lines:['프리셋 3종','720p · 워터마크','월 3편'], cta:'무료로 시작'},
  {name:'사장님', price:'₩29,000', note:'월 / 부가세 별도', lines:['프리셋 전체 128종','1080p · 워터마크 없음','월 20편 · 16:9 + 9:16'], cta:'14일 체험', recommended:true},
  {name:'브랜드', price:'문의', note:'연 단위 계약', lines:['브랜드 전용 프리셋 제작','4K · 팀 계정','제작 담당자 배정'], cta:'상담 요청'},
];
const FAQS = [
  ['영상 편집을 한 번도 해본 적 없어도 되나요?','네. 업종과 프리셋을 고르고 사진과 문구를 넣으면 컷·자막·나레이션까지 자동으로 붙습니다.'],
  ['제품 사진이 몇 장 필요한가요?','한 장으로도 됩니다. 3~4장이면 컷이 더 다양해집니다. 매장 사진이나 메뉴판 사진도 소재로 쓸 수 있습니다.'],
  ['만든 영상을 광고로 집행해도 되나요?','상업적 사용이 포함됩니다. 인스타그램·유튜브·네이버·틱톡 규격으로 함께 내보냅니다.'],
  ['TVC 프리셋과 쇼츠 프리셋은 뭐가 다른가요?','TVC는 16:9, 15~20초로 브랜드 톤을 잡는 연출입니다. 쇼츠는 9:16, 9~12초로 첫 3초에 훅을 넣는 구성입니다.'],
  ['결과물이 마음에 들지 않으면요?','같은 프리셋으로 톤·자막·음악만 바꿔 다시 생성할 수 있습니다. 무료 체험에서 먼저 확인해 보세요.'],
];
let industry = '인기', openFaq = null;

function presetCard(item) {
  const card = document.createElement('article'); card.className = 'preset-card'; card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-label', item.ko + ' 프리셋으로 만들기');
  const visual = document.createElement('div'); visual.className = 'preset-visual';
  if (item.video) { const video = document.createElement('video'); video.src = item.video; video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true; video.preload = 'metadata'; visual.append(video); } else if (item.image) { const image = document.createElement('img'); image.src = item.image; image.alt = ''; visual.append(image); }
  const placeholder = document.createElement('span'); placeholder.textContent = `[ preset still — ${item.slot} ]`; visual.append(placeholder);
  const overlay = document.createElement('div'); overlay.className = 'preset-overlay';
  overlay.innerHTML = `<span>PREVIEW</span><p>${item.cuts} · ${item.fmt === 'TVC' ? '무드 인트로 → 제품 클로즈업 → 사용 장면 → 로고 아웃' : '훅 3초 → 제품 → 자막 CTA'}</p>`;
  if (item.fmt === 'TVC') { const link = document.createElement('button'); link.type = 'button'; link.className = 'btn btn-primary'; link.textContent = '이 프리셋으로 만들기'; link.addEventListener('click', event => { event.stopPropagation(); openBuilder(item.video || item.image, item.ko); }); overlay.append(link); }
  visual.append(overlay); card.append(visual);
  const title = document.createElement('h4'); title.textContent = item.ko;
  const meta = document.createElement('p'); meta.textContent = `${item.ind} · ${item.dur} · ${item.cuts}`; card.append(title, meta);
  card.addEventListener('click', event => { if (!event.target.closest('button')) openBuilder(item.video || item.image, item.ko); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBuilder(item.video || item.image, item.ko); } });
  return card;
}
function renderRails() {
  const pool = industry === '인기' ? PRESETS : PRESETS.filter(item => item.ind === industry);
  for (const [id, fmt] of [['tvcRail','TVC'],['shortsRail','쇼츠']]) {
    const rail = document.getElementById(id); rail.replaceChildren(...pool.filter(item => item.fmt === fmt).map(presetCard));
    if (!rail.children.length) { const empty = document.createElement('p'); empty.className = 'rail-empty'; empty.textContent = '이 업종의 프리셋을 준비하고 있습니다.'; rail.append(empty); }
  }
}
function renderChips() {
  const holder = document.getElementById('industryChips');
  holder.replaceChildren(...INDUSTRIES.map(label => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.setAttribute('aria-pressed', String(label === industry));
    button.onclick = () => { industry = label; renderChips(); renderRails(); };
    return button;
  }));
}
function init() {
  renderChips(); renderRails();
  document.getElementById('caseList').replaceChildren(...CASES.map(item => {
    const row = document.createElement('article'); row.className = 'case-row';
    row.innerHTML = `<img src="${item.image}" alt=""><div><span>${item.ind}</span><h3>${item.title}</h3><p>${item.body}</p></div><strong>${item.metric}</strong>`; return row;
  }));
  document.getElementById('planGrid').replaceChildren(...PLANS.map(item => {
    const card = document.createElement('article'); card.className = `plan-card${item.recommended ? ' recommended' : ''}`;
    card.innerHTML = `<span>${item.name}</span><h3>${item.price}</h3><small>${item.note}</small><ul>${item.lines.map(line => `<li>${line}</li>`).join('')}</ul><button class="btn btn-primary btn-block js-open-builder" type="button">${item.cta}</button>`; return card;
  }));
  const faqList = document.getElementById('faqList');
  const renderFaq = () => faqList.replaceChildren(...FAQS.map(([question, answer], index) => {
    const row = document.createElement('article'); row.className = 'faq-row';
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-expanded', String(openFaq === index));
    button.innerHTML = `<span>${question}</span><b>${openFaq === index ? '−' : '+'}</b>`;
    button.onclick = () => { openFaq = openFaq === index ? null : index; renderFaq(); };
    const body = document.createElement('p'); body.textContent = answer; body.hidden = openFaq !== index; row.append(button, body); return row;
  }));
  renderFaq();
}
document.addEventListener('DOMContentLoaded', init);


// V2 builder
const builderShell = document.getElementById('builderShell');
const modelShell = document.getElementById('modelShell');
const productInput = document.getElementById('productImages');
const productPreviews = document.getElementById('productPreviews');
let productFiles = [];
let selectedModel = null;
let draftModel = null;
let activeGender = 'female';
let modelLibrary = [];
let modelStatus = 'loading';
let logoPreviewUrl = null;
let activePresetName = '광고 프리셋';
let activePresetMedia = './assets/tvc-presets/beauty/luminous-serum.png';

function renderSelectedPreview(id, source, description, onRemove) {
  const container = document.getElementById(id);
  container.replaceChildren();
  if (!source) return;
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.src = source; image.alt = description;
  const remove = document.createElement('button');
  remove.type = 'button'; remove.textContent = '×';
  remove.setAttribute('aria-label', description + ' 선택 해제');
  remove.onclick = onRemove;
  figure.append(image, remove);
  container.append(figure);
}

function renderSelectedModel() {
  const model = modelLibrary.find(item => item.id === selectedModel);
  document.getElementById('modelSummary').textContent = model ? model.name + ' 모델을 사용합니다.' : '썸네일 모델을 사용합니다.';
  renderSelectedPreview('modelPreview', model?.url, model?.name || '모델', () => {
    selectedModel = null; draftModel = null; renderSelectedModel();
    document.getElementById('openModels').focus();
  });
}

function renderLogoPreview() {
  if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
  const input = document.getElementById('logoImage');
  const file = input.files[0];
  logoPreviewUrl = file ? URL.createObjectURL(file) : null;
  document.getElementById('logoName').textContent = file?.name || '미선택';
  renderSelectedPreview('logoPreview', logoPreviewUrl, '로고 이미지', () => {
    input.value = ''; renderLogoPreview();
  });
}

function openBuilder(media, presetName) {
  setWorkflowStep(0);
  if (presetName) activePresetName = presetName;
  if (media) activePresetMedia = media;
  const previewImage = document.getElementById('builderPreviewImage');
  const previewVideo = document.getElementById('builderPreviewVideo');
  const cleanMedia = typeof media === 'string' ? media.split('?')[0].toLowerCase() : '';
  const isVideo = ['.mp4', '.webm', '.ogg'].some(extension => cleanMedia.endsWith(extension));
  if (isVideo) {
    previewVideo.src = media; previewVideo.hidden = false; previewImage.hidden = true;
  } else {
    if (media) previewImage.src = media;
    previewImage.hidden = false; previewVideo.hidden = true; previewVideo.pause(); previewVideo.removeAttribute('src');
  }
  builderShell.hidden = false;
  document.body.classList.add('modal-open');
  builderShell.querySelector('.builder-close').focus();
}
function closeBuilder() {
  reviewShell.hidden = true;
  builderShell.querySelector('.builder-modal').classList.remove('is-reviewing');
  builderShell.hidden = true;
  modelShell.hidden = true;
  document.body.classList.remove('modal-open');
}
function renderProductFiles() {
  document.getElementById('productCount').textContent = productFiles.length + '/5';
  productPreviews.replaceChildren(...productFiles.map((file, index) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);
    image.alt = '제품 이미지 ' + (index + 1);
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', '이미지 삭제');
    remove.onclick = () => { productFiles.splice(index, 1); renderProductFiles(); };
    figure.append(image, remove); return figure;
  }));
}
async function loadModels() {
  modelStatus = 'loading';
  try {
    const response = await fetch('/api/tvc/models', {cache: 'no-store'});
    if (!response.ok) throw new Error('모델 목록을 불러오지 못했습니다.');
    const payload = await response.json();
    modelLibrary = Array.isArray(payload.models) ? payload.models : [];
    modelStatus = 'ready';
  } catch (error) {
    modelLibrary = [];
    modelStatus = 'error';
  }
  if (!modelShell.hidden) renderModels();
}
function renderModels() {
  const grid = document.getElementById('modelGrid');
  if (modelStatus === 'loading') {
    const status = document.createElement('p');
    status.className = 'model-empty'; status.textContent = '모델 이미지를 불러오는 중입니다.';
    grid.replaceChildren(status); return;
  }
  const models = modelLibrary.filter(model => model.gender === activeGender);
  if (!models.length) {
    const status = document.createElement('p');
    status.className = 'model-empty';
    status.textContent = modelStatus === 'error' ? '모델 이미지를 불러오지 못했습니다. 서버를 다시 실행해 주세요.' : '이 분류에 등록된 모델이 없습니다.';
    grid.replaceChildren(status); return;
  }
  grid.replaceChildren(...models.map(model => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'model-card' + (draftModel === model.id ? ' selected' : '');
    card.setAttribute('aria-pressed', String(draftModel === model.id));
    const image = document.createElement('img');
    image.src = model.url; image.alt = model.name; image.loading = 'lazy';
    const name = document.createElement('strong'); name.textContent = model.name;
    card.append(image, name);
    card.onclick = () => { draftModel = model.id; renderModels(); };
    return card;
  }));
}
function openModels() {
  draftModel = selectedModel; modelShell.hidden = false; renderModels();
  if (modelStatus === 'error' || !modelLibrary.length) loadModels();
  modelShell.querySelector('.model-close').focus();
}
function closeModels() { modelShell.hidden = true; }
function bindBuilder() {
  document.querySelectorAll('.js-open-builder').forEach(button => button.addEventListener('click', () => openBuilder()));
  builderShell.querySelector('.builder-close').onclick = closeBuilder;
  builderShell.querySelector('.builder-backdrop').onclick = closeBuilder;
  document.getElementById('openModels').onclick = openModels;
  modelShell.querySelector('.model-close').onclick = closeModels;
  modelShell.querySelector('.model-backdrop').onclick = closeModels;
  document.querySelectorAll('.gender-tabs button').forEach(button => button.onclick = () => {
    activeGender = button.dataset.gender;
    document.querySelectorAll('.gender-tabs button').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
    renderModels();
  });
  document.getElementById('clearModel').onclick = () => { draftModel = null; renderModels(); };
  document.getElementById('confirmModel').onclick = () => {
    selectedModel = draftModel;
    renderSelectedModel();
    closeModels();
  };
  productInput.onchange = () => {
    const incoming = [...productInput.files];
    productFiles = [...productFiles, ...incoming].slice(0, 5);
    productInput.value = ''; renderProductFiles();
  };
  document.getElementById('logoImage').onchange = renderLogoPreview;
  document.querySelectorAll('input[name="videoStyle"]').forEach((input, index) => input.onchange = () => {
    if (!input.checked) return;
    document.getElementById('previewStyleName').textContent = input.value;
    const previewImage = document.getElementById('builderPreviewImage'); const previewVideo = document.getElementById('builderPreviewVideo');
    previewVideo.hidden = true; previewVideo.pause(); previewVideo.removeAttribute('src'); previewImage.hidden = false;
    previewImage.src = input.closest('label').querySelector('img').src;
  });
  document.getElementById('builderForm').onsubmit = event => {
    event.preventDefault();
    openStoryboardReview();
  };
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !reviewShell.hidden) return;
    if (!modelShell.hidden) closeModels(); else if (!builderShell.hidden) closeBuilder();
  });
}
document.addEventListener('DOMContentLoaded', bindBuilder);







// Storyboard review flow
const reviewShell = document.getElementById('reviewShell');
const reviewChat = document.getElementById('reviewChat');
const generationShell = document.getElementById('generationShell');
let reviewStage = 'concept';
const storyboardCuts = [
  {time:'0s–2s', title:'CUT 1 · 첫인상', description:'분위기를 여는 와이드 샷에서 제품이 놓인 공간과 모델을 함께 보여줍니다.', camera:'느린 돌리 인 · 부드러운 초점 이동', narration:'제품과 브랜드를 한 문장으로 소개합니다.'},
  {time:'2s–4s', title:'CUT 2 · 제품 발견', description:'모델이 제품을 발견하고 손에 들어 핵심 디자인을 자연스럽게 드러냅니다.', camera:'미디엄 샷에서 제품 클로즈업', narration:'제품의 가장 중요한 장점을 설명합니다.'},
  {time:'4s–6s', title:'CUT 3 · 사용 장면', description:'실제 사용 순간과 제품 디테일을 교차해 효용을 빠르게 이해시킵니다.', camera:'매크로 디테일 · 리듬감 있는 전환', narration:'사용자가 얻는 변화를 구체적으로 말합니다.'},
  {time:'6s–8s', title:'CUT 4 · 감정 전환', description:'사용 후 달라진 분위기와 모델의 표정으로 브랜드 감정을 완성합니다.', camera:'안정적인 아이레벨 · 여유 있는 움직임', narration:'브랜드가 전하고 싶은 감정을 남깁니다.'},
  {time:'8s–10s', title:'CUT 5 · 엔딩 CTA', description:'제품과 로고를 화면 중심에 두고 짧고 선명한 행동 문구로 마무리합니다.', camera:'고정 프레임 · 로고 아웃', narration:'지금 확인해 보세요.'}
];

function makeChatMessage(kind, text) {
  const message = document.createElement('div');
  message.className = 'chat-message ' + kind;
  const bubble = document.createElement('p'); bubble.textContent = text;
  message.append(bubble); reviewChat.append(message);
  reviewChat.scrollTop = reviewChat.scrollHeight;
  return message;
}
function setReviewProgress(title, description, progress, label) {
  document.getElementById('reviewStageTitle').textContent = title;
  document.getElementById('reviewStageDescription').textContent = description;
  document.getElementById('reviewProgressText').textContent = label;
  document.getElementById('reviewProgressBar').style.width = progress + '%';
}
function renderConceptReview() {
  setWorkflowStep(1);
  reviewStage = 'concept';
  setReviewProgress('컨셉 검토 중', '선택한 분위기를 바탕으로 광고 컨셉을 먼저 확인합니다.', 34, '컨셉 확인');
  reviewChat.replaceChildren();
  makeChatMessage('assistant', '입력한 제품 자료와 선택 옵션을 바탕으로 첫 광고 컨셉을 준비했습니다.');
  const card = document.createElement('article'); card.className = 'concept-card review-card';
  const style = document.querySelector('input[name="videoStyle"]:checked')?.value || '변경하지 않음';
  card.innerHTML = '<span>CONCEPT 01</span><h3>제품의 순간을 영화처럼</h3><p class="concept-copy">선택한 프리셋의 톤을 유지하면서 제품을 초반 2초 안에 보여줍니다. 모델의 자연스러운 사용 장면과 제품 클로즈업을 교차하고, 마지막에는 로고와 짧은 행동 문구로 마무리합니다.</p><dl><div><dt>영상 스타일</dt><dd></dd></div><div><dt>구성</dt><dd>10초 · 5컷</dd></div><div><dt>기본 모델</dt><dd></dd></div></dl><footer><button type="button" class="btn btn-secondary" data-concept-revise>수정 요청</button><button type="button" class="btn btn-primary" data-concept-approve>이 컨셉으로 진행</button></footer>';
  card.querySelectorAll('dd')[0].textContent = style;
  const model = modelLibrary.find(item => item.id === selectedModel);
  card.querySelectorAll('dd')[2].textContent = model?.name || '썸네일 모델';
  reviewChat.append(card);
  card.querySelector('[data-concept-revise]').onclick = () => document.getElementById('reviewMessage').focus();
  card.querySelector('[data-concept-approve]').onclick = renderStoryboardReview;
}
function createCutCard(cut, index) {
  const card = document.createElement('article'); card.className = 'story-cut cut-' + (index + 1);
  const head = document.createElement('header');
  head.innerHTML = '<strong>' + cut.title + '</strong><span>' + cut.time + '</span><button type="button">수정</button>';
  const description = document.createElement('textarea'); description.value = cut.description; description.disabled = true; description.rows = 4; description.setAttribute('aria-label', cut.title + ' 장면 설명');
  const details = document.createElement('dl');
  details.innerHTML = '<div><dt>카메라</dt><dd></dd></div><div><dt>나레이션</dt><dd></dd></div>';
  details.querySelectorAll('dd')[0].textContent = cut.camera;
  details.querySelectorAll('dd')[1].textContent = cut.narration;
  const edit = head.querySelector('button');
  edit.onclick = () => {
    if (description.disabled) { description.disabled = false; edit.textContent = '저장'; description.focus(); card.classList.add('editing'); }
    else { cut.description = description.value.trim() || cut.description; description.value = cut.description; description.disabled = true; edit.textContent = '수정'; card.classList.remove('editing'); }
  };
  card.append(head, description, details); return card;
}
function renderStoryboardReview() {
  setWorkflowStep(2);
  reviewStage = 'storyboard';
  setReviewProgress('스토리보드 검토 중', '컷별 장면과 나레이션을 검토하고 필요한 부분을 수정하세요.', 74, '스토리보드 확인');
  reviewChat.replaceChildren();
  makeChatMessage('user', '이 컨셉으로 스토리보드를 보여주세요.');
  makeChatMessage('assistant', '10초 광고를 5개 컷으로 구성했습니다. 각 컷의 수정 버튼을 누르면 장면 설명을 직접 바꿀 수 있습니다.');
  const board = document.createElement('section'); board.className = 'storyboard-board';
  const intro = document.createElement('header'); intro.innerHTML = '<div><span>10초 STORYBOARD</span><h3>장면 구성 초안</h3></div><small>5 CUTS · 720P PREVIEW</small>';
  const grid = document.createElement('div'); grid.className = 'story-cut-grid';
  grid.replaceChildren(...storyboardCuts.map(createCutCard));
  const actions = document.createElement('footer');
  actions.innerHTML = '<button type="button" class="btn btn-secondary" data-board-revise>채팅으로 수정 요청</button><button type="button" class="btn btn-primary" data-board-confirm>스토리보드 확정</button>';
  board.append(intro, grid, actions); reviewChat.append(board);
  actions.querySelector('[data-board-revise]').onclick = () => document.getElementById('reviewMessage').focus();
  actions.querySelector('[data-board-confirm]').onclick = openGenerationConfirmation;
  reviewChat.scrollTop = 0;
}
function openStoryboardReview() {
  const modal = builderShell.querySelector('.builder-modal');
  modal.append(reviewShell);
  modal.classList.add('is-reviewing');
  builderShell.hidden = false; reviewShell.hidden = false; generationShell.hidden = true;
  const summaryImage = document.getElementById('reviewSummaryImage');
  const cleanMedia = (activePresetMedia || '').split('?')[0].toLowerCase();
  summaryImage.src = ['.mp4','.webm','.ogg'].some(ext => cleanMedia.endsWith(ext)) ? './assets/tvc-presets/beauty/luminous-serum.png' : activePresetMedia;
  document.getElementById('reviewPresetName').textContent = activePresetName;
  const ratio = document.querySelector('input[name="ratio"]:checked')?.value || '16:9';
  const style = document.querySelector('input[name="videoStyle"]:checked')?.value || '변경하지 않음';
  document.getElementById('reviewPresetMeta').textContent = ratio + ' · ' + style;
  renderConceptReview();
  reviewShell.querySelector('.review-close').focus();
}
function closeStoryboardReview() {
  setWorkflowStep(0);
  reviewShell.hidden = true; generationShell.hidden = true;
  builderShell.querySelector('.builder-modal').classList.remove('is-reviewing');
  builderShell.querySelector('.builder-close').focus();
}
function openGenerationConfirmation() {
  reviewStage = 'confirm';
  setReviewProgress('최종 확인', 'AI 영상의 특성과 예상 비용을 확인한 뒤 생성을 시작합니다.', 100, '생성 전 확인');
  generationShell.hidden = false;
  document.getElementById('cancelGeneration').focus();
}
function closeGenerationConfirmation() { generationShell.hidden = true; }
function bindStoryboardReview() {
  reviewShell.querySelector('.review-workspace').removeAttribute('role');
  reviewShell.querySelector('.review-workspace').removeAttribute('aria-modal');
  reviewShell.querySelector('.review-close').onclick = closeStoryboardReview;
  document.getElementById('reviewComposer').onsubmit = event => {
    event.preventDefault();
    const input = document.getElementById('reviewMessage');
    const request = input.value.trim(); if (!request) return;
    makeChatMessage('user', request); input.value = '';
    if (reviewStage === 'concept') {
      const copy = reviewChat.querySelector('.concept-copy');
      if (copy) copy.textContent += ' 수정 요청 반영: ' + request;
      makeChatMessage('assistant', '요청을 컨셉에 반영했습니다. 확인 후 이 컨셉으로 진행해 주세요.');
    } else {
      makeChatMessage('assistant', '수정 요청을 기록했습니다. 필요한 컷의 수정 버튼을 눌러 장면 설명도 직접 조정할 수 있습니다.');
    }
  };
  document.querySelector('.generation-backdrop').onclick = closeGenerationConfirmation;
  document.getElementById('cancelGeneration').onclick = closeGenerationConfirmation;
  document.getElementById('confirmGeneration').onclick = () => {
    closeGenerationConfirmation();
    makeChatMessage('assistant', '영상 생성 요청을 확인했습니다. 실제 생성 API 연결 전까지는 크레딧이 차감되지 않습니다.');
    document.getElementById('reviewProgressText').textContent = '생성 요청 확인';
  };
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!generationShell.hidden) closeGenerationConfirmation();
    else if (!reviewShell.hidden) closeStoryboardReview();
  });
}
document.addEventListener('DOMContentLoaded', bindStoryboardReview);

function setWorkflowStep(step) {
  document.querySelectorAll('.workflow-line li').forEach((item, index) => {
    if (index === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
    item.classList.toggle('is-complete', index < step);
  });
}



