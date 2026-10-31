// Lernreise SPA Root Controller & Event Delegator

import {
  loadState, saveState, getActiveProfile, setActiveProfile,
  addProfile, updateProfile, setParentPin
} from './core/storage.js';
import { speakText, stopSpeech } from './core/audio.js';
import { applyRoundResult } from './core/progression.js';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';

import { renderHeaderBar } from './views/header-bar.js';
import { renderProfileView } from './views/profile-view.js';
import { renderHubView } from './views/hub-view.js';
import { renderJourneyView } from './views/journey-view.js';
import { createExerciseSession, applyExerciseAction, renderExerciseView } from './views/exercise-view.js';
import { renderSummaryView } from './views/summary-view.js';

class LernreiseApp {
  constructor() {
    this.state = loadState();
    this.route = { screen: 'hub', params: {} };
    this.profileUi = { creating: false, draftName: '', draftGrade: 'klasse1', draftBody: 'monster' };
    this.exerciseSession = null;
    this.rewardSummary = null;
    this.parentSession = { unlocked: false, challenge: null, error: null };
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

      case 'hub':
      default:
        this.mainMount.innerHTML = renderHubView(this.state);
        break;
    }
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const val = target.getAttribute('data-value');
      const profile = getActiveProfile(this.state);

      switch (action) {
        case 'open-hub':
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

        case 'open-album':
          this.setRoute('album');
          break;

        case 'open-avatar':
          this.setRoute('avatar');
          break;

        case 'open-goals':
          this.setRoute('goals');
          break;

        case 'open-parent':
          this.setRoute('parent');
          break;
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const app = new LernreiseApp();
    app.init();
    window.lernreiseApp = app;
  });
}
