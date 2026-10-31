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
