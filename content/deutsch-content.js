// Deutsch Curriculum: 27 Stages across Vorschule, Klasse 1, and Klasse 2

import { registerSubjectContent } from './subjects.js';

export const DEUTSCH_TOPICS_BY_GRADE = {
  vorschule: [
    {
      id: 'deutsch-vs-t1',
      title: 'Anlaute hören',
      description: 'Mit welchem Buchstaben beginnt das Wort?',
      stages: [
        { id: 'deutsch-vs-t1-s1', title: 'Stufe 1: Anlaute M, S, L hören', targetScore: 8 },
        { id: 'deutsch-vs-t1-s2', title: 'Stufe 2: Vokale A, O, E, I, U hören', targetScore: 8 },
        { id: 'deutsch-vs-t1-s3', title: 'Stufe 3: Welches Wort klingt am Anfang gleich?', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-vs-t2',
      title: 'Silben schwingen & zählen',
      description: 'Wörter klatschen und Silbenanzahl bestimmen',
      stages: [
        { id: 'deutsch-vs-t2-s1', title: 'Stufe 1: 1 oder 2 Silben klatschen', targetScore: 8 },
        { id: 'deutsch-vs-t2-s2', title: 'Stufe 2: 2 oder 3 Silben klatschen', targetScore: 8 },
        { id: 'deutsch-vs-t2-s3', title: 'Stufe 3: Silbenkönig (1, 2 oder 3 Silben)', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-vs-t3',
      title: 'Reimwörter & Sprachspiel',
      description: 'Gleiche Endungen und Reimpaare entdecken',
      stages: [
        { id: 'deutsch-vs-t3-s1', title: 'Stufe 1: Was reimt sich auf Maus?', targetScore: 8 },
        { id: 'deutsch-vs-t3-s2', title: 'Stufe 2: Was reimt sich auf Stern?', targetScore: 8 },
        { id: 'deutsch-vs-t3-s3', title: 'Stufe 3: Was reimt sich nicht?', targetScore: 8 }
      ]
    }
  ],
  klasse1: [
    {
      id: 'deutsch-kl1-t1',
      title: 'Silben & erste Fibel-Wörter',
      description: 'Zusammenlauten und erste Wörter lesen',
      stages: [
        { id: 'deutsch-kl1-t1-s1', title: 'Stufe 1: Erste Silben lesen', targetScore: 8 },
        { id: 'deutsch-kl1-t1-s2', title: 'Stufe 2: Zweisilbige Fibel-Wörter', targetScore: 8 },
        { id: 'deutsch-kl1-t1-s3', title: 'Stufe 3: Silbenkönige krönen', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-kl1-t2',
      title: 'Fehlende Silbe & Wortbau',
      description: 'Wörter aus Silbenkacheln zusammensetzen',
      stages: [
        { id: 'deutsch-kl1-t2-s1', title: 'Stufe 1: Erste Silbe fehlt', targetScore: 8 },
        { id: 'deutsch-kl1-t2-s2', title: 'Stufe 2: Zweite Silbe fehlt', targetScore: 8 },
        { id: 'deutsch-kl1-t2-s3', title: 'Stufe 3: Schüttelwörter lösen', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-kl1-t3',
      title: 'Begleiter der, die, das',
      description: 'Artikel zu Tieren, Menschen und Dingen zuordnen',
      stages: [
        { id: 'deutsch-kl1-t3-s1', title: 'Stufe 1: Begleiter bei Tieren', targetScore: 8 },
        { id: 'deutsch-kl1-t3-s2', title: 'Stufe 2: Begleiter bei Dingen & Natur', targetScore: 8 },
        { id: 'deutsch-kl1-t3-s3', title: 'Stufe 3: Der, die oder das Quiz', targetScore: 8 }
      ]
    }
  ],
  klasse2: [
    {
      id: 'deutsch-kl2-t1',
      title: 'Wortarten erkennen',
      description: 'Nomen, Verben und Adjektive unterscheiden',
      stages: [
        { id: 'deutsch-kl2-t1-s1', title: 'Stufe 1: Nomen (Namenwörter) großschreiben', targetScore: 8 },
        { id: 'deutsch-kl2-t1-s2', title: 'Stufe 2: Verben (Tuwörter) finden', targetScore: 8 },
        { id: 'deutsch-kl2-t1-s3', title: 'Stufe 3: Adjektive (Wie-Wörter) erkennen', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-kl2-t2',
      title: 'Rechtschreib-Spürnasen',
      description: 'Ei/Ie und Umlaute durch Ableiten richtig schreiben',
      stages: [
        { id: 'deutsch-kl2-t2-s1', title: 'Stufe 1: Ei oder Ie einsetzen', targetScore: 8 },
        { id: 'deutsch-kl2-t2-s2', title: 'Stufe 2: Umlaute ableiten (A/Ä, O/Ö, U/Ü)', targetScore: 8 },
        { id: 'deutsch-kl2-t2-s3', title: 'Stufe 3: Endungen d/t oder g/k verlängern', targetScore: 8 }
      ]
    },
    {
      id: 'deutsch-kl2-t3',
      title: 'Satzbau & Lesesinn',
      description: 'Satzteile ordnen, Satzzeichen setzen und Sinn verstehen',
      stages: [
        { id: 'deutsch-kl2-t3-s1', title: 'Stufe 1: Satzteile richtig ordnen', targetScore: 8 },
        { id: 'deutsch-kl2-t3-s2', title: 'Stufe 2: Passendes Satzzeichen setzen (. / ? / !)', targetScore: 8 },
        { id: 'deutsch-kl2-t3-s3', title: 'Stufe 3: Welcher Satz stimmt?', targetScore: 8 }
      ]
    }
  ]
};

function makeChoices(correctValue, distractors, labels = null) {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => String(d) !== String(correctValue))));
  const picked = uniqueDistractors.slice(0, 3);
  const all = [correctValue, ...picked].sort(() => Math.random() - 0.5);
  return all.map(v => ({
    value: v,
    label: labels && labels[v] ? labels[v] : String(v)
  }));
}

export function generateDeutschStageRound(stageId, options = {}) {
  const tasks = [];

  for (let i = 0; i < 8; i++) {
    // --- VORSCHULE ---
    if (stageId === 'deutsch-vs-t1-s1') {
      const items = [
        { letter: 'M', word: 'Maus', assetId: 'card-maus' },
        { letter: 'M', word: 'Mond', assetId: 'card-mond' },
        { letter: 'S', word: 'Sonne', assetId: 'card-sonne' },
        { letter: 'S', word: 'Stern', assetId: 'card-stern' },
        { letter: 'L', word: 'Lama', assetId: 'card-lama' },
        { letter: 'L', word: 'Limo', assetId: 'card-limo' },
        { letter: 'M', word: 'Maus', assetId: 'card-maus' },
        { letter: 'S', word: 'Sonne', assetId: 'card-sonne' }
      ];
      const item = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Mit welchem Laut beginnt ${item.word}?`,
        speechText: `Mit welchem Laut beginnt das Wort ${item.word}?`,
        visual: { assetId: item.assetId },
        correctAnswer: item.letter,
        payload: {
          choices: makeChoices(item.letter, ['M', 'S', 'L', 'B', 'T'])
        }
      });
    } else if (stageId === 'deutsch-vs-t1-s2') {
      const items = [
        { letter: 'A', word: 'Apfel', assetId: 'card-apfel' },
        { letter: 'A', word: 'Auto', assetId: 'card-auto' },
        { letter: 'U', word: 'Uhr', assetId: 'card-uhr' },
        { letter: 'A', word: 'Apfel', assetId: 'card-apfel' },
        { letter: 'O', word: 'Oma' },
        { letter: 'E', word: 'Esel' },
        { letter: 'I', word: 'Igel' },
        { letter: 'A', word: 'Auto', assetId: 'card-auto' }
      ];
      const item = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welcher Vokal am Anfang: ${item.word}?`,
        speechText: `Welcher Buchstabe klingt am Anfang von ${item.word}?`,
        visual: item.assetId ? { assetId: item.assetId } : null,
        correctAnswer: item.letter,
        payload: {
          choices: makeChoices(item.letter, ['A', 'E', 'I', 'O', 'U'])
        }
      });
    } else if (stageId === 'deutsch-vs-t1-s3') {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welches Bild beginnt wie MAUS mit M?`,
        speechText: `Welches Bild beginnt mit demselben Laut wie Maus?`,
        visual: { assetId: 'card-maus' },
        correctAnswer: 'Mond',
        payload: {
          choices: [
            { value: 'Mond', label: 'Mond', assetId: 'card-mond' },
            { value: 'Sonne', label: 'Sonne', assetId: 'card-sonne' },
            { value: 'Ball', label: 'Ball', assetId: 'card-ball' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t2-s1') {
      const items = [
        { word: 'Hund', count: 1, assetId: 'card-hund' },
        { word: 'Katze', count: 2, assetId: 'card-katze' },
        { word: 'Ball', count: 1, assetId: 'card-ball' },
        { word: 'Lama', count: 2, assetId: 'card-lama' },
        { word: 'Mond', count: 1, assetId: 'card-mond' },
        { word: 'Sonne', count: 2, assetId: 'card-sonne' },
        { word: 'Baum', count: 1, assetId: 'card-baum' },
        { word: 'Auto', count: 2, assetId: 'card-auto' }
      ];
      const item = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Silben klatschst du bei: ${item.word}?`,
        speechText: `Klatsche das Wort ${item.word}. Hat es eine Silbe oder zwei Silben?`,
        visual: { assetId: item.assetId },
        correctAnswer: item.count,
        payload: {
          choices: [
            { value: 1, label: '1 Silbe (👏)' },
            { value: 2, label: '2 Silben (👏 👏)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t2-s2') {
      const items = [
        { word: 'Tomate', count: 3, assetId: 'card-tomate' },
        { word: 'Lama', count: 2, assetId: 'card-lama' },
        { word: 'Banane', count: 3, assetId: 'card-banane' },
        { word: 'Blume', count: 2, assetId: 'card-blume' },
        { word: 'Tomate', count: 3, assetId: 'card-tomate' },
        { word: 'Katze', count: 2, assetId: 'card-katze' },
        { word: 'Banane', count: 3, assetId: 'card-banane' },
        { word: 'Sonne', count: 2, assetId: 'card-sonne' }
      ];
      const item = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Wie viele Silben hat: ${item.word}?`,
        speechText: `Klatsche das Wort ${item.word}. Sind es zwei Silben oder drei Silben?`,
        visual: { assetId: item.assetId },
        correctAnswer: item.count,
        payload: {
          choices: [
            { value: 2, label: '2 Silben (👏 👏)' },
            { value: 3, label: '3 Silben (👏 👏 👏)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t2-s3') {
      const items = [
        { word: 'Hund', count: 1, assetId: 'card-hund' },
        { word: 'Katze', count: 2, assetId: 'card-katze' },
        { word: 'Tomate', count: 3, assetId: 'card-tomate' },
        { word: 'Fisch', count: 1, assetId: 'card-fisch' },
        { word: 'Banane', count: 3, assetId: 'card-banane' },
        { word: 'Auto', count: 2, assetId: 'card-auto' },
        { word: 'Buch', count: 1, assetId: 'card-buch' },
        { word: 'Blume', count: 2, assetId: 'card-blume' }
      ];
      const item = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Zähle die Silben von: ${item.word}`,
        speechText: `Zähle die Silben von ${item.word}: eins, zwei oder drei?`,
        visual: { assetId: item.assetId },
        correctAnswer: item.count,
        payload: {
          choices: [
            { value: 1, label: '1 Silbe' },
            { value: 2, label: '2 Silben' },
            { value: 3, label: '3 Silben' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t3-s1') {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Was reimt sich auf MAUS?`,
        speechText: `Was reimt sich auf Maus? Maus und...`,
        visual: { assetId: 'card-maus' },
        correctAnswer: 'Haus',
        payload: {
          choices: [
            { value: 'Haus', label: 'Haus', assetId: 'card-haus' },
            { value: 'Hund', label: 'Hund', assetId: 'card-hund' },
            { value: 'Baum', label: 'Baum', assetId: 'card-baum' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t3-s2') {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Was reimt sich auf KATZE?`,
        speechText: `Was reimt sich auf Katze?`,
        visual: { assetId: 'card-katze' },
        correctAnswer: 'Tatze',
        payload: {
          choices: [
            { value: 'Tatze', label: 'Tatze' },
            { value: 'Hund', label: 'Hund', assetId: 'card-hund' },
            { value: 'Sonne', label: 'Sonne', assetId: 'card-sonne' }
          ]
        }
      });
    } else if (stageId === 'deutsch-vs-t3-s3') {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welches Wort reimt sich NICHT auf Haus & Maus?`,
        speechText: `Welches Wort reimt sich nicht auf Haus und Maus?`,
        correctAnswer: 'Hund',
        payload: {
          choices: [
            { value: 'Hund', label: 'Hund', assetId: 'card-hund' },
            { value: 'Laus', label: 'Laus' },
            { value: 'Strauß', label: 'Strauß' }
          ]
        }
      });
    }

    // --- KLASSE 1 ---
    else if (stageId === 'deutsch-kl1-t1-s1') {
      const pairs = [
        { c: 'M', v: 'a', ans: 'Ma' },
        { c: 'M', v: 'o', ans: 'Mo' },
        { c: 'S', v: 'a', ans: 'Sa' },
        { c: 'S', v: 'e', ans: 'Se' },
        { c: 'L', v: 'a', ans: 'La' },
        { c: 'L', v: 'i', ans: 'Li' },
        { c: 'M', v: 'u', ans: 'Mu' },
        { c: 'S', v: 'o', ans: 'So' }
      ];
      const p = pairs[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Lies laut zusammen: ${p.c} + ${p.v} = ?`,
        speechText: `Lies laut zusammen: Buchstabe ${p.c} und ${p.v}. Wie heißt die Silbe?`,
        correctAnswer: p.ans,
        payload: {
          choices: makeChoices(p.ans, ['Ma', 'Mo', 'Sa', 'Se', 'La', 'Li', 'Mu'])
        }
      });
    } else if (stageId === 'deutsch-kl1-t1-s2') {
      const words = ['Mama', 'Lama', 'Limo', 'Mimi', 'Salat', 'Tomate', 'Oma', 'Sonne'];
      const current = words[i % words.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welches Wort steht hier: [${current}]?`,
        speechText: `Lies das Wort ${current}. Tippe auf das richtige Wort.`,
        correctAnswer: current,
        payload: {
          choices: makeChoices(current, ['Mama', 'Lama', 'Limo', 'Mimi', 'Salat', 'Sonne'])
        }
      });
    } else if (stageId === 'deutsch-kl1-t1-s3') {
      const items = [
        { word: 'HAUS', tokens: ['H', 'AU', 'S'], kings: [1] },
        { word: 'SONNE', tokens: ['S', 'O', 'NN', 'E'], kings: [1, 3] },
        { word: 'BAUM', tokens: ['B', 'AU', 'M'], kings: [1] },
        { word: 'MOND', tokens: ['M', 'O', 'ND'], kings: [1] },
        { word: 'FISCH', tokens: ['F', 'I', 'SCH'], kings: [1] },
        { word: 'BLUME', tokens: ['BL', 'U', 'M', 'E'], kings: [1, 3] },
        { word: 'MAUS', tokens: ['M', 'AU', 'S'], kings: [1] },
        { word: 'RAKETE', tokens: ['R', 'A', 'K', 'E', 'T', 'E'], kings: [1, 3, 5] }
      ];
      const cur = items[i % items.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'silbenkoenig',
        promptText: `Setze die Krone 👑 auf alle Silbenkönige:`,
        speechText: `Silbenkönige sind die Klingenlaute. Setze jedem Silbenkönig eine Krone auf!`,
        correctAnswer: cur.kings,
        payload: {
          word: cur.word,
          tokens: cur.tokens,
          correctKings: cur.kings
        }
      });
    } else if (stageId === 'deutsch-kl1-t2-s1') {
      const puzzles = [
        { full: 'Mama', missing: 'Ma', remain: 'ma' },
        { full: 'Lama', missing: 'La', remain: 'ma' },
        { full: 'Limo', missing: 'Li', remain: 'mo' },
        { full: 'Salat', missing: 'Sa', remain: 'lat' },
        { full: 'Sonne', missing: 'Son', remain: 'ne' },
        { full: 'Tomate', missing: 'To', remain: 'mate' },
        { full: 'Banane', missing: 'Ba', remain: 'nane' },
        { full: 'Mama', missing: 'Ma', remain: 'ma' }
      ];
      const p = puzzles[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'tile-builder',
        promptText: `Ergänze die 1. Silbe für [${p.full}]: [ ? ] + [${p.remain}]`,
        speechText: `Welche Silbe fehlt am Anfang von ${p.full}?`,
        correctAnswer: p.missing,
        payload: {
          tiles: [p.missing, 'So', 'Mu', 'Le'].sort(() => Math.random() - 0.5)
        }
      });
    } else if (stageId === 'deutsch-kl1-t2-s2') {
      const puzzles = [
        { full: 'Mama', first: 'Ma', missing: 'ma' },
        { full: 'Lama', first: 'La', missing: 'ma' },
        { full: 'Limo', first: 'Li', missing: 'mo' },
        { full: 'Oma', first: 'O', missing: 'ma' },
        { full: 'Salat', first: 'Sa', missing: 'lat' },
        { full: 'Blume', first: 'Blu', missing: 'me' },
        { full: 'Katze', first: 'Kat', missing: 'ze' },
        { full: 'Sonne', first: 'Son', missing: 'ne' }
      ];
      const p = puzzles[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'tile-builder',
        promptText: `Ergänze die 2. Silbe für [${p.full}]: [${p.first}] + [ ? ]`,
        speechText: `Welche Silbe fehlt am Ende von ${p.full}?`,
        correctAnswer: p.missing,
        payload: {
          tiles: [p.missing, 'to', 'la', 'se'].sort(() => Math.random() - 0.5)
        }
      });
    } else if (stageId === 'deutsch-kl1-t2-s3') {
      const puzzles = [
        { word: 'OMA', scrambled: ['M', 'A', 'O'], assetId: 'card-oma' },
        { word: 'SONNE', scrambled: ['N', 'O', 'S', 'E', 'N'], assetId: 'card-sonne' },
        { word: 'MOND', scrambled: ['N', 'D', 'M', 'O'], assetId: 'card-mond' },
        { word: 'BAUM', scrambled: ['U', 'M', 'B', 'A'], assetId: 'card-baum' },
        { word: 'FISCH', scrambled: ['S', 'F', 'I', 'H', 'C'], assetId: 'card-fisch' },
        { word: 'BLUME', scrambled: ['L', 'M', 'B', 'E', 'U'], assetId: 'card-blume' },
        { word: 'MAUS', scrambled: ['U', 'S', 'M', 'A'], assetId: 'card-maus' },
        { word: 'BALL', scrambled: ['L', 'B', 'A', 'L'], assetId: 'card-ball' }
      ];
      const cur = puzzles[i % puzzles.length];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'schuettelwort',
        promptText: `Schüttelwort: Setze das Wort zusammen!`,
        speechText: `Die Buchstaben haben sich geschüttelt. Bringe sie in die richtige Reihenfolge!`,
        correctAnswer: cur.word,
        payload: {
          word: cur.word,
          scrambled: cur.scrambled,
          assetId: cur.assetId
        }
      });
    } else if (stageId === 'deutsch-kl1-t3-s1') {
      const items = [
        { noun: 'Hund', article: 'der', assetId: 'card-hund' },
        { noun: 'Katze', article: 'die', assetId: 'card-katze' },
        { noun: 'Lama', article: 'das', assetId: 'card-lama' },
        { noun: 'Fisch', article: 'der', assetId: 'card-fisch' },
        { noun: 'Maus', article: 'die', assetId: 'card-maus' },
        { noun: 'Hund', article: 'der', assetId: 'card-hund' },
        { noun: 'Katze', article: 'die', assetId: 'card-katze' },
        { noun: 'Lama', article: 'das', assetId: 'card-lama' }
      ];
      const it = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welcher Begleiter passt: ... ${it.noun}?`,
        speechText: `Heißt es der, die oder das ${it.noun}?`,
        visual: { assetId: it.assetId },
        correctAnswer: it.article,
        payload: {
          choices: [
            { value: 'der', label: 'der' },
            { value: 'die', label: 'die' },
            { value: 'das', label: 'das' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl1-t3-s2') {
      const items = [
        { noun: 'Sonne', article: 'die', assetId: 'card-sonne' },
        { noun: 'Mond', article: 'der', assetId: 'card-mond' },
        { noun: 'Buch', article: 'das', assetId: 'card-buch' },
        { noun: 'Baum', article: 'der', assetId: 'card-baum' },
        { noun: 'Blume', article: 'die', assetId: 'card-blume' },
        { noun: 'Haus', article: 'das', assetId: 'card-haus' },
        { noun: 'Auto', article: 'das', assetId: 'card-auto' },
        { noun: 'Ball', article: 'der', assetId: 'card-ball' }
      ];
      const it = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welcher Begleiter passt: ... ${it.noun}?`,
        speechText: `Heißt es der, die oder das ${it.noun}?`,
        visual: { assetId: it.assetId },
        correctAnswer: it.article,
        payload: {
          choices: [
            { value: 'der', label: 'der' },
            { value: 'die', label: 'die' },
            { value: 'das', label: 'das' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl1-t3-s3') {
      const items = [
        { noun: 'Apfel', article: 'der', assetId: 'card-apfel' },
        { noun: 'Uhr', article: 'die', assetId: 'card-uhr' },
        { noun: 'Zug', article: 'der', assetId: 'card-zug' },
        { noun: 'Stern', article: 'der', assetId: 'card-stern' },
        { noun: 'Tomate', article: 'die', assetId: 'card-tomate' },
        { noun: 'Limo', article: 'die', assetId: 'card-limo' },
        { noun: 'Buch', article: 'das', assetId: 'card-buch' },
        { noun: 'Haus', article: 'das', assetId: 'card-haus' }
      ];
      const it = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Der, die oder das: ... ${it.noun}?`,
        speechText: `Heißt es der, die oder das ${it.noun}?`,
        visual: { assetId: it.assetId },
        correctAnswer: it.article,
        payload: {
          choices: [
            { value: 'der', label: 'der' },
            { value: 'die', label: 'die' },
            { value: 'das', label: 'das' }
          ]
        }
      });
    }

    // --- KLASSE 2 ---
    else if (stageId === 'deutsch-kl2-t1-s1') {
      const items = [
        { word: 'Hund', isNoun: true },
        { word: 'rennen', isNoun: false },
        { word: 'Baum', isNoun: true },
        { word: 'schnell', isNoun: false },
        { word: 'Schule', isNoun: true },
        { word: 'spielen', isNoun: false },
        { word: 'Katze', isNoun: true },
        { word: 'bunt', isNoun: false }
      ];
      const it = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Ist [${it.word}] ein Nomen (Namenwort)?`,
        speechText: `Ist das Wort ${it.word} ein Nomen? Nomen schreibt man mit großem Anfangsbuchstaben.`,
        correctAnswer: it.isNoun ? 'Ja' : 'Nein',
        payload: {
          choices: [
            { value: 'Ja', label: 'Ja (Nomen)' },
            { value: 'Nein', label: 'Nein (kein Nomen)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t1-s2') {
      const words = [
        { word: 'laufen', type: 'Verb' },
        { word: 'Buch', type: 'Nomen' },
        { word: 'rechnen', type: 'Verb' },
        { word: 'Sonne', type: 'Nomen' },
        { word: 'lachen', type: 'Verb' },
        { word: 'Tisch', type: 'Nomen' },
        { word: 'schreiben', type: 'Verb' },
        { word: 'Haus', type: 'Nomen' }
      ];
      const cur = words[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Was für ein Wort ist [${cur.word}]?`,
        speechText: `Was für ein Wort ist ${cur.word}? Nomen oder Verb?`,
        correctAnswer: cur.type,
        payload: {
          choices: [
            { value: 'Verb', label: 'Verb (Tuwort)' },
            { value: 'Nomen', label: 'Nomen (Namenwort)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t1-s3') {
      const words = [
        { word: 'bunt', type: 'Adjektiv' },
        { word: 'schnell', type: 'Adjektiv' },
        { word: 'Hund', type: 'Nomen' },
        { word: 'springen', type: 'Verb' },
        { word: 'leise', type: 'Adjektiv' },
        { word: 'Baum', type: 'Nomen' },
        { word: 'schlafen', type: 'Verb' },
        { word: 'mutig', type: 'Adjektiv' }
      ];
      const cur = words[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Bestimme die Wortart von [${cur.word}]:`,
        speechText: `Welche Wortart ist ${cur.word}? Nomen, Verb oder Adjektiv?`,
        correctAnswer: cur.type,
        payload: {
          choices: [
            { value: 'Nomen', label: 'Nomen' },
            { value: 'Verb', label: 'Verb' },
            { value: 'Adjektiv', label: 'Adjektiv (Wie-Wort)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t2-s1') {
      const words = [
        { display: 'B_ne (Insekt)', ans: 'ie', choices: ['ie', 'ei'] },
        { display: 'St_n (am Boden)', ans: 'ei', choices: ['ei', 'ie'] },
        { display: 'L_d (Musik)', ans: 'ie', choices: ['ie', 'ei'] },
        { display: 'Kstr_ch (Farbe)', ans: 'ei', choices: ['ei', 'ie'] },
        { display: 'W_se (grün)', ans: 'ie', choices: ['ie', 'ei'] },
        { display: 'B_n (Körperteil)', ans: 'ei', choices: ['ei', 'ie'] },
        { display: 'Br_f (Post)', ans: 'ie', choices: ['ie', 'ei'] },
        { display: 'Kl_d (Anziehen)', ans: 'ei', choices: ['ei', 'ie'] }
      ];
      const cur = words[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Ei oder Ie: ${cur.display}`,
        speechText: `Schreibt man das Wort mit Ei oder mit langem Ie?`,
        correctAnswer: cur.ans,
        payload: {
          choices: [
            { value: 'ei', label: 'ei' },
            { value: 'ie', label: 'ie' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t2-s2') {
      const items = [
        { single: 'Baum', pluralPrompt: 'Ein Baum, viele B...me', ans: 'äu' },
        { single: 'Hand', pluralPrompt: 'Eine Hand, zwei H...nde', ans: 'ä' },
        { single: 'Haus', pluralPrompt: 'Ein Haus, viele H...ser', ans: 'äu' },
        { single: 'Buch', pluralPrompt: 'Ein Buch, zwei B...cher', ans: 'ü' },
        { single: 'Vogel', pluralPrompt: 'Ein Vogel, viele V...gel', ans: 'ö' },
        { single: 'Apfel', pluralPrompt: 'Ein Apfel, zwei ...pfel', ans: 'Ä' },
        { single: 'Maus', pluralPrompt: 'Eine Maus, viele M...se', ans: 'äu' },
        { single: 'Ball', pluralPrompt: 'Ein Ball, zwei B...lle', ans: 'ä' }
      ];
      const cur = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Umlaut ableiten: ${cur.pluralPrompt}`,
        speechText: `Welcher Umlaut gehört in das Mehrzahl-Wort? Leite vom Grundwort ${cur.single} ab.`,
        correctAnswer: cur.ans,
        payload: {
          choices: makeChoices(cur.ans, ['ä', 'ö', 'ü', 'äu', 'e'])
        }
      });
    } else if (stageId === 'deutsch-kl2-t2-s3') {
      const items = [
        { word: 'Hun... (Hunde)', ans: 'd', choices: ['d', 't'] },
        { word: 'Zel... (Zelte)', ans: 't', choices: ['t', 'd'] },
        { word: 'Ber... (Berge)', ans: 'g', choices: ['g', 'k'] },
        { word: 'Balan... (Bank/Bänke)', ans: 'k', choices: ['k', 'g'] },
        { word: 'Brot... (Brote)', ans: 't', choices: ['t', 'd'] },
        { word: 'Wal... (Wälder)', ans: 'd', choices: ['d', 't'] },
        { word: 'Könn... (Könige)', ans: 'g', choices: ['g', 'k'] },
        { word: 'Pfer... (Pferde)', ans: 'd', choices: ['d', 't'] }
      ];
      const cur = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Verlängere das Wort: ${cur.word}`,
        speechText: `Verlängere das Wort. Welcher Buchstabe kommt ans Ende?`,
        correctAnswer: cur.ans,
        payload: {
          choices: [
            { value: cur.choices[0], label: cur.choices[0] },
            { value: cur.choices[1], label: cur.choices[1] }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t3-s1') {
      const sentences = [
        ['Die Katze', 'schläft', 'im Korb.'],
        ['Der Hund', 'spielt', 'mit dem Ball.'],
        ['Leo', 'liest', 'ein spannendes Buch.'],
        ['Die Sonne', 'scheint', 'am blauen Himmel.'],
        ['Wir', 'rechnen', 'fleißig mit Zahlen.'],
        ['Die Maus', 'sucht', 'ein Stück Käse.'],
        ['Mama', 'kocht', 'leckere Tomatensuppe.'],
        ['Der Vogel', 'singt', 'auf dem Baum.']
      ];
      const cur = sentences[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'sequence-order',
        promptText: `Baue einen vollständigen Satz:`,
        speechText: `Bringe die Satzteile in die richtige Reihenfolge, damit ein Satz entsteht.`,
        correctAnswer: cur,
        payload: {
          tiles: [...cur].sort(() => Math.random() - 0.5)
        }
      });
    } else if (stageId === 'deutsch-kl2-t3-s2') {
      const items = [
        { sentence: 'Wie heißt du', ans: '?', choices: ['?', '.', '!'] },
        { sentence: 'Die Katze schnurrt', ans: '.', choices: ['.', '?', '!'] },
        { sentence: 'Pass jetzt gut auf', ans: '!', choices: ['!', '.', '?'] },
        { sentence: 'Möchtest du einen Apfel', ans: '?', choices: ['?', '.', '!'] },
        { sentence: 'Die Sonne geht auf', ans: '.', choices: ['.', '?', '!'] },
        { sentence: 'Hilfe, ich falle', ans: '!', choices: ['!', '.', '?'] },
        { sentence: 'Wann fahren wir los', ans: '?', choices: ['?', '.', '!'] },
        { sentence: 'Ich mag Tiere sehr gern', ans: '.', choices: ['.', '?', '!'] }
      ];
      const cur = items[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Welches Satzzeichen gehört ans Ende: "${cur.sentence} ..."?`,
        speechText: `Welches Satzzeichen gehört an das Ende des Satzes: Punkt, Fragezeichen oder Ausrufezeichen?`,
        correctAnswer: cur.ans,
        payload: {
          choices: [
            { value: '.', label: '. (Punkt)' },
            { value: '?', label: '? (Fragezeichen)' },
            { value: '!', label: '! (Ausrufezeichen)' }
          ]
        }
      });
    } else if (stageId === 'deutsch-kl2-t3-s3') {
      const questions = [
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Fische schwimmen im Wasser.',
          distractors: ['Fische fliegen auf Bäume.', 'Wasser schwimmt im Fisch.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Der Hund bellt laut.',
          distractors: ['Der Hund miaut leise.', 'Das Haus bellt laut.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Im Sommer ist es oft warm.',
          distractors: ['Im Sommer schneit es meistens.', 'Der Sommer schwimmt im See.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Vögel bauen Nester.',
          distractors: ['Nester fliegen in die Luft.', 'Vögel kochen Suppe.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Wir lesen Bücher in der Schule.',
          distractors: ['Bücher lesen Kinder im Wald.', 'Schulen rennen im Buch.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Die Sonne leuchtet am Tag.',
          distractors: ['Der Mond scheint am Mittag.', 'Die Sonne friert im Wasser.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Autos fahren auf Straßen.',
          distractors: ['Straßen fahren auf Autos.', 'Autos schwimmen auf Bäume.']
        },
        {
          prompt: 'Welcher Satz ist sinnvoll und richtig?',
          correct: 'Bäume haben grüne Blätter.',
          distractors: ['Blätter essen große Bäume.', 'Bäume bellen am Zaun.']
        }
      ];
      const q = questions[i];
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: q.prompt,
        speechText: `Welcher der Sätze ergibt einen echten Sinn?`,
        correctAnswer: q.correct,
        payload: {
          choices: makeChoices(q.correct, q.distractors)
        }
      });
    } else {
      tasks.push({
        id: `${stageId}_${i}`,
        type: 'choice-cards',
        promptText: `Aufgabe ${i + 1}`,
        speechText: `Aufgabe ${i + 1}`,
        correctAnswer: 'A',
        payload: { choices: [{ value: 'A', label: 'A' }] }
      });
    }
  }

  return tasks;
}

// Register Deutsch in subjects
registerSubjectContent(
  'deutsch',
  { title: 'Deutsch', icon: '📖', assetId: 'ui-deutsch', accent: '#0d9488' },
  DEUTSCH_TOPICS_BY_GRADE,
  generateDeutschStageRound
);
