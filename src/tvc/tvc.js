import {categories, presets, presetsFor, createShots, buildPrompt} from './presets.js';
import {saveAsset, loadAsset, removeAsset} from '../core/assetStore.js';
import {submit, readJobs, refreshJobs} from './jobs.js';

const KEY = 'studio.tvc.draft.v1';
const $ = id => document.getElementById(`tvc${id}`);
let draft = {preset: null, product: '', brand: '', benefits: '', title: '', duration: '15', resolution: '720p', ratio: '16:9', audio: true, assets: [], shots: [], modelMode: 'preset', modelId: null};
let models = [], busy = false, polling = false, assetUrls = [];
const thumbnailReady = new Map();
const message = text => { $('Message').textContent = text; };
const selectedPreset = () => presets.find(item => item.id === draft.preset);
const selectedModel = () => draft.modelMode === 'library' ? models.find(item => item.id === draft.modelId) : null;
function persist() { localStorage.setItem(KEY, JSON.stringify(draft)); }

function referenceContext() {
  const preset = selectedPreset(), model = selectedModel();
  const moodEnabled = Boolean(preset && thumbnailReady.get(preset.id));
  return {
    productCount: draft.assets.length,
    modelTag: model ? `@image${draft.assets.length + 1}` : null,
    moodTag: moodEnabled ? `@image${draft.assets.length + (model ? 1 : 0) + 1}` : null,
    modelMode: draft.modelMode,
    presetHasPerson: Boolean(preset?.hasPerson),
  };
}
function sync() {
  for (const key of ['product', 'brand', 'benefits', 'title', 'duration', 'resolution', 'ratio']) draft[key] = $(key).value;
  draft.audio = $('audio').checked;
  draft.shots = [0, 1, 2].map(index => $('shot' + index).value);
  persist(); preview();
}
function preview() {
  try { $('Preview').textContent = buildPrompt(draft, draft.shots, referenceContext()); }
  catch { $('Preview').textContent = '제품 정보와 세 장면을 입력하면 최종 생성 지침이 표시됩니다.'; }
  const context = referenceContext();
  const count = draft.assets.length + (context.modelTag ? 1 : 0) + (context.moodTag ? 1 : 0);
  $('ratio').disabled = count < 2;
  $('RatioHelp').textContent = count < 2 ? '참조가 한 장이면 해당 사진 비율을 시작 프레임으로 사용합니다.' : `참조 ${count}장: 제품 → 선택 모델 → 광고 무드 순서로 전달하며 선택한 화면비를 적용합니다.`;
}
function renderShots() {
  [0, 1, 2].forEach(index => { $('shot' + index).value = draft.shots[index] || ''; });
  preview();
}
function selectPreset(id) {
  if (draft.preset !== id) draft.shots = [];
  draft.preset = id;
  for (const button of $('Presets').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.preset === id));
  const preset = selectedPreset();
  $('Selected').textContent = `${preset.name} · ${preset.mood}`;
  $('Detail').hidden = false;
  renderModels(); renderShots(); persist();
}
function renderPresets(category) {
  $('CategoryTitle').textContent = categories.find(item => item.id === category)?.help || '';
  $('Presets').replaceChildren();
  for (const preset of presetsFor(category)) {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.preset = preset.id; button.className = 'tvc-preset';
    const art = document.createElement('div'); art.className = 'tvc-art'; art.style.setProperty('--tvc-color', preset.color);
    const image = document.createElement('img'); image.alt = `${preset.name} 광고 무드`; image.loading = 'lazy';
    image.addEventListener('load', () => { thumbnailReady.set(preset.id, true); image.hidden = false; if (draft.preset === preset.id) preview(); });
    image.addEventListener('error', () => { thumbnailReady.set(preset.id, false); image.hidden = true; if (draft.preset === preset.id) preview(); });
    image.src = preset.thumbnail;
    const fallback = document.createElement('span'); fallback.textContent = preset.icon;
    const mood = document.createElement('small'); mood.textContent = preset.mood;
    const name = document.createElement('strong'); name.textContent = preset.name;
    const description = document.createElement('p'); description.textContent = preset.description;
    art.append(image, fallback, mood); button.append(art, name, description);
    button.onclick = () => { selectPreset(preset.id); message('광고 무드를 선택했습니다. 제품과 출연 모델을 설정해 주세요.'); $('Detail').scrollIntoView({behavior: 'smooth', block: 'start'}); };
    $('Presets').append(button);
  }
  for (const button of $('Categories').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.category === category));
}
function modelButton(mode, title, description, model = null) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'tvc-model-card';
  button.setAttribute('aria-pressed', String(draft.modelMode === mode && (!model || draft.modelId === model.id)));
  if (model) { const image = document.createElement('img'); image.src = model.url; image.alt = model.name; button.append(image); }
  const copy = document.createElement('span'), strong = document.createElement('strong'), small = document.createElement('small');
  strong.textContent = title; small.textContent = description; copy.append(strong, small); button.append(copy);
  button.onclick = () => { draft.modelMode = mode; draft.modelId = model?.id || null; persist(); renderModels(); preview(); };
  return button;
}
function renderModels() {
  const list = $('Models'); if (!list) return;
  list.replaceChildren();
  const preset = selectedPreset();
  list.append(modelButton('preset', preset?.hasPerson ? '썸네일 속 인물 사용' : '프리셋 구성 따름', preset?.hasPerson ? '썸네일의 인물과 분위기를 함께 참조' : '인물 강제 없이 제품 중심으로 구성'));
  list.append(modelButton('none', '인물 없이 제품 중심', '제품, 손 또는 연출 오브젝트만 사용'));
  for (const model of models) list.append(modelButton('library', model.name, '이 인물의 얼굴과 전체 인상을 유지', model));
  $('ModelsEmpty').hidden = models.length > 0;
}
async function loadModels() {
  try {
    const response = await fetch('/api/tvc/models', {cache: 'no-store'}), result = await response.json();
    if (!response.ok) throw new Error(result.error || '모델 목록을 불러오지 못했습니다.');
    models = Array.isArray(result.models) ? result.models : [];
    if (draft.modelMode === 'library' && !models.some(item => item.id === draft.modelId)) { draft.modelMode = 'preset'; draft.modelId = null; persist(); }
    renderModels(); preview();
  } catch (error) { models = []; renderModels(); message(error.message); }
}
async function renderAssets() {
  assetUrls.forEach(URL.revokeObjectURL); assetUrls = []; $('Images').replaceChildren();
  for (const asset of draft.assets) {
    const card = document.createElement('div'); card.className = 'tvc-image';
    const stored = await loadAsset(asset.id);
    if (stored?.blob) { const image = document.createElement('img'); image.src = URL.createObjectURL(stored.blob); assetUrls.push(image.src); image.alt = asset.name; card.append(image); }
    const button = document.createElement('button'); button.type = 'button'; button.textContent = `제거 · ${asset.name}`; button.disabled = busy;
    button.onclick = async () => { if (busy) return; draft.assets = draft.assets.filter(item => item.id !== asset.id); persist(); await removeAsset(asset.id); await renderAssets(); };
    card.append(button); $('Images').append(card);
  }
  preview();
}
function renderJobs(jobs) {
  for (const job of jobs) {
    let row = document.getElementById('tvc-job-' + job.id);
    if (row?.dataset.state === 'completed') continue;
    const fresh = !row;
    if (!row) { row = document.createElement('article'); row.id = 'tvc-job-' + job.id; row.className = 'tvc-job'; }
    row.dataset.state = job.state; row.replaceChildren();
    const title = document.createElement('strong'); title.textContent = `${job.product} · ${job.duration}초 · ${{processing: '생성 중', completed: '완료', failed: '실패'}[job.state]}`;
    const note = document.createElement('p'); note.textContent = job.error || job.notice || `작업 ID: ${job.id}`; row.append(title, note);
    if (job.url && /^https?:\/\//.test(job.url)) {
      const video = document.createElement('video'); video.controls = true; video.preload = 'metadata'; video.src = job.url;
      const link = document.createElement('a'); link.href = job.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = '영상 원본 열기 · 저장'; row.append(video, link);
    }
    const details = document.createElement('details'), summary = document.createElement('summary'), pre = document.createElement('pre');
    summary.textContent = '사용한 연출 지침'; pre.textContent = job.prompt; details.append(summary, pre); row.append(details);
    if (fresh) $('History').prepend(row);
  }
  $('Empty').hidden = jobs.length > 0;
}
async function refresh() {
  if (polling) return; polling = true;
  try { renderJobs((await refreshJobs()).slice().reverse()); } catch (error) { message(error.message); } finally { polling = false; }
}

export function init() {
  const panel = $('Panel'); if (!panel) return;
  try { draft = {...draft, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; } catch {}
  draft.preset = null;
  panel.innerHTML = `
    <header class="tvc-header"><div><span>PRODUCT · COMMERCIAL</span><h2>TVC_Preset</h2><p>원하는 광고 무드를 고르고 사용자 제품과 출연 모델을 적용해 장면을 만듭니다.</p></div><span class="tvc-badge">Seedance 2.5</span></header>
    <section class="tvc-section"><h3>01 · 광고 무드 선택</h3><p>뷰티, 제품, 음식 중 하나를 고른 뒤 썸네일의 모델·조명·배경·구도를 보고 원하는 광고를 선택하세요. 썸네일 속 제품은 샘플이며 실제 생성에서는 사용자가 올린 제품으로 교체합니다.</p><div id="tvcCategories" class="tvc-categories"></div><p id="tvcCategoryTitle" class="tvc-category-title"></p><div id="tvcPresets" class="tvc-presets"></div></section>
    <div id="tvcDetail" class="tvc-detail" hidden><div class="tvc-selection"><span>선택한 광고 무드</span><strong id="tvcSelected"></strong></div><div class="tvc-layout"><section class="tvc-section"><h3>02 · 제품과 출연 모델</h3>
      <label class="tvc-upload">사용할 제품 사진 추가 · 최대 6장<input id="tvcUpload" type="file" accept="image/png,image/jpeg,image/webp" multiple /></label><p>첫 사진이 제품의 기준입니다. 최대 15MB · PNG/JPEG/WebP</p><div id="tvcImages" class="tvc-images"></div>
      <div class="tvc-model-heading"><div><strong>출연 모델</strong><p>썸네일 인물을 유지하거나, 인물을 빼거나, 모델 폴더의 인물을 선택할 수 있습니다.</p></div><button class="button button--secondary" id="tvcModelsReload" type="button">목록 새로고침</button></div>
      <div id="tvcModels" class="tvc-models"></div><p id="tvcModelsEmpty">모델 이미지가 없습니다. assets/tvc-models 폴더에 PNG/JPEG/WebP 파일을 넣고 목록을 새로고침하세요.</p>
      <label>제품명<input id="tvcproduct" maxlength="100" placeholder="예: 모닝브리즈 세럼밤" /></label>
      <label>브랜드 · 선택<input id="tvcbrand" maxlength="100" /></label>
      <label>제품 특징<textarea id="tvcbenefits" rows="4" maxlength="1000" placeholder="예: 소재, 실제 사용법, 광고에서 보여줄 특징"></textarea></label>
      <label>마지막 광고 문구 · 선택<input id="tvctitle" maxlength="100" placeholder="예: 당신의 아침을 깨우는 한 방울" /></label>
      <div class="tvc-options"><label>길이<select id="tvcduration"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label><label>해상도<select id="tvcresolution"><option>720p</option><option>1080p</option></select></label><label>화면비<select id="tvcratio"><option>16:9</option><option>9:16</option><option>1:1</option></select></label></div>
      <p id="tvcRatioHelp"></p><label class="tvc-check"><input id="tvcaudio" type="checkbox" checked /> 음악·효과음 생성</label>
      <button class="button" id="tvcPlan" type="button">프리셋으로 장면 초안 만들기</button><p>초안 만들기는 로컬 규칙으로 작동하므로 API 비용이 없습니다.</p>
    </section><section class="tvc-section"><h3>03 · 장면 검토와 생성</h3><p>세 장면은 한 번의 영상 생성 요청으로 전달됩니다. 각 장면을 직접 수정할 수 있습니다.</p>
      ${['도입 · 시선 끌기', '전개 · 특징 보여주기', '마무리 · 제품 히어로'].map((label, index) => `<label>${index + 1}. ${label}<textarea id="tvcshot${index}" rows="4" maxlength="2200"></textarea></label>`).join('')}
      <details><summary>최종 전송 지침 확인</summary><pre id="tvcPreview"></pre></details>
      <p>생성 버튼은 유료 WaveSpeed API를 호출합니다. 제품 일치와 인물 일관성은 생성 결과에서 최종 확인하세요.</p>
      <button class="button" id="tvcGenerate" type="button">광고 영상 생성 · 유료 API</button><p id="tvcMessage" role="status" aria-live="polite"></p>
    </section></div></div>
    <section class="tvc-section"><h3>04 · 생성 기록</h3><p>초안·작업 ID는 이 브라우저에 저장됩니다. 완료 영상은 원본 링크가 만료되기 전에 저장하세요.</p><button class="button button--secondary" id="tvcRefresh" type="button">상태 새로고침</button><p id="tvcEmpty">아직 생성한 광고가 없습니다.</p><div id="tvcHistory"></div></section>`;
  for (const category of categories) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.category = category.id;
    button.innerHTML = `<strong>${category.name}</strong><span>${category.help}</span>`;
    button.onclick = () => { draft.preset = null; draft.shots = []; $('Detail').hidden = true; renderPresets(category.id); persist(); };
    $('Categories').append(button);
  }
  renderPresets('beauty');
  for (const key of ['product', 'brand', 'benefits', 'title', 'duration', 'resolution', 'ratio']) { $(key).value = draft[key]; $(key).addEventListener('input', sync); }
  $('audio').checked = draft.audio; $('audio').addEventListener('change', sync);
  [0, 1, 2].forEach(index => $('shot' + index).addEventListener('input', sync));
  renderShots(); renderAssets().catch(error => message(error.message)); renderJobs(readJobs().slice().reverse()); loadModels();
  $('ModelsReload').onclick = loadModels;
  $('Upload').onchange = async () => {
    try {
      const files = [...$('Upload').files];
      if (files.length + draft.assets.length > 6) throw new Error('제품 사진은 최대 6장입니다.');
      if (files.some(file => !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024)) throw new Error('사진 형식 또는 15MB 크기 제한을 확인해 주세요.');
      for (const file of files) { const id = 'tvc-' + crypto.randomUUID(); await saveAsset({id, name: file.name, blob: file}); draft.assets.push({id, name: file.name}); }
      persist(); await renderAssets(); message('제품 사진을 저장했습니다.');
    } catch (error) { message(error.message); } finally { $('Upload').value = ''; }
  };
  $('Plan').onclick = () => {
    sync(); if (!draft.product.trim() || !draft.benefits.trim()) return message('제품명과 특징을 입력해 주세요.');
    draft.shots = createShots(draft.preset, draft.product, draft.benefits); persist(); renderShots(); message('장면 초안을 만들었습니다. 내용을 검토하고 수정해 주세요.');
  };
  $('Generate').onclick = async () => {
    if (busy) return;
    try {
      sync(); if (!draft.assets.length) throw new Error('사용자 제품 사진을 추가해 주세요.');
      const context = referenceContext(), prompt = buildPrompt(draft, draft.shots, context), preset = selectedPreset(), model = selectedModel();
      busy = true; $('Generate').disabled = true; $('Upload').disabled = true; message('제품·모델·무드 참조를 전송하고 영상을 요청하는 중입니다.');
      await submit(structuredClone(draft), [...draft.assets], prompt, {modelUrl: model?.url || null, moodUrl: context.moodTag ? preset?.thumbnail : null});
      renderJobs(readJobs().slice().reverse()); message('생성을 시작했습니다. 아래 기록에서 확인하세요.');
    } catch (error) { message(error.message); }
    finally { busy = false; $('Generate').disabled = false; $('Upload').disabled = false; }
  };
  $('Refresh').onclick = refresh; $('Tab').addEventListener('click', refresh);
  setInterval(() => { if (panel.classList.contains('is-active')) refresh(); }, 6000);
}
