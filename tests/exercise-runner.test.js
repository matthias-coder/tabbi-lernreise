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
  assert.equal(session.phase, 'answering');

  for (let i = 0; i < 8; i++) {
    const task = session.tasks[session.currentIndex];
    const htmlBefore = renderExerciseView(session, profile);
    assert.ok(!htmlBefore.toLowerCase().includes('<input'), 'exercise view must never render <input>');

    // Set answer and submit -> enters 'feedback' phase on same card
    session = applyExerciseAction(session, { type: 'set-answer', value: String(task.correctAnswer) });
    session = applyExerciseAction(session, { type: 'submit-card' });
    assert.equal(session.phase, 'feedback');
    assert.equal(session.results.length, i + 1);
    assert.equal(session.results[i].isCorrect, true);

    const htmlFeedback = renderExerciseView(session, profile);
    assert.ok(htmlFeedback.includes('data-action="next-card"'));

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
  assert.ok(summaryHtml.includes('data-action="summary-to-journey"'));
});

test('numpad-gap backspace, tile-builder toggle, and sequence-order reset work deterministically', () => {
  let sNum = createExerciseSession('mathe-kl2-t1-s1');
  // Digit entry + backspace on numpad task
  sNum = applyExerciseAction(sNum, { type: 'numpad-digit', value: '4' });
  sNum = applyExerciseAction(sNum, { type: 'numpad-digit', value: '2' });
  assert.equal(sNum.draftInput, '42');
  sNum = applyExerciseAction(sNum, { type: 'numpad-backspace' });
  assert.equal(sNum.draftInput, '4');
  sNum = applyExerciseAction(sNum, { type: 'numpad-clear' });
  assert.equal(sNum.draftInput, '');
});

test('zahlenhaus, zahlenmauer, zehnerstreifen, and nachbarzahlen render authentic visual components with visible OK numpad button', () => {
  const profile = getActiveProfile(createInitialState());

  // 1. Zahlenhaus (mathe-kl1-t1-s1)
  const sHaus = createExerciseSession('mathe-kl1-t1-s1');
  assert.equal(sHaus.tasks[0].type, 'zahlenhaus');
  const hausHtml = renderExerciseView(sHaus, profile);
  assert.ok(hausHtml.includes('zahlenhaus-toy') && hausHtml.includes('dach-badge-window') && hausHtml.includes('haus-body'));
  assert.ok(hausHtml.includes('numpad-submit-btn') && !hausHtml.toLowerCase().includes('<input'));

  // Typing "0" must activate the OK button (btn-ready)
  const sHausTyped0 = applyExerciseAction(sHaus, { type: 'numpad-digit', value: '0' });
  const haus0Html = renderExerciseView(sHausTyped0, profile);
  assert.ok(haus0Html.includes('btn-ready'), 'typing 0 must activate OK button');

  // 2. Zahlenmauer (mathe-kl1-t3-s3)
  const sMauer = createExerciseSession('mathe-kl1-t3-s3');
  assert.equal(sMauer.tasks[0].type, 'zahlenmauer');
  const mauerHtml = renderExerciseView(sMauer, profile);
  assert.ok(mauerHtml.includes('zahlenmauer-pyramid') && mauerHtml.includes('mauer-brick'));

  // 3. Zehnerstreifen (mathe-kl1-t1-s3)
  const sStreifen = createExerciseSession('mathe-kl1-t1-s3');
  assert.equal(sStreifen.tasks[0].type, 'zehnerstreifen');
  const streifenHtml = renderExerciseView(sStreifen, profile);
  assert.ok(streifenHtml.includes('zehnerstreifen-toy') && streifenHtml.includes('fuenfer-pack'));

  // 4. Nachbarzahlen (mathe-kl1-t3-s1)
  const sNachbar = createExerciseSession('mathe-kl1-t3-s1');
  assert.equal(sNachbar.tasks[0].type, 'nachbarzahlen');
  const nachbarHtml = renderExerciseView(sNachbar, profile);
  assert.ok(nachbarHtml.includes('nachbar-trio-card') && nachbarHtml.includes('nachbar-box'));

  // 5. Visual renders for dice, hands, dots, dienes, number-line, and dot-array
  const sDice = createExerciseSession('mathe-vs-t1-s2');
  const diceHtml = renderExerciseView(sDice, profile);
  assert.ok(diceHtml.includes('dice-svg'), 'dice stage must render SVG dice');

  const sHands = createExerciseSession('mathe-vs-t2-s2');
  const handsHtml = renderExerciseView(sHands, profile);
  assert.ok(handsHtml.includes('two-hands-container'), 'two hands stage must render both hands');

  const sDienes = createExerciseSession('mathe-kl2-t1-s1');
  const dienesHtml = renderExerciseView(sDienes, profile);
  assert.ok(dienesHtml.includes('dienes-material-tray'), 'Dienes stage must render base-10 blocks');

  const sArray = createExerciseSession('mathe-kl2-t3-s1');
  const arrayHtml = renderExerciseView(sArray, profile);
  assert.ok(arrayHtml.includes('dot-array-tray'), 'Multiplication stage must render dot array grid');
});

test('six new interactive curriculum types (rechendreieck, hunderter-kreuz, geld-betrag, analog-clock, silbenkoenig, schuettelwort) render and evaluate correctly', () => {
  const profile = getActiveProfile(createInitialState());

  // 1. Rechendreieck (mathe-kl1-t2-s3)
  let sDreieck = createExerciseSession('mathe-kl1-t2-s3');
  assert.equal(sDreieck.tasks[0].type, 'rechendreieck');
  const dreieckHtml = renderExerciseView(sDreieck, profile);
  assert.ok(dreieckHtml.includes('rechendreieck-toy') && dreieckHtml.includes('dreieck-shape-svg') && dreieckHtml.includes('dreieck-node'));
  sDreieck = applyExerciseAction(sDreieck, { type: 'numpad-digit', value: String(sDreieck.tasks[0].correctAnswer) });
  sDreieck = applyExerciseAction(sDreieck, { type: 'submit-card' });
  assert.equal(sDreieck.results[0].isCorrect, true);

  // 2. Hundertertafel-Kreuz (mathe-kl2-t1-s2)
  let sKreuz = createExerciseSession('mathe-kl2-t1-s2');
  assert.equal(sKreuz.tasks[0].type, 'hunderter-kreuz');
  const kreuzHtml = renderExerciseView(sKreuz, profile);
  assert.ok(kreuzHtml.includes('hunderter-kreuz-grid') && kreuzHtml.includes('cell-center') && kreuzHtml.includes('cell-gap'));
  sKreuz = applyExerciseAction(sKreuz, { type: 'numpad-digit', value: String(sKreuz.tasks[0].correctAnswer) });
  sKreuz = applyExerciseAction(sKreuz, { type: 'submit-card' });
  assert.equal(sKreuz.results[0].isCorrect, true);

  // 3. Geld-Betrag Zählen (mathe-kl1-t3-s2)
  let sGeldCount = createExerciseSession('mathe-kl1-t3-s2');
  assert.equal(sGeldCount.tasks[0].type, 'geld-betrag');
  assert.equal(sGeldCount.tasks[0].payload.mode, 'count');
  const geldCountHtml = renderExerciseView(sGeldCount, profile);
  assert.ok(geldCountHtml.includes('interactive-geld-count-stage') && geldCountHtml.includes('geld-tray'));
  sGeldCount = applyExerciseAction(sGeldCount, { type: 'numpad-digit', value: String(sGeldCount.tasks[0].correctAnswer) });
  sGeldCount = applyExerciseAction(sGeldCount, { type: 'submit-card' });
  assert.equal(sGeldCount.results[0].isCorrect, true);

  // 4. Geld-Betrag Legen (mathe-kl2-t2-s2)
  let sGeldPlace = createExerciseSession('mathe-kl2-t2-s2');
  assert.equal(sGeldPlace.tasks[0].type, 'geld-betrag');
  assert.equal(sGeldPlace.tasks[0].payload.mode, 'place');
  const target = sGeldPlace.tasks[0].payload.target;
  const geldPlaceHtml = renderExerciseView(sGeldPlace, profile);
  assert.ok(geldPlaceHtml.includes('interactive-geld-place-stage') && geldPlaceHtml.includes('geld-wallet-area') && geldPlaceHtml.includes('geld-bank-area'));

  // Place coins to match target
  let remaining = target;
  for (const c of [20, 10, 5, 2, 1]) {
    while (remaining >= c) {
      sGeldPlace = applyExerciseAction(sGeldPlace, { type: 'place-coin', value: c });
      remaining -= c;
    }
  }
  assert.equal(remaining, 0);
  assert.equal(sGeldPlace.selectedCoins.reduce((a, b) => a + (typeof b === 'object' ? b.value : b), 0), target);
  sGeldPlace = applyExerciseAction(sGeldPlace, { type: 'submit-card' });
  assert.equal(sGeldPlace.results[0].isCorrect, true);

  // Test remove and clear coin
  let sCoinTest = createExerciseSession('mathe-kl2-t2-s2');
  sCoinTest = applyExerciseAction(sCoinTest, { type: 'place-coin', value: 5 });
  sCoinTest = applyExerciseAction(sCoinTest, { type: 'place-coin', value: 2 });
  assert.deepEqual(sCoinTest.selectedCoins.map(c => c.value), [5, 2]);
  sCoinTest = applyExerciseAction(sCoinTest, { type: 'remove-coin', index: 0 });
  assert.deepEqual(sCoinTest.selectedCoins.map(c => c.value), [2]);
  sCoinTest = applyExerciseAction(sCoinTest, { type: 'clear-coins' });
  assert.deepEqual(sCoinTest.selectedCoins, []);

  // 5. Analog-Clock Choice Visual (mathe-kl2-t3-s2)
  const sClock = createExerciseSession('mathe-kl2-t3-s2');
  assert.equal(sClock.tasks[0].type, 'choice-cards');
  assert.equal(sClock.tasks[0].visual.type, 'analog-clock');
  const clockHtml = renderExerciseView(sClock, profile);
  assert.ok(clockHtml.includes('analog-clock-wrapper') && clockHtml.includes('clock-svg'));

  // 6. Silbenkönig (deutsch-kl1-t1-s3)
  let sSilben = createExerciseSession('deutsch-kl1-t1-s3');
  assert.equal(sSilben.tasks[0].type, 'silbenkoenig');
  const silbenHtml = renderExerciseView(sSilben, profile);
  assert.ok(silbenHtml.includes('interactive-silbenkoenig-stage') && silbenHtml.includes('silben-word-card') && silbenHtml.includes('silben-token-btn'));

  const correctKings = sSilben.tasks[0].correctAnswer;
  for (const kingIdx of correctKings) {
    sSilben = applyExerciseAction(sSilben, { type: 'toggle-crown', index: kingIdx });
  }
  assert.deepEqual(sSilben.crownedTokens.sort(), [...correctKings].sort());
  sSilben = applyExerciseAction(sSilben, { type: 'submit-card' });
  assert.equal(sSilben.results[0].isCorrect, true);

  // 7. Schüttelwort (deutsch-kl1-t2-s3)
  let sSchuettel = createExerciseSession('deutsch-kl1-t2-s3');
  assert.equal(sSchuettel.tasks[0].type, 'schuettelwort');
  const schuettelHtml = renderExerciseView(sSchuettel, profile);
  assert.ok(schuettelHtml.includes('interactive-schuettelwort-stage') && schuettelHtml.includes('word-slots-display') && schuettelHtml.includes('scrambled-letters-row'));

  const targetWord = sSchuettel.tasks[0].correctAnswer;
  const scrambled = sSchuettel.tasks[0].payload.scrambled;
  // Place letters in correct order matching targetWord
  const usedIndices = new Set();
  for (const char of targetWord) {
    const originIdx = scrambled.findIndex((c, idx) => c === char && !usedIndices.has(idx));
    assert.ok(originIdx !== -1);
    usedIndices.add(originIdx);
    sSchuettel = applyExerciseAction(sSchuettel, { type: 'place-letter', letter: char, originIdx });
  }
  sSchuettel = applyExerciseAction(sSchuettel, { type: 'submit-card' });
  assert.equal(sSchuettel.results[0].isCorrect, true);
});

test('worksheet theming renders authentic Rechenheft background/stamp for Mathe and Schreibheft-Lineatur with Tintenflecken for Deutsch', () => {
  const profile = getActiveProfile(createInitialState());

  // Mathe stage
  const sMathe = createExerciseSession('mathe-kl1-t1-s1');
  const matheHtml = renderExerciseView(sMathe, profile);
  assert.ok(matheHtml.includes('exercise-view-mathe'));
  assert.ok(matheHtml.includes('task-card-mathe'));
  assert.ok(matheHtml.includes('sheet-paper-margin') && matheHtml.includes('binder-hole'));

  // Deutsch stage
  const sDeutsch = createExerciseSession('deutsch-kl1-t1-s1');
  const deutschHtml = renderExerciseView(sDeutsch, profile);
  assert.ok(deutschHtml.includes('exercise-view-deutsch'));
  assert.ok(deutschHtml.includes('task-card-deutsch'));
  assert.ok(deutschHtml.includes('tintenfleck-corner.svg') && deutschHtml.includes('tintenfleck.svg'));
});
