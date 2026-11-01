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
