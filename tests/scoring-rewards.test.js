import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStars, calculateRoundCoins, ROUND_SIZE, PASS_STARS } from '../js/core/scoring.js';
import {
  upsertParentGoal, removeParentGoal, copyGoalsToAllProfiles,
  redeemParentGoal, fulfillVoucher, cancelVoucher
} from '../js/core/rewards.js';
import { createInitialState, addProfile, getActiveProfile } from '../js/core/storage.js';

test('constants ROUND_SIZE=8 and PASS_STARS=3 are exported', () => {
  assert.equal(ROUND_SIZE, 8);
  assert.equal(PASS_STARS, 3);
});

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
  assert.equal(r1.profile.vouchers[0].title, goal30.title);

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
