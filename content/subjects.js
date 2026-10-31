// Extensible Subject and Grade Registry & Stage Generator Dispatcher

export const GRADES = [
  { id: 'vorschule', label: 'Vorschule', shortCode: 'vs' },
  { id: 'klasse1', label: 'Klasse 1', shortCode: 'kl1' },
  { id: 'klasse2', label: 'Klasse 2', shortCode: 'kl2' }
];

const SUBJECT_REGISTRY = new Map();

export function registerSubjectContent(subjectId, metadata, topicsByGrade, generatorFn) {
  SUBJECT_REGISTRY.set(subjectId, {
    id: subjectId,
    title: metadata.title || subjectId,
    icon: metadata.icon || '📚',
    assetId: metadata.assetId || `ui-${subjectId}`,
    accent: metadata.accent || '#0284c7',
    topicsByGrade,
    generatorFn
  });
}

export function getSubjects() {
  return Array.from(SUBJECT_REGISTRY.values());
}

export function getTopicsForSubjectAndGrade(subjectId, gradeId) {
  const sub = SUBJECT_REGISTRY.get(subjectId);
  if (!sub || !sub.topicsByGrade) return [];
  return sub.topicsByGrade[gradeId] || [];
}

export function getStageMeta(stageId) {
  for (const sub of SUBJECT_REGISTRY.values()) {
    for (const [gradeId, topics] of Object.entries(sub.topicsByGrade)) {
      for (const topic of topics) {
        const topicStageIds = topic.stages.map(s => s.id);
        const stageIndex = topicStageIds.indexOf(stageId);
        if (stageIndex >= 0) {
          return {
            subject: sub,
            gradeId,
            topic,
            stage: topic.stages[stageIndex],
            stageIndex,
            topicStageIds
          };
        }
      }
    }
  }
  return null;
}

export function generateStageRound(stageId, options = {}) {
  const meta = getStageMeta(stageId);
  if (!meta || !meta.subject.generatorFn) {
    throw new Error(`Stage not registered: ${stageId}`);
  }
  return meta.subject.generatorFn(stageId, options);
}

export function evaluateTaskAnswer(task, userAnswer) {
  if (task.type === 'sequence-order') {
    const expected = Array.isArray(task.correctAnswer) ? task.correctAnswer : [task.correctAnswer];
    const user = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const isCorrect = expected.length === user.length && expected.every((val, i) => String(val) === String(user[i]));
    return {
      isCorrect,
      expectedDisplay: expected.join(' → '),
      userDisplay: user.join(' → ')
    };
  }

  if (typeof task.correctAnswer === 'number') {
    const userNum = Number(userAnswer);
    const isCorrect = !Number.isNaN(userNum) && userNum === task.correctAnswer;
    return {
      isCorrect,
      expectedDisplay: String(task.correctAnswer),
      userDisplay: String(userAnswer !== undefined && userAnswer !== null ? userAnswer : '')
    };
  }

  const expectedStr = String(task.correctAnswer).trim();
  const userStr = String(userAnswer !== undefined && userAnswer !== null ? userAnswer : '').trim();
  const isCorrect = expectedStr.toLowerCase() === userStr.toLowerCase();

  return {
    isCorrect,
    expectedDisplay: expectedStr,
    userDisplay: userStr
  };
}
