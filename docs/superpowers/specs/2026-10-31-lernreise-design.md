# Lernreise – Eigenständige Lern-App (Vorschule, Klasse 1 & 2) – Design-Spezifikation

Stand: 2026-10-31 · Status: Bereit zur Freigabe (Technischer Review abgeschlossen) · Gewählter Ansatz: Ansatz 1 (Datengetriebene Vanilla-SPA ohne Build-Step)

---

## 1. Absicht & Warum („Intent & Why“)

Aus dem bestehenden Schulheft-Werkzeug **TABBI** entsteht als **komplett getrennter Fork** das eigenständige Lernprogramm **`Lernreise`**.

Während TABBI streng ein neutrales digitales Papier-Arbeitsblatt ohne Feedback oder Belohnungen für den Unterricht bleibt (und als Projekt unangetastet weiterbesteht), verfolgt **`Lernreise`** ein völlig anderes Ziel für das selbstständige Üben zu Hause:
- Kinder in der **Vorschule sowie in Klasse 1 und Klasse 2** sollen **Mathe und Deutsch** (perspektivisch erweiterbar um weitere Fächer) auf einer motivierenden, schrittweise aufbauenden **Lernreise** üben.
- Kinder bekommen direktes Feedback, feiern Erfolge mit **1–5 Sternen**, gestalten ihren **eigenen Avatar**, sammeln Fortschritte in einem **Stickeralbum** und sparen eine separate **Währung (Taler)** auf echte, von den **Eltern definierte Belohnungen** (z. B. Tablet-Zeit oder Kinogutschein).

---

## 2. Ziele, Nicht-Ziele & Anti-Ziele

### Ziele
1. **Sauberer, unabhängiger Fork:** Eigenes Projektverzeichnis (`../lernreise` neben `tabbi`) mit eigenem Git-Repository und eigener PWA-Identität. TABBI wird nicht verändert.
2. **Altersstufen Vorschule, Klasse 1 & Klasse 2:** Start mit **Mathe** und **Deutsch**, architektonisch offen für weitere Fächer. Vorschul-Aufgaben sind dank Vorlese-Funktion (Browser-TTS) und Bild-/Touch-Karten komplett ohne Lesekenntnisse lösbar.
3. **Mehr-Kind-Profile lokal + Backup:** Mehrere Kinder (z. B. Geschwister) auf einem Gerät mit eigenem Avatar, eigenem Lernstand, eigenem Stickeralbum und eigenem Taler-Konto. Komplette Datenhaltung in `localStorage` inklusive **JSON-Export und JSON-Import**.
4. **Themen-Lernreisen & Übungsrunden:** Fach wählen → Themen-Lernreise mit aufsteigend schwerer werdenden Stufen → kurze Übungsrunde mit Sofort-Check pro Karte und vollständiger Richtig/Falsch-Übersicht + **1–5 Sternen** am Ende.
5. **Zwei strikt getrennte Motivationssysteme:**
   - **Eltern-Ziele mit auszugebender Währung (Taler):** Eltern definieren reale Ziele und Taler-Preise; Kinder sparen Taler und lösen sie gegen Gutschein-Tickets ein.
   - **Eigenes Freischalt-System (Kombination A + C):** Abgeschlossene Lernreise-Stufen schalten feste Themen-Sticker fürs Stickeralbum frei (**A**); zusätzlich füllt jeder verdiente Stern (auch beim Wiederholen) einen Überraschungs-Balken für neue Avatar-Accessoires und Bonus-Sticker (**C**).
6. **Strikte Asset-Qualitätsregel:** Es werden ausschließlich hochwertige Grafiken eingebunden. Wo noch keine hochwertige Grafik vorliegt, rendert die App konsistente, saubere Platzhalter und führt eine vollständige, mit dem Code abgeglichene Bedarfsdatei (`ASSETS_TODO.md`).

### Nicht-Ziele (für v1)
- Kein Backend, keine Cloud-Datenbank, keine Benutzerkonten mit E-Mail/Passwort.
- Keine Druck-/DIN-A4-Arbeitsblätter im Schulheft-Layout (dafür bleibt TABBI bestehen).
- Keine Spracherkennung (Mikrofon-Abnahme) für Leseübungen.

### Anti-Ziele (Was ein Fehlschlag wäre, selbst wenn es technisch funktioniert)
- **Belohnungskonflikt:** Wenn das Einlösen eines Kinogutscheins Sticker oder Avatar-Fortschritte kostet (oder umgekehrt ein neuer Avatar-Hut den Kinogutschein verzögert). Beide Systeme müssen zu 100 % entkoppelt sein.
- **Frust-Schleifen bei jüngeren Kindern:** Wenn ein Vorschulkind eine Aufgabenstellung lesen muss, die Systemtastatur des Tablets aufspringt oder das Kind 8 Aufgaben lang denselben Denkfehler macht, ohne es zu merken.
- **Billige Not-Grafiken:** Improvisierte, unpassende Cliparts oder krude Strichzeichnungen statt sauberer Platzhalter + klar dokumentierter Einträge in `ASSETS_TODO.md`.
- **Datenschutz-Verstoß:** Echte Kindernamen im Quellcode, in Tests oder in Git-Commits (der SHA-256-Datenschutztest aus TABBI wird übernommen).

---

## 3. Rahmenbedingungen & Technische Leitplanken

- **Plattform & Hosting:** Statische Progressive Web App (PWA), offline-fähig über Service Worker (`sw.js`), direkt hostbar auf GitHub Pages ohne Server.
- **Kein Build-Step:** Reines HTML5, CSS3 und modernes Vanilla JavaScript (ES-Module / Node-kompatible Module für Tests), keine `npm`-Laufzeitabhängigkeiten.
- **Automatisierte Tests:** Node.js Built-in Test Runner (`node --test tests/*.test.js`), ohne externe Test-Frameworks.
- **Tablet- & Touch-Optimierung:** `touch-action: manipulation`, `user-select: none`, Tippflächen mindestens `56 × 56 px`, Schriftart `'Andika'` (lokal/gecacht mit System-Fallback), **keine `<input>`-Systemtastatur** in der Kind-Oberfläche (nur im geschützten Elternbereich für Ziel-Namen/PIN erlaubt).

---

## 4. Betrachtete Ansätze & Entscheidung

1. **Ansatz 1 – Datengetriebene Vanilla-Single-Page-App ohne Build-Step (Gewählt):**
   - *Aufbau:* Eine einzige App-Shell (`index.html`), modulare Trennung in reine Datenpakete (`content/`), reine Domain-/State-Logik (`js/core/`) und UI-Views (`js/views/`).
   - *Abwägung:* Keine Abhängigkeiten, kein Build-Schritt, flüssige Screen-Wechsel mit Audio & Animationen, direkte Wiederverwendung bewährter TABBI-Grundlagen. Erfordert eine eigene schlanke View-/State-Schicht (~30 % UI-Code müsste bei einem späteren Wechsel auf Ansatz 2 in Komponenten übersetzt werden, während ~70 % Daten, Spielstände, Logik und Assets 1:1 erhalten bleiben).
2. **Ansatz 2 – Komponenten-App mit Build-Pipeline (Vite + Preact/React + TypeScript) (Verworfen):**
   - *Abwägung:* Komfortabel für komplexe reaktive Views, bringt aber `node_modules`, Bundler-Pflege und CI-Build für GitHub Pages mit sich. Der Nutzer entschied sich bewusst für die Build-Freiheit von Ansatz 1.
3. **Ansatz 3 – Mehrseiten-HTML analog zu TABBI (Verworfen):**
   - *Abwägung:* Volle Seiten-Reloads brechen das flüssige App-Gefühl (Sprachausgabe, Überraschungskiste, Profil-Kontext) und erzeugen über drei Altersstufen und mehrere Fächer unnötige HTML-Duplikate.

---

## 5. Festgelegtes Verhalten im Detail

### 5.1 Vom Nutzer getroffene Kern-Entscheidungen
- **Getrennter Fork:** Eigenständige Entwicklung getrennt von TABBI; Vorschlag Name/Ordner **`Lernreise`** (`c:\Users\matth\OneDrive\Dokumente\lernreise`) wurde bestätigt.
- **Speicherung:** `localStorage` plus Datei-Export/Import aller Nutzerdaten.
- **Profile & Stufen (Variante A):** Mehrere Kinder-Profile mit jeweils eigenem Avatar, eigenem Taler-Guthaben, eigenem Stickeralbum und voreingestellter Start-Stufe (`Vorschule`, `Klasse 1` oder `Klasse 2`). Innerhalb jedes Fachs startet das Kind in seiner Stufe, kann oben aber über einen Stufen-Wechsler frei zwischen Vorschule, Klasse 1 und Klasse 2 wechseln.
- **Navigation & Lernreise:** App öffnen → Lernbereich/Fach wählen (`Rechnen`, `Deutsch`, erweiterbar) → Themen als **Lernreise** mit aufsteigend schwereren Stufen.
- **Übungsrunde & Sterne (Variante B):** Kurzer Richtig/Falsch-Check direkt nach jeder einzelnen Aufgabenkarte; am Rundenende eine Gesamt-Übersicht aller Aufgaben (was war richtig, was war falsch + Lösung) sowie eine Bewertung von **1 bis 5 Sternen**.
- **Avatar-Baukasten:** Auswahl aus **Monster, Junge, Mädchen**, verschiedenen Frisuren, Haarfarben, Haut-/Monsterfarben und freischaltbaren Accessoires.
- **Zwei getrennte Belohnungssysteme:**
  1. **Eltern-Ziele:** Eigene, auszugebende Währung (**Taler**), mit der von Eltern definierte Ziele (z. B. „1 Stunde Tablet“, „Kinogutschein“) eingelöst werden.
  2. **Freischalt-System (Kombination A + C):** Erstmalig geschaffte Lernreise-Stufen schalten den zugehörigen Themen-Sticker frei (**A**); zusätzlich füllt jeder verdiente Stern einen Überraschungs-Balken für Avatar-Accessoires und Bonus-Sticker (**C**).
- **Asset-Regel:** Nur hochwertige Assets verwenden; fehlende Assets als saubere Platzhalter darstellen und vollständig in einer zentralen Datei (`ASSETS_TODO.md`) führen.

### 5.2 Ergänzende Design-Festlegungen („Designer/Builder Calls“ – vom Nutzer inkl. Vorschlägen bestätigt)

1. **Aufbau einer Übungsrunde & 1–5-Sterne-Schwellen *(Designer-Festlegung)*:**
   - Jede Stufe umfasst **8 Aufgabenkarten** (aus einem Stufen-Pool bzw. regelbasierten Generator gezogen, sodass Wiederholungen leicht variieren).
   - **Sterne-Skala bei 8 Aufgaben:**
     - `8 richtig` = **5 Sterne**
     - `6–7 richtig` = **4 Sterne**
     - `4–5 richtig` = **3 Sterne**
     - `2–3 richtig` = **2 Sterne**
     - `0–1 richtig` = **1 Stern** (Ermutigungs-Stern fürs Durchhalten bis zum Schluss).
   - **Weiterkommen auf der Lernreise:** Stufe 1 jedes Themas ist sofort offen; die jeweils nächste Stufe eines Themas öffnet sich ab **mindestens 3 Sternen** in der Vorstufe. Alle Themen einer Klassenstufe sind parallel wählbar (kein Kind steckt in der gesamten App fest, wenn ihm ein einzelnes Thema schwerfällt).

2. **Taler-Wirtschaft & Schutz vor Endlos-Farming derselben Leicht-Aufgabe *(Designer-Festlegung)*:**
   - Pro abgeschlossener Runde erhält das Kind **2 Taler je erreichtem Stern** (also `2` bis `10` Taler) plus einmalig **+4 Bonus-Taler** beim erstmaligen Bestehen (≥ 3 Sterne) einer neuen Stufe.
   - Damit Üben/Wiederholen sich für große Eltern-Ziele lohnt, aber nicht eine einzige Vorschul-Stufe 30-mal hintereinander für den Kinogutschein durchgeklickt wird: Ab dem **4. Abschluss exakt derselben Stufe am selben Kalendertag** gibt diese Stufe für den Rest des Tages noch `1 Taler` Pauschal-Fleißbonus (andere Stufen geben normal volle Taler).
   - Eltern können die Beispiel-Preise frei anpassen (Standard-Vorlagen beim Profilstart: *„30 Min. Tablet-Zeit“ = 30 Taler*, *„Lieblingsessen wünschen“ = 60 Taler*, *„Kinogutschein / Ausflug“ = 150 Taler*).

3. **Gutschein-Ablauf & Geschützter Elternbereich *(Designer-Festlegung)*:**
   - Hat das Kind genug Taler, tippt es bei einem Eltern-Ziel auf *„Einlösen“* (mit Zwei-Tipp-Bestätigung: *„Wirklich für 40 Taler einlösen?“*). Die Taler werden abgezogen und ein **offenes Gutschein-Ticket** mit Datum angelegt.
   - Der **Elternbereich** ist standardmäßig über eine **Einmaleins-Aufgabe** (z. B. `7 × 8 = ?`, analog zu TABBI – sofort ohne Einrichtungszwang nutzbar) geschützt; Eltern können dort optional zusätzlich eine eigene **4-stellige PIN** hinterlegen.
   - Im Elternbereich können Eltern:
     - Eltern-Ziele pro Kind anlegen, bearbeiten, pausieren oder löschen (inkl. Knopf *„Auf alle Kinder-Profile kopieren“*),
     - offene Gutschein-Tickets als **„Eingelöst ✓“** abhaken (oder bei versehentlichem Kinder-Klick stornieren & Taler erstatten),
     - Kinder-Profile verwalten (Name, Start-Stufe, Vorlese-Stimme an/aus),
     - **Nutzerdaten als JSON exportieren** und ein **JSON-Backup importieren** (wahlweise Komplett-Wiederherstellung mit Zwei-Tipp-Bestätigung oder einzelnes Profil hinzufügen).

4. **Freischalt-System A + C im Detail *(Designer-Festlegung)*:**
   - **Freie Grundausstattung im Avatar-Baukasten:** Alle 3 Körpertypen (`Monster`, `Junge`, `Mädchen`), mindestens 6 Haut- bzw. Monsterfarben, 6 Haarfarben und 5 Basis-Frisuren sind von Anfang an für jedes Kind komplett frei verfügbar.
   - **Spur A (Etappen-Sticker):** Jede Lernreise-Stufe hat eine feste Themen-Sticker-ID (oder Etappen-Plakette auf der passenden Themen-Seite des Stickeralbums). Beim ersten Bestehen (≥ 3 Sterne) landet der Sticker als *„✨ Neu“* im Album; das Kind tippt auf den freien Platz, um ihn einzukleben.
   - **Spur C (Sterne-Überraschungsbalken):** Jeder verdiente Stern erhöht `surpriseProgressStars`. Alle **12 Sterne** öffnet sich am Rundenende eine animierte **Überraschungskiste** und schaltet deterministisch-gemischt das nächste noch nicht freigeschaltete **Avatar-Accessoire** (Hüte, Brillen, Flügel, Umhänge, Monster-Hörner, Haustier-Begleiter) oder einen **Glitzer-/Bonus-Sticker** frei. Sind alle Katalog-Extras freigeschaltet, vergibt jede weitere Kiste **+5 Bonus-Taler**.

5. **4 Touch-Aufgaben-Bausteine & Vorlese-Unterstützung *(Designer-Festlegung)*:**
   - Jede Aufgabe besitzt einen `promptText` und einen `speechText` sowie oben links auf der Karte einen großen **🔊 Vorlese-Button** (`window.speechSynthesis`, `de-DE`). In Profilen mit Start-Stufe `Vorschule` ist automatisches Vorlesen beim Öffnen einer Karte standardmäßig aktiv (oben per Lautsprecher-Toggle jederzeit stummschaltbar).
   - Alle Aufgaben in Mathe & Deutsch nutzen vier einheitliche, wiederverwendbare Touch-Renderer (keine Systemtastatur):
     1. **`choice-cards`:** 2 bis 4 große Auswahlkarten (Bild/Platzhalter, Zahl, Silbe oder Wort; Einzelkarten auf Wunsch mit kleinem 🔊-Hör-Button für Vorschul-Wörter).
     2. **`numpad-gap`:** Rechenaufgabe, Zahlenhaus, Zahlenmauer oder Mengen-/Fingerbild mit gelb markierter Lücke und eigenem Ziffernblock (`0–9`, `⌫`, `OK`; mehrstellige Eingaben bis 100 in Klasse 2).
     3. **`tile-builder`:** Gezielter Baukasten aus großen antippbaren Silben-, Buchstaben- oder Wort-Kacheln (z. B. `[To] [ma] [te]` zusammensetzen, fehlenden Anlaut wählen, Nomen/Verb zuordnen).
     4. **`sequence-order`:** 3 bis 5 Kacheln in die richtige Reihenfolge tippen (Zahlenreihen in Mathe, kleiner Satzbau in Deutsch Klasse 2).

6. **Starter-Curriculum für v1 *(Designer-Festlegung)*:**
   - Damit die App direkt nach dem Bau in allen drei Altersstufen sinnvoll nutzbar ist, enthält v1 in **Mathe** und **Deutsch** für jede der 3 Altersstufen (`Vorschule`, `Klasse 1`, `Klasse 2`) jeweils **3 Themen-Lernreisen mit je 3 Stufen** (= 9 Stufen pro Fach & Altersstufe, insgesamt **54 spielbare Lernreise-Stufen** mit Generator-/Aufgabenpools):
     - **Mathe Vorschule:** (1) Mengen & Würfel bis 6 · (2) Fingerbilder & Zählen bis 10 · (3) Mehr, weniger & Muster.
     - **Mathe Klasse 1:** (1) Zahlenhäuser & Verliebte Zahlen bis 10 · (2) Plus & Minus bis 20 · (3) Nachbarzahlen & Zahlenmauern bis 20.
     - **Mathe Klasse 2:** (1) Zahlenraum bis 100 (Zehner & Einer) · (2) Plus & Minus bis 100 · (3) Kleines Einmaleins (2er, 5er, 10er & Kernaufgaben).
     - **Deutsch Vorschule:** (1) Anlaute hören (`M, S, L, A, O, R…`) · (2) Silben zählen (1–3 Silben) · (3) Reimwörter erkennen.
     - **Deutsch Klasse 1:** (1) Silben & erste Fibel-Wörter (aus `tabbi-lesekorpus.js`) · (2) Fehlende Silbe ergänzen · (3) Begleiter `der / die / das`.
     - **Deutsch Klasse 2:** (1) Wortarten (Nomen, Verben, Adjektive) · (2) Rechtschreib-Spürnasen (`ei/ie`, Mehrzahl-Umlaute `a/ä`) · (3) Sätze bauen & Sinn verstehen.

7. **Asset-System & `ASSETS_TODO.md` *(Designer-Festlegung)*:**
   - `js/core/assets.js` ist die **einzige Quelle** für alle visuellen Motive (Fach-Icons, Avatar-Layer, Accessoires, Sticker, Wort-Bildkarten für Vorschule/Deutsch, Belohnungs-Icons).
   - Vorhandene hochwertige Vektorgrafiken aus TABBI (`assets/haende/*.svg`) werden übernommen und stehen auf `status: 'ready'`.
   - Alle noch nicht produzierten Motive stehen im Asset-Katalog auf `status: 'placeholder'`.
   - **Kindgerechte Platzhalter-Darstellung:** Im Spiel zeigt ein Platzhalter **niemals** kryptische Dateinamen, sondern eine hochwertig gestaltete, farblich zur Kategorie passende Vektor-Platzhalterkarte (sanfter Rahmen, Typ-Farbwelt, lesbares Wort/Titel, dezentes „Motiv folgt“-Abzeichen bzw. Silhouetten-Form beim Avatar-Layer). Die technische Asset-ID steht sauber im DOM (`data-asset-id="..."`) und in `ASSETS_TODO.md`.
   - **`ASSETS_TODO.md` + automatisierter Abgleich-Test:** Im Projekt-Root liegt `ASSETS_TODO.md`, gegliedert nach Kategorien (*1. App- & Fach-Icons*, *2. Avatar-Basis-Layer*, *3. Avatar-Accessoires*, *4. Stickeralbum-Motive*, *5. Vorschul- & Deutsch-Wortbilder*, *6. Belohnungs- & UI-Illustrationen*). Jeder Eintrag enthält:
     - `Asset-ID` & exakter Ziel-Dateipfad (z. B. `assets/stickers/zahlen-loewe.svg`)
     - Format & Zielauflösung / `viewBox` (z. B. `SVG, viewBox="0 0 256 256", transparenter Hintergrund`)
     - Konkrete Motiv- und Stilbeschreibung, damit Grafiken einzeln erstellt und durch Setzen von `status: 'ready'` sofort scharfgeschaltet werden können.
   - Ein Unit-Test (`tests/assets-manifest.test.js`) schlägt fehl, falls im Code eine Asset-ID registriert oder referenziert wird, die weder als fertige Datei auf der Festplatte existiert noch in `ASSETS_TODO.md` dokumentiert ist.

---

## 6. Geplante Ordnerstruktur des Forks (`../lernreise`)

```text
lernreise/
├── index.html                    # Einzige App-Shell (SPA, PWA-Einbindung)
├── manifest.json                 # Eigenes Web-App-Manifest für „Lernreise“
├── sw.js                         # Offline-Service-Worker für App & vorhandene Assets
├── ASSETS_TODO.md                # Vollständige, getestete Bedarfsliste aller offenen Assets
├── README.md                     # Projektübersicht, lokale Nutzung & Asset-Workflow
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-10-31-lernreise-design.md
│       └── plans/
├── css/
│   └── lernreise.css             # Freundliches, klares Designsystem, große Touch-Ziele
├── assets/
│   ├── haende/                   # Übernommene hochwertige Hand-SVGs (0–10) aus TABBI
│   ├── avatar/                   # Zielordner für Avatar-Layer-SVGs
│   ├── stickers/                 # Zielordner für Sticker-Grafiken
│   ├── cards/                    # Zielordner für Wort-/Vorschul-Bildkarten
│   └── ui/                       # Zielordner für Fach-, Taler-, Truhen- & Ziel-Icons
├── content/
│   ├── subjects.js               # Fach-Registry (Mathe, Deutsch, erweiterbar)
│   ├── avatar-catalog.js         # Körpertypen, Farbpaletten, Frisuren & Accessoires
│   ├── sticker-catalog.js        # Themen-Seiten, Etappen-Sticker & Bonus-Sticker
│   ├── mathe-content.js          # Lernreisen & Generatoren Mathe (Vorschule, Kl. 1, Kl. 2)
│   └── deutsch-content.js        # Lernreisen & Wortkorpus Deutsch (Vorschule, Kl. 1, Kl. 2)
├── js/
│   ├── app.js                    # Einstiegspunkt & Screen-Router
│   ├── core/
│   │   ├── storage.js            # localStorage, Mehr-Kind-Profile, JSON-Export/Import
│   │   ├── scoring.js            # Runden-Auswertung, 1–5 Sterne, Taler-Berechnung
│   │   ├── progression.js        # Stufen-Freischaltung & A+C Freischalt-Logik
│   │   ├── rewards.js            # Eltern-Ziele, Taler-Einlösung & Gutschein-Tickets
│   │   ├── assets.js             # Asset-Registry & Platzhalter-Renderer
│   │   └── audio.js              # Web Speech API Vorlese-Modul (de-DE)
│   └── views/
│       ├── header-bar.js         # Aktives Profil, Avatar-Miniatur, Taler, Album & Eltern-Button
│       ├── profile-view.js       # Profil-Auswahl & Neues Kind anlegen
│       ├── hub-view.js           # Start-Hub (Lernbereich wählen)
│       ├── journey-view.js       # Themen-Lernreise & Stufen-Umschalter (Vorschule/Kl.1/Kl.2)
│       ├── exercise-view.js      # Aufgabenkarten-Runner (4 Touch-Typen + Sofort-Check)
│       ├── summary-view.js       # Runden-Abschluss (1–5 ⭐, Rückblick, Taler, Überraschungskiste)
│       ├── avatar-view.js        # Avatar-Baukasten (Live-Layer-Vorschau)
│       ├── album-view.js         # Stickeralbum mit Themen-Seiten & Einklebe-Interaktion
│       └── parent-view.js        # Eltern-Schranke, Ziele-Editor, Gutscheine & JSON-Backup
└── tests/
    ├── kein-kindername.test.js   # Übernommener SHA-256-Datenschutz-Wächter
    ├── storage-backup.test.js    # Profile, Migration, JSON-Export/Import-Validierung
    ├── scoring-rewards.test.js   # 1–5 Sterne, Taler-Farming-Schutz, Gutschein-Lifecycle
    ├── progression-unlocks.test.js # Stufen-Freischaltung, Etappen-Sticker (A) & Kiste (C)
    ├── curriculum-tasks.test.js  # Prüft alle 54 Stufen auf wohlgeformte, lösbare Aufgaben
    └── assets-manifest.test.js   # Prüft 1:1-Abgleich zwischen Asset-Registry, Dateien & ASSETS_TODO.md
```

---

## 7. Was der Umsetzung („Left to the Builder“) überlassen bleibt

- Konkrete Farbpalette, Typografie-Abstufungen und sanfte CSS-Übergänge des neuen spielerischen Designs (solange `'Andika'`, hohe Lesbarkeit, ≥ 56 px Touch-Ziele und ruhige Kinder-Fokussierung gewahrt bleiben).
- Konkrete geometrische Gestaltung der typisierten Platzhalter-SVGs (z. B. stilisierte Silhouetten für Monster/Junge/Mädchen mit dynamischer Haut-/Haarfarben-Vorschau, sodass der Farbwechsel im Avatar-Baukasten schon mit den Platzhaltern sichtbar Spaß macht!).
- Genaue Aufgaben-Zufallsparameter und Wortlisten innerhalb der 54 Lernreise-Stufen (solange Altersangemessenheit, eindeutige Lösbarkeit und Vorschul-Vorlesbarkeit durch Tests abgesichert sind).
- Interner Aufbau des leichtgewichtigen SPA-State-Dispatchers zwischen `js/app.js` und `js/views/*`.
