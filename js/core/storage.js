// Local state store, multi-child profiles, parent gate and JSON backup/restore

export const STORAGE_KEY = 'lernreise_state_v1';
export const SCHEMA_VERSION = 1;

export const DEFAULT_PARENT_GOALS = [
  { id: 'goal-tablet', title: '30 Min. Tablet-Zeit', iconId: 'ui-goal-tablet', costCoins: 30, active: true },
  { id: 'goal-meal', title: 'Lieblingsessen wünschen', iconId: 'ui-goal-meal', costCoins: 60, active: true },
  { id: 'goal-cinema', title: 'Kino oder Ausflug', iconId: 'ui-goal-cinema', costCoins: 150, active: true }
];

function generateId(prefix = 'p') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createProfile(input = {}) {
  const defaultGrade = input.defaultGrade || 'klasse1';
  const audioEnabled = input.audioEnabled !== undefined ? Boolean(input.audioEnabled) : false;

  return {
    id: input.id || generateId('prof'),
    displayName: input.displayName || 'Entdecker',
    defaultGrade,
    audioEnabled,
    avatar: {
      bodyType: input.avatar?.bodyType || 'monster',
      skinColorId: input.avatar?.skinColorId || 'mint',
      hairStyleId: input.avatar?.hairStyleId || 'tuft',
      hairColorId: input.avatar?.hairColorId || 'brown',
      accessoryIds: Array.isArray(input.avatar?.accessoryIds) ? [...input.avatar.accessoryIds] : []
    },
    wallet: {
      coins: typeof input.wallet?.coins === 'number' ? Math.max(0, input.wallet.coins) : 0
    },
    unlocks: {
      unlockedStickerIds: Array.isArray(input.unlocks?.unlockedStickerIds) ? [...input.unlocks.unlockedStickerIds] : [],
      placedStickerIds: Array.isArray(input.unlocks?.placedStickerIds) ? [...input.unlocks.placedStickerIds] : [],
      unlockedAccessoryIds: Array.isArray(input.unlocks?.unlockedAccessoryIds) ? [...input.unlocks.unlockedAccessoryIds] : [],
      surpriseProgressStars: typeof input.unlocks?.surpriseProgressStars === 'number' ? input.unlocks.surpriseProgressStars : 0,
      surpriseCount: typeof input.unlocks?.surpriseCount === 'number' ? input.unlocks.surpriseCount : 0
    },
    journeyProgress: input.journeyProgress && typeof input.journeyProgress === 'object' ? { ...input.journeyProgress } : {},
    dailyStageCounts: input.dailyStageCounts && typeof input.dailyStageCounts === 'object' ? { ...input.dailyStageCounts } : {},
    parentGoals: Array.isArray(input.parentGoals) && input.parentGoals.length > 0
      ? input.parentGoals.map(g => ({ ...g }))
      : DEFAULT_PARENT_GOALS.map(g => ({ ...g, id: generateId('goal') })),
    vouchers: Array.isArray(input.vouchers) ? input.vouchers.map(v => ({ ...v })) : []
  };
}

export function createInitialState() {
  const initialProfile = createProfile({ displayName: 'Entdecker', defaultGrade: 'klasse1' });
  return {
    schemaVersion: SCHEMA_VERSION,
    activeProfileId: initialProfile.id,
    profiles: [initialProfile],
    parentGate: {
      mode: 'math',
      pin: null
    }
  };
}

export function getActiveProfile(state) {
  if (!state || !Array.isArray(state.profiles) || state.profiles.length === 0) {
    return createProfile();
  }
  const found = state.profiles.find(p => p.id === state.activeProfileId);
  return found || state.profiles[0];
}

export function setActiveProfile(state, profileId) {
  const exists = state.profiles.some(p => p.id === profileId);
  if (!exists) return state;
  return {
    ...state,
    activeProfileId: profileId
  };
}

export function addProfile(state, profileInput) {
  const newProfile = createProfile(profileInput);
  return {
    ...state,
    profiles: [...state.profiles, newProfile]
  };
}

export function updateProfile(state, profileId, updaterFn) {
  return {
    ...state,
    profiles: state.profiles.map(p => {
      if (p.id !== profileId) return p;
      return updaterFn(p);
    })
  };
}

export function deleteProfile(state, profileId) {
  if (state.profiles.length <= 1) {
    // Keep at least one profile
    return state;
  }
  const remaining = state.profiles.filter(p => p.id !== profileId);
  const activeProfileId = state.activeProfileId === profileId ? remaining[0].id : state.activeProfileId;
  return {
    ...state,
    activeProfileId,
    profiles: remaining
  };
}

export function createMathChallenge(rng = Math.random) {
  const a = 3 + Math.floor(rng() * 7); // 3..9
  const b = 3 + Math.floor(rng() * 7); // 3..9
  return {
    factorA: a,
    factorB: b,
    prompt: `${a} × ${b} = ?`,
    answer: a * b
  };
}

export function setParentPin(state, pinOrNull) {
  if (pinOrNull === null) {
    return {
      ...state,
      parentGate: {
        mode: 'math',
        pin: null
      }
    };
  }
  if (typeof pinOrNull !== 'string' || !/^\d{4}$/.test(pinOrNull)) {
    throw new Error('PIN muss 4 Ziffern haben');
  }
  return {
    ...state,
    parentGate: {
      mode: 'pin',
      pin: pinOrNull
    }
  };
}

export function verifyParentPin(state, pin) {
  if (state.parentGate.mode !== 'pin' || !state.parentGate.pin) {
    return false;
  }
  return state.parentGate.pin === pin;
}

export function loadState(storage = typeof window !== 'undefined' ? window.localStorage : null) {
  if (!storage) return createInitialState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.schemaVersion === SCHEMA_VERSION && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      return parsed;
    }
    return createInitialState();
  } catch (err) {
    return createInitialState();
  }
}

export function saveState(state, storage = typeof window !== 'undefined' ? window.localStorage : null) {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    return false;
  }
}

export function exportBackupJson(state, now = new Date()) {
  const dateStr = now.toISOString().slice(0, 10);
  const filename = `lernreise-backup-${dateStr}.json`;
  const json = JSON.stringify(state, null, 2);
  return { filename, json };
}

export function importBackupJson(currentState, jsonString, options = {}) {
  const { mode = 'replace' } = options;
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      return { ok: false, state: currentState, error: 'Ungültiges Dateiformat oder inkompatible Version' };
    }

    if (mode === 'replace') {
      const sanitizedProfiles = parsed.profiles.map(p => createProfile(p));
      const activeId = sanitizedProfiles.some(p => p.id === parsed.activeProfileId)
        ? parsed.activeProfileId
        : sanitizedProfiles[0].id;

      const newState = {
        schemaVersion: SCHEMA_VERSION,
        activeProfileId: activeId,
        profiles: sanitizedProfiles,
        parentGate: parsed.parentGate && typeof parsed.parentGate === 'object'
          ? { mode: parsed.parentGate.mode === 'pin' ? 'pin' : 'math', pin: parsed.parentGate.pin || null }
          : { mode: 'math', pin: null }
      };
      return { ok: true, state: newState };
    }

    if (mode === 'merge-profiles') {
      const existingIds = new Set(currentState.profiles.map(p => p.id));
      const importedProfiles = parsed.profiles.map(p => {
        const prof = createProfile(p);
        if (existingIds.has(prof.id)) {
          prof.id = generateId('prof');
        }
        return prof;
      });

      return {
        ok: true,
        state: {
          ...currentState,
          profiles: [...currentState.profiles, ...importedProfiles]
        }
      };
    }

    return { ok: false, state: currentState, error: `Unbekannter Modus: ${mode}` };
  } catch (err) {
    return { ok: false, state: currentState, error: 'JSON-Syntaxfehler in der Importdatei' };
  }
}
