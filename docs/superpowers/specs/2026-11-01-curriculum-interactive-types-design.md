# Design Document: 6 Neue Didaktische Interaktions-Typen (Lehrplan Kl. 1 & 2)

**Datum:** 2026-11-01  
**Projekt:** Lernreise (PWA)  
**Status:** In Vorbereitung zur Genehmigung  
**Autor:** Antigravity & Nutzer  

---

## 1. Intent & Das "Warum"
Die Lernreise soll über die bisherigen Grundbausteine (Zahlenhäuser, Mauern, Zehnerstreifen, Auswahlkarten) hinauswachsen und die wichtigsten interaktiven Aufgabenformen aus den Standard-Lehrwerken der 1. und 2. Grundschulklasse abbilden. Ziel ist es, motorisch entlastend (ohne Tastatur, ohne Drag-and-Drop) kognitiv anspruchsvolle und motivierende Aufgabenformen bereitzustellen.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
* **6 neue vollwertige Touch-Interaktionstypen:**
  1. `rechendreieck` (Arithmetik-Dreieck mit 3 Innen- und 3 Außenfeldern)
  2. `geld-betrag` (Euro- & Cent-Münzen/Scheine zum Zählen und Legen)
  3. `uhrzeit` (Vektor-Uhr mit analogem Zifferblatt und Zeigern)
  4. `hunderter-kreuz` (Kreuz-Ausschnitt der Hundertertafel mit Zehner-/Einer-Nachbarn)
  5. `silbenkoenig` (Vokale A, E, I, O, U in Wörtern antippen und krönen)
  6. `schuettelwort` (Durcheinandergewürfelte Buchstaben per Fingertipp zum Wort ordnen)
* **Kinderfreundliche Touch-Bedienung:** Große Touch-Targets (≥ 56px), kein Drag-and-Drop, sofortige taktile Rückmeldung.
* **100 % Offline-fähig & rein SVG/CSS:** Keine externen Bild- oder Tondateien notwendig.
* **Nahtlose Integration:** Volle Unterstützung von Variante B (Sofort-Feedback) und Taler-/Stern-System.

### Non-Goals
* Keine komplexe Bruchrechnung oder Uhrzeiten mit Sekunden (Klasse 1 & 2 fokussiert auf volle/halbe Stunden und Viertelstunden).
* Keine Handschrifterkennung (strikte Einhaltung des Tablet-Tipp-Prinzips).

### Anti-Goals
* Kein kognitiver Hilfetext, der die Lösung vorab verrät.
* Keine sperrigen Dropdown-Menüs oder native `<input>`-Elemente.

---

## 3. Approaches (Betrachtete Lösungswege)

### Ansatz A: Modulares Komponenten-Upgrade (Gewählt)
Die neuen Typen werden als modulare Touch-Komponenten in `js/views/exercise-view.js` implementiert und direkt in passende Stufen des bestehenden 54-Stufen-Curriculums eingepflegt.
* *Trade-off:* Ersetzt rein textbasierte Aufgaben durch reichhaltige Interaktionen, hält die Progression schlank.

### Ansatz B: Curriculum-Erweiterung um neue Themenwelten
Einführung zusätzlicher Themenkomplexe (z.B. Thema 4 je Klasse) und Vergrößerung des Stickeralbums.
* *Trade-off:* Erheblich größerer Overhead bei Freischaltungen und Progression.

---

## 4. Detaillierte Spezifikation der 6 Typen & Reviewer-Klarstellungen

### 1. `rechendreieck` (Mathe Kl. 1)
* **Curriculum-Platzierung:** `mathe-kl1-t2-s3` (ersetzt rein textuelle Zwergenaufgaben durch das visuelle Rechendreieck bis 20).
* **Aufbau:** Geometrisches Dreieck mit 3 Innenfeldern ($a, b, c$) und 3 Außenfeldern ($a+b, b+c, c+a$).
* **Lücke:** Genau **ein** gelbes Lückenfeld `?` pro Karte (z. B. eine Außensumme oder eine Innenzahl).
* **Bedienung:** Ziffernblock darunter, identisch zu Zahlenhaus und Zahlenmauer.

### 2. `hunderter-kreuz` (Mathe Kl. 2)
* **Curriculum-Platzierung:** `mathe-kl2-t1-s2` (Orientierung auf der Hundertertafel & Nachbarzehner).
* **Aufbau:** 5-Felder-Kreuz (Mitte $N$, oben $N-10$, unten $N+10$, links $N-1$, rechts $N+1$).
* **Lücke:** Didaktisch strikt **eine** gelbe Lücke `?` pro Karte (z. B. Nachbarzehner oben oder Nachbareiner links). Dadurch bleibt die Eingabelogik deterministisch und motorisch fehlersicher.

### 3. `geld-betrag` (Mathe Kl. 1 & 2)
* **Curriculum-Platzierung:**
  * `mathe-kl1-t3-s2`: Euro-Münzen & Scheine zählen bis 20 Euro.
  * `mathe-kl2-t2-s2`: Geldbeträge legen & glatte Zehner-Beträge.
* **Modus "Zählen":** Reine Euro-Beträge (1–20 €) mit Ziffernblock oder Cent-Kombinationen über Choice-Cards (kein Dezimal-Komma auf dem Kinder-Numpad nötig).
* **Modus "Legen":** Zielbetrag vorgegeben (z. B. "Lege 7 Euro"). Jede mathematisch richtige Kombination ist gültig (5€+2€ oder 2€+2€+2€+1€). Antippen im Portemonnaie legt Münzen zurück. Der Zähler verrät nicht die Summe, sondern zeigt nur: *„3 Münzen im Geldbeutel“*.

### 4. `uhrzeit` (Mathe Kl. 2)
* **Curriculum-Platzierung:** `mathe-kl2-t3-s2` (Kernaufgaben & Uhrzeit).
* **Architektur:** Realisiert über den neuen Visual-Renderer `visual: { type: 'analog-clock', hours, minutes }` mit 4 großen Choice-Cards (oder umgekehrt: Digitalzeit vorgegeben, 3 SVG-Uhren zur Auswahl).
* **Vorteil:** Verhindert frustrierendes Zeiger-Wischen auf Tablets und entspricht exakt den Aufgabenformaten in Grundschulheften.

### 5. `silbenkoenig` (Deutsch Kl. 1)
* **Curriculum-Platzierung:** `deutsch-kl1-t1-s3` (Buchstaben & Laute).
* **Graphem-Tokenisierung:** Wörter werden als Graphem-Kacheln dargestellt (z. B. `[H] [AU] [S]` oder `[B] [AU] [M]`), sodass Diphthonge wie `AU`, `EI`, `EU` als **ein** gemeinsamer Silbenkönig gekrönt werden.
* **Interaktion:** Antippen setzt die Krone 👑, erneutes Antippen nimmt sie zurück. "OK ✓" prüft die Auswahl.

### 6. `schuettelwort` (Deutsch Kl. 1 & 2)
* **Curriculum-Platzierung:** `deutsch-kl1-t3-s2` & `deutsch-kl2-t1-s2`.
* **Interaktion:** Bildkarte oben, darunter gemischte Buchstabenkacheln. Antippen legt sie in die Wortleiste. Antippen in der Wortleiste legt sie zurück. "OK ✓" bestätigt das fertige Wort.

---

## 5. Technische Architektur & Test-Strategie
* **Rendering:** Erweiterung der `switch(task.type)`-Verzweigung in `js/views/exercise-view.js`.
* **Evaluator:** Erweiterung von `evaluateTaskAnswer` in `content/subjects.js`.
* **Tests:** Jeder neue Typ erhält Unit-Tests in `tests/exercise-runner.test.js` und Test-Runden in `tests/curriculum-tasks.test.js`.
