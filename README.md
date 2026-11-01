# 🚀 Lernreise – Spielerisch lernen (Vorschule, Klasse 1 & 2)

> 🌐 **Live Web-App:** [**https://matthias-coder.github.io/tabbi-lernreise/**](https://matthias-coder.github.io/tabbi-lernreise/)  
> 📱 **PWA-fähig:** Direkt im Browser auf Tablet, iPad oder Smartphone starten oder zum Homescreen hinzufügen.

<div align="center">

[![Live Demo auf GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-0284c7?style=for-the-badge&logo=github&logoColor=white)](https://matthias-coder.github.io/tabbi-lernreise/)

### 📲 QR-Code zum Scannen (Tablet / Smartphone):
*Halte die Kamera deines Tablets oder Handys auf diesen QR-Code, um die Lernreise direkt zu öffnen:*

<a href="https://matthias-coder.github.io/tabbi-lernreise/">
  <img src="docs/qr-code.png" width="200" height="200" alt="QR-Code zu Lernreise auf GitHub Pages" />
</a>

👉 [**matthias-coder.github.io/tabbi-lernreise**](https://matthias-coder.github.io/tabbi-lernreise/)

</div>

---

Lernreise ist eine moderne, kindgerechte und offline-fähige Web-App (PWA) für Kinder der **Vorschule, Klasse 1 und Klasse 2** für die Fächer **Mathe** und **Deutsch**.

---

## 🌟 Kernfeatures & Philosophie

1. **Kindgerecht & barrierearm:**
   - **Keine Systemtastatur:** In allen Kinderansichten sind native `<input>`-Felder streng verboten. Die Interaktion erfolgt ausschließlich über kindgerechte Touch-Kacheln, Bildschirm-Ziffernblöcke oder Buchstaben-Tastaturen.
   - **Audio-Vorlesefunktion:** Web Speech API (`de-DE`) liest Aufgaben für Leseanfänger und Vorschulkinder automatisch oder auf Fingertipp vor.
   - **Fat-Finger-Schutz:** Mindestens 56px große Touch-Ziele, globales `touch-action: manipulation` und deaktivierte Textselektion.

2. **Duale Ökonomie (Entkoppelte Systeme):**
   - **Taler (🪙):** Eigene Währung für von den Eltern frei definierte Belohnungen (z. B. 30 Min. Tablet-Zeit, Wunschessen, Ausflug). Verdient durch jede absolvierte Übungsrunde.
   - **Freischaltungen (Track A & Track C):**
     - *Track A:* Erstmaliges Meistern einer Stufe (≥ 3 Sterne) schaltet einen thematischen Sammelsticker für das **Stickeralbum** frei.
     - *Track C:* Alle 12 gesammelten Sterne öffnet sich eine animierte **Überraschungskiste** mit Accessoires für den Avatar-Builder oder seltenen Glitzer-Stickern.

3. **Layered Avatar Builder:**
   - Auswahl zwischen drei Figuren (Monster, Junge, Mädchen).
   - Anpassbare Haut-, Monster- und Haarfarben sowie Frisuren.
   - Freischaltbare Accessoires (Brillen, Mützen, Kronen, Flügel, Zauberstäbe).

4. **Geschützter Elternbereich:**
   - Zugang über eine Rechenaufgabe (z. B. Einmaleins) oder optionalen 4-stelligen Eltern-PIN.
   - Belohnungen anlegen, Preise anpassen, auf Geschwisterkinder übertragen.
   - Offene Gutschein-Tickets als erledigt markieren oder stornieren (mit Taler-Rückerstattung).
   - Vollständiger lokaler JSON-Backup-Export und Wiederherstellung.

5. **Curriculum mit 54 Stufen:**
   - **Mathe (27 Stufen):**
     - *Vorschule:* Zählen bis 5, Würfelbilder & Hände, Größenvergleich.
     - *Klasse 1:* Zehnerfeld, Zerlegung & Freunde der 10, Plus & Minus bis 20.
     - *Klasse 2:* Hundertertafel, Zehnerübergang bis 100, Kleines 1x1 Einstieg.
   - **Deutsch (27 Stufen):**
     - *Vorschule:* Anlaute hören, Reime finden, Silben klatschen.
     - *Klasse 1:* Buchstaben-Laut-Zuordnung, Erste Wörter bauen, Kurze Sätze lesen.
     - *Klasse 2:* Groß- & Kleinschreibung (Nomen), Wortbausteine, Leseverständnis.

---

## 📁 Projektstruktur

```
lernreise/
├── index.html                   # PWA App-Shell
├── manifest.json                # Web App Manifest
├── sw.js                        # Offline Service Worker (Cache-First)
├── package.json                 # Node ESM Config & Test-Skripte
├── ASSETS_TODO.md               # 1:1 Dokumentation aller Assets & Platzhalter
├── css/
│   └── lernreise.css            # Zentrales responsive Stylesheet
├── js/
│   ├── app.js                   # SPA Controller & Event Delegator
│   ├── core/
│   │   ├── assets.js            # Asset-Registry & Live-SVG-Avatar-Renderer
│   │   ├── audio.js             # Web Speech TTS-Wrapper
│   │   ├── storage.js           # LocalStorage, Profile & JSON Backup
│   │   ├── scoring.js           # Stern- & Taler-Berechnung
│   │   ├── rewards.js           # Eltern-Ziele, Gutscheine & Taler-Shop
│   │   └── progression.js       # Stufenfreischaltung, Track A & C Unlocks
│   └── views/
│       ├── header-bar.js        # Profil- & Taler-Kopfzeile
│       ├── profile-view.js      # Profilauswahl & Touch-Namenseingabe
│       ├── hub-view.js          # Hauptmenü
│       ├── journey-view.js      # Thematische Stufenübersicht
│       ├── exercise-view.js     # 8-Aufgaben-Übungsrunde (4 Renderer)
│       ├── summary-view.js      # Rundenabschluss mit Sternen & Belohnungen
│       ├── avatar-view.js       # Live Avatar-Builder
│       ├── album-view.js        # Stickeralbum (7 Seiten)
│       └── parent-view.js       # Kind-Ziele & Eltern-Dashboard
├── content/
│   ├── subjects.js              # Fächer & Klassenstufen
│   ├── avatar-catalog.js        # Körpertypen, Farben, Frisuren & Accessoires
│   ├── sticker-catalog.js       # 54 Stufen- + 12 Bonus-Sticker
│   ├── mathe-content.js         # 27 Mathe-Stufen à 8 Aufgaben (216 Aufgaben)
│   └── deutsch-content.js       # 27 Deutsch-Stufen à 8 Aufgaben (216 Aufgaben)
├── assets/
│   └── haende/                  # SVGs für Hand-Mengen (0 bis 5 Finger)
└── tests/                       # Unit- & Invarianten-Tests (Node Native Runner)
```

---

## 🧪 Tests ausführen

Alle Tests nutzen den nativen Node.js Test-Runner (ohne externe Abhängigkeiten):

```bash
npm test
```

Oder einzelne Testsuiten:

```bash
node --test tests/kein-kindername.test.js
node --test tests/assets-manifest.test.js
node --test tests/storage-backup.test.js
node --test tests/scoring-rewards.test.js
node --test tests/progression-unlocks.test.js
node --test tests/curriculum-mathe.test.js
node --test tests/curriculum-tasks.test.js
node --test tests/ui-shell.test.js
node --test tests/exercise-runner.test.js
node --test tests/pwa-and-views.test.js
```

---

## 🎨 Asset-Workflow & Platzhalter

- Alle Bild- und Audio-Assets sind in `js/core/assets.js` typisiert registriert.
- Wenn eine endgültige Illustration noch nicht existiert, rendert die App automatisch ein sauberes SVG-Platzhalterkärtchen mit Icon und Beschriftung.
- Alle benötigten Grafiken sind 1:1 in `ASSETS_TODO.md` dokumentiert. Sobald eine Grafik fertig ist, wird die Datei im angegebenen Pfad abgelegt und in `js/core/assets.js` der Status auf `'ready'` gesetzt.
