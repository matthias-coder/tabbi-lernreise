import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createInitialState, getActiveProfile, createMathChallenge } from '../js/core/storage.js';
import { applyRoundResult } from '../js/core/progression.js';
import { renderAvatarView } from '../js/views/avatar-view.js';
import { renderAlbumView } from '../js/views/album-view.js';
import { renderChildGoalsView, renderParentView } from '../js/views/parent-view.js';

test('avatar, sticker album, and child goals views render zero <input> tags and support two-tap goal redemption', () => {
  let state = createInitialState();
  let p = getActiveProfile(state);
  p = applyRoundResult(p, { stageId: 'mathe-vs-t1-s1', correctCount: 8, dateKey: '2026-10-31' }).profile;
  p = { ...p, wallet: { coins: 60 } };

  const avatarHtml = renderAvatarView(p, 'accessories');
  const albumHtml = renderAlbumView(p, 0);
  const goalsHtml = renderChildGoalsView(p, p.parentGoals[0].id);

  for (const html of [avatarHtml, albumHtml, goalsHtml]) {
    assert.ok(!html.toLowerCase().includes('<input'), 'child views must not render <input>');
  }
  assert.ok(albumHtml.includes('Antippen zum Einkleben'));
  assert.ok(goalsHtml.includes('Wirklich einlösen'));
});

test('parent view stays locked behind math/PIN gate until unlocked, then exposes goal editor, vouchers, and JSON backup', () => {
  const state = createInitialState();
  const challenge = createMathChallenge(() => 0.4);
  const lockedHtml = renderParentView(state, { unlocked: false, challenge });
  assert.ok(lockedHtml.includes(challenge.prompt));
  assert.ok(!lockedHtml.includes('data-action="export-backup"'));

  const unlockedHtml = renderParentView(state, { unlocked: true, challenge });
  assert.ok(unlockedHtml.includes('data-action="export-backup"'));
  assert.ok(unlockedHtml.includes('data-action="copy-goals-all"'));
});

test('sw.js CORE_ASSETS lists every existing HTML, CSS, content, core, view, and ready SVG file on disk', () => {
  const swCode = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const match = swCode.match(/const CORE_ASSETS = \[([\s\S]*?)\];/);
  assert.ok(match, 'CORE_ASSETS array must exist in sw.js');
  const listed = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1].replace(/^\.\//, ''));
  for (const rel of listed) {
    if (rel === '') continue;
    assert.ok(fs.existsSync(new URL(`../${rel}`, import.meta.url)), `sw.js lists missing file: ${rel}`);
  }
  for (const required of ['index.html', 'css/lernreise.css', 'js/app.js', 'content/mathe-content.js', 'content/deutsch-content.js']) {
    assert.ok(listed.includes(required), `sw.js missing required asset: ${required}`);
  }
});
