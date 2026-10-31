// Parent goals, Taler redemption and voucher lifecycle

function generateId(prefix = 'v') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function upsertParentGoal(profile, goalInput) {
  const cost = typeof goalInput.costCoins === 'number' ? Math.max(1, Math.round(goalInput.costCoins)) : 30;
  const id = goalInput.id || generateId('goal');
  const existingIndex = profile.parentGoals.findIndex(g => g.id === id);

  const goal = {
    id,
    title: goalInput.title || 'Belohnung',
    iconId: goalInput.iconId || 'ui-goal-tablet',
    costCoins: cost,
    active: goalInput.active !== undefined ? Boolean(goalInput.active) : true
  };

  const newGoals = [...profile.parentGoals];
  if (existingIndex >= 0) {
    newGoals[existingIndex] = goal;
  } else {
    newGoals.push(goal);
  }

  return {
    ...profile,
    parentGoals: newGoals
  };
}

export function removeParentGoal(profile, goalId) {
  return {
    ...profile,
    parentGoals: profile.parentGoals.filter(g => g.id !== goalId)
  };
}

export function copyGoalsToAllProfiles(state, sourceProfileId) {
  const source = state.profiles.find(p => p.id === sourceProfileId);
  if (!source) return state;

  return {
    ...state,
    profiles: state.profiles.map(p => {
      if (p.id === sourceProfileId) return p;
      return {
        ...p,
        parentGoals: source.parentGoals.map(g => ({ ...g, id: generateId('goal') }))
      };
    })
  };
}

export function redeemParentGoal(profile, goalId, nowIso = new Date().toISOString()) {
  const goal = profile.parentGoals.find(g => g.id === goalId);
  if (!goal) {
    return { ok: false, profile, error: 'Ziel nicht gefunden' };
  }
  if (goal.active === false) {
    return { ok: false, profile, error: 'Ziel ist nicht aktiv' };
  }
  if (profile.wallet.coins < goal.costCoins) {
    return { ok: false, profile, error: 'Nicht genügend Taler' };
  }

  const voucher = {
    id: generateId('vouch'),
    goalId: goal.id,
    title: goal.title,
    costCoins: goal.costCoins,
    iconId: goal.iconId,
    redeemedAt: nowIso,
    fulfilledAt: null
  };

  const updatedProfile = {
    ...profile,
    wallet: {
      ...profile.wallet,
      coins: profile.wallet.coins - goal.costCoins
    },
    vouchers: [voucher, ...profile.vouchers]
  };

  return {
    ok: true,
    profile: updatedProfile,
    voucher
  };
}

export function fulfillVoucher(profile, voucherId, nowIso = new Date().toISOString()) {
  return {
    ...profile,
    vouchers: profile.vouchers.map(v => {
      if (v.id !== voucherId) return v;
      return {
        ...v,
        fulfilledAt: nowIso
      };
    })
  };
}

export function cancelVoucher(profile, voucherId) {
  const voucher = profile.vouchers.find(v => v.id === voucherId);
  if (!voucher) {
    return { ok: false, profile, error: 'Gutschein nicht gefunden' };
  }
  if (voucher.fulfilledAt !== null) {
    return { ok: false, profile, error: 'Bereits eingelöste Gutscheine können nicht storniert werden' };
  }

  const updatedProfile = {
    ...profile,
    wallet: {
      ...profile.wallet,
      coins: profile.wallet.coins + voucher.costCoins
    },
    vouchers: profile.vouchers.filter(v => v.id !== voucherId)
  };

  return {
    ok: true,
    profile: updatedProfile
  };
}
