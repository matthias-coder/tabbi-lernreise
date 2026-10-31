// Multi-Page Sticker Album with Tap-to-Place Interaction (Zero <input> tags!)

import { STICKER_CATALOG } from '../../content/sticker-catalog.js';
import { renderAssetHtml } from '../core/assets.js';
import { SURPRISE_THRESHOLD_STARS } from '../core/progression.js';

export function renderAlbumView(profile, pageIndex = 0) {
  const pages = STICKER_CATALOG.pages;
  const safeIdx = Math.max(0, Math.min(pageIndex, pages.length - 1));
  const currentPage = pages[safeIdx];

  const unlockedStickers = new Set(profile.unlocks?.unlockedStickerIds || []);
  const placedStickers = new Set(profile.unlocks?.placedStickerIds || []);

  const chestStars = profile.unlocks?.surpriseProgressStars || 0;
  const chestProgressPct = (chestStars / SURPRISE_THRESHOLD_STARS) * 100;

  return `
  <div class="view-container album-view">
    <div class="album-hero-card">
      <div class="album-header-row">
        <button type="button" class="btn-touch btn-nav-back" data-action="open-hub">◀ Start</button>
        <h2>Mein Stickeralbum</h2>
        <span class="album-counter-badge">${placedStickers.size} / 66 gesammelt</span>
      </div>

      <!-- Surprise Chest Progress -->
      <div class="album-chest-bar-wrapper">
        <div class="chest-icon-col">🎁</div>
        <div class="chest-bar-col">
          <div class="chest-progress-track">
            <div class="chest-progress-fill" style="width: ${chestProgressPct}%;"></div>
          </div>
          <span class="chest-progress-text">Überraschungskiste: <strong>${chestStars} / ${SURPRISE_THRESHOLD_STARS} ⭐</strong> (jeder Stern hilft!)</span>
        </div>
      </div>

      <!-- Album Pages Tabs -->
      <div class="album-pages-tabs">
        ${pages.map((p, idx) => `
          <button type="button" class="btn-touch album-page-tab ${idx === safeIdx ? 'active' : ''}" data-action="switch-album-page" data-page-index="${idx}">
            ${escapeHtml(p.title)}
          </button>
        `).join('')}
      </div>

      <!-- Stickers Grid on Current Page -->
      <div class="stickers-page-grid">
        ${currentPage.stickers.map(sticker => {
          const isUnlocked = unlockedStickers.has(sticker.id);
          const isPlaced = placedStickers.has(sticker.id);

          if (isPlaced) {
            return `
            <div class="sticker-slot slot-placed">
              <div class="sticker-asset-wrap">
                ${renderAssetHtml(sticker.assetId, { size: 'lg' })}
              </div>
              <strong class="sticker-name">${escapeHtml(sticker.label)}</strong>
            </div>`;
          }

          if (isUnlocked) {
            return `
            <button type="button" class="btn-touch sticker-slot slot-unplaced-new" data-action="place-sticker" data-sticker-id="${sticker.id}" title="Hier einkleben!">
              <div class="sticker-asset-wrap">
                ${renderAssetHtml(sticker.assetId, { size: 'lg' })}
              </div>
              <span class="pulse-new-badge">✨ Antippen zum Einkleben!</span>
            </button>`;
          }

          return `
          <div class="sticker-slot slot-locked">
            <span class="slot-locked-icon">❓</span>
            <span class="slot-locked-title">Noch geheim</span>
            <span class="slot-locked-hint">${currentPage.isBonus ? 'Aus der Überraschungskiste' : 'Schaffe die Stufe mit 3 ⭐'}</span>
          </div>`;
        }).join('')}
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
