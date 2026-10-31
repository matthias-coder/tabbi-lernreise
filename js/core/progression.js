// Lernreise progression engine, stage unlocks and A+C dual reward applicator

import { calculateStars, calculateRoundCoins, PASS_STARS } from './scoring.js';
import { AVATAR_CATALOG } from '../../content/avatar-catalog.js';
import { STICKER_CATALOG, getStickerForStage } from '../../content/sticker-catalog.js';

export const SURPRISE_THRESHOLD_STARS = 12;
export const EXHAUSTED_SURPRISE_BONUS_COINS = 5;

export function isStageUnlocked(profile, topicStageIds, stageIndex) {
  if (stageIndex === 0) return true;
  if (!Array.isArray(topicStageIds) || stageIndex >= topicStageIds.length) return false;

  const prevStageId = topicStageIds[stageIndex - 1];
  const prevProgress = profile.journeyProgress?.[prevStageId];
  return (prevProgress?.bestStars || 0) >= PASS_STARS;
}

export function applyRoundResult(profile, params = {}) {
  const {
    stageId,
    correctCount,
    totalCount = 8,
    dateKey = new Date().toISOString().slice(0, 10),
    nowIso = new Date().toISOString()
  } = params;

  const stars = calculateStars(correctCount, totalCount);
  const currentProgress = profile.journeyProgress?.[stageId] || { bestStars: 0, completions: 0 };
  const isFirstPass = stars >= PASS_STARS && currentProgress.bestStars < PASS_STARS;

  const dailyKey = `${dateKey}:${stageId}`;
  const completionsTodayBeforeThis = profile.dailyStageCounts?.[dailyKey] || 0;

  const coinResult = calculateRoundCoins({
    stars,
    isFirstPass,
    completionsTodayBeforeThis
  });

  // 1. Update journey progress
  const updatedJourneyProgress = {
    ...profile.journeyProgress,
    [stageId]: {
      bestStars: Math.max(currentProgress.bestStars || 0, stars),
      completions: (currentProgress.completions || 0) + 1,
      firstCompletedAt: currentProgress.firstCompletedAt || (stars >= PASS_STARS ? nowIso : null),
      lastCompletedAt: nowIso
    }
  };

  const updatedDailyStageCounts = {
    ...profile.dailyStageCounts,
    [dailyKey]: completionsTodayBeforeThis + 1
  };

  // 2. Track A: Stage Sticker on first pass (>= 3 stars)
  let newStageSticker = null;
  const unlockedStickers = new Set(profile.unlocks?.unlockedStickerIds || []);

  if (isFirstPass) {
    const stageSticker = getStickerForStage(stageId);
    if (stageSticker && !unlockedStickers.has(stageSticker.id)) {
      unlockedStickers.add(stageSticker.id);
      newStageSticker = stageSticker;
    }
  }

  // 3. Track C: 12-Star Surprise Chest
  let surpriseProgressStars = (profile.unlocks?.surpriseProgressStars || 0) + stars;
  let surpriseCount = profile.unlocks?.surpriseCount || 0;
  const unlockedAccessories = new Set(profile.unlocks?.unlockedAccessoryIds || []);
  const surpriseRewards = [];
  let chestBonusCoins = 0;

  while (surpriseProgressStars >= SURPRISE_THRESHOLD_STARS) {
    surpriseProgressStars -= SURPRISE_THRESHOLD_STARS;
    surpriseCount += 1;

    const lockedAccessories = AVATAR_CATALOG.unlockableAccessories.filter(a => !unlockedAccessories.has(a.id));
    const lockedBonusStickers = STICKER_CATALOG.bonusStickers.filter(s => !unlockedStickers.has(s.id));

    // Alternate between accessory and bonus sticker
    const preferAccessory = surpriseCount % 2 === 1;

    if (preferAccessory) {
      if (lockedAccessories.length > 0) {
        const item = lockedAccessories[0];
        unlockedAccessories.add(item.id);
        surpriseRewards.push({ kind: 'accessory', item });
      } else if (lockedBonusStickers.length > 0) {
        const item = lockedBonusStickers[0];
        unlockedStickers.add(item.id);
        surpriseRewards.push({ kind: 'bonus-sticker', item });
      } else {
        chestBonusCoins += EXHAUSTED_SURPRISE_BONUS_COINS;
        surpriseRewards.push({ kind: 'bonus-coins', coins: EXHAUSTED_SURPRISE_BONUS_COINS });
      }
    } else {
      if (lockedBonusStickers.length > 0) {
        const item = lockedBonusStickers[0];
        unlockedStickers.add(item.id);
        surpriseRewards.push({ kind: 'bonus-sticker', item });
      } else if (lockedAccessories.length > 0) {
        const item = lockedAccessories[0];
        unlockedAccessories.add(item.id);
        surpriseRewards.push({ kind: 'accessory', item });
      } else {
        chestBonusCoins += EXHAUSTED_SURPRISE_BONUS_COINS;
        surpriseRewards.push({ kind: 'bonus-coins', coins: EXHAUSTED_SURPRISE_BONUS_COINS });
      }
    }
  }

  const totalCoinsEarned = coinResult.totalCoins + chestBonusCoins;

  const updatedProfile = {
    ...profile,
    wallet: {
      ...profile.wallet,
      coins: (profile.wallet?.coins || 0) + totalCoinsEarned
    },
    unlocks: {
      ...profile.unlocks,
      unlockedStickerIds: Array.from(unlockedStickers),
      unlockedAccessoryIds: Array.from(unlockedAccessories),
      surpriseProgressStars,
      surpriseCount
    },
    journeyProgress: updatedJourneyProgress,
    dailyStageCounts: updatedDailyStageCounts
  };

  return {
    profile: updatedProfile,
    summary: {
      stars,
      isFirstPass,
      coinsEarned: totalCoinsEarned,
      antiFarmingApplied: coinResult.antiFarmingApplied,
      newStageSticker,
      surpriseRewards
    }
  };
}

export function placeSticker(profile, stickerId) {
  const unlocked = new Set(profile.unlocks?.unlockedStickerIds || []);
  if (!unlocked.has(stickerId)) return profile;

  const placed = new Set(profile.unlocks?.placedStickerIds || []);
  placed.add(stickerId);

  return {
    ...profile,
    unlocks: {
      ...profile.unlocks,
      placedStickerIds: Array.from(placed)
    }
  };
}

export function updateAvatar(profile, patch = {}) {
  const unlockedAccs = new Set(profile.unlocks?.unlockedAccessoryIds || []);
  const validAccs = Array.isArray(patch.accessoryIds)
    ? patch.accessoryIds.filter(id => unlockedAccs.has(id))
    : profile.avatar.accessoryIds;

  return {
    ...profile,
    avatar: {
      ...profile.avatar,
      ...patch,
      accessoryIds: validAccs
    }
  };
}
