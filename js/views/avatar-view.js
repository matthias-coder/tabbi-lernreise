// Live Layered Avatar Builder (Zero <input> tags!)

import { renderAvatarSvg } from '../core/assets.js';
import { AVATAR_CATALOG } from '../../content/avatar-catalog.js';

export function renderAvatarView(profile, activeTab = 'figur') {
  const currentAvatar = profile.avatar || {};
  const unlockedAccs = new Set(profile.unlocks?.unlockedAccessoryIds || []);
  const equippedAccs = new Set(currentAvatar.accessoryIds || []);

  return `
  <div class="view-container avatar-builder-view">
    <div class="avatar-builder-layout">
      <!-- Live Preview Box -->
      <div class="avatar-preview-card">
        <div class="preview-stage">
          ${renderAvatarSvg(currentAvatar, { size: 180 })}
        </div>
        <strong class="avatar-owner-tag">${escapeHtml(profile.displayName)}s Avatar</strong>
        <button type="button" class="btn-touch btn-primary btn-done-avatar" data-action="open-hub">
          Fertig & Speichern ✓
        </button>
      </div>

      <!-- Customization Tabs & Options -->
      <div class="avatar-controls-card">
        <div class="avatar-tabs-bar">
          <button type="button" class="btn-touch avatar-tab ${activeTab === 'figur' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="figur">
            Figur
          </button>
          <button type="button" class="btn-touch avatar-tab ${activeTab === 'farben' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="farben">
            Farben
          </button>
          <button type="button" class="btn-touch avatar-tab ${activeTab === 'frisuren' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="frisuren">
            Frisuren
          </button>
          <button type="button" class="btn-touch avatar-tab ${activeTab === 'accessories' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="accessories">
            Accessoires (${equippedAccs.size}/${unlockedAccs.size})
          </button>
        </div>

        <div class="avatar-options-pane">
          ${activeTab === 'figur' ? `
            <div class="options-group">
              <div class="group-title">Wähle deinen Körpertyp:</div>
              <div class="bodies-grid">
                ${AVATAR_CATALOG.bodyTypes.map(b => {
                  const isSel = currentAvatar.bodyType === b.id;
                  return `
                  <button type="button" class="btn-touch body-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-avatar-body" data-value="${b.id}">
                    <span class="body-emoji">${b.icon}</span>
                    <span class="body-name">${b.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : activeTab === 'farben' ? `
            <div class="options-group">
              <div class="group-title">Haut- / Monsterfarbe:</div>
              <div class="color-swatches-grid">
                ${AVATAR_CATALOG.skinColors.map(c => {
                  const isSel = currentAvatar.skinColorId === c.id;
                  return `
                  <button type="button" class="btn-touch swatch-btn ${isSel ? 'selected' : ''}" data-action="pick-skin-color" data-value="${c.id}" style="--swatch-hex: ${c.hex};" title="${c.label}">
                    <span class="swatch-circle"></span>
                    <span class="swatch-label">${c.label}</span>
                  </button>`;
                }).join('')}
              </div>

              <div class="group-title" style="margin-top: 18px;">Haarfarbe:</div>
              <div class="color-swatches-grid">
                ${AVATAR_CATALOG.hairColors.map(c => {
                  const isSel = currentAvatar.hairColorId === c.id;
                  return `
                  <button type="button" class="btn-touch swatch-btn ${isSel ? 'selected' : ''}" data-action="pick-hair-color" data-value="${c.id}" style="--swatch-hex: ${c.hex};" title="${c.label}">
                    <span class="swatch-circle"></span>
                    <span class="swatch-label">${c.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : activeTab === 'frisuren' ? `
            <div class="options-group">
              <div class="group-title">Frisur (alle von Anfang an frei):</div>
              <div class="hairstyles-grid">
                ${AVATAR_CATALOG.baseHairStyles.map(h => {
                  const isSel = currentAvatar.hairStyleId === h.id;
                  return `
                  <button type="button" class="btn-touch hair-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-hair-style" data-value="${h.id}">
                    <span class="hair-name">${h.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : `
            <!-- Accessories -->
            <div class="options-group">
              <div class="group-title">Accessoires (Freischaltung über Überraschungskisten):</div>
              <div class="accessories-grid">
                ${AVATAR_CATALOG.unlockableAccessories.map(acc => {
                  const isUnlocked = unlockedAccs.has(acc.id);
                  const isEquipped = equippedAccs.has(acc.id);
                  return `
                  <div class="accessory-card ${isUnlocked ? 'acc-unlocked' : 'acc-locked'} ${isEquipped ? 'acc-equipped' : ''}">
                    <span class="acc-icon">${acc.icon}</span>
                    <strong class="acc-name">${acc.label}</strong>
                    ${isUnlocked ? `
                      <button type="button" class="btn-touch btn-toggle-acc ${isEquipped ? 'btn-equipped' : 'btn-secondary'}" data-action="toggle-avatar-accessory" data-acc-id="${acc.id}">
                        ${isEquipped ? 'Angelegt ✓' : 'Anziehen'}
                      </button>
                    ` : `
                      <span class="acc-locked-text">🔒 Ab 12 ⭐</span>
                    `}
                  </div>`;
                }).join('')}
              </div>
            </div>
          `}
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
