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
    selectedCoins: [],
    crownedTokens: [],
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

    case 'place-coin': {
      const coins = [...(session.selectedCoins || [])];
      const coinVal = Number(action.value);
      const coinLabel = action.label || `${coinVal} €`;
      coins.push({ id: Date.now() + Math.random(), value: coinVal, label: coinLabel });
      return { ...session, selectedCoins: coins };
    }

    case 'remove-coin': {
      const coins = [...(session.selectedCoins || [])];
      const idx = Number(action.index);
      if (idx >= 0 && idx < coins.length) coins.splice(idx, 1);
      return { ...session, selectedCoins: coins };
    }

    case 'clear-coins': {
      return { ...session, selectedCoins: [] };
    }

    case 'toggle-crown': {
      const crowns = [...(session.crownedTokens || [])];
      const idx = Number(action.index);
      const pos = crowns.indexOf(idx);
      if (pos >= 0) crowns.splice(pos, 1);
      else crowns.push(idx);
      return { ...session, crownedTokens: crowns };
    }

    case 'place-letter': {
      const tiles = [...(session.selectedTiles || [])];
      const originIdx = Number(action.originIdx);
      if (!tiles.some(t => typeof t === 'object' && t.originIdx === originIdx)) {
        tiles.push({ letter: action.letter, originIdx });
      }
      return { ...session, selectedTiles: tiles };
    }

    case 'remove-letter': {
      const tiles = [...(session.selectedTiles || [])];
      const idx = Number(action.index);
      if (idx >= 0 && idx < tiles.length) tiles.splice(idx, 1);
      return { ...session, selectedTiles: tiles };
    }

    case 'clear-letters': {
      return { ...session, selectedTiles: [] };
    }

    case 'submit-card': {
      if (session.phase !== 'answering') return session;

      let answerToEval = session.draftInput;
      if (currentTask.type === 'sequence-order') {
        answerToEval = session.selectedTiles;
      } else if (currentTask.type === 'schuettelwort') {
        answerToEval = (session.selectedTiles || []).map(t => typeof t === 'object' ? t.letter : t);
      } else if (currentTask.type === 'silbenkoenig') {
        answerToEval = session.crownedTokens || [];
      } else if (currentTask.type === 'geld-betrag' && currentTask.payload?.mode === 'place') {
        answerToEval = session.selectedCoins || [];
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
          selectedCoins: [],
          crownedTokens: [],
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

  const subjectId = session.meta?.subject?.id || (session.stageId?.startsWith('deutsch') ? 'deutsch' : 'mathe');
  const isMathe = subjectId === 'mathe';
  const isDeutsch = subjectId === 'deutsch';

  return `
  <div class="view-container exercise-view exercise-view-${subjectId}">
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

    <div class="task-card task-card-${subjectId} ${isFeedback ? (lastResult.isCorrect ? 'card-feedback-correct' : 'card-feedback-wrong') : ''}">
      <!-- Sheet Paper Margin & Lochung -->
      <div class="sheet-paper-margin" aria-hidden="true">
        <div class="binder-hole hole-top"></div>
        <div class="binder-hole hole-bottom"></div>
      </div>

      ${isDeutsch ? `
        <!-- Ink Blotches for German Worksheet (Tintenflecken) -->
        <div class="tintenfleck-wrap tintenfleck-corner" aria-hidden="true">
          <img src="assets/ui/tintenfleck-corner.svg" alt="" class="tintenfleck-img" />
        </div>
        <div class="tintenfleck-wrap tintenfleck-bottom" aria-hidden="true">
          <img src="assets/ui/tintenfleck.svg" alt="" class="tintenfleck-img" />
        </div>
      ` : ''}

      <div class="task-prompt-row">
        <button type="button" class="btn-touch btn-speak-prompt" data-action="speak-prompt" data-speech="${escapeHtml(currentTask.speechText)}" title="Aufgabe vorlesen">
          🔊
        </button>
        <h3 class="task-prompt-text">${escapeHtml(currentTask.promptText)}</h3>
      </div>

      ${renderTaskVisual(currentTask)}

      <div class="task-interaction-zone">
        ${renderTaskInteraction(currentTask, session, isFeedback)}
      </div>

      ${isFeedback ? `
        <div class="feedback-banner ${lastResult.isCorrect ? 'banner-correct' : 'banner-wrong'}" data-action="next-card" role="button" tabindex="0" title="Antippen zum Weitergehen">
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

    case 'zahlenhaus': {
      const { roof, left, right } = task.payload;
      const isLeftGap = left === null;
      const isRightGap = right === null;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';

      return `
      <div class="interactive-zahlenhaus-stage">
        <div class="zahlenhaus-toy">
          <div class="dach-wrapper">
            <svg class="dach-shape-svg" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="dachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f87171" />
                  <stop offset="100%" stop-color="#dc2626" />
                </linearGradient>
              </defs>
              <polygon points="100,6 194,84 6,84" fill="url(#dachGrad)" stroke="#991b1b" stroke-width="4" stroke-linejoin="round" />
            </svg>
            <div class="dach-badge-window">
              <span class="dach-label">Ziel:</span>
              <strong class="dach-number">${roof}</strong>
            </div>
          </div>

          <div class="haus-body">
            <div class="zimmer zimmer-left ${isLeftGap ? 'zimmer-gap active' : 'zimmer-given'}">
              <span class="zimmer-val">${isLeftGap ? currentVal : left}</span>
            </div>
            <div class="zimmer-divider"></div>
            <div class="zimmer zimmer-right ${isRightGap ? 'zimmer-gap active' : 'zimmer-given'}">
              <span class="zimmer-val">${isRightGap ? currentVal : right}</span>
            </div>
          </div>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'zahlenmauer': {
      const { base, mid, top, gap } = task.payload;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';

      return `
      <div class="interactive-zahlenmauer-stage">
        <div class="zahlenmauer-pyramid">
          <div class="mauer-tier tier-top">
            <div class="mauer-brick ${gap === 'top' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'top' ? currentVal : top}</span>
            </div>
          </div>

          <div class="mauer-tier tier-mid">
            <div class="mauer-brick ${gap === 'mid-left' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'mid-left' ? currentVal : mid[0]}</span>
            </div>
            <div class="mauer-brick ${gap === 'mid-right' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'mid-right' ? currentVal : mid[1]}</span>
            </div>
          </div>

          <div class="mauer-tier tier-base">
            <div class="mauer-brick ${gap === 'base-0' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'base-0' ? currentVal : base[0]}</span>
            </div>
            <div class="mauer-brick ${gap === 'base-1' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'base-1' ? currentVal : base[1]}</span>
            </div>
            <div class="mauer-brick ${gap === 'base-2' ? 'brick-gap active' : 'brick-given'}">
              <span class="brick-val">${gap === 'base-2' ? currentVal : base[2]}</span>
            </div>
          </div>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'zehnerstreifen': {
      const { blueCount = 0, redCount = 0 } = task.payload;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';

      const circles = [];
      for (let i = 0; i < 10; i++) {
        let colorClass = 'empty';
        if (i < blueCount) colorClass = 'token-blue';
        else if (i < blueCount + redCount) colorClass = 'token-red';
        circles.push(`<span class="token-circle ${colorClass}"></span>`);
      }

      return `
      <div class="interactive-zehnerstreifen-stage">
        <div class="zehnerstreifen-toy">
          <div class="fuenfer-pack">${circles.slice(0, 5).join('')}</div>
          <div class="zehner-separator"></div>
          <div class="fuenfer-pack">${circles.slice(5, 10).join('')}</div>
        </div>

        <div class="streifen-gap-display">
          <span>Deine Antwort:</span>
          <span class="gap-slot filled">${currentVal}</span>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'nachbarzahlen': {
      const { centerNumber, gap, leftHeader = 'Vorgänger (-1)', centerHeader = 'Zahl', rightHeader = 'Nachfolger (+1)', fixedLeft, fixedRight } = task.payload;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';
      const isPrevGap = gap === 'prev';
      const prevVal = isPrevGap ? currentVal : (fixedLeft !== undefined ? fixedLeft : centerNumber - 1);
      const nextVal = !isPrevGap ? currentVal : (fixedRight !== undefined ? fixedRight : centerNumber + 1);

      return `
      <div class="interactive-nachbar-stage">
        <div class="nachbar-trio-card">
          <div class="nachbar-column col-prev">
            <span class="nachbar-col-label">${escapeHtml(leftHeader)}</span>
            <div class="nachbar-box ${isPrevGap ? 'box-gap active' : 'box-given'}">
              <span class="box-val">${prevVal}</span>
            </div>
          </div>

          <div class="nachbar-column col-center">
            <span class="nachbar-col-label">${escapeHtml(centerHeader)}</span>
            <div class="nachbar-box box-center-given">
              <span class="box-val">${centerNumber}</span>
            </div>
          </div>

          <div class="nachbar-column col-next">
            <span class="nachbar-col-label">${escapeHtml(rightHeader)}</span>
            <div class="nachbar-box ${!isPrevGap ? 'box-gap active' : 'box-given'}">
              <span class="box-val">${nextVal}</span>
            </div>
          </div>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'numpad-gap': {
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';
      const hasInput = session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '';
      return `
      <div class="numpad-task-container">
        <div class="numpad-gap-display">
          <span class="gap-slot ${hasInput ? 'filled' : 'empty'}">
            ${currentVal}
          </span>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
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

    case 'rechendreieck': {
      const { a, b, c, sumAB, sumBC, sumCA, gap } = task.payload;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';

      return `
      <div class="interactive-rechendreieck-stage">
        <div class="rechendreieck-toy">
          <svg class="dreieck-shape-svg" viewBox="0 0 280 230" aria-hidden="true">
            <polygon points="140,32 36,196 244,196" fill="#f0f9ff" stroke="#0284c7" stroke-width="4" stroke-linejoin="round" />
            <line x1="140" y1="32" x2="140" y2="142" stroke="#bae6fd" stroke-width="2" stroke-dasharray="4,4" />
            <line x1="36" y1="196" x2="140" y2="142" stroke="#bae6fd" stroke-width="2" stroke-dasharray="4,4" />
            <line x1="244" y1="196" x2="140" y2="142" stroke="#bae6fd" stroke-width="2" stroke-dasharray="4,4" />
          </svg>

          <!-- Corner A (Top) -->
          <div class="dreieck-node node-a ${gap === 'a' ? 'node-gap active' : 'node-given'}">
            <span>${gap === 'a' ? currentVal : a}</span>
          </div>

          <!-- Corner B (Bottom-Left) -->
          <div class="dreieck-node node-b ${gap === 'b' ? 'node-gap active' : 'node-given'}">
            <span>${gap === 'b' ? currentVal : b}</span>
          </div>

          <!-- Corner C (Bottom-Right) -->
          <div class="dreieck-node node-c ${gap === 'c' ? 'node-gap active' : 'node-given'}">
            <span>${gap === 'c' ? currentVal : c}</span>
          </div>

          <!-- Edge AB (Left) -->
          <div class="dreieck-edge edge-ab ${gap === 'sumAB' ? 'edge-gap active' : 'edge-given'}">
            <span>${gap === 'sumAB' ? currentVal : sumAB}</span>
          </div>

          <!-- Edge BC (Bottom) -->
          <div class="dreieck-edge edge-bc ${gap === 'sumBC' ? 'edge-gap active' : 'edge-given'}">
            <span>${gap === 'sumBC' ? currentVal : sumBC}</span>
          </div>

          <!-- Edge CA (Right) -->
          <div class="dreieck-edge edge-ca ${gap === 'sumCA' ? 'edge-gap active' : 'edge-given'}">
            <span>${gap === 'sumCA' ? currentVal : sumCA}</span>
          </div>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'hunderter-kreuz': {
      const { center, top, bottom, left, right, gap } = task.payload;
      const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';

      return `
      <div class="interactive-hunderter-stage">
        <div class="hunderter-kreuz-grid">
          <div class="kreuz-cell cell-empty"></div>
          <div class="kreuz-cell cell-top ${gap === 'top' ? 'cell-gap active' : 'cell-given'}">
            <span>${gap === 'top' ? currentVal : top}</span>
          </div>
          <div class="kreuz-cell cell-empty"></div>

          <div class="kreuz-cell cell-left ${gap === 'left' ? 'cell-gap active' : 'cell-given'}">
            <span>${gap === 'left' ? currentVal : left}</span>
          </div>
          <div class="kreuz-cell cell-center cell-given">
            <span>${center}</span>
          </div>
          <div class="kreuz-cell cell-right ${gap === 'right' ? 'cell-gap active' : 'cell-given'}">
            <span>${gap === 'right' ? currentVal : right}</span>
          </div>

          <div class="kreuz-cell cell-empty"></div>
          <div class="kreuz-cell cell-bottom ${gap === 'bottom' ? 'cell-gap active' : 'cell-given'}">
            <span>${gap === 'bottom' ? currentVal : bottom}</span>
          </div>
          <div class="kreuz-cell cell-empty"></div>
        </div>

        ${renderOnscreenNumpad(session, isFeedback)}
      </div>`;
    }

    case 'geld-betrag': {
      const mode = task.payload?.mode || 'count';
      if (mode === 'count') {
        const currentVal = (session.draftInput !== undefined && session.draftInput !== null && session.draftInput !== '') ? session.draftInput : '?';
        const coins = task.payload.coins || [5, 2];
        return `
        <div class="interactive-geld-count-stage">
          <div class="geld-tray">
            <span class="geld-tray-title">Zähle das Geld im Portemonnaie:</span>
            <div class="geld-coins-row">
              ${coins.map(c => renderCoinOrBill(c)).join('')}
            </div>
          </div>

          <div class="streifen-gap-display">
            <span>Betrag:</span>
            <span class="gap-slot filled">${currentVal} €</span>
          </div>

          ${renderOnscreenNumpad(session, isFeedback)}
        </div>`;
      }

      // Mode: place
      const placedCoins = session.selectedCoins || [];
      const available = task.payload.availableCoins || [1, 2, 5, 10];
      const canSubmit = placedCoins.length > 0;

      return `
      <div class="interactive-geld-place-stage">
        <div class="geld-wallet-area">
          <div class="wallet-header">
            <span class="wallet-title">Dein Portemonnaie (Antippen zum Herausnehmen):</span>
            <span class="wallet-count-badge">${placedCoins.length} Münzen / Scheine</span>
          </div>
          <div class="wallet-coins-grid">
            ${placedCoins.length > 0 ? placedCoins.map((coin, idx) => `
              <button type="button" class="btn-touch coin-placed-btn ${isFeedback ? 'disabled' : ''}" data-action="remove-coin" data-index="${idx}" title="Zurück in den Vorrat">
                ${renderCoinOrBill(coin.value)}
              </button>
            `).join('') : `<span class="wallet-empty-hint">Tippe unten auf Münzen oder Scheine, um sie hineinzulegen!</span>`}
          </div>
        </div>

        <div class="geld-bank-area">
          <span class="bank-title">Münzen- & Schein-Vorrat:</span>
          <div class="bank-coins-row">
            ${available.map(val => `
              <button type="button" class="btn-touch coin-bank-btn ${isFeedback ? 'disabled' : ''}" data-action="place-coin" data-value="${val}" title="${val} € ins Portemonnaie legen">
                ${renderCoinOrBill(val)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="geld-actions-row">
          <button type="button" class="btn-touch btn-secondary ${isFeedback || !canSubmit ? 'disabled' : ''}" data-action="clear-coins">Alles leeren</button>
          <button type="button" class="btn-touch btn-primary ${isFeedback || !canSubmit ? 'disabled' : 'btn-ready'}" data-action="submit-card">OK ✓</button>
        </div>
      </div>`;
    }

    case 'silbenkoenig': {
      const tokens = task.payload?.tokens || ['H', 'AU', 'S'];
      const crowned = new Set(session.crownedTokens || []);
      const canSubmit = crowned.size > 0;

      return `
      <div class="interactive-silbenkoenig-stage">
        <div class="silben-word-card">
          <div class="silben-tokens-row">
            ${tokens.map((token, idx) => {
              const isCrowned = crowned.has(idx);
              return `
              <button type="button" class="btn-touch silben-token-btn ${isCrowned ? 'crowned' : ''} ${isFeedback ? 'disabled' : ''}" data-action="toggle-crown" data-index="${idx}">
                <div class="crown-slot">${isCrowned ? '👑' : '<span class="crown-placeholder"></span>'}</div>
                <span class="token-letter">${escapeHtml(token)}</span>
              </button>`;
            }).join('')}
          </div>
        </div>

        <p class="silben-hint">Tippe auf alle Silbenkönige (Vokale wie A, E, I, O, U, AU, EI), um ihnen eine Krone aufzusetzen!</p>

        <div class="silben-actions-row">
          <button type="button" class="btn-touch btn-primary btn-large ${isFeedback || !canSubmit ? 'disabled' : 'btn-ready'}" data-action="submit-card">
            OK ✓
          </button>
        </div>
      </div>`;
    }

    case 'schuettelwort': {
      const { word, scrambled, assetId } = task.payload;
      const placed = session.selectedTiles || [];
      const placedOrigins = new Set(placed.map(t => typeof t === 'object' ? t.originIdx : -1));
      const canSubmit = placed.length === word.length;

      return `
      <div class="interactive-schuettelwort-stage">
        ${assetId ? `
          <div class="schuettel-asset-wrap">
            ${renderAssetHtml(assetId, { size: 'lg' })}
          </div>
        ` : ''}

        <div class="word-slots-display">
          ${Array.from({ length: word.length }).map((_, idx) => {
            const item = placed[idx];
            if (item) {
              const letter = typeof item === 'object' ? item.letter : item;
              return `
              <button type="button" class="btn-touch letter-slot-btn filled ${isFeedback ? 'disabled' : ''}" data-action="remove-letter" data-index="${idx}" title="Buchstabe entfernen">
                ${escapeHtml(letter)}
              </button>`;
            }
            return `<span class="letter-slot-box empty">_</span>`;
          }).join('')}
        </div>

        <div class="scrambled-letters-row">
          ${scrambled.map((letter, originIdx) => {
            const isUsed = placedOrigins.has(originIdx);
            return `
            <button type="button" class="btn-touch letter-pick-btn ${isUsed ? 'used' : ''} ${isFeedback ? 'disabled' : ''}" data-action="place-letter" data-letter="${escapeHtml(letter)}" data-origin-idx="${originIdx}">
              ${escapeHtml(letter)}
            </button>`;
          }).join('')}
        </div>

        <div class="schuettel-actions-row">
          <button type="button" class="btn-touch btn-secondary ${isFeedback || placed.length === 0 ? 'disabled' : ''}" data-action="clear-letters">Neu anfangen</button>
          <button type="button" class="btn-touch btn-primary ${isFeedback || !canSubmit ? 'disabled' : 'btn-ready'}" data-action="submit-card">OK ✓</button>
        </div>
      </div>`;
    }

    default:
      return `<div class="unknown-task-type">Aufgabentyp wird geladen…</div>`;
  }
}

function renderOnscreenNumpad(session, isFeedback) {
  const hasInput = Boolean(
    session.draftInput !== undefined &&
    session.draftInput !== null &&
    String(session.draftInput).length > 0
  );

  return `
  <div class="onscreen-numpad" role="group" aria-label="Ziffernblock">
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="1">1</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="2">2</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="3">3</button>

    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="4">4</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="5">5</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="6">6</button>

    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="7">7</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="8">8</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="9">9</button>

    <button type="button" class="btn-touch numpad-action-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-backspace" title="Löschen">⌫</button>
    <button type="button" class="btn-touch numpad-digit-btn ${isFeedback ? 'disabled' : ''}" data-action="numpad-digit" data-value="0">0</button>
    <button type="button" class="btn-touch numpad-submit-btn ${isFeedback || !hasInput ? 'disabled' : 'btn-ready'}" data-action="submit-card" title="Eingabe bestätigen">
      OK ✓
    </button>
  </div>`;
}

export function renderTaskVisual(task) {
  if (!task || !task.visual) return '';
  const v = task.visual;

  if (v.assetId) {
    return `
    <div class="task-visual-box">
      ${renderAssetHtml(v.assetId, { size: 'lg' })}
    </div>`;
  }

  if (v.type === 'dice') {
    return `
    <div class="task-visual-box visual-dice-box">
      ${renderDiceSvg(v.count)}
    </div>`;
  }

  if (v.type === 'two-hands') {
    return `
    <div class="task-visual-box visual-hands-box">
      ${renderTwoHands(v.right)}
    </div>`;
  }

  if (v.type === 'dots') {
    return `
    <div class="task-visual-box visual-dots-box">
      ${renderCountingDots(v.count, v.color || '#0284c7')}
    </div>`;
  }

  if (v.type === 'meadow') {
    return `
    <div class="task-visual-box visual-meadow-box">
      ${renderAnimalMeadow(v.count, v.emoji || '🍎')}
    </div>`;
  }

  if (v.type === 'compare-groups') {
    return `
    <div class="task-visual-box visual-compare-box">
      ${renderCompareGroups(v.leftCount, v.rightCount, v.icon || '⭐')}
    </div>`;
  }

  if (v.type === 'dienes') {
    return `
    <div class="task-visual-box visual-dienes-box">
      ${renderDienesBlocks(v.tens, v.ones)}
    </div>`;
  }

  if (v.type === 'number-line') {
    return `
    <div class="task-visual-box visual-numberline-box">
      ${renderNumberLine(v.current, v.target, v.min, v.max)}
    </div>`;
  }

  if (v.type === 'dot-array') {
    return `
    <div class="task-visual-box visual-array-box">
      ${renderDotArray(v.rows, v.cols)}
    </div>`;
  }

  if (v.type === 'zwerg-riese') {
    return `
    <div class="task-visual-box visual-zwerg-box">
      ${renderZwergRieseCard(v.zwerg, v.riese)}
    </div>`;
  }

  if (v.type === 'pattern') {
    return `
    <div class="task-visual-box visual-pattern-box">
      ${renderPatternPreview(v.sequence, v.missingIndex)}
    </div>`;
  }

  if (v.type === 'analog-clock') {
    return `
    <div class="task-visual-box visual-clock-box">
      ${renderAnalogClockSvg(v.hours, v.minutes)}
    </div>`;
  }

  return '';
}

function renderAnalogClockSvg(hours = 12, minutes = 0) {
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;

  const hourNumbers = [];
  for (let h = 1; h <= 12; h++) {
    const angleRad = (h * 30 - 90) * (Math.PI / 180);
    const x = 100 + 68 * Math.cos(angleRad);
    const y = 100 + 68 * Math.sin(angleRad) + 5;
    hourNumbers.push(`<text x="${x}" y="${y}" text-anchor="middle" font-size="16" font-weight="900" fill="#1e293b">${h}</text>`);
  }

  return `
  <div class="analog-clock-wrapper">
    <svg viewBox="0 0 200 200" width="160" height="160" class="clock-svg" aria-label="Analoge Uhr">
      <defs>
        <radialGradient id="clockShine" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="85%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#clockShine)" stroke="#0284c7" stroke-width="8" filter="drop-shadow(0 6px 14px rgba(0,0,0,0.12))" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#cbd5e1" stroke-width="2" />
      ${hourNumbers.join('')}
      <line x1="100" y1="100" x2="100" y2="52" stroke="#dc2626" stroke-width="6" stroke-linecap="round" transform="rotate(${hourAngle} 100 100)" />
      <line x1="100" y1="100" x2="100" y2="30" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round" transform="rotate(${minuteAngle} 100 100)" />
      <circle cx="100" cy="100" r="6" fill="#1e293b" />
      <circle cx="100" cy="100" r="2.5" fill="#facc15" />
    </svg>
  </div>`;
}

function renderCoinOrBill(val) {
  const num = Number(val);
  if (num === 5 || num === 10 || num === 20) {
    const bg = num === 5 ? '#bfdbfe' : (num === 10 ? '#fecaca' : '#bbf7d0');
    const border = num === 5 ? '#1d4ed8' : (num === 10 ? '#b91c1c' : '#15803d');
    return `
    <div class="euro-bill bill-${num}" style="--bill-bg: ${bg}; --bill-border: ${border};">
      <span class="bill-val">${num} €</span>
    </div>`;
  }
  const is50ct = num === 0.5 || String(val).includes('ct');
  const label = is50ct ? '50 ct' : `${num} €`;
  const isBicolor = num === 1 || num === 2;
  return `
  <div class="euro-coin coin-${is50ct ? '50ct' : num} ${isBicolor ? 'bicolor' : 'gold'}">
    <span class="coin-val">${label}</span>
  </div>`;
}

function renderDiceSvg(count) {
  const pipMap = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 26], [30, 50], [30, 74], [70, 26], [70, 50], [70, 74]]
  };
  const pips = pipMap[count] || [[50, 50]];
  const pipElements = pips.map(([cx, cy]) =>
    `<circle cx="${cx}" cy="${cy}" r="9" fill="#dc2626" />`
  ).join('');

  return `
  <div class="dice-wrapper">
    <svg viewBox="0 0 100 100" width="108" height="108" class="dice-svg" aria-label="Würfel mit ${count} Augen">
      <defs>
        <radialGradient id="dieShine" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="70%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="20" fill="url(#dieShine)" stroke="#cbd5e1" stroke-width="4" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.12))" />
      ${pipElements}
    </svg>
  </div>`;
}

function renderTwoHands(rightCount) {
  return `
  <div class="two-hands-container">
    <div class="hand-box left-hand">
      ${renderAssetHtml('hand-l-5', { size: 'md' })}
      <span class="hand-label">5 Finger</span>
    </div>
    <span class="hands-plus">+</span>
    <div class="hand-box right-hand">
      ${renderAssetHtml('hand-r-' + rightCount, { size: 'md' })}
      <span class="hand-label">${rightCount} Finger</span>
    </div>
  </div>`;
}

function renderCountingDots(count, color = '#0284c7') {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(`
      <div class="counting-dot" style="--dot-color: ${color};">
        <span class="dot-shine"></span>
      </div>
    `);
  }
  return `
  <div class="counting-dots-tray">
    <div class="dots-grid dots-count-${count}">
      ${dots.join('')}
    </div>
  </div>`;
}

function renderAnimalMeadow(count, emoji = '🍎') {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(`
      <div class="meadow-item">
        <span class="meadow-emoji" aria-hidden="true">${emoji}</span>
      </div>
    `);
  }
  return `
  <div class="meadow-tray">
    <div class="meadow-grid meadow-count-${count}">
      ${items.join('')}
    </div>
  </div>`;
}

function renderCompareGroups(leftCount, rightCount, icon = '⭐') {
  const makeIcons = (c) => Array.from({ length: c }, () => `<span class="compare-icon">${icon}</span>`).join('');
  return `
  <div class="compare-groups-tray">
    <div class="compare-box compare-box-left">
      <span class="compare-box-title">Gruppe A</span>
      <div class="compare-icons-grid">${makeIcons(leftCount)}</div>
      <span class="compare-badge">${leftCount}</span>
    </div>
    <div class="compare-vs">VS</div>
    <div class="compare-box compare-box-right">
      <span class="compare-box-title">Gruppe B</span>
      <div class="compare-icons-grid">${makeIcons(rightCount)}</div>
      <span class="compare-badge">${rightCount}</span>
    </div>
  </div>`;
}

function renderDienesBlocks(tens, ones) {
  const tenBars = [];
  for (let i = 0; i < tens; i++) {
    tenBars.push(`
      <div class="dienes-ten-bar" title="1 Zehnerstange (10 Einer)">
        ${Array.from({ length: 10 }, () => '<span class="dienes-unit"></span>').join('')}
      </div>
    `);
  }
  const oneCubes = [];
  for (let j = 0; j < ones; j++) {
    oneCubes.push(`
      <div class="dienes-one-cube" title="1 Einerwürfel"></div>
    `);
  }
  return `
  <div class="dienes-material-tray">
    <div class="dienes-group dienes-tens">
      <span class="dienes-title">Zehner (${tens})</span>
      <div class="dienes-bars-row">${tenBars.join('')}</div>
    </div>
    <div class="dienes-divider"></div>
    <div class="dienes-group dienes-ones">
      <span class="dienes-title">Einer (${ones})</span>
      <div class="dienes-cubes-grid">${oneCubes.join('')}</div>
    </div>
  </div>`;
}

function renderNumberLine(current, target, min = Math.max(0, current - 5), max = current + 10) {
  const stones = [];
  for (let n = min; n <= max; n++) {
    const isCurrent = n === current;
    const isTarget = n === target;
    stones.push(`
      <div class="number-stone ${isCurrent ? 'stone-current' : ''} ${isTarget ? 'stone-target' : ''}">
        <span class="stone-val">${isTarget ? '?' : n}</span>
        ${isCurrent ? '<span class="stone-pin">Hier!</span>' : ''}
        ${isTarget ? '<span class="stone-target-pin">Ziel</span>' : ''}
      </div>
    `);
  }
  return `
  <div class="number-line-tray">
    <div class="number-line-track">
      ${stones.join('')}
    </div>
    <div class="number-line-hop">
      <span class="hop-arrow">↷ Sprung zum nächsten Zehner!</span>
    </div>
  </div>`;
}

function renderDotArray(rows, cols) {
  const rowElements = [];
  for (let r = 0; r < rows; r++) {
    const dotsInRow = [];
    for (let c = 0; c < cols; c++) {
      dotsInRow.push(`<span class="array-dot">⭐</span>`);
    }
    rowElements.push(`
      <div class="array-row">
        <span class="array-row-label">Reihe ${r + 1}:</span>
        <div class="array-row-dots">${dotsInRow.join('')}</div>
        <span class="array-row-count">${cols}</span>
      </div>
    `);
  }
  return `
  <div class="dot-array-tray">
    <div class="array-grid-container">
      ${rowElements.join('')}
    </div>
    <div class="array-summary-badge">${rows} Reihen mit je ${cols} = ?</div>
  </div>`;
}

function renderZwergRieseCard(zwerg, riese) {
  return `
  <div class="zwerg-riese-tray">
    <div class="zr-card zwerg-card">
      <span class="zr-badge">🍄 Kleine Zwergen-Aufgabe</span>
      <strong class="zr-math">${escapeHtml(zwerg)}</strong>
    </div>
    <div class="zr-arrow">⬇ hilft der ⬇</div>
    <div class="zr-card riese-card">
      <span class="zr-badge">🏰 Große Riesen-Aufgabe</span>
      <strong class="zr-math">${escapeHtml(riese)}</strong>
    </div>
  </div>`;
}

function renderPatternPreview(sequence, missingIndex = -1) {
  return `
  <div class="pattern-preview-tray">
    <div class="pattern-items-row">
      ${sequence.map((item, idx) => `
        <div class="pattern-item-box ${idx === missingIndex ? 'pattern-gap active' : ''}">
          <span class="pattern-item-val">${idx === missingIndex ? '?' : escapeHtml(item)}</span>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
