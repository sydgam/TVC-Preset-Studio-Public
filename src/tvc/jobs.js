import {loadAsset} from '../core/assetStore.js';
const KEY = 'studio.tvc.jobs.v1';
export const readJobs = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const saveJobs = jobs => localStorage.setItem(KEY, JSON.stringify(jobs.slice(0, 30)));
const dataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
});

async function loadStaticImage(url, fallbackName) {
  const response = await fetch(url, {cache: 'no-store'});
  if (!response.ok) throw new Error(`${fallbackName} 참조 이미지를 불러오지 못했습니다.`);
  return {name: fallbackName, dataUrl: await dataUrl(await response.blob())};
}

export async function submit(draft, assets, prompt, references = {}) {
  const images = [];
  for (const asset of assets) {
    const stored = await loadAsset(asset.id);
    if (!stored?.blob) throw new Error('제품 사진이 저장소에 없습니다. 다시 추가해 주세요.');
    images.push({name: asset.name, dataUrl: await dataUrl(stored.blob)});
  }
  if (!images.length) throw new Error('제품 사진을 1장 이상 추가해 주세요.');
  if (references.modelUrl) images.push(await loadStaticImage(references.modelUrl, 'selected-model'));
  if (references.moodUrl) images.push(await loadStaticImage(references.moodUrl, 'preset-mood'));
  const response = await fetch('/api/wavespeed/videos/generations', {method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: 'seedance-2.5', prompt, images, duration: Number(draft.duration), resolution: draft.resolution,
      aspectRatio: draft.ratio, generateAudio: draft.audio, enableSafetyChecker: true})});
  const result = await response.json();
  if (!response.ok || !result.id) throw new Error(result.error || '영상 생성 요청에 실패했습니다.');
  const job = {id: result.id, state: 'processing', created: Date.now(), product: draft.product, preset: draft.preset,
    duration: draft.duration, prompt, model: result.effectiveModel || 'seedance-2.5'};
  saveJobs([job, ...readJobs()]);
  return job;
}

export async function refreshJobs() {
  const jobs = readJobs();
  for (const job of jobs.filter(j => j.state === 'processing')) {
    try {
      const response = await fetch(`/api/wavespeed/predictions?id=${encodeURIComponent(job.id)}`, {cache: 'no-store'});
      const result = await response.json();
      if (!response.ok) { job.notice = result.error || '상태 조회 실패. 다시 확인합니다.'; continue; }
      delete job.notice;
      if (result.status === 'completed' && result.outputs?.[0]) { job.state = 'completed'; job.url = result.outputs[0]; }
      else if (['failed', 'cancelled', 'timeout'].includes(result.status)) { job.state = 'failed'; job.error = result.error || '생성이 완료되지 않았습니다.'; }
    } catch { job.notice = '연결을 확인해 주세요. 작업 ID는 보관되어 있습니다.'; }
  }
  // Merge refreshed jobs into current history so a concurrent submission is never lost.
  const updates = new Map(jobs.map(j => [j.id, j]));
  saveJobs(readJobs().map(j => updates.get(j.id) || j));
  return readJobs();
}
