// Live 3-Zone Layered Avatar Builder (Zero <input> tags!)

import { renderAvatarSvg } from '../core/assets.js';
import { AVATAR_CATALOG } from '../../content/avatar-catalog.js';

export function renderAvatarView(profile, activeTab = 'kopf') {
  const currentAvatar = profile.avatar || {};
  const unlockedAccs = new Set(profile.unlocks?.unlockedAccessoryIds || []);
  const equippedAccs = new Set(currentAvatar.accessoryIds || []);

  // Backwards compatibility for old activeTab names
  let tab = activeTab;
  if (tab === 'figur') tab = 'kopf';

  const headId = currentAvatar.headId || (currentAvatar.bodyType === 'monster' ? 'head-monster-horns' : 'head-child-smile');
  const torsoId = currentAvatar.torsoId || (currentAvatar.bodyType === 'monster' ? 'torso-monster-belly' : 'torso-shirt-stripes');
  const legsId = currentAvatar.legsId || (currentAvatar.bodyType === 'monster' ? 'legs-paws' : 'legs-sneaker');
  const clothColorId = currentAvatar.clothColorId || 'sky';

  const showHairPicker = !headId.includes('robot') && !headId.includes('bear');

  return `
  <div class="view-container avatar-builder-view">
    <div class="avatar-builder-layout">
      <!-- Live Preview Box -->
      <div class="avatar-preview-card">
        <div class="preview-stage">
          ${renderAvatarSvg(currentAvatar, { size: 180 })}
        </div>
        <strong class="avatar-owner-tag">${escapeHtml(profile.displayName)}s Entdecker</strong>
        <button type="button" class="btn-touch btn-primary btn-done-avatar" data-action="open-hub">
          Fertig & Speichern ✓
        </button>
      </div>

      <!-- Customization Tabs & Options -->
      <div class="avatar-controls-card">
        <div class="avatar-tabs-bar">
          <button type="button" class="btn-touch avatar-tab ${tab === 'kopf' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="kopf">
            👤 Kopf
          </button>
          <button type="button" class="btn-touch avatar-tab ${tab === 'koerper' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="koerper">
            👕 Körper
          </button>
          <button type="button" class="btn-touch avatar-tab ${tab === 'beine' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="beine">
            👟 Beine
          </button>
          <button type="button" class="btn-touch avatar-tab ${tab === 'farben' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="farben">
            🎨 Farben
          </button>
          <button type="button" class="btn-touch avatar-tab ${tab === 'accessories' ? 'active' : ''}" data-action="switch-avatar-tab" data-value="accessories">
            👑 Extras (${equippedAccs.size}/${unlockedAccs.size})
          </button>
        </div>

        <div class="avatar-options-pane">
          ${tab === 'kopf' ? `
            <div class="options-group">
              <div class="group-title">Wähle deinen Kopf:</div>
              <div class="parts-grid">
                ${AVATAR_CATALOG.heads.map(h => {
                  const isSel = headId === h.id;
                  return `
                  <button type="button" class="btn-touch part-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-avatar-head" data-value="${h.id}">
                    <span class="part-emoji">${h.icon}</span>
                    <span class="part-name">${h.label}</span>
                  </button>`;
                }).join('')}
              </div>

              ${showHairPicker ? `
                <div class="group-title" style="margin-top: 18px;">Frisur / Schopf:</div>
                <div class="hairstyles-grid">
                  ${AVATAR_CATALOG.baseHairStyles.map(h => {
                    const isSel = currentAvatar.hairStyleId === h.id;
                    return `
                    <button type="button" class="btn-touch hair-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-hair-style" data-value="${h.id}">
                      <span class="hair-name">${h.label}</span>
                    </button>`;
                  }).join('')}
                </div>
              ` : ''}
            </div>
          ` : tab === 'koerper' ? `
            <div class="options-group">
              <div class="group-title">Wähle deinen Körper / Kleidung:</div>
              <div class="parts-grid">
                ${AVATAR_CATALOG.torsos.map(t => {
                  const isSel = torsoId === t.id;
                  return `
                  <button type="button" class="btn-touch part-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-avatar-torso" data-value="${t.id}">
                    <span class="part-emoji">${t.icon}</span>
                    <span class="part-name">${t.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : tab === 'beine' ? `
            <div class="options-group">
              <div class="group-title">Wähle Beine oder Fahrwerk:</div>
              <div class="parts-grid">
                ${AVATAR_CATALOG.legs.map(l => {
                  const isSel = legsId === l.id;
                  return `
                  <button type="button" class="btn-touch part-pick-btn ${isSel ? 'selected' : ''}" data-action="pick-avatar-legs" data-value="${l.id}">
                    <span class="part-emoji">${l.icon}</span>
                    <span class="part-name">${l.label}</span>
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : tab === 'farben' ? `
            <div class="options-group">
              <div class="group-title">Körper- / Monster- / Grundfarbe:</div>
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

              <div class="group-title" style="margin-top: 18px;">Kleidungsfarbe (Shirt / Hoodie / Chassis):</div>
              <div class="color-swatches-grid">
                ${AVATAR_CATALOG.clothColors.map(c => {
                  const isSel = clothColorId === c.id;
                  return `
                  <button type="button" class="btn-touch swatch-btn ${isSel ? 'selected' : ''}" data-action="pick-cloth-color" data-value="${c.id}" style="--swatch-hex: ${c.hex};" title="${c.label}">
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
