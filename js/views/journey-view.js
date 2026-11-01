// Interactive 2D Space Ascent Adventure Map (From Earth/Meadow to Mars!)
// Zero <input> tags, tablet-optimized touch targets >= 56px!

import { getActiveProfile } from '../core/storage.js';
import { isStageUnlocked } from '../core/progression.js';
import { renderAvatarSvg } from '../core/assets.js';
import { GRADES, getTopicsForSubjectAndGrade, getSubjects } from '../../content/subjects.js';

export function renderJourneyView(state, options = {}) {
  const profile = getActiveProfile(state);
  const { subjectId = 'mathe', selectedGrade = profile.defaultGrade || 'klasse1' } = options;

  const subjects = getSubjects();
  const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0];
  const topics = getTopicsForSubjectAndGrade(subjectId, selectedGrade);

  // Flatten stages for the current grade
  const allGradeStages = [];
  topics.forEach((t, tIdx) => {
    const topicStageIds = t.stages.map(s => s.id);
    t.stages.forEach((st, sIdx) => {
      const unlocked = isStageUnlocked(profile, topicStageIds, sIdx);
      const progress = profile.journeyProgress?.[st.id];
      const bestStars = progress?.bestStars || 0;
      allGradeStages.push({
        topic: t,
        topicIndex: tIdx,
        stage: st,
        stageIndex: sIdx,
        unlocked,
        bestStars,
        isMastered: bestStars >= 3
      });
    });
  });

  // Find active stage (first unlocked stage with < 3 stars, or last unlocked)
  let activeStageIdx = allGradeStages.findIndex(s => s.unlocked && !s.isMastered);
  if (activeStageIdx === -1) {
    activeStageIdx = allGradeStages.findLastIndex(s => s.unlocked);
  }
  if (activeStageIdx === -1) activeStageIdx = 0;

  // Fixed coordinates for 9 milestone stations along the ascending S-curve (Y: 2280 down to 240)
  const stationCoords = [
    { x: 300, y: 2280, zone: 'Erde' },
    { x: 200, y: 2050, zone: 'Wiese' },
    { x: 380, y: 1820, zone: 'Wolken' },
    { x: 220, y: 1600, zone: 'Stratosphäre' },
    { x: 420, y: 1380, zone: 'Raketenstart' },
    { x: 190, y: 1140, zone: 'ISS Orbit' },
    { x: 390, y: 880, zone: 'Mond-Orbit' },
    { x: 230, y: 620, zone: 'Mond-Basis' },
    { x: 350, y: 340, zone: 'Mars-Anflug' }
  ];

  return `
  <div class="view-container journey-view journey-view-${subjectId}" style="--subject-accent: ${currentSubject.accent};">
    
    <!-- Top Sticky Header Bar -->
    <div class="journey-header">
      <div class="journey-title-row">
        <button type="button" class="btn-touch btn-nav-back" data-action="open-hub">◀ Fächer</button>
        <h2>${escapeHtml(currentSubject.title)} – Weltraum-Expedition 🚀</h2>
      </div>

      <div class="grade-switcher-bar">
        ${GRADES.map(g => `
          <button type="button" class="btn-touch grade-tab ${selectedGrade === g.id ? 'active' : ''}" data-action="switch-journey-grade" data-grade-id="${g.id}">
            ${g.label}
          </button>
        `).join('')}
      </div>

      <!-- Quick Altitude Jump Pills -->
      <div class="altitude-jump-bar">
        <button type="button" class="btn-touch btn-altitude-jump" data-action="jump-altitude" data-target="earth">
          🌱 Erde
        </button>
        <button type="button" class="btn-touch btn-altitude-jump active-jump" data-action="jump-altitude" data-target="current">
          📍 Aktuelle Mission
        </button>
        <button type="button" class="btn-touch btn-altitude-jump" data-action="jump-altitude" data-target="moon">
          🌙 Mond
        </button>
        <button type="button" class="btn-touch btn-altitude-jump" data-action="jump-altitude" data-target="mars">
          🔴 Mars
        </button>
      </div>
    </div>

    <!-- The 2D Vertical Space Map -->
    <div class="space-journey-map-card">
      <div class="altitude-sky-gradient"></div>
      <div class="space-stars-layer"></div>

      <!-- Zone Anchors & Banners -->
      <div class="map-zone-banner banner-mars zone-mars-anchor">
        <div class="zone-badge">🔴 STUFE 3</div>
        <div class="zone-info">
          <strong>Ziel: Der Rote Planet Mars</strong>
          <span>Klasse 2 Meisterschaft • 225 Mio. km</span>
        </div>
      </div>

      <div class="map-zone-banner banner-moon zone-moon-anchor">
        <div class="zone-badge">🌙 STUFE 2</div>
        <div class="zone-info">
          <strong>Mond-Basis & Erdorbit (ISS)</strong>
          <span>Klasse 1 Meisterschaft • 384.000 km</span>
        </div>
      </div>

      <div class="map-zone-banner banner-earth zone-earth-anchor">
        <div class="zone-badge">🌱 STUFE 1</div>
        <div class="zone-info">
          <strong>Grüne Erde, Wiese & Startrampe</strong>
          <span>Vorschule & Basis-Rechnen • 0 m</span>
        </div>
      </div>

      <!-- SVG Map Track & Stations -->
      <svg class="space-map-canvas" viewBox="0 0 600 2400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="rocketFlightTrail" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#22c55e" />
            <stop offset="35%" stop-color="#38bdf8" />
            <stop offset="65%" stop-color="#818cf8" />
            <stop offset="100%" stop-color="#f43f5e" />
          </linearGradient>

          <filter id="stationDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3" />
          </filter>

          <linearGradient id="marsBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f87171" />
            <stop offset="60%" stop-color="#dc2626" />
            <stop offset="100%" stop-color="#991b1b" />
          </linearGradient>

          <linearGradient id="moonBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="60%" stop-color="#cbd5e1" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
        </defs>

        <!-- DEKO: Mars oben rechts -->
        <g transform="translate(480, 140)">
          <circle cx="0" cy="0" r="105" fill="url(#marsBodyGrad)" />
          <ellipse cx="-25" cy="-20" rx="35" ry="16" fill="#991b1b" opacity="0.5" />
          <ellipse cx="20" cy="35" rx="40" ry="20" fill="#991b1b" opacity="0.5" />
          <circle cx="0" cy="0" r="109" fill="none" stroke="#fca5a5" stroke-width="3" opacity="0.6" />
        </g>
        <text x="390" y="150" font-size="34">🤖</text>

        <!-- DEKO: Mond Mitte links -->
        <g transform="translate(90, 760)">
          <circle cx="0" cy="0" r="75" fill="url(#moonBodyGrad)" />
          <circle cx="-20" cy="-15" r="16" fill="#94a3b8" opacity="0.6" />
          <circle cx="20" cy="15" r="12" fill="#94a3b8" opacity="0.6" />
          <circle cx="-5" cy="30" r="18" fill="#94a3b8" opacity="0.6" />
          <text x="35" y="-55" font-size="22">🚩</text>
        </g>

        <!-- DEKO: ISS & Satellit -->
        <g transform="translate(130, 1260)">
          <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
          <circle cx="0" cy="0" r="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2" />
          <text x="0" y="4" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">ISS</text>
        </g>
        <text x="470" y="1120" font-size="24">🛰️</text>

        <!-- DEKO: Wolken & Heißluftballon -->
        <ellipse cx="140" cy="1740" rx="90" ry="32" fill="#ffffff" opacity="0.8" />
        <ellipse cx="480" cy="1620" rx="100" ry="38" fill="#ffffff" opacity="0.8" />
        <text x="470" y="1690" font-size="34">🎈</text>
        <text x="90" y="1520" font-size="28">✈️</text>

        <!-- DEKO: Grüne Hügel & Startrampe ganz unten -->
        <ellipse cx="160" cy="2390" rx="280" ry="120" fill="#16a34a" />
        <ellipse cx="460" cy="2400" rx="260" ry="110" fill="#22c55e" />
        <text x="70" y="2330" font-size="44">🏡</text>
        <text x="160" y="2350" font-size="22">🌻</text>
        <text x="500" y="2330" font-size="46">🌳</text>

        <!-- Geschwungener S-Kurven Flugpfad -->
        <path d="
          M 300 2280
          C 180 2200, 150 2120, 200 2050
          C 260 1960, 430 1910, 380 1820
          C 330 1730, 170 1690, 220 1600
          C 270 1500, 470 1470, 420 1380
          C 370 1280, 140 1230, 190 1140
          C 240 1040, 440 980, 390 880
          C 340 780, 180 720, 230 620
          C 280 500, 400 440, 350 340
          L 340 220
        " fill="none" stroke="#0f172a" stroke-width="24" stroke-linecap="round" opacity="0.4" />

        <path d="
          M 300 2280
          C 180 2200, 150 2120, 200 2050
          C 260 1960, 430 1910, 380 1820
          C 330 1730, 170 1690, 220 1600
          C 270 1500, 470 1470, 420 1380
          C 370 1280, 140 1230, 190 1140
          C 240 1040, 440 980, 390 880
          C 340 780, 180 720, 230 620
          C 280 500, 400 440, 350 340
          L 340 220
        " fill="none" stroke="url(#rocketFlightTrail)" stroke-width="14" stroke-linecap="round" stroke-dasharray="14 10" />

        <!-- Ziel-Meilenstein am Ende des Pfads (Mars Pokal) -->
        <g transform="translate(340, 220)" filter="url(#stationDropShadow)">
          <circle cx="0" cy="0" r="32" fill="#fef08a" stroke="#eab308" stroke-width="4" />
          <text x="0" y="9" font-size="24" text-anchor="middle">🏆</text>
          <rect x="-38" y="38" width="76" height="18" rx="9" fill="#a16207" />
          <text x="0" y="51" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">MEISTER-ZIEL</text>
        </g>

        <!-- STATIONS ENTLANG DES PFADS -->
        ${allGradeStages.map((item, idx) => {
          const pos = stationCoords[idx] || { x: 300, y: 1200 };
          const isActive = idx === activeStageIdx;
          const starsDisplay = '★'.repeat(item.bestStars) + '☆'.repeat(Math.max(0, 3 - item.bestStars));

          return `
          <g transform="translate(${pos.x}, ${pos.y})" class="map-station-group ${isActive ? 'active-station-group' : ''}" data-station-y="${pos.y}" filter="url(#stationDropShadow)">
            ${isActive ? `
              <!-- Pulsierender Schein um die aktive Station -->
              <circle cx="0" cy="0" r="38" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.8" />
            ` : ''}

            <!-- Stations-Knopf (Klickbar für sofortiges Öffnen) -->
            <circle cx="0" cy="0" r="28" fill="${item.isMastered ? '#10b981' : isActive ? '#0284c7' : item.unlocked ? '#3b82f6' : '#64748b'}" 
                    stroke="#ffffff" stroke-width="3.5" />
            
            <text x="0" y="8" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">
              ${item.unlocked ? (idx + 1) : '🔒'}
            </text>

            <!-- Sterne oder Schloss Badge über dem Stein -->
            ${item.unlocked ? `
              <rect x="-24" y="-38" width="48" height="18" rx="9" fill="${item.isMastered ? '#065f46' : '#1e3a8a'}" />
              <text x="0" y="-25" font-size="11" fill="#facc15" text-anchor="middle">${starsDisplay}</text>
            ` : `
              <rect x="-20" y="-38" width="40" height="18" rx="9" fill="#334155" />
              <text x="0" y="-25" font-size="10" fill="#94a3b8" text-anchor="middle">🔒</text>
            `}

            <!-- DER AVATAR IN SEINER RAKETE (NUR AUF DER AKTIVEN STATION) -->
            ${isActive ? `
              <g transform="translate(0, -96)" class="active-avatar-capsule">
                <!-- Sprechblase -->
                <rect x="-42" y="-24" width="84" height="22" rx="11" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
                <polygon points="-4,-2 4,-2 0,4" fill="#ffffff" />
                <text x="0" y="-10" font-size="10.5" font-weight="bold" fill="#0284c7" text-anchor="middle">Flugbereit!</text>
                
                <!-- Raketenkapsel mit Cockpit-Fenster -->
                <path d="M 0,-4 Q -16,14 -14,36 L 14,36 Q 16,14 0,-4 Z" fill="#ffffff" stroke="#0284c7" stroke-width="2" />
                <polygon points="-14,24 -24,38 -14,38" fill="#ef4444" />
                <polygon points="14,24 24,38 14,38" fill="#ef4444" />
                <polygon points="-6,36 6,36 0,46" fill="#f59e0b" />
                
                <!-- Bullauge mit Kind-Avatar -->
                <circle cx="0" cy="18" r="12" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" />
                <g transform="translate(-15, 3) scale(0.3)">
                  ${renderAvatarSvg(profile.avatar, { size: 36 })}
                </g>
              </g>
            ` : ''}

            <!-- Direkter Touch-Aktivator für die Station -->
            ${item.unlocked ? `
              <circle cx="0" cy="0" r="32" fill="transparent" style="cursor: pointer;"
                      data-action="open-stage" data-stage-id="${item.stage.id}"
                      title="${escapeHtml(item.stage.title)} (Tippen zum Starten)" />
            ` : ''}
          </g>`;
        }).join('')}
      </svg>
    </div>

    <!-- Zusätzliche Themen- & Stufen-Kartenansicht (Kompakt für Eltern & Übersicht) -->
    <div class="topics-container-section">
      <h3 class="section-title">Expeditions-Logbuch & Stufenübersicht</h3>
      <div class="topics-container">
        ${topics.map((topic, tIdx) => {
          const topicStageIds = topic.stages.map(s => s.id);
          const masteredCount = topic.stages.filter(s => (profile.journeyProgress?.[s.id]?.bestStars || 0) >= 3).length;
          const topicStars = topic.stages.reduce((sum, s) => sum + (profile.journeyProgress?.[s.id]?.bestStars || 0), 0);
          const maxTopicStars = topic.stages.length * 5;

          return `
          <div class="topic-section">
            <div class="topic-header">
              <div class="topic-header-top">
                <span class="topic-badge">Thema ${tIdx + 1}</span>
                <span class="topic-progress-badge">★ ${topicStars}/${maxTopicStars} • ${masteredCount}/${topic.stages.length} gemeistert</span>
              </div>
              <h3 class="topic-title">${escapeHtml(topic.title)}</h3>
              <p class="topic-desc">${escapeHtml(topic.description)}</p>
            </div>

            <div class="stages-track">
              ${topic.stages.map((stage, sIdx) => {
                const unlocked = isStageUnlocked(profile, topicStageIds, sIdx);
                const progress = profile.journeyProgress?.[stage.id];
                const bestStars = progress?.bestStars || 0;
                const starsDisplay = '★'.repeat(bestStars) + '☆'.repeat(5 - bestStars);

                return `
                <div class="stage-card ${unlocked ? 'stage-unlocked' : 'stage-locked'}">
                  <div class="stage-info">
                    <div class="stage-step-tag">Stufe ${sIdx + 1}</div>
                    <strong class="stage-name">${escapeHtml(stage.title)}</strong>
                    ${unlocked && bestStars > 0 ? `
                      <div class="stage-stars" title="${bestStars} von 5 Sternen">${starsDisplay}</div>
                    ` : unlocked ? `
                      <div class="stage-status-text">Bereit zum Starten</div>
                    ` : `
                      <div class="stage-status-text">Öffnet ab 3 Sternen in Stufe ${sIdx}</div>
                    `}
                  </div>

                  <div class="stage-action">
                    ${unlocked ? `
                      <button type="button" class="btn-touch btn-primary btn-play-stage" data-action="open-stage" data-stage-id="${stage.id}">
                        ${bestStars > 0 ? 'Nochmal ▶' : 'Start ▶'}
                      </button>
                    ` : `
                      <span class="lock-indicator" title="Noch gesperrt">🔒</span>
                    `}
                  </div>
                </div>`;
              }).join('')}
            </div>
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
