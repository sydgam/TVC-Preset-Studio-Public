import assert from 'node:assert/strict';
import {presets, createShots, buildPrompt} from '../src/tvc/presets.js';
const draft = {preset: 'beauty-luminous', product: '테스트 커피', brand: '브랜드', benefits: '고소한 향', title: '', duration: '15', audio: false};
for (const preset of presets) {
  const shots = createShots(preset.id, draft.product, draft.benefits);
  const prompt = buildPrompt(draft, shots, {productCount: 2, moodTag: '@image3', modelMode: 'preset', presetHasPerson: true});
  assert.equal(shots.length, 3);
  assert.ok(prompt.includes('10.0s to 15.0s'));
  assert.ok(prompt.includes('테스트 커피'));
  assert.ok(prompt.includes('정돈된 무음'));
  assert.ok(prompt.includes('프리셋 참조 속 샘플 제품 대신'));
  assert.ok(prompt.includes('@image1 @image2'));
}
assert.throws(() => buildPrompt({...draft, product: ''}, ['a', 'b', 'c'], {productCount: 1}));
assert.throws(() => buildPrompt(draft, ['', 'b', 'c'], {productCount: 1}));
assert.throws(() => buildPrompt({...draft, duration: '31'}, ['a', 'b', 'c'], {productCount: 1}));
// A poll finishing after a new submission must not drop the new job.
let saved = JSON.stringify([{id: 'old', state: 'processing'}]);
globalThis.localStorage = {getItem: () => saved, setItem: (_, value) => {saved = value;}};
globalThis.fetch = async () => {
  saved = JSON.stringify([{id: 'new', state: 'processing'}, ...JSON.parse(saved)]);
  return {ok: true, json: async () => ({status: 'completed', outputs: ['https://example.com/video.mp4']})};
};
const {refreshJobs} = await import('../src/tvc/jobs.js');
const jobs = await refreshJobs();
assert.equal(jobs[0].id, 'new');
assert.equal(jobs[1].state, 'completed');
console.log('TVC: 9 presets, prompt validation and polling persistence passed. No paid API calls.');
