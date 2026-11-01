# Implementierungsplan: 6 Neue Didaktische Interaktionstypen

**Status:** Bereit zur Ausführung  
**Ziel-Repository:** `c:\Users\matth\OneDrive\Dokumente\lernreise`  
**GitHub Pages:** `https://matthias-coder.github.io/tabbi-lernreise/`  

---

## Phasenübersicht

### Phase 1: Evaluator & Datenmodell (`content/subjects.js`)
* Erweiterung von `evaluateTaskAnswer` um:
  * `rechendreieck` (Zahlenvergleich)
  * `hunderter-kreuz` (Zahlenvergleich)
  * `geld-betrag` (Zählen: Zahlenwert; Legen: Summe der ausgewählten Münzen)
  * `silbenkoenig` (Mengenvergleich der markierten Vokal-Indizes)
  * `schuettelwort` (Zusammengesetzter Wortstring)

### Phase 2: Touch-Interaktionsbausteine (`js/views/exercise-view.js`)
* Reducer & Actions in `applyExerciseAction`:
  * `place-coin` & `remove-coin` für Geldbeträge
  * `toggle-crown` für Silbenkönige
  * `place-letter` & `remove-letter` für Schüttelwörter
* Neue Render-Funktionen in `renderTaskInteraction`:
  * `renderRechendreieckStage` (SVG-Dreieck mit 3 Ecken, 3 Kanten, gelber Lücke)
  * `renderHunderterKreuzStage` (5-Felder-Kreuz mit Zehner-/Einer-Nachbarn)
  * `renderGeldStage` (Portemonnaie-Ablage, Münzen-Vorrat, Live-Münzzähler)
  * `renderSilbenkoenigStage` (Graphem-Kacheln mit Kronen 👑)
  * `renderSchuettelwortStage` (Ziellinie + gemischte Buchstaben)
* Neuer Visual-Renderer in `renderTaskVisual`:
  * `renderAnalogClockSvg` (Analoges Zifferblatt mit Stunden-/Minutenzeigern)

### Phase 3: Curriculum-Mapping
* **`content/mathe-content.js`:**
  * `mathe-kl1-t2-s3`: Rechendreiecke bis 20
  * `mathe-kl1-t3-s2`: Geldmengen bis 20 Euro zählen
  * `mathe-kl2-t1-s2`: Hundertertafel-Kreuz
  * `mathe-kl2-t2-s2`: Geldbeträge legen
  * `mathe-kl2-t3-s2`: Uhrzeiten (Analoge Uhren)
* **`content/deutsch-content.js`:**
  * `deutsch-kl1-t1-s3`: Silbenkönige
  * `deutsch-kl1-t3-s2` & `deutsch-kl2-t1-s2`: Schüttelwörter

### Phase 4: Styling & SVG-Grafiken (`css/lernreise.css`)
* Styling für Münzen (1€, 2€, 5€, 10€, 50ct)
* Dreiecks- und Kreuz-Gitter
* Kronen-Animationen für Vokale
* Buchstabenschüttler-Slots

### Phase 5: Tests & GitHub-Push
* Unit-Tests für alle 6 Typen in `tests/exercise-runner.test.js`
* Gesamte Testsuite durchlaufen (`npm test`)
* Commit & Push auf `main` zu GitHub Pages
