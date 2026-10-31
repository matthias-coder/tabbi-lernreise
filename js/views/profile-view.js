// Profile Switcher & Child-Safe Touch New Profile Creator (Zero <input> tags!)

import { renderAvatarSvg } from '../core/assets.js';
import { GRADES } from '../../content/subjects.js';

export function renderProfileView(state, uiState = {}) {
  const { creating = false, draftName = '', draftGrade = 'klasse1', draftBody = 'monster' } = uiState;

  if (creating) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('');
    return `
    <div class="view-container profile-create-view">
      <div class="view-card">
        <div class="view-header">
          <h2>Neues Kind anlegen</h2>
          <button type="button" class="btn-touch btn-secondary" data-action="cancel-create-profile">Abbrechen</button>
        </div>

        <div class="create-form-section">
          <div class="section-label">1. Name tippen:</div>
          <div class="name-display-box">
            <span class="name-text">${draftName ? escapeHtml(draftName) : '<span class="placeholder-text">Name hier tippen…</span>'}</span>
            ${draftName ? `<button type="button" class="btn-touch btn-icon-inline" data-action="name-backspace" title="Letzten Buchstaben löschen">⌫</button>` : ''}
          </div>

          <div class="letter-keyboard-grid">
            ${letters.map(l => `
              <button type="button" class="btn-touch key-btn" data-action="name-add-letter" data-value="${l}">${l}</button>
            `).join('')}
          </div>
        </div>

        <div class="create-form-section">
          <div class="section-label">2. Klassenstufe wählen:</div>
          <div class="grade-chips-row">
            ${GRADES.map(g => `
              <button type="button" class="btn-touch grade-chip ${draftGrade === g.id ? 'active' : ''}" data-action="set-draft-grade" data-value="${g.id}">
                ${g.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="create-form-section">
          <div class="section-label">3. Figur wählen:</div>
          <div class="body-chips-row">
            ${['monster', 'boy', 'girl'].map(b => `
              <button type="button" class="btn-touch body-chip ${draftBody === b ? 'active' : ''}" data-action="set-draft-body" data-value="${b}">
                <div class="chip-avatar-preview">${renderAvatarSvg({ bodyType: b, skinColorId: 'mint' }, { size: 48 })}</div>
                <span>${b === 'monster' ? 'Monster 👾' : b === 'boy' ? 'Junge 👦' : 'Mädchen 👧'}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-touch btn-primary btn-large ${!draftName.trim() ? 'disabled' : ''}" data-action="confirm-create-profile">
            Profil speichern & Starten ▶
          </button>
        </div>
      </div>
    </div>`;
  }

  return `
  <div class="view-container profile-list-view">
    <div class="view-card">
      <div class="view-header">
        <h2>Wer spielt heute?</h2>
        <button type="button" class="btn-touch btn-secondary" data-action="open-hub">✕ Schließen</button>
      </div>

      <div class="profiles-grid">
        ${state.profiles.map(p => {
          const isActive = p.id === state.activeProfileId;
          const gradeDef = GRADES.find(g => g.id === p.defaultGrade);
          const starsTotal = Object.values(p.journeyProgress || {}).reduce((acc, v) => acc + (v.bestStars || 0), 0);
          return `
          <div class="profile-card ${isActive ? 'active-profile' : ''}">
            <div class="profile-avatar-box">
              ${renderAvatarSvg(p.avatar, { size: 96 })}
            </div>
            <div class="profile-details">
              <strong class="profile-title">${escapeHtml(p.displayName)}</strong>
              <span class="profile-grade-badge">${gradeDef ? gradeDef.label : p.defaultGrade}</span>
              <div class="profile-stats-row">
                <span>⭐ ${starsTotal}</span>
                <span>🪙 ${p.wallet?.coins || 0}</span>
                <span>📒 ${(p.unlocks?.placedStickerIds || []).length} Sticker</span>
              </div>
            </div>
            <div class="profile-card-actions">
              ${isActive ? `
                <span class="active-tag">✓ Aktiv</span>
              ` : `
                <button type="button" class="btn-touch btn-primary" data-action="select-profile" data-profile-id="${p.id}">
                  Auswählen
                </button>
              `}
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="list-footer-actions">
        <button type="button" class="btn-touch btn-primary btn-add-child" data-action="start-create-profile">
          + Weiteres Kind anlegen
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
