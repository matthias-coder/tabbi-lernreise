// Start-Hub: Choose Learning Area / Subject with Rich Task Previews

import { getActiveProfile } from '../core/storage.js';
import { getSubjects } from '../../content/subjects.js';
import { renderAvatarSvg, renderAssetHtml } from '../core/assets.js';

const SUBJECT_TASKS_PREVIEW = {
  mathe: [
    { icon: '🏠', label: 'Zahlenhäuser' },
    { icon: '🎲', label: 'Würfel & Mengen' },
    { icon: '🔵', label: 'Zehnerstreifen' },
    { icon: '➕', label: 'Plus & Minus' },
    { icon: '📐', label: 'Rechendreiecke' },
    { icon: '🧱', label: 'Zahlenmauern' },
    { icon: '🪙', label: 'Geld (Euro)' },
    { icon: '⏰', label: 'Uhrzeiten' }
  ],
  deutsch: [
    { icon: '🔤', label: 'Buchstaben & Laute' },
    { icon: '📖', label: 'Erste Fibel-Wörter' },
    { icon: '👑', label: 'Silbenkönige' },
    { icon: '👏', label: 'Silben klatschen' },
    { icon: '🧩', label: 'Schüttelwörter' },
    { icon: '🦊', label: 'Wortarten & Reime' },
    { icon: '📝', label: 'Wortbau' }
  ]
};

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
      ${subjects.map(sub => {
        const isMathe = sub.id === 'mathe';
        const tasks = SUBJECT_TASKS_PREVIEW[sub.id] || [];
        const bannerPath = `assets/ui/${isMathe ? 'mathe-hub-banner.jpg' : 'deutsch-hub-banner.jpg'}`;

        return `
        <button type="button" class="btn-touch subject-card subject-card-${sub.id}" data-action="select-subject" data-subject-id="${sub.id}" style="--subject-accent: ${sub.accent};">
          <div class="subject-card-banner">
            <img src="${bannerPath}" alt="${escapeHtml(sub.title)}" class="subject-banner-img" />
            <div class="subject-banner-badge">
              <span>${isMathe ? '🔢 Mathematik' : '📖 Deutsch'}</span>
            </div>
          </div>

          <div class="subject-card-body">
            <div class="subject-card-header">
              <div class="subject-icon-wrap">
                ${renderAssetHtml(sub.assetId, { size: 'md' })}
              </div>
              <div class="subject-header-text">
                <h2 class="subject-title">${escapeHtml(sub.title)}</h2>
                <span class="subject-grade-tag">Vorschule • 1. Klasse • 2. Klasse</span>
              </div>
            </div>

            <p class="subject-desc">${isMathe ? 'Zahlen, Mengen, Rechnen, Geld & Uhrzeit' : 'Laute, Silben, Wörter, Fibel & Lesen'}</p>

            <div class="subject-tasks-section">
              <div class="tasks-section-label">Aufgaben in diesem Fach:</div>
              <div class="subject-tasks-chips">
                ${tasks.map(t => `
                  <span class="task-preview-chip">
                    <span class="task-chip-icon" aria-hidden="true">${t.icon}</span>
                    <span class="task-chip-label">${escapeHtml(t.label)}</span>
                  </span>
                `).join('')}
              </div>
            </div>

            <div class="subject-card-footer">
              <div class="subject-arrow">Lernreise starten ▶</div>
            </div>
          </div>
        </button>`;
      }).join('')}
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
