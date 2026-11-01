// Sticker Album catalog: 54 Stage Stickers + 12 Bonus Stickers across 7 Album Pages

const STAGE_STICKER_MAP = {};

const grades = [
  { code: 'vs', title: 'Vorschule' },
  { code: 'kl1', title: 'Klasse 1' },
  { code: 'kl2', title: 'Klasse 2' }
];

const subjects = [
  { code: 'mathe', title: 'Mathe', icon: '🔢' },
  { code: 'deutsch', title: 'Deutsch', icon: '📖' }
];

const PAGES = [];

const gradeIcons = { vs: '🧸', kl1: '🎒', kl2: '🚀' };

for (const sub of subjects) {
  for (const grd of grades) {
    const pageStickers = [];
    for (let t = 1; t <= 3; t++) {
      for (let s = 1; s <= 3; s++) {
        const stageId = `${sub.code}-${grd.code}-t${t}-s${s}`;
        const stickerId = `sticker-${stageId}`;
        const sticker = {
          id: stickerId,
          stageId,
          subjectCode: sub.code,
          gradeCode: grd.code,
          topicIndex: t,
          stageIndex: s,
          label: `${sub.title} ${grd.title} T${t}.${s}`,
          assetId: stickerId
        };
        STAGE_STICKER_MAP[stageId] = sticker;
        pageStickers.push(sticker);
      }
    }
    PAGES.push({
      id: `page-${sub.code}-${grd.code}`,
      title: `${gradeIcons[grd.code]} ${sub.title} ${grd.title}`,
      subjectCode: sub.code,
      gradeCode: grd.code,
      stickers: pageStickers
    });
  }
}

const BONUS_STICKERS = [
  { id: 'sticker-bonus-01', label: 'Goldener Stern', assetId: 'sticker-bonus-01' },
  { id: 'sticker-bonus-02', label: 'Regenbogen-Einhorn', assetId: 'sticker-bonus-02' },
  { id: 'sticker-bonus-03', label: 'Super-Rakete', assetId: 'sticker-bonus-03' },
  { id: 'sticker-bonus-04', label: 'Glücks-Kleeblatt', assetId: 'sticker-bonus-04' },
  { id: 'sticker-bonus-05', label: 'Disco-Kugel', assetId: 'sticker-bonus-05' },
  { id: 'sticker-bonus-06', label: 'Sonnen-Lächeln', assetId: 'sticker-bonus-06' },
  { id: 'sticker-bonus-07', label: 'Zauber-Kristall', assetId: 'sticker-bonus-07' },
  { id: 'sticker-bonus-08', label: 'Pokal des Wissens', assetId: 'sticker-bonus-08' },
  { id: 'sticker-bonus-09', label: 'Weltraum-Alien', assetId: 'sticker-bonus-09' },
  { id: 'sticker-bonus-10', label: 'Schatzkiste', assetId: 'sticker-bonus-10' },
  { id: 'sticker-bonus-11', label: 'Sternschnuppe', assetId: 'sticker-bonus-11' },
  { id: 'sticker-bonus-12', label: 'Meister-Diplom', assetId: 'sticker-bonus-12' }
];

PAGES.push({
  id: 'page-bonus',
  title: '✨ Glitzer-Überraschungen',
  isBonus: true,
  stickers: BONUS_STICKERS
});

export const STICKER_CATALOG = {
  pages: PAGES,
  stageStickerMap: STAGE_STICKER_MAP,
  bonusStickers: BONUS_STICKERS
};

export function getStickerForStage(stageId) {
  return STAGE_STICKER_MAP[stageId] || null;
}
