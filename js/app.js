// Lernreise SPA Root Controller & Event Delegator

import {
  loadState, saveState, getActiveProfile, setActiveProfile,
  addProfile, updateProfile, setParentPin, verifyParentPin,
  createMathChallenge, exportBackupJson, importBackupJson
} from './core/storage.js';
import { speakText, stopSpeech } from './core/audio.js';
import { applyRoundResult, updateAvatar, placeSticker } from './core/progression.js';
import { redeemParentGoal, fulfillVoucher, cancelVoucher, copyGoalsToAllProfiles } from './core/rewards.js';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';

import { renderHeaderBar } from './views/header-bar.js';
import { renderProfileView } from './views/profile-view.js';
import { renderHubView } from './views/hub-view.js';
import { renderJourneyView } from './views/journey-view.js';
import { createExerciseSession, applyExerciseAction, renderExerciseView } from './views/exercise-view.js';
import { renderSummaryView } from './views/summary-view.js';
import { renderAvatarView } from './views/avatar-view.js';
import { renderAlbumView } from './views/album-view.js';
import { renderChildGoalsView, renderParentView } from './views/parent-view.js';

class LernreiseApp {
  constructor() {
    this.state = loadState();
    this.route = { screen: 'hub', params: {} };
    this.profileUi = { creating: false, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
    this.exerciseSession = null;
    this.rewardSummary = null;
    this.avatarTab = 'figur';
    this.albumPageIdx = 0;
    this.confirmGoalId = null;
    this.parentSession = { unlocked: false, challenge: null, inputVal: '', error: null };
  }

  init() {
    this.mountElements();
    this.bindEvents();
    this.render();
  }

  mountElements() {
    this.headerMount = document.getElementById('header-mount');
    this.mainMount = document.getElementById('app-main');
  }

  persist() {
    saveState(this.state);
  }

  setRoute(screen, params = {}) {
    stopSpeech();
    this.route = { screen, params };

    if (screen === 'exercise' && params.stageId) {
      if (!this.exerciseSession || this.exerciseSession.stageId !== params.stageId) {
        this.exerciseSession = createExerciseSession(params.stageId);
        const profile = getActiveProfile(this.state);
        if (profile.audioEnabled && this.exerciseSession.tasks[0]) {
          speakText(this.exerciseSession.tasks[0].speechText);
        }
      }
    }

    this.render();
  }

  render() {
    if (!this.mainMount) return;

    if (this.headerMount) {
      this.headerMount.innerHTML = renderHeaderBar(this.state, this.route);
    }

    const profile = getActiveProfile(this.state);

    switch (this.route.screen) {
      case 'profiles':
        this.mainMount.innerHTML = renderProfileView(this.state, this.profileUi);
        break;

      case 'journey':
        this.mainMount.innerHTML = renderJourneyView(this.state, {
          subjectId: this.route.params.subjectId || 'mathe',
          selectedGrade: this.route.params.selectedGrade || profile.defaultGrade || 'klasse1'
        });
        break;

      case 'exercise':
        if (this.exerciseSession) {
          this.mainMount.innerHTML = renderExerciseView(this.exerciseSession, profile);
        }
        break;

      case 'summary':
        if (this.exerciseSession && this.rewardSummary) {
          this.mainMount.innerHTML = renderSummaryView(this.exerciseSession, this.rewardSummary, profile);
        }
        break;

      case 'avatar':
        this.mainMount.innerHTML = renderAvatarView(profile, this.avatarTab);
        break;

      case 'album':
        this.mainMount.innerHTML = renderAlbumView(profile, this.albumPageIdx);
        break;

      case 'goals':
        this.mainMount.innerHTML = renderChildGoalsView(profile, this.confirmGoalId);
        break;

      case 'parent':
        this.mainMount.innerHTML = renderParentView(this.state, this.parentSession);
        break;

      case 'hub':
      default:
        this.mainMount.innerHTML = renderHubView(this.state);
        break;
    }
  }

  bindEvents() {
    // Delegated Change for parent backup import input
    document.addEventListener('change', (e) => {
      const target = e.target.closest('[data-action="import-backup-file"]');
      if (!target || !target.files || target.files.length === 0) return;
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        const result = importBackupJson(this.state, text, { mode: 'replace' });
        if (result.ok) {
          this.state = result.state;
          this.persist();
          alert('Backup erfolgreich geladen!');
          this.render();
        } else {
          alert(`Fehler beim Laden: ${result.error || 'Unbekannt'}`);
        }
      };
      reader.readAsText(file);
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const val = target.getAttribute('data-value');
      const profile = getActiveProfile(this.state);

      switch (action) {
        case 'open-hub':
          this.confirmGoalId = null;
          this.setRoute('hub');
          break;

        case 'open-profiles':
          this.profileUi = { creating: false, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
          this.setRoute('profiles');
          break;

        case 'select-profile': {
          const profileId = target.getAttribute('data-profile-id');
          this.state = setActiveProfile(this.state, profileId);
          this.persist();
          this.setRoute('hub');
          break;
        }

        case 'start-create-profile':
          this.profileUi = { creating: true, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
          this.render();
          break;

        case 'cancel-create-profile':
          this.profileUi = { creating: false, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
          this.render();
          break;

        case 'name-add-letter':
          if (this.profileUi.draftName.length < 14) {
            this.profileUi.draftName += val;
            this.render();
          }
          break;

        case 'name-backspace':
          this.profileUi.draftName = this.profileUi.draftName.slice(0, -1);
          this.render();
          break;

        case 'set-draft-grade':
          this.profileUi.draftGrade = val;
          this.render();
          break;

        case 'set-draft-body':
          this.profileUi.draftBody = val;
          this.render();
          break;

        case 'confirm-create-profile':
          if (this.profileUi.draftName.trim()) {
            this.state = addProfile(this.state, {
              displayName: this.profileUi.draftName.trim(),
              defaultGrade: this.profileUi.draftGrade,
              avatar: { bodyType: this.profileUi.draftBody }
            });
            const newProf = this.state.profiles[this.state.profiles.length - 1];
            this.state = setActiveProfile(this.state, newProf.id);
            this.persist();
            this.profileUi = { creating: false, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
            this.setRoute('hub');
          }
          break;

        case 'select-subject': {
          const subjectId = target.getAttribute('data-subject-id');
          this.setRoute('journey', { subjectId, selectedGrade: profile.defaultGrade || 'klasse1' });
          break;
        }

        case 'switch-journey-grade':
          this.route.params.selectedGrade = target.getAttribute('data-grade-id');
          this.render();
          break;

        case 'open-stage': {
          const stageId = target.getAttribute('data-stage-id');
          this.setRoute('exercise', { stageId });
          break;
        }

        case 'speak-prompt': {
          const text = target.getAttribute('data-speech');
          speakText(text, { enabled: true });
          break;
        }

        case 'select-choice': {
          if (!this.exerciseSession || this.exerciseSession.phase !== 'answering') return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'set-answer', value: val });
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'submit-card' });
          this.render();
          break;
        }

        case 'numpad-digit': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'numpad-digit', value: val });
          this.render();
          break;
        }

        case 'numpad-backspace': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'numpad-backspace' });
          this.render();
          break;
        }

        case 'toggle-tile': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'toggle-tile', value: val });
          this.render();
          break;
        }

        case 'clear-tiles': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'numpad-clear' });
          this.render();
          break;
        }

        case 'submit-card': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'submit-card' });
          this.render();
          break;
        }

        case 'next-card': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'next-card' });
          if (this.exerciseSession.phase === 'completed') {
            const outcome = applyRoundResult(profile, {
              stageId: this.exerciseSession.stageId,
              correctCount: this.exerciseSession.correctCount
            });
            this.state = updateProfile(this.state, profile.id, () => outcome.profile);
            this.persist();
            this.rewardSummary = outcome.summary;
            this.setRoute('summary');
          } else {
            if (profile.audioEnabled && this.exerciseSession.tasks[this.exerciseSession.currentIndex]) {
              speakText(this.exerciseSession.tasks[this.exerciseSession.currentIndex].speechText);
            }
            this.render();
          }
          break;
        }

        case 'ask-cancel': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'ask-cancel' });
          this.render();
          break;
        }

        case 'dismiss-cancel': {
          if (!this.exerciseSession) return;
          this.exerciseSession = applyExerciseAction(this.exerciseSession, { type: 'dismiss-cancel' });
          this.render();
          break;
        }

        case 'confirm-cancel': {
          const subId = this.exerciseSession?.meta?.subject?.id || 'mathe';
          this.exerciseSession = null;
          this.setRoute('journey', { subjectId: subId });
          break;
        }

        case 'summary-to-journey': {
          const subId = this.exerciseSession?.meta?.subject?.id || 'mathe';
          this.setRoute('journey', { subjectId: subId });
          break;
        }

        case 'summary-to-hub': {
          this.setRoute('hub');
          break;
        }

        case 'toggle-audio': {
          this.state = updateProfile(this.state, profile.id, (p) => ({ ...p, audioEnabled: !p.audioEnabled }));
          this.persist();
          this.render();
          break;
        }

        // --- AVATAR BUILDER ---
        case 'open-avatar':
          this.avatarTab = 'figur';
          this.setRoute('avatar');
          break;

        case 'switch-avatar-tab':
          this.avatarTab = val;
          this.render();
          break;

        case 'pick-avatar-body':
          this.state = updateProfile(this.state, profile.id, (p) => updateAvatar(p, { bodyType: val }));
          this.persist();
          this.render();
          break;

        case 'pick-skin-color':
          this.state = updateProfile(this.state, profile.id, (p) => updateAvatar(p, { skinColorId: val }));
          this.persist();
          this.render();
          break;

        case 'pick-hair-color':
          this.state = updateProfile(this.state, profile.id, (p) => updateAvatar(p, { hairColorId: val }));
          this.persist();
          this.render();
          break;

        case 'pick-hair-style':
          this.state = updateProfile(this.state, profile.id, (p) => updateAvatar(p, { hairStyleId: val }));
          this.persist();
          this.render();
          break;

        case 'toggle-avatar-accessory': {
          const accId = target.getAttribute('data-acc-id');
          const current = new Set(profile.avatar?.accessoryIds || []);
          if (current.has(accId)) {
            current.delete(accId);
          } else {
            current.add(accId);
          }
          this.state = updateProfile(this.state, profile.id, (p) => updateAvatar(p, { accessoryIds: Array.from(current) }));
          this.persist();
          this.render();
          break;
        }

        // --- STICKER ALBUM ---
        case 'open-album':
          this.albumPageIdx = 0;
          this.setRoute('album');
          break;

        case 'switch-album-page':
          this.albumPageIdx = parseInt(target.getAttribute('data-page-index') || '0', 10);
          this.render();
          break;

        case 'place-sticker': {
          const stickerId = target.getAttribute('data-sticker-id');
          this.state = updateProfile(this.state, profile.id, (p) => placeSticker(p, stickerId));
          this.persist();
          this.render();
          break;
        }

        // --- CHILD GOALS & REWARD SHOP ---
        case 'open-goals':
          this.confirmGoalId = null;
          this.setRoute('goals');
          break;

        case 'ask-redeem-goal':
          this.confirmGoalId = target.getAttribute('data-goal-id');
          this.render();
          break;

        case 'cancel-redeem-goal':
          this.confirmGoalId = null;
          this.render();
          break;

        case 'confirm-redeem-goal': {
          const goalId = target.getAttribute('data-goal-id');
          const outcome = redeemParentGoal(profile, goalId);
          if (outcome.ok) {
            this.state = updateProfile(this.state, profile.id, () => outcome.profile);
            this.persist();
          }
          this.confirmGoalId = null;
          this.render();
          break;
        }

        // --- PROTECTED PARENT DASHBOARD & GATE ---
        case 'open-parent':
          if (!this.parentSession.unlocked) {
            this.parentSession = {
              unlocked: false,
              challenge: createMathChallenge(),
              inputVal: '',
              error: null
            };
          }
          this.setRoute('parent');
          break;

        case 'parent-gate-digit':
          if (this.parentSession.inputVal.length < 6) {
            this.parentSession.inputVal += val;
            this.parentSession.error = null;
            this.render();
          }
          break;

        case 'parent-gate-backspace':
          this.parentSession.inputVal = this.parentSession.inputVal.slice(0, -1);
          this.parentSession.error = null;
          this.render();
          break;

        case 'parent-gate-submit': {
          const pinValid = this.state.parentGate?.pin && verifyParentPin(this.state, this.parentSession.inputVal);
          const mathValid = this.parentSession.challenge && parseInt(this.parentSession.inputVal, 10) === this.parentSession.challenge.answer;
          if (pinValid || mathValid) {
            this.parentSession.unlocked = true;
            this.parentSession.error = null;
            this.parentSession.inputVal = '';
          } else {
            this.parentSession.challenge = createMathChallenge();
            this.parentSession.inputVal = '';
            this.parentSession.error = 'Das war nicht richtig. Bitte neue Aufgabe lösen:';
          }
          this.render();
          break;
        }

        case 'parent-lock-and-exit':
          this.parentSession = { unlocked: false, challenge: null, inputVal: '', error: null };
          this.setRoute('hub');
          break;

        case 'parent-fulfill-voucher': {
          const voucherId = target.getAttribute('data-voucher-id');
          this.state = updateProfile(this.state, profile.id, (p) => fulfillVoucher(p, voucherId));
          this.persist();
          this.render();
          break;
        }

        case 'parent-cancel-voucher': {
          const voucherId = target.getAttribute('data-voucher-id');
          const outcome = cancelVoucher(profile, voucherId);
          if (outcome.ok) {
            this.state = updateProfile(this.state, profile.id, () => outcome.profile);
            this.persist();
          }
          this.render();
          break;
        }

        case 'parent-adjust-cost': {
          const goalId = target.getAttribute('data-goal-id');
          const delta = parseInt(target.getAttribute('data-delta') || '0', 10);
          this.state = updateProfile(this.state, profile.id, (p) => ({
            ...p,
            parentGoals: (p.parentGoals || []).map((g) => {
              if (g.id !== goalId) return g;
              return { ...g, costCoins: Math.max(5, g.costCoins + delta) };
            })
          }));
          this.persist();
          this.render();
          break;
        }

        case 'parent-toggle-goal': {
          const goalId = target.getAttribute('data-goal-id');
          this.state = updateProfile(this.state, profile.id, (p) => ({
            ...p,
            parentGoals: (p.parentGoals || []).map((g) => {
              if (g.id !== goalId) return g;
              return { ...g, active: g.active === false ? true : false };
            })
          }));
          this.persist();
          this.render();
          break;
        }

        case 'copy-goals-all':
          this.state = copyGoalsToAllProfiles(this.state, profile.id);
          this.persist();
          alert('Belohnungen wurden auf alle Profile übertragen!');
          this.render();
          break;

        case 'export-backup': {
          const { filename, json } = exportBackupJson(this.state);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
        }
      }
    });
  }
}

// Offline Service Worker Registration
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    const app = new LernreiseApp();
    app.init();
    window.lernreiseApp = app;
  });
}
