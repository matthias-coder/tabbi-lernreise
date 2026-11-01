// Themed Journey View with Grade Switcher (Vorschule, Klasse 1, Klasse 2)

import { getActiveProfile } from '../core/storage.js';
import { isStageUnlocked } from '../core/progression.js';
import { GRADES, getTopicsForSubjectAndGrade, getSubjects } from '../../content/subjects.js';

export function renderJourneyView(state, options = {}) {
  const profile = getActiveProfile(state);
  const { subjectId = 'mathe', selectedGrade = profile.defaultGrade || 'klasse1' } = options;

  const subjects = getSubjects();
  const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0];
  const topics = getTopicsForSubjectAndGrade(subjectId, selectedGrade);

  return `
  <div class="view-container journey-view" style="--subject-accent: ${currentSubject.accent};">
    <div class="journey-header">
      <div class="journey-title-row">
        <button type="button" class="btn-touch btn-nav-back" data-action="open-hub">◀ Fächer</button>
        <h2>${escapeHtml(currentSubject.title)} – Lernreise</h2>
      </div>

      <div class="grade-switcher-bar">
        ${GRADES.map(g => `
          <button type="button" class="btn-touch grade-tab ${selectedGrade === g.id ? 'active' : ''}" data-action="switch-journey-grade" data-grade-id="${g.id}">
            ${g.label}
          </button>
        `).join('')}
      </div>
    </div>

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
  </div>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
