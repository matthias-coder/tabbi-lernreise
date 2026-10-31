import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ASSET_CATALOG, getAsset, renderAssetHtml, renderAvatarSvg, formatAssetsTodoMarkdown } from '../js/core/assets.js';
import { speakText, stopSpeech } from '../js/core/audio.js';

test('every ready asset exists on disk and every placeholder is documented 1:1 in ASSETS_TODO.md', () => {
  const todoMd = fs.readFileSync(new URL('../ASSETS_TODO.md', import.meta.url), 'utf8');
  const entries = Object.values(ASSET_CATALOG);
  assert.ok(entries.length >= 110, `expected >= 110 catalog entries, got ${entries.length}`);

  for (const item of entries) {
    assert.ok(item.id && item.category && item.path && item.format && item.description && item.label);
    if (item.status === 'ready') {
      const full = new URL(`../${item.path}`, import.meta.url);
      assert.ok(fs.existsSync(full), `ready asset missing on disk: ${item.path}`);
    } else {
      assert.equal(item.status, 'placeholder');
      assert.ok(todoMd.includes(`\`${item.id}\``), `placeholder ${item.id} missing in ASSETS_TODO.md`);
      assert.ok(todoMd.includes(item.path), `target path ${item.path} missing in ASSETS_TODO.md`);
    }
  }
  assert.equal(todoMd.trim(), formatAssetsTodoMarkdown().trim());
});

test('renderAssetHtml exposes data-asset-id without leaking raw file paths to visible child text', () => {
  const htmlPlaceholder = renderAssetHtml('card-mond', { size: 'md', showLabel: true });
  assert.ok(htmlPlaceholder.includes('data-asset-id="card-mond"'));
  assert.ok(htmlPlaceholder.includes('Mond'));
  assert.ok(!htmlPlaceholder.includes('.svg') && !htmlPlaceholder.includes('card-mond<'));

  const htmlReady = renderAssetHtml('hand-l-3', { size: 'md', showLabel: false });
  assert.ok(htmlReady.includes('data-asset-id="hand-l-3"'));
  assert.ok(htmlReady.includes('assets/haende/hand_L_3.svg'));

  const fallback = getAsset('unknown-future-id');
  assert.equal(fallback.status, 'placeholder');
});

test('renderAvatarSvg layers body, skin color, hair, and accessories cleanly', () => {
  const svg = renderAvatarSvg({
    bodyType: 'monster',
    skinColorId: 'mint',
    hairStyleId: 'spikes',
    hairColorId: 'purple',
    accessoryIds: ['acc-krone', 'acc-brille']
  });
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('data-body-type="monster"'));
  assert.ok(svg.includes('data-accessory="acc-krone"'));
  assert.ok(svg.includes('data-accessory="acc-brille"'));
});

test('speakText degrades silently when speechSynthesis is absent, muted, or throws', () => {
  assert.equal(speakText('Hallo', { enabled: false }), false);
  assert.equal(speakText('', { enabled: true }), false);
  assert.equal(speakText('Hallo', { enabled: true, synth: null }), false);

  const spoken = [];
  const mockSynth = {
    cancel() {},
    speak(u) { spoken.push(u); }
  };
  assert.equal(speakText('Wo hörst du ein M?', { enabled: true, synth: mockSynth }), true);
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].lang, 'de-DE');

  const throwingSynth = {
    cancel() { throw new Error('audio blocked'); },
    speak() {}
  };
  assert.equal(speakText('Hallo', { enabled: true, synth: throwingSynth }), false);
  assert.doesNotThrow(() => stopSpeech(null));
});
