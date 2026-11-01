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
        const meta = getStageMeta(stageId);
        assert.ok(meta, `missing meta for ${stageId}`);
        assert.equal(meta.stageIndex, s - 1);
        assert.equal(meta.topicStageIds.length, 3);

        const tasks = generateStageRound(stageId);
        assert.equal(tasks.length, 8);
        for (const task of tasks) {
          assert.ok([
            'choice-cards', 'numpad-gap', 'tile-builder', 'sequence-order',
            'zahlenhaus', 'zahlenmauer', 'zehnerstreifen', 'nachbarzahlen',
            'rechendreieck', 'hunderter-kreuz', 'geld-betrag'
          ].includes(task.type), `unexpected task type ${task.type} in ${stageId}`);
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
