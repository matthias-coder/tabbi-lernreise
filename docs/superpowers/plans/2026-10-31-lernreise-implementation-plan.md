# Lernreise (Eigenständiger Fork: Vorschule, Klasse 1 & 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the standalone gamified learning PWA `Lernreise` in `c:\Users\matth\OneDrive\Dokumente\lernreise` (leaving `tabbi` untouched) for Preschool, Grade 1, and Grade 2 in Math and German with multi-child profiles, JSON backup, layered Avatar Builder, Sticker Album + Surprise Chest unlocks, and separate Taler currency for Parent Goals.

**Architecture:** Zero-build Vanilla HTML5/CSS3/ES-Module Single-Page App split into three strict layers: pure curriculum/catalog data (`content/*.js`), pure Node-testable domain & state modules (`js/core/*.js`), and touch-first DOM views (`js/views/*.js`). All visual motifs resolve through a single Asset Registry (`js/core/assets.js`) paired with a verified `ASSETS_TODO.md` manifest.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (native ES Modules, `"type": "module"`, zero npm dependencies), Web Speech API (`de-DE` TTS), Service Worker PWA, Node.js Built-in Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-31-lernreise-design.md` (source copy during scaffolding: `C:\Users\matth\.gemini\antigravity\brain\c6aae6e7-572a-417a-821e-c91ab9b9c8fb\2026-10-31-lernreise-design.md`)

## Global Constraints

- **Separate Fork Integrity:** All new files and Git commits happen strictly inside `c:\Users\matth\OneDrive\Dokumente\lernreise`. `c:\Users\matth\OneDrive\Dokumente\tabbi` must remain 100% clean and unmodified.
- **Zero Build / Zero Dependencies:** `package.json` contains `"type": "module"` and test scripts only — no `dependencies`, no `devDependencies`, no `node_modules`, no bundler. Every ES module import must use explicit relative paths (`./` or `../`) with `.js` extensions so browser `<script type="module">` and `node --test` execute identical files.
- **Child Touch & Keyboard Safety:** Global `touch-action: manipulation` and `user-select: none`, minimum `56 × 56 px` interactive tap targets, `'Andika'` font with system fallback. Never render `<input>` or trigger the tablet system keyboard in any child-facing screen (`<input>` is allowed strictly inside the protected Parent Area for goal titles, PIN entry, and file import).
- **Decoupled Dual Economy:** Spending `wallet.coins` (Taler) on Parent Goals must never reduce `bestStars`, `unlockedStickerIds`, `placedStickerIds`, `unlockedAccessoryIds`, or `surpriseProgressStars`, and unlocking stickers/accessories must never cost Taler.
- **High-Quality Assets Only:** Only verified high-quality assets (initially `assets/haende/*.svg` copied from TABBI) may have `status: 'ready'`. All unproduced graphics must have `status: 'placeholder'`, render clean child-friendly vector cards/silhouettes with `data-asset-id` (never raw filenames in visible text), and be listed 1:1 in `ASSETS_TODO.md`.
- **Child Name Privacy Guard:** No source file, test, or commit message may contain the protected child's first name (enforced via SHA-256 hash `5f16795c54ab7de419edf8e9c6da6065f7dd448f122fcbc9815c67daa566ba8e` in `tests/kein-kindername.test.js`).
- **Git Binary Path on Windows:** Invoke Git via `"C:\Users\matth\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"`.

## Review Focus

1. **Corrupted, partial, or wrong-version JSON backup import (`localStorage` / file import):** Importing invalid JSON, an unsupported `schemaVersion`, or profiles missing required fields must return `{ ok: false, error }` without mutating existing profiles or throwing uncaught exceptions (pinned in Task 3).
2. **Double-redemption, insufficient Taler, or duplicate voucher refund:** Redeeming a Parent Goal when `wallet.coins < costCoins` must fail cleanly without negative coins; cancelling an already-fulfilled voucher must be rejected, and cancelling an open voucher must refund `costCoins` exactly once (pinned in Task 4).
3. **Multi-threshold star overflow & catalog exhaustion on the 12-star Surprise Chest bar:** Earning stars that cross a 12-star multiple (e.g., `10 + 5 = 15`) must open the chest, carry over `3` remainder stars, never unlock duplicate items, and grant `+5` bonus Taler once all catalog accessories and bonus stickers are unlocked (pinned in Task 5).
4. **Unavailable or throwing Web Speech API (`window.speechSynthesis` undefined or throws):** Calling `speakText()` in environments without TTS (Node tests, headless browsers, muted profiles, or tablets lacking offline voices) must return `false` quietly and never block task progression (pinned in Task 2).
5. **Ambiguous or age-inappropriate generated tasks across all 54 stages:** Generated `choice-cards` rounds must never contain duplicate choice values or omit the true answer, math tasks in Preschool/Grade 1 must never produce negative results, and every task across all 54 stages must provide non-empty `promptText` and `speechText` (pinned in Tasks 6 & 7).

---

## File Map

- `c:\Users\matth\OneDrive\Dokumente\lernreise\`
  - `package.json`, `.gitignore`, `README.md`, `ASSETS_TODO.md`, `index.html`, `manifest.json`, `sw.js`
  - `docs/superpowers/specs/2026-10-31-lernreise-design.md`
  - `docs/superpowers/plans/2026-10-31-lernreise-implementation-plan.md`
  - `css/lernreise.css` — Design tokens, tablet touch protections, layout & component styles
  - `assets/haende/*.svg` — Reused high-quality finger-count SVGs (`0`–`10`) from TABBI
  - `content/avatar-catalog.js` — Free body types (`monster`, `boy`, `girl`), skin/hair palettes, base hairstyles, unlockable accessories
  - `content/sticker-catalog.js` — Sticker album pages, 54 stage stickers, bonus stickers
  - `content/subjects.js` — Extensible subject & grade registry (`mathe`, `deutsch`)
  - `content/mathe-content.js` — 9 Mathe topics × 3 stages = 27 stage generators (`vorschule`, `klasse1`, `klasse2`)
  - `content/deutsch-content.js` — 9 Deutsch topics × 3 stages = 27 stage generators + syllable/word corpus
  - `js/core/assets.js` — Asset catalog, child-friendly SVG placeholder renderer, layered avatar SVG composer
  - `js/core/audio.js` — Safe Web Speech API (`de-DE`) wrapper
  - `js/core/storage.js` — `lernreise_state_v1` persistence, multi-child profiles, parent gate (1×1 + PIN), JSON export/import
  - `js/core/scoring.js` — 8-task star formula (`1..5`), Taler calculation & 4th-repeat/day anti-farming rule
  - `js/core/rewards.js` — Parent goals CRUD, copy-to-all-profiles, voucher redemption, fulfillment & refund
  - `js/core/progression.js` — Stage unlock check, `applyRoundResult` (Stars + Taler + Track A stage sticker + Track C 12-star Surprise Chest), sticker placement, avatar updates
  - `js/app.js` — SPA state coordinator & screen router
  - `js/views/header-bar.js` — Active child avatar chip, Taler counter, Goals, Album (`✨`), Parent lock button
  - `js/views/profile-view.js` — Child profile switcher & touch-friendly new-profile creator
  - `js/views/hub-view.js` — Subject selection hub
  - `js/views/journey-view.js` — Grade switcher (`Vorschule | Klasse 1 | Klasse 2`) & themed stage path
  - `js/views/exercise-view.js` — 8-card runner (`choice-cards`, `numpad-gap`, `tile-builder`, `sequence-order`), TTS button & per-card immediate check
  - `js/views/summary-view.js` — 1–5 Stars celebration, 8-task right/wrong recap, Taler payout & Surprise Chest reveal
  - `js/views/avatar-view.js` — Live layered Avatar Builder
  - `js/views/album-view.js` — Multi-page Sticker Album with tap-to-place interaction
  - `js/views/parent-view.js` — Math/PIN parent gate, goal editor, open voucher manager, profile admin & JSON backup/restore
  - `tests/*.test.js` — Node test suite covering privacy, assets, storage/backup, scoring/rewards, progression/unlocks, all 54 curriculum stages, UI shell/runner, and PWA precache parity

---

### Task 1: Fork Scaffolding, Git Repo & Child-Name Privacy Guard

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\package.json`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\.gitignore`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\docs\superpowers\specs\2026-10-31-lernreise-design.md`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\docs\superpowers\plans\2026-10-31-lernreise-implementation-plan.md`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\assets\haende\*` (copied from `tabbi\assets\haende\*`)
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\kein-kindername.test.js`

**Interfaces:**
- Consumes: `c:\Users\matth\OneDrive\Dokumente\tabbi\assets\haende\*.svg`, `c:\Users\matth\OneDrive\Dokumente\tabbi\tests\kein-kindername.test.js`
- Produces: Initialized ESM Git repository at `c:\Users\matth\OneDrive\Dokumente\lernreise` where `node --test tests/*.test.js` runs natively.

- [ ] **Step 1: Scaffold `c:\Users\matth\OneDrive\Dokumente\lernreise`, initialize Git, copy spec, plan, and `assets/haende/*.svg`**

Create directory structure (`assets/haende`, `assets/avatar`, `assets/stickers`, `assets/cards`, `assets/ui`, `css`, `content`, `js/core`, `js/views`, `tests`, `docs/superpowers/specs`, `docs/superpowers/plans`), copy all `.svg` files from `tabbi/assets/haende/` into `lernreise/assets/haende/`, copy the approved spec and plan into `lernreise/docs/superpowers/`, write `.gitignore` (`.superpowers/`, `.DS_Store`, `Thumbs.db`), and write `package.json`:

```json
{
  "name": "lernreise",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

- [ ] **Step 2: Write `tests/kein-kindername.test.js` in ESM format**

Port `tabbi/tests/kein-kindername.test.js` to ES Module imports (`node:test`, `node:assert/strict`, `node:crypto`, `node:fs`, `node:path`, `node:child_process`) preserving the exact SHA-256 hash `5f16795c54ab7de419edf8e9c6da6065f7dd448f122fcbc9815c67daa566ba8e` across all tracked/working files and Git commit messages, plus asserting that `assets/haende/` contains the copied SVG files.

```javascript
test('privacy guard and reused hand SVGs exist in lernreise fork', () => {
  assert.ok(fs.readdirSync(path.resolve(ROOT, 'assets/haende')).some((f) => f.endsWith('.svg')));
});
```

- [ ] **Step 3: Run test in `lernreise` and verify `tabbi` is untouched**

Run in `c:\Users\matth\OneDrive\Dokumente\lernreise`: `node --test tests/kein-kindername.test.js`
Expected: PASS (2 passing tests), and `git status` in `c:\Users\matth\OneDrive\Dokumente\tabbi` shows `working tree clean`.

- [ ] **Step 4: Initialize Git repository in `lernreise` and commit Task 1**

```powershell
git init -b main
git add .
git commit -m "chore: scaffold standalone lernreise fork with privacy guard and hand assets"
```

---

### Task 2: Asset Registry, Child-Friendly Placeholders, `ASSETS_TODO.md` & Speech Wrapper

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\assets.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\audio.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\ASSETS_TODO.md`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\assets-manifest.test.js`

**Interfaces:**
- Consumes: `assets/haende/*.svg`
- Produces:
  - `js/core/assets.js`:
    - `ASSET_CATALOG`: `Record<string, { id: string, category: 'haende' | 'ui' | 'avatar-base' | 'avatar-acc' | 'sticker' | 'card', path: string, format: string, description: string, status: 'ready' | 'placeholder', label: string, accent: string }>`
    - `getAsset(assetId: string)`
    - `renderAssetHtml(assetId: string, options?: { size?: 'sm' | 'md' | 'lg', showLabel?: boolean }) -> string`
    - `renderAvatarSvg(avatarConfig: { bodyType: 'monster' | 'boy' | 'girl', skinColorId: string, hairStyleId: string, hairColorId: string, accessoryIds: string[] }, options?: { size?: number }) -> string`
  - `js/core/audio.js`:
    - `speakText(text: string, options?: { enabled?: boolean, lang?: string, rate?: number, synth?: object | null }) -> boolean`
    - `stopSpeech(synth?: object | null) -> void`

- [ ] **Step 1: Write the failing tests in `tests/assets-manifest.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ASSET_CATALOG, renderAssetHtml, renderAvatarSvg } from '../js/core/assets.js';
import { speakText, stopSpeech } from '../js/core/audio.js';

test('every ready asset exists on disk and every placeholder is documented in ASSETS_TODO.md', () => {
  const todoMd = fs.readFileSync(new URL('../ASSETS_TODO.md', import.meta.url), 'utf8');
  const entries = Object.values(ASSET_CATALOG);
  assert.ok(entries.length >= 90, 'catalog covers UI, avatar, stickers, and word-card motifs');
  for (const item of entries) {
    if (item.status === 'ready') {
      const full = new URL(`../${item.path}`, import.meta.url);
      assert.ok(fs.existsSync(full), `ready asset missing on disk: ${item.path}`);
    } else {
      assert.equal(item.status, 'placeholder');
      assert.ok(todoMd.includes(`\`${item.id}\``), `placeholder ${item.id} missing in ASSETS_TODO.md`);
      assert.ok(todoMd.includes(item.path), `target path ${item.path} missing in ASSETS_TODO.md`);
    }
  }
});

test('renderAssetHtml exposes data-asset-id without leaking raw file paths to child text', () => {
  const html = renderAssetHtml('card-mond', { size: 'md', showLabel: true });
  assert.ok(html.includes('data-asset-id="card-mond"'));
  assert.ok(html.includes('Mond'));
  assert.ok(!html.includes('.svg') && !html.includes('card-mond<'));
});

test('renderAvatarSvg layers body, skin color, hair, and accessories cleanly', () => {
  const svg = renderAvatarSvg({
    bodyType: 'monster',
    skinColorId: 'mint',
    hairStyleId: 'spikes',
    hairColorId: 'purple',
    accessoryIds: ['acc-krone']
  });
  assert.ok(svg.includes('<svg') && svg.includes('data-body-type="monster"') && svg.includes('data-accessory="acc-krone"'));
});

test('speakText degrades silently when speechSynthesis is absent, muted, or throws', () => {
  assert.equal(speakText('Hallo', { enabled: false }), false);
  assert.equal(speakText('Hallo', { enabled: true, synth: null }), false);
  const throwingSynth = { cancel() { throw new Error('audio blocked'); }, speak() {} };
  assert.equal(speakText('Hallo', { enabled: true, synth: throwingSynth }), false);
  assert.doesNotThrow(() => stopSpeech(null));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/assets-manifest.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../js/core/assets.js`.

- [ ] **Step 3: Implement `js/core/assets.js`, `js/core/audio.js`, and `ASSETS_TODO.md`**

- Register all existing `assets/haende/*.svg` entries as `status: 'ready'`.
- Register all placeholder IDs needed across the app:
  - UI & Subjects (`ui-mathe`, `ui-deutsch`, `ui-taler`, `ui-surprise-chest`, `ui-goal-tablet`, `ui-goal-meal`, `ui-goal-cinema`, `ui-goal-trip`, `ui-goal-book`, `ui-goal-play`)
  - Avatar bases & hairstyles (`avatar-body-monster`, `avatar-body-boy`, `avatar-body-girl`, 5 hairstyles) and 12 unlockable accessories (`acc-krone`, `acc-brille`, `acc-zauberhut`, `acc-cape`, `acc-fluegel`, `acc-hoerner`, `acc-kopfhoerer`, `acc-schal`, `acc-sternstab`, `acc-piratenhut`, `acc-blume`, `acc-drache`)
  - Stickers: 54 stage stickers (`sticker-mathe-vs-1-1` … `sticker-deutsch-kl2-3-3` or clean thematic IDs mapped 1:1 to the 54 stages) + 12 bonus stickers (`sticker-bonus-01` … `sticker-bonus-12`)
  - Preschool & German word-card motifs (`card-mond`, `card-maus`, `card-ball`, `card-hund`, `card-sonne`, `card-stern`, `card-apfel`, `card-auto`, `card-lama`, `card-limo`, `card-tomate`, `card-banane`, `card-fisch`, `card-katze`, `card-baum`, `card-blume`, `card-haus`, `card-buch`, `card-uhr`, `card-zug`)
- `renderAvatarSvg` renders clean, friendly geometric vector silhouettes dynamically tinted with the selected skin/monster color and hair color, plus distinct visual accessory badges/silhouettes with `data-accessory="<id>"`, so the Avatar Builder feels responsive immediately while awaiting final art.
- Generate `ASSETS_TODO.md` grouped by the 6 spec categories with `[ ]` checkboxes, Asset-ID, target path, `SVG, viewBox="0 0 256 256"`, and motif description.
- In `js/core/audio.js`, wrap `synth.cancel()` and `new SpeechSynthesisUtterance(text)` (`lang = 'de-DE'`, `rate = 0.9`) in `try/catch`, falling back to a plain `{ text, lang, rate }` utterance object if `globalThis.SpeechSynthesisUtterance` is absent in unit tests with a mock `synth`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS (all tests in `kein-kindername.test.js` and `assets-manifest.test.js`).

- [ ] **Step 5: Commit Task 2**

```powershell
git add js/core/assets.js js/core/audio.js ASSETS_TODO.md tests/assets-manifest.test.js
git commit -m "feat: add asset registry, child-friendly placeholders, ASSETS_TODO manifest and TTS wrapper"
```

---

### Task 3: Local State Store, Multi-Child Profiles, Parent Gate & JSON Backup

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\storage.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\storage-backup.test.js`

**Interfaces:**
- Consumes: none (pure state module)
- Produces (`js/core/storage.js`):
  - `STORAGE_KEY = 'lernreise_state_v1'`, `SCHEMA_VERSION = 1`, `DEFAULT_PARENT_GOALS`
  - `createProfile({ displayName, defaultGrade?: 'vorschule' | 'klasse1' | 'klasse2', avatar?: object }) -> Profile`
  - `createInitialState() -> AppState`
  - `loadState(storage?: StorageLike) -> AppState`
  - `saveState(state: AppState, storage?: StorageLike) -> boolean`
  - `getActiveProfile(state: AppState) -> Profile`
  - `setActiveProfile(state: AppState, profileId: string) -> AppState`
  - `addProfile(state: AppState, profileInput: object) -> AppState`
  - `updateProfile(state: AppState, profileId: string, updaterFn: (p: Profile) => Profile) -> AppState`
  - `deleteProfile(state: AppState, profileId: string) -> AppState`
  - `createMathChallenge(rng?: () => number) -> { factorA: number, factorB: number, prompt: string, answer: number }`
  - `setParentPin(state: AppState, pinOrNull: string | null) -> AppState`
  - `verifyParentPin(state: AppState, pin: string) -> boolean`
  - `exportBackupJson(state: AppState, now?: Date) -> { filename: string, json: string }`
  - `importBackupJson(currentState: AppState, jsonString: string, options?: { mode?: 'replace' | 'merge-profiles' }) -> { ok: boolean, state: AppState, error?: string }`

- [ ] **Step 1: Write the failing tests in `tests/storage-backup.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY, createInitialState, loadState, saveState,
  addProfile, setActiveProfile, deleteProfile, getActiveProfile,
  createMathChallenge, setParentPin, verifyParentPin,
  exportBackupJson, importBackupJson
} from '../js/core/storage.js';

test('initial state creates default profile with 3 starter parent goals and audio auto-enabled for vorschule', () => {
  const s = createInitialState();
  const p = getActiveProfile(s);
  assert.equal(s.schemaVersion, 1);
  assert.equal(p.parentGoals.length, 3);
  assert.deepEqual(p.parentGoals.map((g) => g.costCoins), [30, 60, 150]);
  const s2 = addProfile(s, { displayName: 'Mini', defaultGrade: 'vorschule' });
  const vs = s2.profiles.find((x) => x.displayName === 'Mini');
  assert.equal(vs.audioEnabled, true);
});

test('multi-profile switching and deletion never leaves zero profiles', () => {
  let s = createInitialState();
  s = deleteProfile(s, s.activeProfileId);
  assert.equal(s.profiles.length, 1);
  s = addProfile(s, { displayName: 'Kind 2', defaultGrade: 'klasse2' });
  const second = s.profiles[1];
  s = setActiveProfile(s, second.id);
  assert.equal(getActiveProfile(s).id, second.id);
  s = deleteProfile(s, second.id);
  assert.equal(s.profiles.length, 1);
  assert.equal(s.activeProfileId, s.profiles[0].id);
});

test('parent gate supports 1x1 math challenge by default and optional 4-digit PIN', () => {
  const ch = createMathChallenge(() => 0.5);
  assert.equal(ch.answer, ch.factorA * ch.factorB);
  assert.ok(ch.factorA >= 3 && ch.factorB >= 3);
  let s = createInitialState();
  s = setParentPin(s, '4826');
  assert.equal(s.parentGate.mode, 'pin');
  assert.equal(verifyParentPin(s, '4826'), true);
  assert.equal(verifyParentPin(s, '0000'), false);
  s = setParentPin(s, null);
  assert.equal(s.parentGate.mode, 'math');
});

test('corrupted or wrong-version JSON import fails non-destructively while valid replace and merge-profiles succeed', () => {
  let s = createInitialState();
  s = addProfile(s, { displayName: 'Sternchen', defaultGrade: 'klasse1' });
  const bad1 = importBackupJson(s, '{broken-json');
  assert.equal(bad1.ok, false);
  assert.equal(bad1.state.profiles.length, 2);

  const bad2 = importBackupJson(s, JSON.stringify({ schemaVersion: 99, profiles: [] }));
  assert.equal(bad2.ok, false);
  assert.equal(bad2.state.profiles.length, 2);

  const { filename, json } = exportBackupJson(s, new Date('2026-10-31T12:00:00Z'));
  assert.equal(filename, 'lernreise-backup-2026-10-31.json');

  const fresh = createInitialState();
  const replaced = importBackupJson(fresh, json, { mode: 'replace' });
  assert.equal(replaced.ok, true);
  assert.equal(replaced.state.profiles.length, 2);

  const merged = importBackupJson(fresh, json, { mode: 'merge-profiles' });
  assert.equal(merged.ok, true);
  assert.equal(merged.state.profiles.length, 3);
});

test('loadState recovers gracefully when localStorage throws or holds broken JSON', () => {
  const brokenStorage = { getItem() { return '{oops'; }, setItem() { throw new Error('quota'); } };
  const loaded = loadState(brokenStorage);
  assert.equal(loaded.schemaVersion, 1);
  assert.equal(saveState(loaded, brokenStorage), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/storage-backup.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../js/core/storage.js`.

- [ ] **Step 3: Implement `js/core/storage.js`**

Implement immutable state helpers matching the exact signatures above. Each `Profile` carries:
`{ id, displayName, defaultGrade, audioEnabled, avatar: { bodyType: 'monster', skinColorId: 'mint', hairStyleId: 'tuft', hairColorId: 'brown', accessoryIds: [] }, wallet: { coins: 0 }, unlocks: { unlockedStickerIds: [], placedStickerIds: [], unlockedAccessoryIds: [], surpriseProgressStars: 0, surpriseCount: 0 }, journeyProgress: {}, dailyStageCounts: {}, parentGoals: [...DEFAULT_PARENT_GOALS], vouchers: [] }`.
Validate imported profiles strictly (regenerating colliding `id`s in `merge-profiles` mode) and reject non-4-digit PIN strings (`!/^\d{4}$/.test(pin)` throws or is ignored cleanly; clarify: throw `Error('PIN muss 4 Ziffern haben')` when invalid non-null string passed).

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 3**

```powershell
git add js/core/storage.js tests/storage-backup.test.js
git commit -m "feat: add multi-child localStorage store, parent gate and validated JSON backup"
```

---

### Task 4: Scoring, 1–5 Stars, Taler Anti-Farming Economy & Parent Vouchers

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\scoring.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\rewards.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\scoring-rewards.test.js`

**Interfaces:**
- Consumes: `Profile` and `AppState` shapes from `js/core/storage.js`
- Produces:
  - `js/core/scoring.js`:
    - `ROUND_SIZE = 8`, `PASS_STARS = 3`
    - `calculateStars(correctCount: number, totalCount?: number) -> 1 | 2 | 3 | 4 | 5`
    - `calculateRoundCoins({ stars: number, isFirstPass: boolean, completionsTodayBeforeThis: number }) -> { baseCoins: number, firstPassBonus: number, totalCoins: number, antiFarmingApplied: boolean }`
  - `js/core/rewards.js`:
    - `upsertParentGoal(profile: Profile, goalInput: { id?: string, title: string, iconId?: string, costCoins: number, active?: boolean }) -> Profile`
    - `removeParentGoal(profile: Profile, goalId: string) -> Profile`
    - `copyGoalsToAllProfiles(state: AppState, sourceProfileId: string) -> AppState`
    - `redeemParentGoal(profile: Profile, goalId: string, nowIso?: string) -> { ok: boolean, profile: Profile, voucher?: object, error?: string }`
    - `fulfillVoucher(profile: Profile, voucherId: string, nowIso?: string) -> Profile`
    - `cancelVoucher(profile: Profile, voucherId: string) -> { ok: boolean, profile: Profile, error?: string }`

- [ ] **Step 1: Write the failing tests in `tests/scoring-rewards.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStars, calculateRoundCoins } from '../js/core/scoring.js';
import {
  upsertParentGoal, removeParentGoal, copyGoalsToAllProfiles,
  redeemParentGoal, fulfillVoucher, cancelVoucher
} from '../js/core/rewards.js';
import { createInitialState, addProfile, getActiveProfile } from '../js/core/storage.js';

test('calculateStars maps 8-task scores to exact 1..5 star thresholds', () => {
  assert.equal(calculateStars(8, 8), 5);
  assert.equal(calculateStars(7, 8), 4);
  assert.equal(calculateStars(6, 8), 4);
  assert.equal(calculateStars(5, 8), 3);
  assert.equal(calculateStars(4, 8), 3);
  assert.equal(calculateStars(3, 8), 2);
  assert.equal(calculateStars(2, 8), 2);
  assert.equal(calculateStars(1, 8), 1);
  assert.equal(calculateStars(0, 8), 1);
});

test('calculateRoundCoins awards 2 coins/star +4 first-pass bonus, and caps 4th+ same-day repeat at 1 coin', () => {
  assert.deepEqual(calculateRoundCoins({ stars: 5, isFirstPass: true, completionsTodayBeforeThis: 0 }), {
    baseCoins: 10, firstPassBonus: 4, totalCoins: 14, antiFarmingApplied: false
  });
  assert.deepEqual(calculateRoundCoins({ stars: 4, isFirstPass: false, completionsTodayBeforeThis: 2 }), {
    baseCoins: 8, firstPassBonus: 0, totalCoins: 8, antiFarmingApplied: false
  });
  assert.deepEqual(calculateRoundCoins({ stars: 5, isFirstPass: false, completionsTodayBeforeThis: 3 }), {
    baseCoins: 1, firstPassBonus: 0, totalCoins: 1, antiFarmingApplied: true
  });
});

test('redeeming parent goals checks balance, prevents negative coins, and supports single refund on cancel', () => {
  let p = { ...getActiveProfile(createInitialState()), wallet: { coins: 45 } };
  const goal30 = p.parentGoals[0]; // 30 Taler
  const r1 = redeemParentGoal(p, goal30.id, '2026-10-31T15:00:00Z');
  assert.equal(r1.ok, true);
  assert.equal(r1.profile.wallet.coins, 15);
  assert.equal(r1.profile.vouchers.length, 1);

  // Second redeem with only 15 coins fails cleanly
  const r2 = redeemParentGoal(r1.profile, goal30.id);
  assert.equal(r2.ok, false);
  assert.equal(r2.profile.wallet.coins, 15);

  // Cancel open voucher refunds 30 coins once
  const c1 = cancelVoucher(r1.profile, r1.voucher.id);
  assert.equal(c1.ok, true);
  assert.equal(c1.profile.wallet.coins, 45);
  assert.equal(c1.profile.vouchers.length, 0);

  // Fulfilled voucher cannot be cancelled/refunded
  const r3 = redeemParentGoal(c1.profile, goal30.id, '2026-10-31T16:00:00Z');
  const fulfilled = fulfillVoucher(r3.profile, r3.voucher.id, '2026-10-31T17:00:00Z');
  assert.equal(fulfilled.vouchers[0].fulfilledAt, '2026-10-31T17:00:00Z');
  const cAfterFulfill = cancelVoucher(fulfilled, r3.voucher.id);
  assert.equal(cAfterFulfill.ok, false);
  assert.equal(cAfterFulfill.profile.wallet.coins, 15);
});

test('copyGoalsToAllProfiles clones active parent goal templates without touching sibling coins or vouchers', () => {
  let s = addProfile(createInitialState(), { displayName: 'Geschwister', defaultGrade: 'klasse2' });
  const p1 = upsertParentGoal(s.profiles[0], { title: 'Schwimmbad', costCoins: 90, iconId: 'ui-goal-trip' });
  s = { ...s, profiles: [p1, { ...s.profiles[1], wallet: { coins: 77 } }] };
  s = copyGoalsToAllProfiles(s, p1.id);
  assert.equal(s.profiles[1].parentGoals.some((g) => g.title === 'Schwimmbad' && g.costCoins === 90), true);
  assert.equal(s.profiles[1].wallet.coins, 77);
  assert.equal(removeParentGoal(p1, p1.parentGoals[0].id).parentGoals.length, p1.parentGoals.length - 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/scoring-rewards.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `js/core/scoring.js` and `js/core/rewards.js`**

- In `calculateStars(correctCount, totalCount = 8)`, scale proportionally if `totalCount !== 8` (`ratio = correctCount / totalCount`: `1.0 -> 5`, `>= 0.75 -> 4`, `>= 0.5 -> 3`, `>= 0.25 -> 2`, `< 0.25 -> 1`).
- In `calculateRoundCoins`, if `completionsTodayBeforeThis >= 3`, return `{ baseCoins: 1, firstPassBonus: 0, totalCoins: 1, antiFarmingApplied: true }`; otherwise `baseCoins = stars * 2`, `firstPassBonus = isFirstPass ? 4 : 0`.
- In `js/core/rewards.js`, clamp `costCoins` to integer `>= 1`, enforce `goal.active !== false` and `profile.wallet.coins >= goal.costCoins` on `redeemParentGoal`, and reject `cancelVoucher` if `voucher.fulfilledAt !== null`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 4**

```powershell
git add js/core/scoring.js js/core/rewards.js tests/scoring-rewards.test.js
git commit -m "feat: add 1-5 star scoring, anti-farming Taler economy and parent voucher lifecycle"
```

---

### Task 5: Avatar & Sticker Catalogs + Lernreise Progression & A+C Unlock Engine

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\content\avatar-catalog.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\content\sticker-catalog.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\core\progression.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\progression-unlocks.test.js`

**Interfaces:**
- Consumes: `ASSET_CATALOG` (`js/core/assets.js`), `calculateStars`, `calculateRoundCoins`, `PASS_STARS` (`js/core/scoring.js`)
- Produces:
  - `content/avatar-catalog.js`: `AVATAR_CATALOG` (`{ bodyTypes, skinColors, hairColors, baseHairStyles, unlockableAccessories }`)
  - `content/sticker-catalog.js`: `STICKER_CATALOG` (`{ pages, stageStickerMap, bonusStickers }`), `getStickerForStage(stageId) -> StickerDef | null`
  - `js/core/progression.js`:
    - `SURPRISE_THRESHOLD_STARS = 12`, `EXHAUSTED_SURPRISE_BONUS_COINS = 5`
    - `isStageUnlocked(profile: Profile, topicStageIds: string[], stageIndex: number) -> boolean`
    - `applyRoundResult(profile: Profile, params: { stageId: string, correctCount: number, totalCount?: number, dateKey?: string, nowIso?: string }) -> { profile: Profile, summary: { stars: number, isFirstPass: boolean, coinsEarned: number, antiFarmingApplied: boolean, newStageSticker: object | null, surpriseRewards: Array<{ kind: 'accessory' | 'bonus-sticker' | 'bonus-coins', item?: object, coins?: number }> } }`
    - `placeSticker(profile: Profile, stickerId: string) -> Profile`
    - `updateAvatar(profile: Profile, patch: Partial<Profile['avatar']>) -> Profile`

- [ ] **Step 1: Write the failing tests in `tests/progression-unlocks.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATAR_CATALOG } from '../content/avatar-catalog.js';
import { STICKER_CATALOG, getStickerForStage } from '../content/sticker-catalog.js';
import {
  SURPRISE_THRESHOLD_STARS, isStageUnlocked, applyRoundResult, placeSticker, updateAvatar
} from '../js/core/progression.js';
import { createInitialState, getActiveProfile } from '../js/core/storage.js';
import { redeemParentGoal } from '../js/core/rewards.js';

test('avatar catalog provides 3 free body types, >=6 skin/hair colors, >=5 base hairstyles, and 12 unlockable accessories', () => {
  assert.deepEqual(AVATAR_CATALOG.bodyTypes.map((b) => b.id), ['monster', 'boy', 'girl']);
  assert.ok(AVATAR_CATALOG.skinColors.length >= 6);
  assert.ok(AVATAR_CATALOG.hairColors.length >= 6);
  assert.ok(AVATAR_CATALOG.baseHairStyles.length >= 5);
  assert.equal(AVATAR_CATALOG.unlockableAccessories.length, 12);
  assert.equal(Object.keys(STICKER_CATALOG.stageStickerMap).length, 54);
  assert.equal(STICKER_CATALOG.bonusStickers.length, 12);
});

test('stage 1 is always unlocked; stage 2 unlocks only after >=3 stars in stage 1', () => {
  let p = getActiveProfile(createInitialState());
  const stages = ['mathe-kl1-t1-s1', 'mathe-kl1-t1-s2', 'mathe-kl1-t1-s3'];
  assert.equal(isStageUnlocked(p, stages, 0), true);
  assert.equal(isStageUnlocked(p, stages, 1), false);

  // 2 stars does NOT unlock next stage or stage sticker
  p = applyRoundResult(p, { stageId: stages[0], correctCount: 3, dateKey: '2026-10-31' }).profile;
  assert.equal(isStageUnlocked(p, stages, 1), false);
  assert.equal(p.unlocks.unlockedStickerIds.length, 0);

  // 4 stars unlocks stage 2 AND awards Track A stage sticker once
  const win = applyRoundResult(p, { stageId: stages[0], correctCount: 7, dateKey: '2026-10-31' });
  assert.equal(isStageUnlocked(win.profile, stages, 1), true);
  assert.equal(win.summary.isFirstPass, true);
  assert.equal(win.summary.newStageSticker.id, getStickerForStage(stages[0]).id);
});

test('Track C 12-star Surprise Chest carries over remainder stars, avoids duplicates, and grants +5 coins when exhausted', () => {
  let p = getActiveProfile(createInitialState());
  p = { ...p, unlocks: { ...p.unlocks, surpriseProgressStars: 10 } };
  const res = applyRoundResult(p, { stageId: 'mathe-vs-t1-s1', correctCount: 8, dateKey: '2026-10-31' });
  assert.equal(res.summary.stars, 5);
  assert.equal(res.profile.unlocks.surpriseProgressStars, 3); // (10 + 5) % 12
  assert.equal(res.summary.surpriseRewards.length, 1);
  assert.ok(['accessory', 'bonus-sticker'].includes(res.summary.surpriseRewards[0].kind));

  // Exhaust all accessories + bonus stickers -> chest grants +5 bonus Taler
  const allAcc = AVATAR_CATALOG.unlockableAccessories.map((a) => a.id);
  const allBonus = STICKER_CATALOG.bonusStickers.map((s) => s.id);
  let fullP = {
    ...res.profile,
    unlocks: { ...res.profile.unlocks, unlockedAccessoryIds: allAcc, unlockedStickerIds: allBonus, surpriseProgressStars: 9 }
  };
  const beforeCoins = fullP.wallet.coins;
  const exhausted = applyRoundResult(fullP, { stageId: 'mathe-vs-t1-s2', correctCount: 8, dateKey: '2026-10-31' });
  assert.equal(exhausted.summary.surpriseRewards[0].kind, 'bonus-coins');
  assert.equal(exhausted.profile.wallet.coins, beforeCoins + 14 + 5);
});

test('spending Taler on parent goals never alters unlocked stickers, accessories, or avatar equipment', () => {
  let p = getActiveProfile(createInitialState());
  p = applyRoundResult(p, { stageId: 'mathe-kl1-t1-s1', correctCount: 8, dateKey: '2026-10-31' }).profile;
  p = { ...p, wallet: { coins: 50 }, unlocks: { ...p.unlocks, unlockedAccessoryIds: ['acc-krone'] } };
  const stickerId = p.unlocks.unlockedStickerIds[0];
  p = placeSticker(p, stickerId);
  p = updateAvatar(p, { bodyType: 'girl', accessoryIds: ['acc-krone'] });
  const redeemed = redeemParentGoal(p, p.parentGoals[0].id);
  assert.equal(redeemed.ok, true);
  assert.deepEqual(redeemed.profile.unlocks, p.unlocks);
  assert.deepEqual(redeemed.profile.avatar, p.avatar);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/progression-unlocks.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `content/avatar-catalog.js`, `content/sticker-catalog.js`, and `js/core/progression.js`**

- Use uniform canonical stage IDs `{subject}-{grade}-t{1..3}-s{1..3}` where `subject` ∈ `['mathe', 'deutsch']` and `grade` ∈ `['vs', 'kl1', 'kl2']` (54 total stage IDs) so `STICKER_CATALOG.stageStickerMap` and Tasks 6–7 align 1:1.
- Group `STICKER_CATALOG.pages` into 7 album pages: 6 subject/grade pages (9 stage stickers each = 54) + 1 *„Glitzer-Überraschungen“* page (12 bonus stickers).
- In `applyRoundResult`, alternate Track C surprise unlocks deterministically between the next locked accessory and the next locked bonus sticker (`while (poolStars >= 12)`), updating `dailyStageCounts[`${dateKey}:${stageId}`]` for anti-farming calculation.
- In `updateAvatar`, ignore any `accessoryId` not yet present in `profile.unlocks.unlockedAccessoryIds`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 5**

```powershell
git add content/avatar-catalog.js content/sticker-catalog.js js/core/progression.js tests/progression-unlocks.test.js
git commit -m "feat: add avatar and sticker catalogs with A+C stage and surprise chest unlock engine"
```

---

### Task 6: Subject Registry & Mathe Curriculum (27 Playable Stages: Vorschule, Kl. 1, Kl. 2)

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\content\subjects.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\content\mathe-content.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\curriculum-mathe.test.js`

**Interfaces:**
- Consumes: `ROUND_SIZE` (`js/core/scoring.js`), `ASSET_CATALOG` (`js/core/assets.js`)
- Produces:
  - `content/mathe-content.js`: `MATHE_TOPICS_BY_GRADE` (`{ vorschule: Topic[3], klasse1: Topic[3], klasse2: Topic[3] }`), `generateMatheStageRound(stageId: string, options?: { rng?: () => number }) -> TaskItem[8]`
  - `content/subjects.js`:
    - `GRADES`: `[{ id: 'vorschule', label: 'Vorschule', shortCode: 'vs' }, { id: 'klasse1', label: 'Klasse 1', shortCode: 'kl1' }, { id: 'klasse2', label: 'Klasse 2', shortCode: 'kl2' }]`
    - `registerSubjectContent(subjectId: string, topicsByGrade: object, generatorFn: Function) -> void`
    - `getSubjects() -> SubjectDef[]`
    - `getTopicsForSubjectAndGrade(subjectId: string, gradeId: string) -> Topic[]`
    - `getStageMeta(stageId: string) -> { subject: SubjectDef, gradeId: string, topic: Topic, stage: StageDef, stageIndex: number, topicStageIds: string[] } | null`
    - `generateStageRound(stageId: string, options?: { rng?: () => number }) -> TaskItem[8]`
    - `evaluateTaskAnswer(task: TaskItem, userAnswer: string | number | string[]) -> { isCorrect: boolean, expectedDisplay: string, userDisplay: string }`

- [ ] **Step 1: Write the failing tests in `tests/curriculum-mathe.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSubjects, getTopicsForSubjectAndGrade, getStageMeta, generateStageRound, evaluateTaskAnswer
} from '../content/subjects.js';
import '../content/mathe-content.js';

test('Mathe registers 3 topics x 3 stages for vorschule, klasse1, and klasse2 (27 stages)', () => {
  assert.ok(getSubjects().some((s) => s.id === 'mathe'));
  for (const gradeId of ['vorschule', 'klasse1', 'klasse2']) {
    const topics = getTopicsForSubjectAndGrade('mathe', gradeId);
    assert.equal(topics.length, 3);
    for (const topic of topics) {
      assert.equal(topic.stages.length, 3);
    }
  }
});

test('every Mathe stage generates 8 unambiguous, age-safe, solvable tasks across touch types', () => {
  for (const [gradeId, code] of [['vorschule', 'vs'], ['klasse1', 'kl1'], ['klasse2', 'kl2']]) {
    for (let t = 1; t <= 3; t++) {
      for (let s = 1; s <= 3; s++) {
        const stageId = `mathe-${code}-t${t}-s${s}`;
        assert.ok(getStageMeta(stageId), `missing meta for ${stageId}`);
        const tasks = generateStageRound(stageId);
        assert.equal(tasks.length, 8);
        for (const task of tasks) {
          assert.ok(['choice-cards', 'numpad-gap', 'tile-builder', 'sequence-order'].includes(task.type));
          assert.ok(task.promptText.length > 3 && task.speechText.length > 3);
          if (task.type === 'choice-cards') {
            const values = task.payload.choices.map((c) => String(c.value));
            assert.equal(new Set(values).size, values.length, `duplicate choice in ${stageId}`);
            assert.ok(values.includes(String(task.correctAnswer)), `missing answer in choices for ${stageId}`);
          }
          if (gradeId !== 'klasse2' && typeof task.correctAnswer === 'number') {
            assert.ok(task.correctAnswer >= 0 && task.correctAnswer <= 20);
          }
          const okEval = evaluateTaskAnswer(task, task.correctAnswer);
          assert.equal(okEval.isCorrect, true);
          const wrongEval = evaluateTaskAnswer(task, '__WRONG__');
          assert.equal(wrongEval.isCorrect, false);
        }
      }
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/curriculum-mathe.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `content/subjects.js` and `content/mathe-content.js`**

Implement the 9 Mathe topics from Spec §5.2.6 with progressive difficulty per stage (Stufe 1 → 2 → 3):
- **Vorschule (`mathe-vs-t1..3-s1..3`):** (1) Mengen & Würfel bis 6 (`choice-cards` with dot/dice visuals), (2) Fingerbilder & Zählen bis 10 (reusing `assets/haende/` SVGs!), (3) Mehr, weniger & Muster (`choice-cards` & `sequence-order`).
- **Klasse 1 (`mathe-kl1-t1..3-s1..3`):** (1) Zahlenhäuser & Verliebte Zahlen bis 10 (`numpad-gap`), (2) Plus & Minus bis 20 inkl. Zwerg/Riese (`numpad-gap`), (3) Nachbarzahlen & Zahlenmauern bis 20 (`sequence-order` & `numpad-gap`).
- **Klasse 2 (`mathe-kl2-t1..3-s1..3`):** (1) Zahlenraum bis 100 – Zehner & Einer (`numpad-gap` & `sequence-order`, `maxDigits: 3`), (2) Plus & Minus bis 100 ohne/mit Zehnerübergang (`numpad-gap`), (3) Kleines Einmaleins 2er/5er/10er → 3er/4er → Mix (`numpad-gap` & `choice-cards`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 6**

```powershell
git add content/subjects.js content/mathe-content.js tests/curriculum-mathe.test.js
git commit -m "feat: add extensible subject registry and 27-stage Mathe curriculum"
```

---

### Task 7: Deutsch Curriculum (27 Playable Stages: Vorschule, Kl. 1, Kl. 2) & Full 54-Stage Invariant Suite

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\content\deutsch-content.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\curriculum-tasks.test.js`

**Interfaces:**
- Consumes: `registerSubjectContent`, `getTopicsForSubjectAndGrade`, `generateStageRound`, `evaluateTaskAnswer` (`content/subjects.js`), `ASSET_CATALOG` (`js/core/assets.js`), `STICKER_CATALOG` (`content/sticker-catalog.js`), `tabbi/js/tabbi-lesekorpus.js` word/syllable progression as didactic seed
- Produces:
  - `content/deutsch-content.js`: `DEUTSCH_TOPICS_BY_GRADE`, `DEUTSCH_WORDS`, `generateDeutschStageRound(stageId: string, options?: { rng?: () => number }) -> TaskItem[8]` (self-registers `'deutsch'` in `content/subjects.js`)

- [ ] **Step 1: Write the failing tests in `tests/curriculum-tasks.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { getSubjects, getStageMeta, generateStageRound, evaluateTaskAnswer } from '../content/subjects.js';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';
import { STICKER_CATALOG } from '../content/sticker-catalog.js';
import { ASSET_CATALOG } from '../js/core/assets.js';

test('all 54 stages across Mathe and Deutsch map 1:1 to stage stickers, valid assets, and solvable 8-task rounds', () => {
  assert.deepEqual(getSubjects().map((s) => s.id), ['mathe', 'deutsch']);
  const stageIds = Object.keys(STICKER_CATALOG.stageStickerMap);
  assert.equal(stageIds.length, 54);

  for (const stageId of stageIds) {
    const meta = getStageMeta(stageId);
    assert.ok(meta, `stageId ${stageId} missing in subjects registry`);
    const round = generateStageRound(stageId);
    assert.equal(round.length, 8, `stage ${stageId} must generate 8 tasks`);
    for (const task of round) {
      assert.ok(task.promptText && task.speechText);
      if (task.visual?.assetId) {
        assert.ok(ASSET_CATALOG[task.visual.assetId], `unregistered asset ${task.visual.assetId} in ${stageId}`);
      }
      if (task.type === 'choice-cards') {
        const vals = task.payload.choices.map((c) => String(c.value));
        assert.equal(new Set(vals).size, vals.length, `duplicate choices in ${stageId}`);
        assert.ok(vals.includes(String(task.correctAnswer)));
        for (const c of task.payload.choices) {
          if (c.assetId) assert.ok(ASSET_CATALOG[c.assetId], `unregistered choice asset ${c.assetId}`);
        }
      }
      assert.equal(evaluateTaskAnswer(task, task.correctAnswer).isCorrect, true);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/curriculum-tasks.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../content/deutsch-content.js`.

- [ ] **Step 3: Implement `content/deutsch-content.js`**

Implement the 9 Deutsch topics (27 stages: `deutsch-vs-t1..3-s1..3`, `deutsch-kl1-t1..3-s1..3`, `deutsch-kl2-t1..3-s1..3`) per Spec §5.2.6:
- **Vorschule:** (1) Anlaute hören (`choice-cards` with `assetId` + per-choice `speechLabel` so non-readers can tap 🔊 on every picture card!), (2) Silben zählen `1 / 2 / 3` (`choice-cards` with clap icons & spoken word), (3) Reimwörter erkennen (`choice-cards`, e.g., *Maus – Haus*).
- **Klasse 1:** Pre-syllabified Hessen Fibel words (`['Ma','ma']`, `['La','ma']`, `['Li','mo']`, `['To','ma','te']`, `['Sa','la','t']` -> `['Sa','lat']`, `['Ba','na','ne']`, etc.): (1) Silben & Fibel-Wörter lesen/zuordnen (`choice-cards` & `tile-builder`), (2) Fehlende Silbe einsetzen (`tile-builder`), (3) Begleiter `der / die / das` (`choice-cards`).
- **Klasse 2:** (1) Wortarten erkennen: Nomen, Verben, Adjektive (`choice-cards`), (2) Rechtschreib-Spürnasen `ei` vs. `ie` und Mehrzahl-Umlaute `a/ä, o/ö, u/ü` (`tile-builder` & `choice-cards`), (3) Sätze bauen & Sinn verstehen (`sequence-order` with 3–5 word tiles & `choice-cards`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 7**

```powershell
git add content/deutsch-content.js tests/curriculum-tasks.test.js
git commit -m "feat: add 27-stage Deutsch curriculum and 54-stage curriculum integrity tests"
```

---

### Task 8: Design System, App Shell, Header Bar, Profile Switcher, Start-Hub & Journey View

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\index.html`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\css\lernreise.css`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\header-bar.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\profile-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\hub-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\journey-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\app.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\ui-shell.test.js`

**Interfaces:**
- Consumes: `js/core/storage.js`, `js/core/assets.js`, `js/core/progression.js`, `content/subjects.js`, `content/mathe-content.js`, `content/deutsch-content.js`
- Produces:
  - Pure HTML renderers (`renderHeaderBar(state, route)`, `renderProfileView(state, uiState)`, `renderHubView(state)`, `renderJourneyView(state, { subjectId, selectedGrade })`) returning HTML strings + delegated `data-action="..."` attributes handled by `js/app.js` (so every view can be unit-tested in Node without a browser DOM library!).

- [ ] **Step 1: Write the failing tests in `tests/ui-shell.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createInitialState } from '../js/core/storage.js';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';
import { renderHeaderBar } from '../js/views/header-bar.js';
import { renderProfileView } from '../js/views/profile-view.js';
import { renderHubView } from '../js/views/hub-view.js';
import { renderJourneyView } from '../js/views/journey-view.js';

test('child-facing shell views contain zero <input> elements and expose accessible data-action controls', () => {
  const state = createInitialState();
  const htmls = [
    renderHeaderBar(state, { screen: 'hub' }),
    renderProfileView(state, { creating: true, draftName: 'LEO', draftGrade: 'vorschule' }),
    renderHubView(state),
    renderJourneyView(state, { subjectId: 'mathe', selectedGrade: 'klasse1' })
  ];
  for (const html of htmls) {
    assert.ok(!html.toLowerCase().includes('<input'), 'child views must never render <input>');
  }
  assert.ok(htmls[2].includes('Rechnen') && htmls[2].includes('Deutsch'));
  assert.ok(htmls[3].includes('Vorschule') && htmls[3].includes('Klasse 1') && htmls[3].includes('Klasse 2'));
});

test('index.html and css/lernreise.css enforce touch-action manipulation, >=56px tap targets, and module boot', () => {
  const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../css/lernreise.css', import.meta.url), 'utf8');
  assert.ok(indexHtml.includes('<script type="module" src="./js/app.js"></script>'));
  assert.ok(css.includes('touch-action: manipulation') && css.includes('user-select: none') && css.includes('56px'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ui-shell.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `index.html`, `css/lernreise.css`, `header-bar.js`, `profile-view.js`, `hub-view.js`, `journey-view.js`, and `js/app.js`**

- `css/lernreise.css`: Warm, friendly child-app design tokens (`--bg-canvas`, `--surface-card`, `--accent-primary`, `--coin-gold`, `--star-gold`, `--ok-green`, `--fix-coral`), `'Andika'` typography, `min-height: 56px; min-width: 56px` on `.btn-touch`, responsive tablet/desktop grids.
- `profile-view.js`: Profile cards with live `renderAvatarSvg`, plus an inline touch-tile A–Z/ÄÖÜ name builder + grade selector (`Vorschule | Klasse 1 | Klasse 2`) so creating/switching child profiles never invokes the tablet OS keyboard.
- `journey-view.js`: Top grade switcher defaulting to `activeProfile.defaultGrade`, displaying the 3 themed Lernreisen and their 3 stages (`⭐⭐⭐⭐⭐` best stars, `Start ▶` on unlocked stages, `🔒` on locked stages).
- `js/app.js`: Central store + route controller (`hub`, `profiles`, `journey`, `exercise`, `summary`, `avatar`, `album`, `goals`, `parent`) delegating `[data-action]` clicks cleanly.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 8**

```powershell
git add index.html css/lernreise.css js/app.js js/views/header-bar.js js/views/profile-view.js js/views/hub-view.js js/views/journey-view.js tests/ui-shell.test.js
git commit -m "feat: add SPA shell, touch design system, profile switcher, subject hub and journey view"
```

---

### Task 9: Interactive Exercise Runner (4 Touch Renderers + Immediate Check) & End-of-Round Summary

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\exercise-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\summary-view.js`
- Modify: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\app.js`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\exercise-runner.test.js`

**Interfaces:**
- Consumes: `generateStageRound`, `evaluateTaskAnswer`, `getStageMeta` (`content/subjects.js`), `applyRoundResult` (`js/core/progression.js`), `speakText`, `stopSpeech` (`js/core/audio.js`), `renderAssetHtml` (`js/core/assets.js`)
- Produces:
  - `js/views/exercise-view.js`:
    - `createExerciseSession(stageId: string, options?: { rng?: () => number }) -> ExerciseSession`
    - `applyExerciseAction(session: ExerciseSession, action: { type: string, value?: string }) -> ExerciseSession`
    - `renderExerciseView(session: ExerciseSession, profile: Profile) -> string`
  - `js/views/summary-view.js`:
    - `renderSummaryView(session: ExerciseSession, rewardSummary: object, profile: Profile) -> string`

- [ ] **Step 1: Write the failing tests in `tests/exercise-runner.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';
import { createInitialState, getActiveProfile } from '../js/core/storage.js';
import { applyRoundResult } from '../js/core/progression.js';
import { createExerciseSession, applyExerciseAction, renderExerciseView } from '../js/views/exercise-view.js';
import { renderSummaryView } from '../js/views/summary-view.js';

test('exercise session enforces Variant B immediate per-card feedback before advancing through all 8 cards', () => {
  const profile = getActiveProfile(createInitialState());
  let session = createExerciseSession('mathe-kl1-t1-s1');
  assert.equal(session.tasks.length, 8);
  assert.equal(session.currentIndex, 0);

  for (let i = 0; i < 8; i++) {
    const task = session.tasks[session.currentIndex];
    const htmlBefore = renderExerciseView(session, profile);
    assert.ok(!htmlBefore.toLowerCase().includes('<input'));

    // Set answer and submit -> enters 'feedback' phase on same card
    session = applyExerciseAction(session, { type: 'set-answer', value: String(task.correctAnswer) });
    session = applyExerciseAction(session, { type: 'submit-card' });
    assert.equal(session.phase, 'feedback');
    assert.equal(session.results.length, i + 1);
    assert.equal(session.results[i].isCorrect, true);

    // Advance to next card (or complete after card 8)
    session = applyExerciseAction(session, { type: 'next-card' });
  }
  assert.equal(session.phase, 'completed');
  assert.equal(session.correctCount, 8);

  const outcome = applyRoundResult(profile, {
    stageId: session.stageId,
    correctCount: session.correctCount,
    dateKey: '2026-10-31'
  });
  const summaryHtml = renderSummaryView(session, outcome.summary, outcome.profile);
  assert.ok(summaryHtml.includes('5') && summaryHtml.includes('14') && !summaryHtml.toLowerCase().includes('<input'));
});

test('numpad-gap backspace, tile-builder toggle, and sequence-order reset work deterministically', () => {
  let sNum = createExerciseSession('mathe-kl2-t1-s1');
  // Force testing digit entry + backspace on numpad task
  sNum = applyExerciseAction(sNum, { type: 'numpad-digit', value: '4' });
  sNum = applyExerciseAction(sNum, { type: 'numpad-digit', value: '2' });
  assert.equal(sNum.draftInput, '42');
  sNum = applyExerciseAction(sNum, { type: 'numpad-backspace' });
  assert.equal(sNum.draftInput, '4');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/exercise-runner.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `js/views/exercise-view.js`, `js/views/summary-view.js`, and wire into `js/app.js`**

- Render all 4 touch task modes (`choice-cards` with per-choice `🔊` button when `speechLabel` exists, `numpad-gap` with yellow active gap `#fffacd` and fixed/bottom `0–9 / ⌫ / OK` pad, `tile-builder` with tap-to-append/remove syllable or letter tiles, `sequence-order` with tap-to-order slots).
- Include top progress bar (`1 / 8` … `8 / 8`), `🔊 Vorlesen` button + audio mute toggle (auto-speaking new cards when `profile.audioEnabled` is true), and two-tap `✕ Abbrechen` guard so children don't lose a round on one stray tap.
- In `phase === 'feedback'`, highlight right answer in friendly green or show the gentle correction banner (`Richtige Lösung: …`) with a prominent `Weiter ▶` button.
- In `summary-view.js`, show the 1–5 Stars banner, complete 8-row task review (`✓` / `✗` + expected answer), `+X 🪙 Taler` card, Track A new stage sticker button (*„Jetzt ins Album kleben!“*), and Track C Surprise Chest animation/reveal when `rewardSummary.surpriseRewards.length > 0`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS.

- [ ] **Step 5: Commit Task 9**

```powershell
git add js/views/exercise-view.js js/views/summary-view.js js/app.js tests/exercise-runner.test.js
git commit -m "feat: add 4-mode touch exercise runner with per-card feedback and 1-5 star summary view"
```

---

### Task 10: Avatar Builder, Sticker Album, Goals/Vouchers, Protected Parent Area & Offline PWA

**Files:**
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\avatar-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\album-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\views\parent-view.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\manifest.json`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\sw.js`
- Create: `c:\Users\matth\OneDrive\Dokumente\lernreise\README.md`
- Modify: `c:\Users\matth\OneDrive\Dokumente\lernreise\js\app.js`
- Modify: `c:\Users\matth\OneDrive\Dokumente\lernreise\index.html`
- Test: `c:\Users\matth\OneDrive\Dokumente\lernreise\tests\pwa-and-views.test.js`

**Interfaces:**
- Consumes: `AVATAR_CATALOG`, `STICKER_CATALOG`, `updateAvatar`, `placeSticker` (`js/core/progression.js`), `upsertParentGoal`, `removeParentGoal`, `copyGoalsToAllProfiles`, `redeemParentGoal`, `fulfillVoucher`, `cancelVoucher` (`js/core/rewards.js`), `createMathChallenge`, `setParentPin`, `verifyParentPin`, `exportBackupJson`, `importBackupJson` (`js/core/storage.js`)
- Produces:
  - `renderAvatarView(profile: Profile, uiTab?: string) -> string`
  - `renderAlbumView(profile: Profile, pageIndex?: number) -> string`
  - `renderChildGoalsView(profile: Profile, confirmGoalId?: string | null) -> string`
  - `renderParentView(state: AppState, parentSession: { unlocked: boolean, challenge: object, error?: string }) -> string`
  - Offline PWA (`manifest.json`, `sw.js` with `CORE_ASSETS` precaching every local HTML/CSS/JS/SVG file) & `README.md`.

- [ ] **Step 1: Write the failing tests in `tests/pwa-and-views.test.js`**

```javascript
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
  p = applyRoundResult(p, { stageId: 'mathe-kl1-t1-s1', correctCount: 8, dateKey: '2026-10-31' }).profile;
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/pwa-and-views.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `avatar-view.js`, `album-view.js`, `parent-view.js`, `manifest.json`, `sw.js`, `README.md`, and complete `js/app.js` wiring**

- `avatar-view.js`: Live `renderAvatarSvg` preview + tabs for *Figur* (`Monster`, `Junge`, `Mädchen`), *Farben* (skin/monster + hair swatches), *Frisuren* (all 5 free), and *Accessoires* (toggle up to 2 unlocked accessories simultaneously, locked slots show `🔒 Überraschungskiste (alle 12 ⭐)`).
- `album-view.js`: 7 page tabs with placed stickers rendered in full color card frame, newly unlocked unplaced stickers pulsing with *„✨ NEU – Antippen zum Einkleben“*, and locked slots showing `❓` + which stage unlocks them, plus the 12-star Surprise Chest progress bar at the top.
- `parent-view.js`: Exports both `renderChildGoalsView` (child-safe two-tap goal redemption + list of open voucher tickets waiting for parent checkoff, zero `<input>` tags, on-screen numpad used even for the parent gate unlock!) and `renderParentView` (unlocked parent dashboard with goal CRUD, *„Auf alle Kinder-Profile kopieren“*, open voucher *„Eingelöst ✓“* / *„Stornieren & Taler erstatten“*, optional 4-digit PIN setup, profile grade/audio toggles, JSON backup download & JSON file restore/merge). Automatically re-locks whenever leaving the `parent` route.
- `manifest.json` + `sw.js` (`CACHE_NAME = 'lernreise-offline-v1'`) + `README.md` documenting local start, architecture, backup format, and workflow for replacing placeholders via `ASSETS_TODO.md`.

- [ ] **Step 4: Run full test suite in `lernreise` and verify `tabbi` git status**

Run in `c:\Users\matth\OneDrive\Dokumente\lernreise`: `node --test tests/*.test.js`
Expected: PASS (all 9 test files passing, 0 failures), and `git status` in `c:\Users\matth\OneDrive\Dokumente\tabbi` remains clean.

- [ ] **Step 5: Commit Task 10**

```powershell
git add js/views/avatar-view.js js/views/album-view.js js/views/parent-view.js js/app.js index.html manifest.json sw.js README.md tests/pwa-and-views.test.js
git commit -m "feat: add avatar builder, sticker album, parent goals/vouchers, backup UI and offline PWA"
```
