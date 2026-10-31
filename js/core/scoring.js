// Scoring, 1-5 Stars and Taler Economy calculation

export const ROUND_SIZE = 8;
export const PASS_STARS = 3;

export function calculateStars(correctCount, totalCount = ROUND_SIZE) {
  if (totalCount <= 0) return 1;
  const count = Math.max(0, Math.min(correctCount, totalCount));
  const ratio = count / totalCount;

  if (ratio >= 1.0) return 5;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

export function calculateRoundCoins(params = {}) {
  const {
    stars = 1,
    isFirstPass = false,
    completionsTodayBeforeThis = 0
  } = params;

  if (completionsTodayBeforeThis >= 3) {
    return {
      baseCoins: 1,
      firstPassBonus: 0,
      totalCoins: 1,
      antiFarmingApplied: true
    };
  }

  const baseCoins = stars * 2;
  const firstPassBonus = isFirstPass ? 4 : 0;
  const totalCoins = baseCoins + firstPassBonus;

  return {
    baseCoins,
    firstPassBonus,
    totalCoins,
    antiFarmingApplied: false
  };
}
