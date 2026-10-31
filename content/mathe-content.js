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
        { id: 'mathe-kl1-t2-s3', title: 'Stufe 3: Zwerg & Riese bis 20', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl1-t3',
      title: 'Nachbarzahlen & Zahlenmauern',
      description: 'Vorgänger, Nachfolger und Zahlenmauern bis 20',
      stages: [
        { id: 'mathe-kl1-t3-s1', title: 'Stufe 1: Nachbarzahlen bis 20', targetScore: 8 },
        { id: 'mathe-kl1-t3-s2', title: 'Stufe 2: Zahlen ordnen bis 20', targetScore: 8 },
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
        { id: 'mathe-kl2-t1-s2', title: 'Stufe 2: Nachbarzehner bis 100', targetScore: 8 },
        { id: 'mathe-kl2-t1-s3', title: 'Stufe 3: Zahlen ordnen bis 100', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl2-t2',
      title: 'Plus & Minus bis 100',
      description: 'Zweistellige Aufgaben schrittweise lösen',
      stages: [
        { id: 'mathe-kl2-t2-s1', title: 'Stufe 1: Rechnen ohne Zehnerübergang', targetScore: 8 },
        { id: 'mathe-kl2-t2-s2', title: 'Stufe 2: Glatte Zehnerzahlen rechnen', targetScore: 8 },
        { id: 'mathe-kl2-t2-s3', title: 'Stufe 3: Rechnen mit Zehnerübergang', targetScore: 8 }
      ]
    },
    {
      id: 'mathe-kl2-t3',
      title: 'Kleines Einmaleins',
      description: 'Malreihen, Quadrataufgaben und Kernaufgaben',
      stages: [
        { id: 'mathe-kl2-t3-s1', title: 'Stufe 1: 2er-, 5er- und 10er-Reihe', targetScore: 8 },
        { id: 'mathe-kl2-t3-s2', title: 'Stufe 2: Quadrat- & Kernaufgaben', targetScore: 8 },
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
        promptText: `Wie viele Punkte siehst du?`,
        speechText: `Wie viele Punkte siehst du auf dem Würfel?`,
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
        speechText: `Zähle die Punkte im Kreis. Wie viele sind es?`,
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
        visual: { assetId: `hand-r-${rightHandCount}` },
        correctAnswer: num,
        payload: {
          choices: makeChoices(num, [num - 1 || 5, num + 1 <= 10 ? num + 1 : 6, 7, 10])
        }
      });
    } else if (stageId === 'mathe-vs-t2-s3') {
      const count = 3 + (i % 8); // 3..10
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Zähle die Tiere: Wie viele sind es?`,
        speechText: `Zähle die Tiere auf der Wiese. Wie viele sind es?`,
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
        correctAnswer: right,
        payload: {
          choices: [
            { value: left, label: `${left} Punkte` },
            { value: right, label: `${right} Punkte` }
          ]
        }
      });
    } else if (stageId === 'mathe-vs-t3-s2') {
      const seq = [1, 2, 1, 2, 1];
      const next = 2;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Was kommt als Nächstes? (1, 2, 1, 2, 1, …)`,
        speechText: `Welche Zahl setzt die Reihe fort? 1, 2, 1, 2, 1...`,
        correctAnswer: next,
        payload: {
          choices: makeChoices(next, [1, 2, 3, 4])
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
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Zahlenhaus 5: ${left} + ? = 5`,
        speechText: `Im Zahlenhaus 5: Wie viel fehlt zu ${left}, damit es 5 wird?`,
        correctAnswer: right,
        payload: {
          roof,
          left,
          gap: 'right',
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t1-s2') {
      const roof = 8 + (i % 3); // 8, 9, 10
      const left = 2 + (i % 6);
      const right = roof - left;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Zahlenhaus ${roof}: ${left} + ? = ${roof}`,
        speechText: `Im Zahlenhaus ${roof}: ${left} plus wie viel ist ${roof}?`,
        correctAnswer: right,
        payload: {
          roof,
          left,
          gap: 'right',
          maxDigits: 2
        }
      });
    } else if (stageId === 'mathe-kl1-t1-s3') {
      const left = 1 + (i % 9);
      const right = 10 - left;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Verliebte Zahl zur 10: ${left} + ? = 10`,
        speechText: `Welche verliebte Zahl gehört zu ${left}, um zusammen 10 zu sein?`,
        correctAnswer: right,
        payload: {
          left,
          sum: 10,
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
      const a = 2 + (i % 4);
      const b = 3;
      const bigA = 10 + a;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Zwerg: ${a}+${b}=${a + b} → Riese: ${bigA} + ${b} = ?`,
        speechText: `Kleine Zwergenaufgabe hilft der Riesenaufgabe: Wie viel ist ${bigA} plus ${b}?`,
        correctAnswer: bigA + b,
        payload: { maxDigits: 2 }
      });
    } else if (stageId === 'mathe-kl1-t3-s1') {
      const n = 11 + (i % 8);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Nachfolger von ${n}: Was kommt nach ${n}?`,
        speechText: `Welche Zahl ist der Nachfolger von ${n}?`,
        correctAnswer: n + 1,
        payload: { maxDigits: 2 }
      });
    } else if (stageId === 'mathe-kl1-t3-s2') {
      const start = 10 + (i % 6);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'sequence-order',
        promptText: `Ordne die Zahlen vorwärts:`,
        speechText: `Ordne die Zahlen von klein nach groß.`,
        correctAnswer: [start, start + 1, start + 2],
        payload: {
          tiles: [start + 2, start, start + 1]
        }
      });
    } else if (stageId === 'mathe-kl1-t3-s3') {
      const base1 = 2 + (i % 4);
      const base2 = 3 + (i % 3);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Zahlenmauer: Mauerstein oben über ${base1} und ${base2} = ?`,
        speechText: `Auf der Zahlenmauer: Wie viel ergibt ${base1} plus ${base2}?`,
        correctAnswer: base1 + base2,
        payload: { maxDigits: 2 }
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
        correctAnswer: num,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t1-s2') {
      const n = 25 + (i * 8);
      const nextTen = Math.ceil(n / 10) * 10;
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Nächster Zehner nach ${n} = ?`,
        speechText: `Welcher glatte Zehner folgt auf die Zahl ${n}?`,
        correctAnswer: nextTen,
        payload: { maxDigits: 3 }
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
      const a = 20 + ((i % 5) * 10);
      const b = 10 + ((i % 4) * 10);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `${a} + ${b} = ?`,
        speechText: `Zehner rechnen: Wie viel ist ${a} plus ${b}?`,
        correctAnswer: a + b,
        payload: { maxDigits: 3 }
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
        correctAnswer: factor * table,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t3-s2') {
      const num = 2 + (i % 8);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'numpad-gap',
        promptText: `Quadrataufgabe: ${num} × ${num} = ?`,
        speechText: `Quadratzahl: Wie viel ist ${num} mal ${num}?`,
        correctAnswer: num * num,
        payload: { maxDigits: 3 }
      });
    } else if (stageId === 'mathe-kl2-t3-s3') {
      const a = 3 + (i % 6);
      const b = 3 + ((i * 2) % 6);
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `${a} × ${b} = ?`,
        speechText: `Wie viel ist ${a} mal ${b}?`,
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
