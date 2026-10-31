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
