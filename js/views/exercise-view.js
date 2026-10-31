// Interactive 4-Mode Touch Exercise Runner with Variant B Immediate Card Check

import { generateStageRound, evaluateTaskAnswer, getStageMeta } from '../../content/subjects.js';
import { renderAssetHtml } from '../core/assets.js';

export function createExerciseSession(stageId, options = {}) {
  const tasks = generateStageRound(stageId, options);
  const meta = getStageMeta(stageId);

  return {
    stageId,
    meta,
    tasks,
    currentIndex: 0,
    phase: 'answering', // 'answering' | 'feedback' | 'completed'
    draftInput: '',
    selectedTiles: [],
    results: [],
    confirmCancel: false,
    correctCount: 0
  };
}

export function applyExerciseAction(session, action = {}) {
  const currentTask = session.tasks[session.currentIndex];

  switch (action.type) {
    case 'set-answer': {
      return {
        ...session,
        draftInput: String(action.value !== undefined ? action.value : '')
      };
    }

    case 'numpad-digit': {
      const maxDigits = currentTask?.payload?.maxDigits || 3;
      if (session.draftInput.length >= maxDigits) return session;
      return {
        ...session,
        draftInput: `${session.draftInput}${action.value}`
      };
    }

    case 'numpad-backspace': {
      return {
        ...session,
        draftInput: session.draftInput.slice(0, -1)
      };
    }

    case 'numpad-clear': {
      return {
        ...session,
        draftInput: ''
      };
    }

    case 'toggle-tile': {
      const tileVal = action.value;
      const cur = [...session.selectedTiles];
      const idx = cur.indexOf(tileVal);
      if (idx >= 0) {
        cur.splice(idx, 1);
      } else {
        cur.push(tileVal);
      }
      return {
        ...session,
        selectedTiles: cur,
        draftInput: cur.join('')
      };
    }

    case 'submit-card': {
      if (session.phase !== 'answering') return session;

      let answerToEval = session.draftInput;
      if (currentTask.type === 'sequence-order') {
        answerToEval = session.selectedTiles;
      }

      const evalResult = evaluateTaskAnswer(currentTask, answerToEval);
      const isCorrect = evalResult.isCorrect;

      const newResults = [
        ...session.results,
        {
          taskIndex: session.currentIndex,
          task: currentTask,
          userAnswer: answerToEval,
          isCorrect,
          evalResult
        }
      ];

      return {
        ...session,
        phase: 'feedback',
        results: newResults,
        correctCount: session.correctCount + (isCorrect ? 1 : 0)
      };
    }

    case 'next-card': {
      if (session.currentIndex + 1 < session.tasks.length) {
        return {
          ...session,
          currentIndex: session.currentIndex + 1,
          phase: 'answering',
          draftInput: '',
          selectedTiles: [],
          confirmCancel: false
        };
      }
      return {
        ...session,
        phase: 'completed'
      };
    }

    case 'ask-cancel': {
      return { ...session, confirmCancel: true };
    }

    case 'dismiss-cancel': {
      return { ...session, confirmCancel: false };
    }

    default:
      return session;
  }
}

export function renderExerciseView(session, profile) {
  const currentTask = session.tasks[session.currentIndex];
  const progressRatio = ((session.currentIndex + 1) / session.tasks.length) * 100;
  const isFeedback = session.phase === 'feedback';
  const lastResult = isFeedback ? session.results[session.results.length - 1] : null;

  return `
  <div class="view-container exercise-view">
    <div class="exercise-top-bar">
      ${session.confirmCancel ? `
        <div class="cancel-confirm-box">
          <span>Runde wirklich abbrechen?</span>
          <button type="button" class="btn-touch btn-secondary" data-action="dismiss-cancel">Weiterspielen ▶</button>
          <button type="button" class="btn-touch btn-cancel-confirm" data-action="confirm-cancel">Ja, Beenden</button>
        </div>
      ` : `
        <button type="button" class="btn-touch btn-secondary btn-cancel-round" data-action="ask-cancel" title="Übung abbrechen">
          ✕ Abbrechen
        </button>
      `}

      <div class="round-progress-wrapper">
        <div class="round-progress-bar">
          <div class="round-progress-fill" style="width: ${progressRatio}%;"></div>
        </div>
        <span class="round-step-counter">Aufgabe ${session.currentIndex + 1} / ${session.tasks.length}</span>
      </div>
    </div>

    <div class="task-card ${isFeedback ? (lastResult.isCorrect ? 'card-feedback-correct' : 'card-feedback-wrong') : ''}">
      <div class="task-prompt-row">
        <button type="button" class="btn-touch btn-speak-prompt" data-action="speak-prompt" data-speech="${escapeHtml(currentTask.speechText)}" title="Aufgabe vorlesen">
          🔊
        </button>
        <h3 class="task-prompt-text">${escapeHtml(currentTask.promptText)}</h3>
      </div>

      ${currentTask.visual?.assetId ? `
        <div class="task-visual-box">
          ${renderAssetHtml(currentTask.visual.assetId, { size: 'lg' })}
        </div>
      ` : ''}

      <div class="task-interaction-zone">
        ${renderTaskInteraction(currentTask, session, isFeedback)}
      </div>

      ${isFeedback ? `
        <div class="feedback-banner ${lastResult.isCorrect ? 'banner-correct' : 'banner-wrong'}">
          ${lastResult.isCorrect ? `
            <div class="feedback-message">
              <span class="feedback-icon">🎉</span>
              <strong>Super gemacht! Richtig!</strong>
            </div>
          ` : `
            <div class="feedback-message">
              <span class="feedback-icon">💡</span>
              <div>
                <strong>Fast richtig!</strong>
                <div class="correct-answer-hint">Richtige Lösung: <strong>${escapeHtml(lastResult.evalResult.expectedDisplay)}</strong></div>
              </div>
            </div>
          `}
          <button type="button" class="btn-touch btn-primary btn-large btn-next-card" data-action="next-card">
            ${session.currentIndex + 1 < session.tasks.length ? 'Nächste Aufgabe ▶' : 'Ergebnis anzeigen ▶'}
          </button>
        </div>
      ` : ''}
    </div>
  </div>`;
}

function renderTaskInteraction(task, session, isFeedback) {
  switch (task.type) {
    case 'choice-cards': {
      return `
      <div class="choice-cards-grid">
        ${task.payload.choices.map(choice => {
          const isSelected = String(session.draftInput) === String(choice.value);
          return `
          <button type="button" class="btn-touch choice-card-btn ${isSelected ? 'selected' : ''} ${isFeedback ? 'disabled' : ''}" data-action="select-choice" data-value="${escapeHtml(choice.value)}">
            ${choice.assetId ? `
              <div class="choice-asset">${renderAssetHtml(choice.assetId, { size: 'md' })}</div>
            ` : ''}
            <span class="choice-label">${escapeHtml(choice.label || choice.value)}</span>
          </button>`;
        }).join('')}
      </div>`;
    }

    case 'numpad-gap': {
      return `
      <div class="numpad-task-container">
        <div class="numpad-gap-display">
          <span class="gap-slot ${session.draftInput ? 'filled' : 'empty'}">
            ${session.draftInput || '?'}
          </span>
        </div>

        <div class="onscreen-numpad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(digit => `
            <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="${digit}">
              ${digit}
            </button>
          `).join('')}
          <button type="button" class="btn-touch numpad-action-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-backspace" title="Löschen">⌫</button>
          <button type="button" class="btn-touch numpad-submit-btn btn-primary ${isFeedback || !session.draftInput ? 'disabled' : ''}" data-action="submit-card">
            OK ✓
          </button>
        </div>
      </div>`;
    }

    case 'tile-builder': {
      const selected = session.selectedTiles || [];
      return `
      <div class="tile-builder-container">
        <div class="tile-slots-display">
          ${selected.length > 0 ? selected.map(tile => `
            <span class="tile-slot filled">${escapeHtml(tile)}</span>
          `).join('') : `<span class="tile-slot empty">Kacheln antippen…</span>`}
        </div>

        <div class="available-tiles-row">
          ${task.payload.tiles.map(tile => {
            const isPicked = selected.includes(tile);
            return `
            <button type="button" class="btn-touch tile-btn ${isPicked ? 'picked' : ''} ${isFeedback ? 'disabled' : ''}" data-action="toggle-tile" data-value="${escapeHtml(tile)}">
              ${escapeHtml(tile)}
            </button>`;
          }).join('')}
        </div>

        <div class="tile-actions-row">
          <button type="button" class="btn-touch btn-secondary ${isFeedback || selected.length === 0 ? 'disabled' : ''}" data-action="clear-tiles">Zurücksetzen</button>
          <button type="button" class="btn-touch btn-primary ${isFeedback || selected.length === 0 ? 'disabled' : ''}" data-action="submit-card">OK ✓</button>
        </div>
      </div>`;
    }

    case 'sequence-order': {
      const selected = session.selectedTiles || [];
      return `
      <div class="sequence-order-container">
        <div class="sequence-slots-display">
          ${selected.length > 0 ? selected.map(tile => `
            <span class="sequence-slot filled">${escapeHtml(tile)}</span>
          `).join('') : `<span class="sequence-slot empty">Reihenfolge durch Antippen wählen…</span>`}
        </div>

        <div class="sequence-tiles-row">
          ${task.payload.tiles.map(tile => {
            const isPicked = selected.includes(tile);
            return `
            <button type="button" class="btn-touch sequence-btn ${isPicked ? 'picked' : ''} ${isFeedback ? 'disabled' : ''}" data-action="toggle-tile" data-value="${escapeHtml(tile)}">
              ${escapeHtml(tile)}
            </button>`;
          }).join('')}
        </div>

        <div class="sequence-actions-row">
          <button type="button" class="btn-touch btn-secondary ${isFeedback || selected.length === 0 ? 'disabled' : ''}" data-action="clear-tiles">Neu anfangen</button>
          <button type="button" class="btn-touch btn-primary ${isFeedback || selected.length === 0 ? 'disabled' : ''}" data-action="submit-card">OK ✓</button>
        </div>
      </div>`;
    }

    default:
      return `<div class="unknown-task-type">Aufgabentyp wird geladen…</div>`;
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
