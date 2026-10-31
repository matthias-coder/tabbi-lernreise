// Child Goals / Taler Shop & Protected Parent Dashboard

import { getActiveProfile } from '../core/storage.js';
import { renderAssetHtml } from '../core/assets.js';
import { GRADES } from '../../content/subjects.js';

export function renderChildGoalsView(profile, confirmGoalId = null) {
  const coins = profile.wallet?.coins || 0;
  const goals = (profile.parentGoals || []).filter(g => g.active !== false);
  const vouchers = profile.vouchers || [];
  const openVouchers = vouchers.filter(v => v.fulfilledAt === null);

  return `
  <div class="view-container goals-view">
    <div class="view-card">
      <div class="view-header">
        <div class="header-title-wrap">
          <button type="button" class="btn-touch btn-nav-back" data-action="open-hub">◀ Start</button>
          <h2>Meine Eltern-Ziele</h2>
        </div>
        <div class="coins-balance-pill">
          <span>Dein Guthaben:</span>
          <strong>🪙 ${coins} Taler</strong>
        </div>
      </div>

      <!-- Goals List -->
      <div class="goals-list-section">
        <h3 class="section-title">Wähle deine Belohnung:</h3>
        <div class="goals-grid">
          ${goals.map(goal => {
            const canAfford = coins >= goal.costCoins;
            const isConfirming = confirmGoalId === goal.id;

            return `
            <div class="goal-card ${canAfford ? 'goal-affordable' : 'goal-locked'}">
              <div class="goal-icon-col">
                ${renderAssetHtml(goal.iconId || 'ui-goal-tablet', { size: 'md' })}
              </div>
              <div class="goal-info-col">
                <strong class="goal-title">${escapeHtml(goal.title)}</strong>
                <span class="goal-cost">Preis: 🪙 ${goal.costCoins} Taler</span>
                ${!canAfford ? `
                  <span class="goal-needed">Noch ${goal.costCoins - coins} Taler sparen</span>
                ` : ''}
              </div>
              <div class="goal-action-col">
                ${isConfirming ? `
                  <div class="confirm-redeem-box">
                    <button type="button" class="btn-touch btn-redeem-yes" data-action="confirm-redeem-goal" data-goal-id="${goal.id}">
                      Wirklich einlösen!
                    </button>
                    <button type="button" class="btn-touch btn-secondary" data-action="cancel-redeem-goal">
                      Abbrechen
                    </button>
                  </div>
                ` : canAfford ? `
                  <button type="button" class="btn-touch btn-primary btn-redeem-goal" data-action="ask-redeem-goal" data-goal-id="${goal.id}">
                    Einlösen 🎁
                  </button>
                ` : `
                  <button type="button" class="btn-touch btn-secondary disabled">Noch sparen</button>
                `}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Open Voucher Tickets -->
      ${openVouchers.length > 0 ? `
        <div class="vouchers-section" style="margin-top: 28px;">
          <h3 class="section-title">🎟️ Deine offenen Gutscheine:</h3>
          <div class="vouchers-grid">
            ${openVouchers.map(vouch => `
              <div class="voucher-ticket">
                <span class="voucher-icon">🎟️</span>
                <div class="voucher-info">
                  <strong>${escapeHtml(vouch.title)}</strong>
                  <span class="voucher-date">Eingelöst am: ${vouch.redeemedAt.slice(0, 10)}</span>
                </div>
                <span class="voucher-status-badge">Wartet auf Eltern ✓</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  </div>`;
}

export function renderParentView(state, parentSession = {}) {
  const { unlocked = false, challenge = {}, error = null } = parentSession;

  if (!unlocked) {
    return `
    <div class="view-container parent-gate-view">
      <div class="view-card gate-card">
        <div class="view-header">
          <h2>🔒 Geschützter Elternbereich</h2>
          <button type="button" class="btn-touch btn-secondary" data-action="open-hub">✕ Schließen</button>
        </div>

        <p class="gate-intro">Bitte löse diese kurze Rechenaufgabe, um den Elternbereich zu öffnen:</p>

        <div class="gate-challenge-box">
          <div class="challenge-prompt">${escapeHtml(challenge.prompt || 'Aufgabe wird geladen…')}</div>
          <div class="gate-entered-val">${escapeHtml(parentSession.inputVal || '—')}</div>
          ${error ? `<div class="gate-error-banner">${escapeHtml(error)}</div>` : ''}
        </div>

        <div class="gate-numpad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `
            <button type="button" class="btn-touch gate-digit-btn" data-action="parent-gate-digit" data-value="${d}">
              ${d}
            </button>
          `).join('')}
          <button type="button" class="btn-touch gate-action-btn" data-action="parent-gate-backspace">⌫</button>
          <button type="button" class="btn-touch btn-primary gate-submit-btn" data-action="parent-gate-submit">
            Öffnen 🔓
          </button>
        </div>
      </div>
    </div>`;
  }

  // UNLOCKED Parent Dashboard
  const activeProfile = getActiveProfile(state);
  const openVouchers = (activeProfile.vouchers || []).filter(v => v.fulfilledAt === null);

  return `
  <div class="view-container parent-dashboard-view">
    <div class="view-card">
      <div class="view-header">
        <div class="header-title-wrap">
          <h2>👨‍👩‍👧 Elternbereich (Dashboard)</h2>
          <span class="active-profile-badge">Aktives Kind: <strong>${escapeHtml(activeProfile.displayName)}</strong></span>
        </div>
        <button type="button" class="btn-touch btn-secondary" data-action="parent-lock-and-exit">
          🔒 Sperren & Verlassen
        </button>
      </div>

      <!-- Section: Vouchers to fulfill -->
      <div class="parent-section">
        <h3 class="section-title">🎟️ Offene Gutschein-Tickets (${openVouchers.length})</h3>
        ${openVouchers.length === 0 ? `
          <p class="section-empty">Keine offenen Gutscheine vorhanden.</p>
        ` : `
          <div class="parent-vouchers-list">
            ${openVouchers.map(v => `
              <div class="parent-voucher-row">
                <div>
                  <strong>${escapeHtml(v.title)}</strong> (🪙 ${v.costCoins} Taler)
                  <div class="voucher-subtext">Eingelöst am ${v.redeemedAt.slice(0, 10)}</div>
                </div>
                <div class="voucher-row-actions">
                  <button type="button" class="btn-touch btn-primary" data-action="parent-fulfill-voucher" data-voucher-id="${v.id}">
                    Als erledigt abhaken ✓
                  </button>
                  <button type="button" class="btn-touch btn-secondary" data-action="parent-cancel-voucher" data-voucher-id="${v.id}">
                    Stornieren & Taler erstatten
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Section: Goal Editor -->
      <div class="parent-section" style="margin-top: 24px;">
        <div class="section-header-row">
          <h3 class="section-title">🎯 Belohnungen verwalten (Preise & Ziele)</h3>
          <button type="button" class="btn-touch btn-secondary" data-action="copy-goals-all">
            Auf alle Kinder kopieren
          </button>
        </div>

        <div class="parent-goals-editor">
          ${(activeProfile.parentGoals || []).map(g => `
            <div class="goal-editor-row">
              <span class="goal-row-icon">${renderAssetHtml(g.iconId || 'ui-goal-tablet', { size: 'sm' })}</span>
              <strong class="goal-row-title">${escapeHtml(g.title)}</strong>
              <div class="goal-row-controls">
                <span>Preis: <strong>${g.costCoins} 🪙</strong></span>
                <button type="button" class="btn-touch btn-secondary" data-action="parent-adjust-cost" data-goal-id="${g.id}" data-delta="-10">-10</button>
                <button type="button" class="btn-touch btn-secondary" data-action="parent-adjust-cost" data-goal-id="${g.id}" data-delta="10">+10</button>
                <button type="button" class="btn-touch btn-secondary" data-action="parent-toggle-goal" data-goal-id="${g.id}">
                  ${g.active !== false ? 'Aktiv ✓' : 'Pausiert'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: JSON Backup & Profile Security -->
      <div class="parent-section" style="margin-top: 24px;">
        <h3 class="section-title">💾 Daten-Sicherung & Wiederherstellung</h3>
        <p class="section-subtext">Exportiere ein lokales JSON-Backup aller Spielstände oder stelle ein Backup wieder her.</p>

        <div class="backup-actions-row">
          <button type="button" class="btn-touch btn-primary" data-action="export-backup">
            📥 Backup herunterladen (JSON)
          </button>
          <label class="btn-touch btn-secondary file-import-label">
            📤 Backup einspielen
            <input type="file" id="backup-file-input" accept=".json" style="display:none;" data-action="import-backup-file">
          </label>
        </div>
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
