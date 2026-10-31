import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY, SCHEMA_VERSION, DEFAULT_PARENT_GOALS,
  createProfile, createInitialState, loadState, saveState,
  addProfile, setActiveProfile, updateProfile, deleteProfile, getActiveProfile,
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
  assert.equal(s.profiles.length, 2);
  const second = s.profiles[1];
  s = setActiveProfile(s, second.id);
  assert.equal(getActiveProfile(s).id, second.id);
  s = deleteProfile(s, second.id);
  assert.equal(s.profiles.length, 1);
  assert.equal(s.activeProfileId, s.profiles[0].id);

  // updateProfile works
  s = updateProfile(s, s.activeProfileId, (p) => ({ ...p, displayName: 'Neuer Name' }));
  assert.equal(getActiveProfile(s).displayName, 'Neuer Name');
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

  assert.throws(() => setParentPin(s, '123'), /PIN muss 4 Ziffern haben/);
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

  // default storage in test (null/undefined) returns fresh state
  const fromNull = loadState(null);
  assert.equal(fromNull.schemaVersion, 1);
});
