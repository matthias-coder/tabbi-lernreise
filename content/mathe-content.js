// Mathe Curriculum: 27 Stages across Vorschule, Klasse 1, and Klasse 2

import { registerSubjectContent } from './subjects.js';

export const MATHE_TOPICS_BY_GRADE = {
  vorschule: [
    {
      id: 'mathe-vs-t1',
      title: 'Mengen & Würfel bis 6',
      description: 'Punkte und Würfelbilder auf einen Blick erfassen',
      stages: [
        { id: 'mathe-vs-t1-s1', title: 'Stufe 1: Würfelbilder bis 3', targetScore: 8 },
        { id: 'mathe-vs-t1-s2', title: 'Stufe 2: Würfelbilder bis 6', targetScore: 8 },
        { id: 'mathe-vs-t1-s3', title: 'Stufe 3: Punktebilder bis 6 zählen', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-vs-t2',
      title: 'Fingerbilder & Zählen bis 10',
      description: 'Finger an beiden Händen blitzschnell erkennen',
      stages: [
        { id: 'mathe-vs-t2-s1', title: 'Stufe 1: Finger bis 5 (Eine Hand)', targetScore: 8 },
        { id: 'mathe-vs-t2-s2', title: 'Stufe 2: Finger bis 10 (Zwei Hände)', targetScore: 8 },
        { id: 'mathe-vs-t2-s3', title: 'Stufe 3: Mengen bis 10 zählen', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-vs-t3',
      title: 'Mehr, weniger & Muster',
      description: 'Mengen vergleichen und Reihenfolgen legen',
      stages: [
        { id: 'mathe-vs-t3-s1', title: 'Stufe 1: Wo ist mehr?', targetScore: 8 },
        { id: 'mathe-vs-t3-s2', title: 'Stufe 2: Farb- und Zahlenmuster', targetScore: 8 },
        { id: 'mathe-vs-t3-s3', title: 'Stufe 3: Zahlen 1 bis 5 ordnen', targetScore: 8 }
      ]
    }
  ],
  klasse1: [
    {
      id: 'mathe-kl1-t1',
      title: 'Zahlenhäuser & Verliebte Zahlen',
      description: 'Zahlen bis 10 zerlegen und Partner finden',
      stages: [
        { id: 'mathe-kl1-t1-s1', title: 'Stufe 1: Zahlenhäuser bis 5', targetScore: 8 },
        { id: 'mathe-kl1-t1-s2', title: 'Stufe 2: Zahlenhäuser bis 10', targetScore: 8 },
        { id: 'mathe-kl1-t1-s3', title: 'Stufe 3: Verliebte Zahlen (Zusammen 10)', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl1-t2',
      title: 'Plus & Minus bis 20',
      description: 'Erstes Rechnen und Zwergen-/Riesen-Tricks',
      stages: [
        { id: 'mathe-kl1-t2-s1', title: 'Stufe 1: Plusaufgaben bis 10', targetScore: 8 },
        { id: 'mathe-kl1-t2-s2', title: 'Stufe 2: Minusaufgaben bis 10', targetScore: 8 },
        { id: 'mathe-kl1-t2-s3', title: 'Stufe 3: Rechendreiecke bis 20', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl1-t3',
      title: 'Nachbarzahlen & Zahlenmauern',
      description: 'Vorgänger, Nachfolger und Zahlenmauern bis 20',
      stages: [
        { id: 'mathe-kl1-t3-s1', title: 'Stufe 1: Nachbarzahlen bis 20', targetScore: 8 },
        { id: 'mathe-kl1-t3-s2', title: 'Stufe 2: Euro-Münzen zählen bis 20', targetScore: 8 },
        { id: 'mathe-kl1-t3-s3', title: 'Stufe 3: Zahlenmauern bis 20', targetScore: 8 }
      ]
    }
  ],
  klasse2: [
    {
      id: 'mathe-kl2-t1',
      title: 'Zahlenraum bis 100',
      description: 'Zehner und Einer bündeln und Nachbarn finden',
      stages: [
        { id: 'mathe-kl2-t1-s1', title: 'Stufe 1: Zehner und Einer bündeln', targetScore: 8 },
        { id: 'mathe-kl2-t1-s2', title: 'Stufe 2: Hundertertafel-Kreuz', targetScore: 8 },
        { id: 'mathe-kl2-t1-s3', title: 'Stufe 3: Zahlen ordnen bis 100', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl2-t2',
      title: 'Plus & Minus bis 100',
      description: 'Zweistellige Aufgaben schrittweise lösen',
      stages: [
        { id: 'mathe-kl2-t2-s1', title: 'Stufe 1: Rechnen ohne Zehnerübergang', targetScore: 8 },
        { id: 'mathe-kl2-t2-s2', title: 'Stufe 2: Geldbeträge im Portemonnaie legen', targetScore: 8 },
        { id: 'mathe-kl2-t2-s3', title: 'Stufe 3: Rechnen mit Zehnerübergang', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl2-t3',
      title: 'Kleines Einmaleins',
      description: 'Malreihen, Quadrataufgaben und Kernaufgaben',
      stages: [
        { id: 'mathe-kl2-t3-s1', title: 'Stufe 1: 2er-, 5er- und 10er-Reihe', targetScore: 8 },
        { id: 'mathe-kl2-t3-s2', title: 'Stufe 2: Uhrzeiten am Zifferblatt', targetScore: 8 },
        { id: 'mathe-kl2-t3-s3', title: 'Stufe 3: Gemischtes Einmaleins', targetScore: 8 }
      ]
    }
  ]
};

function makeChoices(correctValue, distractors) {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => String(d) !== String(correctValue))));
  const picked = uniqueDistractors.slice(0, 3);
  const all = [correctValue, ...picked].sort(() => Math.random() - 0.5);
  return all.map(v => ({ value: v, label: String(v) }));
}

export function generateMatheStageRound(stageId, options = {}) {
  const tasks = [];

  for (let i = 0; i < 8; i++) {
    // --- VORSCHULE ---
    if (stageId === 'mathe-vs-t1-s1') {
      const num = 1 + (i % 3);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Würfelpunkte siehst du?`,
        speechText: `Wie viele Punkte siehst du auf dem Würfel?`,
        visual: { type: 'dice', count: num },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [1, 2, 3, 4])
        }
      });
    } else if (stageId === 'mathe-vs-t1-s2') {
      const num = 1 + (i % 6);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Würfelpunkte sind das?`,
        speechText: `Wie viele Würfelpunkte sind das?`,
        visual: { type: 'dice', count: num },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [1, 2, 3, 4, 5, 6])
        }
      });
    } else if (stageId === 'mathe-vs-t1-s3') {
      const num = 1 + ((i * 2 + 1) % 6);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Zähle die Punkte: Wie viele sind es?`,
        speechText: `Zähle die Punkte. Wie viele sind es?`,
        visual: { type: 'dots', count: num, color: '#0284c7' },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [num - 1 || 6, num + 1 <= 6 ? num + 1 : 1, 4, 5])
        }
      });
    } else if (stageId === 'mathe-vs-t2-s1') {
      const num = 1 + (i % 5);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Finger werden gezeigt?`,
        speechText: `Wie viele Finger siehst du an der Hand?`,
        visual: { assetId: `hand-l-${num}` },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [1, 2, 3, 4, 5])
        }
      });
    } else if (stageId === 'mathe-vs-t2-s2') {
      const num = 5 + (i % 6); // 5..10
      const rightHandCount = num - 5;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Finger an beiden Händen?`,
        speechText: `Wie viele Finger siehst du an beiden Händen zusammen?`,
        visual: { type: 'two-hands', right: rightHandCount },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [num - 1 || 5, num + 1 <= 10 ? num + 1 : 6, 7, 10])
        }
      });
    } else if (stageId === 'mathe-vs-t2-s3') {
      const count = 3 + (i % 8); // 3..10
      const emojis = ['🍎', '⭐', '🎈', '🐞', '🐥', '🐟', '🍓', '🥕'];
      const emoji = emojis[i % emojis.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Zähle die Objekte: Wie viele sind es?`,
        speechText: `Zähle die Objekte. Wie viele sind es?`,
        visual: { type: 'meadow', count, emoji },
        correctAnswer: count,
        payload: {
          choices: makeChoices(count, [count - 1, count + 1, count + 2, 8])
        }
      });
    } else if (stageId === 'mathe-vs-t3-s1') {
      const left = 2 + (i % 4);
      const right = left + 2;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wo sind MEHR Punkte?`,
        speechText: `Tippe auf das Feld mit MEHR Punkten.`,
        visual: { type: 'compare-groups', leftCount: left, rightCount: right, icon: '⭐' },
        correctAnswer: right,
        payload: {
          choices: [
            { value: left, label: `${left} Sterne (A)` },
            { value: right, label: `${right} Sterne (B)` }
          ]
        }
      });
    } else if (stageId === 'mathe-vs-t3-s2') {
      const patternItems = ['⭐', '🔵', '⭐', '🔵', '⭐'];
      const next = '🔵';
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Was kommt als Nächstes im Muster?`,
        speechText: `Welches Symbol setzt das Muster fort?`,
        visual: { type: 'pattern', sequence: patternItems, missingIndex: -1 },
        correctAnswer: next,
        payload: {
          choices: [
            { value: '🔵', label: '🔵 Kreis' },
            { value: '⭐', label: '⭐ Stern' },
            { value: '🟩', label: '🟩 Quadrat' }
          ]
        }
      });
    } else if (stageId === 'mathe-vs-t3-s3') {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'sequence-order',
        promptText: `Bringe die Zahlen von klein nach groß in die richtige Reihenfolge:`,
        speechText: `Bringe die Zahlen von 1 bis 4 in die richtige Reihenfolge.`,
        correctAnswer: [1, 2, 3, 4],
        payload: {
          tiles: [3, 1, 4, 2]
        }
      });
    }

    // --- KLASSE 1 ---
    else if (stageId === 'mathe-kl1-t1-s1') {
      const roof = 5;
      const left = i % 5;
      const right = roof - left;
      const gapSide = (i % 2 === 0) ? 'right' : 'left';
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'zahlenhaus',
        promptText: `Zahlenhaus 5: Welche Zahl fehlt in der Wohnung?`,
        speechText: `Im Zahlenhaus 5: Welche Zahl gehört in das leere Zimmer?`,
        correctAnswer: gapSide === 'right' ? right : left,
        payload: {
          roof,
          left: gapSide === 'right' ? left : null,
          right: gapSide === 'right' ? null : right,
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t1-s2') {
      const roofs = [6, 7, 8, 9, 10, 8, 7, 10];
      const roof = roofs[i % roofs.length];
      const left = 1 + (i % (roof - 1));
      const right = roof - left;
      const gapSide = (i % 2 === 0) ? 'right' : 'left';
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'zahlenhaus',
        promptText: `Zahlenhaus ${roof}: Welche Zahl fehlt im Zimmer?`,
        speechText: `Im Zahlenhaus ${roof}: Welche Zahl gehört in das freie Zimmer?`,
        correctAnswer: gapSide === 'right' ? right : left,
        payload: {
          roof,
          left: gapSide === 'right' ? left : null,
          right: gapSide === 'right' ? null : right,
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t1-s3') {
      const blueCount = 1 + (i % 9);
      const redCount = 10 - blueCount;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'zehnerstreifen',
        promptText: `Zehnerstreifen: ${blueCount} blaue Plättchen. Wie viele rote Plättchen fehlen bis 10?`,
        speechText: `Auf dem Zehnerstreifen liegen ${blueCount} blaue Plättchen. Wie viele rote Plättchen fehlen bis 10?`,
        correctAnswer: redCount,
        payload: {
          blueCount,
          redCount,
          target: 10,
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t2-s1') {
      const a = 1 + (i % 6);
      const b = 1 + ((i * 2) % 4);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${a} + ${b} = ?`,
        speechText: `Wie viel ist ${a} plus ${b}?`,
        correctAnswer: a + b,
        payload: { maxDigits: 2 }
      });
    } else if (stageId === 'mathe-kl1-t2-s2') {
      const a = 5 + (i % 6);
      const b = 1 + (i % 4);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${a} - ${b} = ?`,
        speechText: `Wie viel ist ${a} minus ${b}?`,
        correctAnswer: a - b,
        payload: { maxDigits: 2 }
      });
    } else if (stageId === 'mathe-kl1-t2-s3') {
      const triples = [
        { a: 3, b: 4, c: 5 },
        { a: 2, b: 6, c: 4 },
        { a: 5, b: 2, c: 7 },
        { a: 4, b: 5, c: 3 },
        { a: 6, b: 3, c: 5 },
        { a: 2, b: 7, c: 6 },
        { a: 4, b: 4, c: 8 },
        { a: 5, b: 6, c: 4 }
      ];
      const cur = triples[i % triples.length];
      const a = cur.a;
      const b = cur.b;
      const c = cur.c;
      const sumAB = a + b;
      const sumBC = b + c;
      const sumCA = c + a;
      const gapOptions = ['sumAB', 'sumBC', 'sumCA', 'a', 'b', 'c'];
      const gap = gapOptions[i % gapOptions.length];
      let correctAnswer;
      if (gap === 'sumAB') correctAnswer = sumAB;
      else if (gap === 'sumBC') correctAnswer = sumBC;
      else if (gap === 'sumCA') correctAnswer = sumCA;
      else if (gap === 'a') correctAnswer = a;
      else if (gap === 'b') correctAnswer = b;
      else correctAnswer = c;

      tasks.push({
        id: `${stageId}_${i}`,
        type: 'rechendreieck',
        promptText: `Rechendreieck: Welche Zahl fehlt im freien Feld?`,
        speechText: `Im Rechendreieck: Zwei Innenecken ergeben zusammen das Außenfeld. Welche Zahl fehlt?`,
        correctAnswer,
        payload: {
          a,
          b,
          c,
          sumAB,
          sumBC,
          sumCA,
          gap,
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t3-s1') {
      const center = 11 + (i % 8);
      const askPrev = (i % 2 === 0);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'nachbarzahlen',
        promptText: askPrev ? `Finde den Vorgänger von ${center}:` : `Finde den Nachfolger von ${center}:`,
        speechText: askPrev ? `Welche Zahl kommt vor ${center}?` : `Welche Zahl kommt nach ${center}?`,
        correctAnswer: askPrev ? center - 1 : center + 1,
        payload: {
          centerNumber: center,
          gap: askPrev ? 'prev' : 'next',
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t3-s2') {
      const coinSets = [
        [2, 2, 1],          // 5 €
        [5, 2, 1],          // 8 €
        [5, 5, 2],          // 12 €
        [10, 2, 2, 1],      // 15 €
        [10, 5, 1],         // 16 €
        [2, 2, 2, 1],       // 7 €
        [10, 5, 2, 2],      // 19 €
        [5, 5, 5, 2, 1]     // 18 €
      ];
      const coins = coinSets[i % coinSets.length];
      const total = coins.reduce((acc, c) => acc + c, 0);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'geld-betrag',
        promptText: `Wie viel Euro liegt im Portemonnaie?`,
        speechText: `Zähle das Geld: Wie viele Euro sind das zusammen?`,
        correctAnswer: total,
        payload: {
          mode: 'count',
          coins,
          target: total,
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t3-s3') {
      const b1 = 1 + (i % 3);
      const b2 = 2 + ((i * 2) % 3);
      const b3 = 1 + ((i * 3) % 4);
      const m1 = b1 + b2;
      const m2 = b2 + b3;
      const top = m1 + m2;
      const gap = i % 3 === 0 ? 'top' : (i % 3 === 1 ? 'mid-left' : 'mid-right');
      const correctAnswer = gap === 'top' ? top : (gap === 'mid-left' ? m1 : m2);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'zahlenmauer',
        promptText: `Zahlenmauer: Rechne die Mauersteine nach oben zusammen!`,
        speechText: `Auf der Zahlenmauer: Welcher Stein fehlt?`,
        correctAnswer,
        payload: {
          base: [b1, b2, b3],
          mid: [gap === 'mid-left' ? null : m1, gap === 'mid-right' ? null : m2],
          top: gap === 'top' ? null : top,
          gap,
          maxDigits: 2
        }
      });
    }

    // --- KLASSE 2 ---
    else if (stageId === 'mathe-kl2-t1-s1') {
      const z = 2 + (i % 7);
      const e = 1 + ((i * 3) % 9);
      const num = z * 10 + e;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${z} Zehner und ${e} Einer = ?`,
        speechText: `Wie viel sind ${z} Zehner und ${e} Einer zusammen?`,
        visual: { type: 'dienes', tens: z, ones: e },
        correctAnswer: num,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t1-s2') {
      const centers = [35, 52, 64, 48, 73, 26, 58, 67];
      const center = centers[i % centers.length];
      const gaps = ['top', 'bottom', 'left', 'right'];
      const gap = gaps[i % gaps.length];
      let correctAnswer;
      if (gap === 'top') correctAnswer = center - 10;
      else if (gap === 'bottom') correctAnswer = center + 10;
      else if (gap === 'left') correctAnswer = center - 1;
      else correctAnswer = center + 1;

      tasks.push({
        id: `${stageId}_${i}`,
        type: 'hunderter-kreuz',
        promptText: `Hundertertafel-Kreuz: Welche Zahl gehört ins freie Feld?`,
        speechText: `Auf dem Hundertertafel-Kreuz: Zehner gehen nach oben und unten, Einer nach links und rechts. Welche Zahl fehlt?`,
        correctAnswer,
        payload: {
          center,
          top: center - 10,
          bottom: center + 10,
          left: center - 1,
          right: center + 1,
          gap,
          maxDigits: 3
        }
      });
    } else if (stageId === 'mathe-kl2-t1-s3') {
      const nums = [20 + i * 5, 40 + i * 4, 60 + i * 3].sort((a, b) => a - b);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'sequence-order',
        promptText: `Ordne die Zehnerzahlen der Größe nach:`,
        speechText: `Bringe die Zahlen von klein nach groß in die richtige Reihenfolge.`,
        correctAnswer: nums,
        payload: {
          tiles: [nums[2], nums[0], nums[1]]
        }
      });
    } else if (stageId === 'mathe-kl2-t2-s1') {
      const a = 23 + (i % 10);
      const b = 12 + (i % 5);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${a} + ${b} = ?`,
        speechText: `Rechne aus: Wie viel ist ${a} plus ${b}?`,
        correctAnswer: a + b,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t2-s2') {
      const targets = [6, 7, 9, 12, 14, 15, 17, 18];
      const target = targets[i % targets.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'geld-betrag',
        promptText: `Lege genau ${target} € in dein Portemonnaie:`,
        speechText: `Tippe auf die Münzen und Scheine, um genau ${target} Euro ins Portemonnaie zu legen.`,
        correctAnswer: target,
        payload: {
          mode: 'place',
          target,
          available: [1, 2, 5, 10, 20]
        }
      });
    } else if (stageId === 'mathe-kl2-t2-s3') {
      const a = 28 + (i % 8);
      const b = 7 + (i % 5);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${a} + ${b} = ? (über den Zehner)`,
        speechText: `Rechnen über den Zehner: Wie viel ist ${a} plus ${b}?`,
        correctAnswer: a + b,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t3-s1') {
      const factor = 1 + (i % 9);
      const table = [2, 5, 10][i % 3];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${factor} × ${table} = ?`,
        speechText: `Wie viel ist ${factor} mal ${table}?`,
        visual: { type: 'dot-array', rows: factor, cols: table },
        correctAnswer: factor * table,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t3-s2') {
      const clockTasks = [
        { hours: 3, minutes: 0, ans: '3:00 Uhr', distractors: ['4:00 Uhr', '2:30 Uhr', '12:15 Uhr'] },
        { hours: 8, minutes: 30, ans: '8:30 Uhr (halb 9)', distractors: ['9:30 Uhr', '8:00 Uhr', '7:30 Uhr'] },
        { hours: 12, minutes: 0, ans: '12:00 Uhr', distractors: ['1:00 Uhr', '11:30 Uhr', '6:00 Uhr'] },
        { hours: 6, minutes: 30, ans: '6:30 Uhr (halb 7)', distractors: ['7:30 Uhr', '5:30 Uhr', '6:00 Uhr'] },
        { hours: 9, minutes: 0, ans: '9:00 Uhr', distractors: ['10:00 Uhr', '8:30 Uhr', '9:30 Uhr'] },
        { hours: 2, minutes: 30, ans: '2:30 Uhr (halb 3)', distractors: ['3:30 Uhr', '1:30 Uhr', '2:00 Uhr'] },
        { hours: 10, minutes: 0, ans: '10:00 Uhr', distractors: ['11:00 Uhr', '9:30 Uhr', '10:30 Uhr'] },
        { hours: 4, minutes: 30, ans: '4:30 Uhr (halb 5)', distractors: ['5:30 Uhr', '3:30 Uhr', '4:00 Uhr'] }
      ];
      const cur = clockTasks[i % clockTasks.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie spät ist es auf der Uhr?`,
        speechText: `Schaue auf die Zeiger der Uhr: Wie spät ist es?`,
        visual: { type: 'analog-clock', hours: cur.hours, minutes: cur.minutes },
        correctAnswer: cur.ans,
        payload: {
          choices: makeChoices(cur.ans, cur.distractors)
        }
      });
    } else if (stageId === 'mathe-kl2-t3-s3') {
      const a = 3 + (i % 6);
      const b = 3 + ((i * 2) % 6);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `${a} × ${b} = ?`,
        speechText: `Wie viel ist ${a} mal ${b}?`,
        visual: { type: 'dot-array', rows: a, cols: b },
        correctAnswer: a * b,
        payload: {
          choices: makeChoices(a * b, [a * b - 2, a * b + 4, a * (b - 1) || 12, (a + 1) * b])
        }
      });
    } else {
      // Fallback
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Aufgabe ${i + 1}`,
        speechText: `Aufgabe ${i + 1}`,
        correctAnswer: i + 1,
        payload: { choices: [{ value: i + 1, label: String(i + 1) }] }
      });
    }
  }

  return tasks;
}

// Register Mathe in subjects
registerSubjectContent(
  'mathe',
  { title: 'Rechnen', icon: '🔢', assetId: 'ui-mathe', accent: '#0284c7' },
  MATHE_TOPICS_BY_GRADE,
  generateMatheStageRound
);
