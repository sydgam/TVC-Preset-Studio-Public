const PRESETS = [
  {ko:'카페 시그니처 드링크', ind:'음식·카페', fmt:'TVC', dur:'15초', cuts:'6컷', image:'./assets/tvc-presets/food/fresh-table.png', slot:'pour macro'},
  {ko:'야간 포차 무드', ind:'음식·카페', fmt:'TVC', dur:'20초', cuts:'8컷', slot:'neon night'},
  {ko:'글로우 스킨 클로즈업', ind:'뷰티', fmt:'TVC', dur:'15초', cuts:'5컷', image:'./assets/tvc-presets/beauty/luminous-serum.png', slot:'skin macro'},
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
const INDUSTRIES = ['전체','음식·카페','뷰티','패션','리빙','헬스','교육'];
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
let industry = '전체', openFaq = null;

function presetCard(item) {
  const card = document.createElement('article'); card.className = 'preset-card';
  const visual = document.createElement('div'); visual.className = 'preset-visual';
  if (item.image) { const image = document.createElement('img'); image.src = item.image; image.alt = ''; visual.append(image); }
  const placeholder = document.createElement('span'); placeholder.textContent = `[ preset still — ${item.slot} ]`; visual.append(placeholder);
  const overlay = document.createElement('div'); overlay.className = 'preset-overlay';
  overlay.innerHTML = `<span>PREVIEW</span><p>${item.cuts} · ${item.fmt === 'TVC' ? '무드 인트로 → 제품 클로즈업 → 사용 장면 → 로고 아웃' : '훅 3초 → 제품 → 자막 CTA'}</p>`;
  if (item.fmt === 'TVC') { const link = document.createElement('a'); link.className = 'btn btn-primary'; link.href = './studio.html'; link.textContent = '이 프리셋으로 만들기'; overlay.append(link); }
  visual.append(overlay); card.append(visual);
  const title = document.createElement('h4'); title.textContent = item.ko;
  const meta = document.createElement('p'); meta.textContent = `${item.ind} · ${item.dur} · ${item.cuts}`; card.append(title, meta);
  card.addEventListener('click', event => { if (!event.target.closest('a')) card.classList.toggle('is-previewing'); });
  return card;
}
function renderRails() {
  const pool = industry === '전체' ? PRESETS : PRESETS.filter(item => item.ind === industry);
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
    card.innerHTML = `<span>${item.name}</span><h3>${item.price}</h3><small>${item.note}</small><ul>${item.lines.map(line => `<li>${line}</li>`).join('')}</ul><a class="btn btn-primary btn-block" href="./studio.html">${item.cta}</a>`; return card;
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
