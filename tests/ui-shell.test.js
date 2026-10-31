import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createInitialState } from '../js/core/storage.js';
import '../content/mathe-content.js';
import '../content/deutsch-content.js';
import { renderHeaderBar } from '../js/views/header-bar.js';
import { renderProfileView } from '../js/views/profile-view.js';
import { renderHubView } from '../js/views/hub-view.js';
import { renderJourneyView } from '../js/views/journey-view.js';

test('child-facing shell views contain zero <input> elements and expose accessible data-action controls', () => {
  const state = createInitialState();
  const htmls = [
    renderHeaderBar(state, { screen: 'hub' }),
    renderProfileView(state, { creating: true, draftName: 'LEO', draftGrade: 'vorschule' }),
    renderHubView(state),
    renderJourneyView(state, { subjectId: 'mathe', selectedGrade: 'klasse1' })
  ];
  for (const html of htmls) {
    assert.ok(!html.toLowerCase().includes('<input'), 'child views must never render <input>');
  }
  assert.ok(htmls[2].includes('Rechnen') && htmls[2].includes('Deutsch'));
  assert.ok(htmls[3].includes('Vorschule') && htmls[3].includes('Klasse 1') && htmls[3].includes('Klasse 2'));
  assert.ok(htmls[3].includes('data-action="open-stage"'));
});

test('index.html and css/lernreise.css enforce touch-action manipulation, >=56px tap targets, and module boot', () => {
  const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../css/lernreise.css', import.meta.url), 'utf8');
  assert.ok(indexHtml.includes('<script type="module" src="./js/app.js"></script>'));
  assert.ok(css.includes('touch-action: manipulation') && css.includes('user-select: none') && css.includes('56px'));
});
