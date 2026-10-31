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
  assert.equal(STICKER_CATALOG.pages.length, 7);
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

  // Second pass does not re-award stage sticker as new
  const win2 = applyRoundResult(win.profile, { stageId: stages[0], correctCount: 8, dateKey: '2026-10-31' });
  assert.equal(win2.summary.isFirstPass, false);
  assert.equal(win2.summary.newStageSticker, null);
});

test('Track C 12-star Surprise Chest carries over remainder stars, avoids duplicates, and grants +5 coins when exhausted', () => {
  let p = getActiveProfile(createInitialState());
  p = { ...p, unlocks: { ...p.unlocks, surpriseProgressStars: 10 } };
  const res = applyRoundResult(p, { stageId: 'mathe-vs-t1-s1', correctCount: 8, dateKey: '2026-10-31' });
  assert.equal(res.summary.stars, 5);
  assert.equal(res.profile.unlocks.surpriseProgressStars, 3); // (10 + 5) % 12 = 3
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
  assert.ok(p.unlocks.placedStickerIds.includes(stickerId));
  p = updateAvatar(p, { bodyType: 'girl', accessoryIds: ['acc-krone'] });
  const redeemed = redeemParentGoal(p, p.parentGoals[0].id);
  assert.equal(redeemed.ok, true);
  assert.deepEqual(redeemed.profile.unlocks, p.unlocks);
  assert.deepEqual(redeemed.profile.avatar, p.avatar);

  // Trying to equip a locked accessory is rejected/ignored
  const lockedEquip = updateAvatar(p, { accessoryIds: ['acc-unlocked-fake'] });
  assert.deepEqual(lockedEquip.avatar.accessoryIds, []);
});
