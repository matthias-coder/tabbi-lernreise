// Start-Hub: Choose Learning Area / Subject

import { getActiveProfile } from '../core/storage.js';
import { getSubjects } from '../../content/subjects.js';
import { renderAvatarSvg, renderAssetHtml } from '../core/assets.js';

export function renderHubView(state) {
  const profile = getActiveProfile(state);
  const subjects = getSubjects();

  return `
  <div class="view-container hub-view">
    <div class="hub-hero">
      <div class="hub-welcome">
        <div class="welcome-avatar">
          ${renderAvatarSvg(profile.avatar, { size: 72 })}
        </div>
        <div class="welcome-text">
          <h1>Hallo, ${escapeHtml(profile.displayName)}!</h1>
          <p>Was möchtest du heute üben?</p>
        </div>
      </div>
    </div>

    <div class="subjects-grid">
      ${subjects.map(sub => `
        <button type="button" class="btn-touch subject-card" data-action="select-subject" data-subject-id="${sub.id}" style="--subject-accent: ${sub.accent};">
          <div class="subject-icon-wrap">
            ${renderAssetHtml(sub.assetId, { size: 'lg' })}
          </div>
          <div class="subject-info">
            <h2 class="subject-title">${escapeHtml(sub.title)}</h2>
            <p class="subject-desc">${sub.id === 'mathe' ? 'Zahlen, Mengen, Plus & Minus, Malnehmen' : 'Laute, Silben, Wörter & Lesen'}</p>
          </div>
          <div class="subject-arrow">Lernreise starten ▶</div>
        </button>
      `).join('')}
    </div>

    <div class="hub-footer-hint">
      <span>✨ Wähle dein Fach und meistere jede Stufe Schritt für Schritt!</span>
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
