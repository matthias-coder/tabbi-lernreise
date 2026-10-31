// Top Navigation Bar (Active Child, Coins, Album, Avatar, Audio & Parent Gate)

import { getActiveProfile } from '../core/storage.js';
import { renderAvatarSvg } from '../core/assets.js';

export function renderHeaderBar(state, route = { screen: 'hub' }) {
  const profile = getActiveProfile(state);
  const coins = profile.wallet?.coins || 0;
  const isHub = route.screen === 'hub';

  const unplacedCount = (profile.unlocks?.unlockedStickerIds || [])
    .filter(id => !(profile.unlocks?.placedStickerIds || []).includes(id)).length;

  return `
  <header class="app-header">
    <div class="header-left">
      ${!isHub ? `
        <button type="button" class="btn-touch btn-nav-back" data-action="open-hub" title="Zurück zum Start">
          ◀ Start
        </button>
      ` : ''}
      <button type="button" class="btn-touch btn-profile-chip" data-action="open-profiles" title="Kind-Profil wechseln">
        <div class="avatar-thumb">
          ${renderAvatarSvg(profile.avatar, { size: 36 })}
        </div>
        <span class="profile-name">${escapeHtml(profile.displayName)}</span>
      </button>
    </div>

    <div class="header-right">
      <button type="button" class="btn-touch btn-stat-chip btn-coins" data-action="open-goals" title="Meine Taler & Eltern-Ziele">
        <span class="coin-icon">🪙</span>
        <span class="coin-count">${coins}</span>
      </button>

      <button type="button" class="btn-touch btn-icon-nav" data-action="open-album" title="Stickeralbum">
        <span>📒</span>
        <span class="btn-label">Album</span>
        ${unplacedCount > 0 ? `<span class="badge-pulsing">${unplacedCount}</span>` : ''}
      </button>

      <button type="button" class="btn-touch btn-icon-nav" data-action="open-avatar" title="Avatar gestalten">
        <span>🎨</span>
        <span class="btn-label">Avatar</span>
      </button>

      <button type="button" class="btn-touch btn-icon-nav btn-audio-toggle" data-action="toggle-audio" title="Vorlesen an/aus">
        <span>${profile.audioEnabled ? '🔊' : '🔇'}</span>
      </button>

      <button type="button" class="btn-touch btn-icon-nav btn-parent-lock" data-action="open-parent" title="Geschützter Elternbereich">
        <span>🔒</span>
        <span class="btn-label">Eltern</span>
      </button>
    </div>
  </header>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
