// Round Summary: 1-5 Stars, Right/Wrong Recap, Taler Payout & Chest Reveal

import { renderAssetHtml } from '../core/assets.js';

export function renderSummaryView(session, rewardSummary = {}, profile = {}) {
  const stars = rewardSummary.stars || 1;
  const starsDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  const correctCount = session.correctCount !== undefined ? session.correctCount : session.results.filter(r => r.isCorrect).length;
  const totalCount = session.tasks.length;
  const coinsEarned = rewardSummary.coinsEarned || 0;

  return `
  <div class="view-container summary-view">
    <div class="summary-hero-card">
      <div class="stars-celebration-banner">
        <div class="stars-gold-row">${starsDisplay}</div>
        <h2 class="stars-headline">${stars} von 5 Sternen!</h2>
        <p class="score-subtext">${correctCount} von ${totalCount} Aufgaben richtig gelöst</p>
      </div>

      <div class="rewards-summary-row">
        <div class="reward-pill pill-coins">
          <span class="reward-icon">🪙</span>
          <div class="reward-details">
            <strong>+${coinsEarned} Taler verdient</strong>
            <span>Für deine Eltern-Ziele gutgeschrieben</span>
          </div>
        </div>

        ${rewardSummary.newStageSticker ? `
          <div class="reward-pill pill-stage-sticker">
            <span class="reward-icon">✨</span>
            <div class="reward-details">
              <strong>Neuer Sticker freigeschaltet!</strong>
              <span>${escapeHtml(rewardSummary.newStageSticker.label)}</span>
            </div>
            <button type="button" class="btn-touch btn-secondary btn-to-album" data-action="open-album">Ins Album ▶</button>
          </div>
        ` : ''}

        ${rewardSummary.surpriseRewards && rewardSummary.surpriseRewards.length > 0 ? `
          <div class="reward-pill pill-surprise-chest">
            <span class="reward-icon">🎁</span>
            <div class="reward-details">
              <strong>Überraschungskiste geöffnet!</strong>
              ${rewardSummary.surpriseRewards.map(r => `
                <div class="surprise-item">
                  ${r.kind === 'accessory' ? `Neues Accessoire: <strong>${escapeHtml(r.item?.label)}</strong>` :
                    r.kind === 'bonus-sticker' ? `Bonus-Sticker: <strong>${escapeHtml(r.item?.label)}</strong>` :
                    `Extra-Bonus: <strong>+${r.coins} Taler</strong>`}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="recap-section">
        <h3 class="recap-title">Aufgaben-Rückblick:</h3>
        <div class="recap-list">
          ${session.results.map((res, idx) => `
            <div class="recap-row ${res.isCorrect ? 'recap-correct' : 'recap-wrong'}">
              <span class="recap-index">${idx + 1}.</span>
              <div class="recap-content">
                <span class="recap-prompt">${escapeHtml(res.task.promptText)}</span>
                ${!res.isCorrect ? `
                  <div class="recap-correction">Lösung: <strong>${escapeHtml(res.evalResult.expectedDisplay)}</strong></div>
                ` : ''}
              </div>
              <span class="recap-badge">${res.isCorrect ? '✓ Richtig' : '✗ Falsch'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="summary-actions-row">
        <button type="button" class="btn-touch btn-secondary btn-large" data-action="summary-to-hub">
          Zum Hauptmenü
        </button>
        <button type="button" class="btn-touch btn-primary btn-large" data-action="summary-to-journey">
          Weiter auf der Lernreise ▶
        </button>
      </div>
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
