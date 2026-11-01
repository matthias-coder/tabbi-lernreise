# Design-Dokument: Modulares Avatar-Baukastensystem („Klassenzimmer-Entdecker“)

**Datum:** 2026-11-01  
**Status:** In Abstimmung (Review)  
**Projekt:** TABBI Lernreise (`tabbi-lernreise`)  
**Zielgruppe:** Erstklässler & Vorschulkinder (motorische Entlastung, hohe Motivation, Identifikationsfigur)

---

## 1. Vision & Kontext
Der bisherige Avatar war ein rein provisorisches Minimal-SVG (entweder ein grüner Knet-Blob oder ein blaues Rechteck mit Kreis als Kopf). Kinder möchten sich jedoch auf ihrer Lernreise stolz wiedererkennen oder ein lustiges, fantastisches Wesen erschaffen.

Das neue System ersetzt die starren Primitivformen durch einen **vollständig modularen 3-Zonen-Baukasten**:
- **Kopf & Gesicht** (Kind, Monster, Roboter, Tierchen)
- **Körpermitte / Torso** (T-Shirt, Hoodie, Flauschbauch, Roboter-Chassis, Weste)
- **Beine & Fahrwerk** (Sneaker, Stiefel, Tatzen, Sprungfeder, Rollen)

Kinder haben die **bunte Crossover-Freiheit**: Sie können jedes Teil völlig frei miteinander kombinieren (z. B. ein Monsterkopf mit Schulkind-Hoodie auf Roboter-Sprungfedern).

---

## 2. Ziele, Nicht-Ziele & Anti-Ziele

### Ziele:
- **Modularer 3-Zonen-Aufbau:** Kopf, Torso und Beine sind unabhängig voneinander wählbar.
- **Skalierbarkeit & Schärfe:** Das zusammengesetzte Vektor-SVG skaliert verlustfrei von `36px` (Header-Avatar) über `72px` (Hub-Begrüßung) bis `200px` (Studio-Großansicht).
- **Sofortige Dynamik:** Farben für Haut/Körper, Haare und Kleidung/Chassis lassen sich direkt im SVG umfärben, ohne dass separate Grafiken geladen werden müssen.
- **Kindgerechte Studio-Bedienung:** 5 klare Tabs (`👤 Kopf`, `👕 Körper`, `👟 Beine`, `🎨 Farben`, `👑 Accessoires`) mit $\ge 56\,\text{px}$ Touch-Kacheln, kein Text-Clipping, kein horizontaler Scrollzwang.
- **100 % Abwärtskompatibilität:** Ältere Spielstände mit `{ bodyType: 'monster' | 'boy' | 'girl' }` werden nahtlos und verlustfrei in das neue Modell überführt.

### Nicht-Ziele:
- Keine komplexe Skelett-Animation oder Physik-Simulation.
- Keine 3D-Canvas-/WebGL-Engine (reines, performantes SVG).
- Keine kostenpflichtigen oder durch Echtgeld gesperrten Avatar-Teile (Grundformen sind alle frei; spezielle Accessoires werden weiterhin über die Überraschungskisten erspielt).

### Anti-Ziele (Verboten):
- Keine blockierenden oder asynchron ladenden PNG/WebP-Stapel, die auf langsamen Tablets flackern.
- Keine nativen `<input>`-Tags im Avatar-Studio (nur barrierefreie Touch-Buttons).
- Keine starre Trennung von "nur Monster" oder "nur Mensch" – Crossover-Kombinationen sind ausdrücklich erwünscht.

---

## 3. Technische Ansätze & Entscheidung

### Bewertete Ansätze:
1. **Ansatz 1: Reines SVG-Layering mit modularen Vektorgruppen (Ausgewählt & bestätigt)**
   * *Prinzip:* `renderAvatarSvg` setzt das Bild aus exakt vermessenen Andock-Zonen (`y: 20–75` Kopf, `y: 75–130` Torso, `y: 130–185` Beine) zusammen.
   * *Vorteile:* 0 ms Ladezeit, verlustfrei skalierbar, Farbänderungen wirken sofort, 100 % offline-fähig im Service Worker.
2. **Ansatz 2: Externe SVG-Dateien über `<img>`-Stapel**
   * *Verworfen:* Externe `<img>`-Tags können nicht per CSS oder Inline-Werten umgefärbt werden. Weißblitzen beim Laden auf schwachen Tablets.

---

## 4. Detaillierte Modul-Spezifikation

### 4.1 Zone A: Beine & Fahrwerk (`y: 130–185`, Ankerpunkt `y = 130`, Breite 80px zentriert)
1. `legs-sneaker`: Blaue Jeans mit coolen roten/weißen Sneakern.
2. `legs-boots`: Robuste gelbe Entdecker-Gummistiefel / Wanderstiefel.
3. `legs-paws`: Grüne/bunte Dino- oder Monstertatzen mit 3 Zehen.
4. `legs-spring`: Roboter-Sprungfeder aus Stahl mit Pogo-Platte.
5. `legs-wheels`: Rollen-/Einrad-Fahrwerk mit Stoßdämpfer.
6. `legs-tracks`: Roboter-Raupenketten.

### 4.2 Zone B: Körpermitte & Torso (`y: 75–130`, Ankerpunkte oben `y = 75`, unten `y = 130`)
1. `torso-shirt-stripes`: Bequemes Rundhals-T-Shirt mit Streifen.
2. `torso-hoodie-star`: Warmer Kapuzenpullover mit goldenem Stern auf der Brust.
3. `torso-monster-belly`: Kugelrunder, flauschiger Monsterbauch mit Bauchfleck.
4. `torso-robot-chassis`: Metall-Chassis mit Herz-Display, Zahnrad und 3 bunten Knöpfen.
5. `torso-vest-explorer`: Abenteuer-Weste mit Gurt und kleiner Tasche.
6. `torso-dungarees`: Lustige Latzhose mit Messingknöpfen.

### 4.3 Zone C: Kopf & Gesicht (`y: 20–75`, Ankerpunkt `y = 75`, Zentrum `x = 80`)
1. `head-child-smile`: Freundliches Kindergesicht mit Kulleraugen, Wangen und offenem Lächeln.
2. `head-child-freckles`: Kindergesicht mit Sommersprossen und Augenzwinkern.
3. `head-monster-horns`: Rundes Monstergesicht mit 2 Hörnchen und großem Grinsen.
4. `head-monster-tri`: Lustiges Monster mit 3 neugierigen Kulleraugen.
5. `head-robot-screen`: Monitor-Kopf mit Antenne, Leuchtkugel und Pixel-Smiley.
6. `head-robot-visor`: Roboter-Kopf mit Hightech-Brille/Visier und Ohrenschrauben.
7. `head-bear`: Flauschiger Tierkopf mit runden Bärenohren und Schnäuzchen.

### 4.4 Schichten-Reihenfolge im SVG:
1. Schattenwurf / Base Filter
2. Beine & Fahrwerk (Hintergrund-Ebene)
3. Körpermitte / Torso
4. Kopf & Gesicht
5. Frisur (bei menschlichen und Monster-Köpfen; bei Monitorköpfen als Antennen-Aufsatz)
6. Accessoires (Krone, Brille, Zauberhut etc. auf exakter Kopf-Höhe)

---

## 5. Datenmodell & Migration

### Schema-Erweiterung in `profile.avatar`:
```javascript
{
  headId: 'head-child-smile',      // Neu
  torsoId: 'torso-shirt-stripes',  // Neu
  legsId: 'legs-sneaker',          // Neu
  skinColorId: 'fair',             // Bestehend (Haut / Monster / Roboter-Body)
  clothColorId: 'sky',             // Neu: Hauptfarbe für Shirt/Hoodie/Chassis
  hairStyleId: 'tuft',             // Bestehend
  hairColorId: 'brown',            // Bestehend
  accessoryIds: ['acc-krone']      // Bestehend
}
```

### Farbpalette Kleidung (`clothColors` in `avatar-catalog.js`):
- `sky`: Himmelblau (`#38bdf8`) [Standard/Migration]
- `navy`: Marineblau (`#1e3a8a`)
- `red`: Signalrot (`#dc2626`)
- `emerald`: Smaragdgrün (`#059669`)
- `yellow`: Sonnengelb (`#eab308`)
- `purple`: Zauberlila (`#9333ea`)
- `orange`: Leuchtorange (`#ea580c`)
- `pink`: Knallpink (`#ec4899`)
- `slate`: Schiefergrau (`#334155`)

### Automatische Fallback-Migration (`storage.js`):
Existiert in einem Profil noch kein `headId`, greift die Fallback-Regel:
- War `bodyType === 'monster'`:
  `headId = 'head-monster-horns'`, `torsoId = 'torso-monster-belly'`, `legsId = 'legs-paws'`, `clothColorId = 'emerald'`.
- War `bodyType === 'boy' | 'girl'`:
  `headId = 'head-child-smile'`, `torsoId = 'torso-shirt-stripes'`, `legsId = 'legs-sneaker'`, `clothColorId = 'sky'`.
- Kein Spielstand geht verloren, keine Daten werden gelöscht.

### Profil-Onboarding (`profile-view.js`):
Bei der Neuerstellung eines Profils wählen Kinder aus **4 bunten Entdecker-Startern**:
1. 🎒 **Schulkind** (`head-child-smile`, `torso-shirt-stripes`, `legs-sneaker`, `sky`)
2. 👾 **Monster** (`head-monster-horns`, `torso-monster-belly`, `legs-paws`, `emerald`)
3. 🤖 **Robo** (`head-robot-screen`, `torso-robot-chassis`, `legs-spring`, `yellow`)
4. 🐻 **Tierchen** (`head-bear`, `torso-vest-adventurer`, `legs-boots-rain`, `orange`)

---

## 6. Studio-Bedienoberfläche (`avatar-view.js`)

Das Studio erhält 5 übersichtliche Tabs mit klaren Icons:
1. `👤 Kopf` (Auswahl der 7 Kopfformen; darunter nahtlose Wahl der Frisur / Antenne / Hörner)
2. `👕 Körper` (Auswahl der 6 Torsos)
3. `👟 Beine` (Auswahl der 6 Beine/Fahrwerke)
4. `🎨 Farben` (Haut-/Monster-/Robotergrundfarbe, Haarfarbe, Kleidungsfarbe)
5. `👑 Accessoires` (Freigespielte Schätze)

Jede Auswahl aktualisiert sofort die Live-Vorschau links/oben. Die Buttons sind mindestens $56\,\text{px}$ hoch und haben fühlbare 3D-Kanten mit Klick-Feedback.

---

## 7. Verifikation & Qualitätssicherung
- **Unit Tests:**
  - `renderAvatarSvg` mit allen neuen Head-, Torso- und Legs-Kombinationen.
  - Abwärtskompatibilitäts-Test für alte Profile ohne `headId`.
  - Keine `<input>`-Tags im Avatar-Studio.
  - Datenschutz-Guard: Keine Echtnamen im Code (`kein-kindername.test.js`).
- **PWA & Offline:** `sw.js` Cache-Busting auf neue Version.
- **Visuelle Prüfung:** Avatar im Header (`36px`), im Start-Hub (`72px`) und im Studio (`180px`).
