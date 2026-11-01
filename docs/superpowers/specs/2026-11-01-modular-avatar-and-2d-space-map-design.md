# Design-Dokument: Modulares Avatar-System, Visuelle Hilfen & 2D-Weltraum-Karte

**Datum:** 2026-11-01  
**Status:** Freigegeben (Approved)  
**Projekt:** TABBI Lernreise (`c:\Users\matth\OneDrive\Dokumente\lernreise`)  
**Zielgruppe:** Erstklässler & Vorschulkinder (motorische Entlastung, hohe Motivation, Identifikationsfigur)

---

## 1. Übersicht der 4 Säulen

1. **Modulares Avatar-Baukastensystem („Klassenzimmer-Entdecker“):**
   * 3-Zonen-Aufbau (Kopf, Torso, Beine/Fahrwerk) mit freier Crossover-Freiheit.
   * 7 Köpfe, 6 Torsos, 6 Beine, 9 Kleidungsfarben, 4 Starter-Archetypen (Schulkind, Monster, Robo, Tierchen).
   * 100 % Abwärtskompatibilität zu bestehenden Profilen (`bodyType`).

2. **Visuelle Hilfestellungen (Scaffolding für niedrige Stufen):**
   * 2-Farben-Wendepunkte (rot & blau im 10er-/20er-Feld) für Plus, Minus und Zahlenhäuser in Stufe 1 & Vorschule.
   * Würfelaugen-Visualisierung für Mengenerfassung.
   * Zuschaltbar oder bei Stufe 1 automatisch eingeblendet.

3. **Vollständige Integration der TABBI-Aufgabentypen:**
   * Ergänzung der 3 noch fehlenden Aufgabentypen:
     * `strichlisten`: Zählen mit Strichen 1–8 inkl. Querstrich beim 5er-Paket (`~~||||~~ ||`).
     * `zwerg_riese`: Verwandte Aufgaben ($4 + 3 = 7 \rightarrow 14 + 3 = 17$).
     * `wuerfel_tuerme`: Stapel aus 2 Würfeln addieren.

4. **2D-Weltraum-Aufstiegs-Karte (`journey-view.js`):**
   * Vertikal aufsteigender Abenteuerpfad von der Erde bis zum Mars:
     * **Zone 1 (Vorschule, 0 m):** Grüne Wiese, Blumen, Zahlenhäuschen, Startrampe.
     * **Zone 2 (Klasse 1 Einstieg, 35 km):** Wolken, Heißluftballon, Stratosphäre, Raketenstart.
     * **Zone 3 (Klasse 1 Finale, 408 km):** Erd-Orbit, Raumstation ISS, Zehnerübergang.
     * **Zone 4 (Klasse 2, 384.000 km):** Mond-Basis, Krater, Hunderter-Raum.
     * **Zone 5 (Klasse 2 Meister, 225 Mio. km):** Roter Planet Mars, Rover, Einmaleins, Meister-Pokal.
   * Der Avatar reist in seiner Raketenkapsel live mit und steht auf der aktuellen Station.

---

## 2. Detailliertes Datenmodell & Migration

### Avatar-Schema in `profile.avatar`:
```javascript
{
  headId: 'head-child-smile',      // Neu
  torsoId: 'torso-shirt-stripes',  // Neu
  legsId: 'legs-sneaker',          // Neu
  skinColorId: 'fair',             // Bestehend (Haut / Monster / Robo)
  clothColorId: 'sky',             // Neu: Hauptfarbe für Shirt/Hoodie/Chassis
  hairStyleId: 'tuft',             // Bestehend
  hairColorId: 'brown',            // Bestehend
  accessoryIds: ['acc-krone']      // Bestehend
}
```

### Migration in `storage.js`:
Fehlt `headId`, erfolgt die automatische Zuordnung:
* `monster` $\rightarrow$ `{ headId: 'head-monster-horns', torsoId: 'torso-monster-belly', legsId: 'legs-paws', clothColorId: 'emerald' }`
* `boy` / `girl` $\rightarrow$ `{ headId: 'head-child-smile', torsoId: 'torso-shirt-stripes', legsId: 'legs-sneaker', clothColorId: 'sky' }`

---

## 3. Architektur der 2D-Weltraum-Karte (`journey-view.js`)

* **Kontinuierlicher Höhenverlauf (Y: 2400 $\rightarrow$ 0):**
  * Erde & Wiese (Y: 1950 – 2400)
  * Stratosphäre & Wolken (Y: 1450 – 1950)
  * Erd-Orbit & ISS (Y: 950 – 1450)
  * Mond & Sterne (Y: 450 – 950)
  * Mars & tiefer Kosmos (Y: 0 – 450)
* **Pfad-Berechnung:**
  * SVG-Pfad mit kubischen Bézier-Kurven (`C`-Kommandos).
  * Jede Stufe des aktiven Fachs hat feste $(x, y)$-Koordinaten auf dem Pfad.
* **Avatar-Position:**
  * Der Avatar wird als SVG am $(x, y)$-Punkt der aktuellen, noch ungelösten Stufe gerendert.
  * Sanftes automatisches Hin-Scrollen beim Öffnen der Lernreise.
* **Touch-Interaktion:**
  * Antippen einer Station öffnet die untere Aktionskarte (`.station-popup`) mit Stufentitel, Sternen und großem Start-Knopf ($\ge 56\,\text{px}$).

---

## 4. Teststrategie & Qualitätssicherung

1. **Unit Tests (`node --test tests/*.test.js`):**
   * Vollständiger Test aller Avatar-Zonen-Kombinationen.
   * Test der Migrations-Logik für alte Profile.
   * Test der 3 neuen Aufgabentypen (`strichlisten`, `zwerg_riese`, `wuerfel_tuerme`).
   * Test der Berechnungslogik der 2D-Weltraum-Karte.
   * Datenschutz-Guard: `tests/kein-kindername.test.js` bleibt grün.
   * Keine `<input>`-Tags im Kind-Bereich (`tests/pwa-and-views.test.js`).
2. **PWA & Offline:**
   * Aktualisierung von `sw.js` (Cache-Version `v9`).
3. **Workspace-Sicherheit:**
   * `c:\Users\matth\OneDrive\Dokumente\tabbi` bleibt unberührt.
