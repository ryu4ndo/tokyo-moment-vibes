/** Home "Moment" themes — user picks what kind of Tokyo experience they want */
export const MOMENTS = [
  {
    id: 'tokyo-night',
    icon: '🌃',
    labelJa: '東京の夜を体験',
    labelEn: 'Experience Tokyo Night',
    moodKey: '🌃 深夜東京を感じたい',
    categories: ['nightlife', 'wine', 'walk'],
  },
  {
    id: 'food-adventure',
    icon: '🍣',
    labelJa: 'フードアドベンチャー',
    labelEn: 'Food Adventure',
    moodKey: '✨ ローカル東京を感じたい',
    categories: ['food', 'nightlife'],
  },
  {
    id: 'hidden-bars',
    icon: '🍸',
    labelJa: '隠れ家バー',
    labelEn: 'Hidden Bars',
    moodKey: '🍷 しっぽり飲みたい',
    categories: ['wine', 'nightlife'],
  },
  {
    id: 'cafe-hopping',
    icon: '☕',
    labelJa: 'カフェ巡り',
    labelEn: 'Cafe Hopping',
    moodKey: '☕ 一人で落ち着きたい',
    categories: ['cafe', 'walk'],
  },
  {
    id: 'traditional',
    icon: '🏮',
    labelJa: '伝統的な東京',
    labelEn: 'Traditional Tokyo',
    moodKey: '✨ ローカル東京を感じたい',
    categories: ['culture', 'walk', 'food'],
  },
  {
    id: 'seasonal',
    icon: '🌸',
    labelJa: '季節の体験',
    labelEn: 'Seasonal Experience',
    moodKey: '🚶 雨の夜を歩きたい',
    categories: ['walk', 'culture'],
  },
  {
    id: 'festivals',
    icon: '🎆',
    labelJa: '祭り・イベント',
    labelEn: 'Festivals & Events',
    moodKey: '✨ ローカル東京を感じたい',
    categories: ['culture', 'nightlife'],
  },
  {
    id: 'shopping',
    icon: '🛍',
    labelJa: 'ショッピング',
    labelEn: 'Shopping',
    moodKey: '✨ ローカル東京を感じたい',
    categories: ['walk', 'cafe'],
  },
  {
    id: 'scenic',
    icon: '🌅',
    labelJa: '絶景スポット',
    labelEn: 'Scenic Views',
    moodKey: '🌃 深夜東京を感じたい',
    categories: ['walk', 'culture'],
  },
  {
    id: 'art',
    icon: '🎨',
    labelJa: 'アート・美術館',
    labelEn: 'Art & Museums',
    moodKey: '☕ 一人で落ち着きたい',
    categories: ['culture', 'cafe'],
  },
  {
    id: 'walking',
    icon: '🚶',
    labelJa: 'ウォーキングツアー',
    labelEn: 'Walking Tour',
    moodKey: '🚶 雨の夜を歩きたい',
    categories: ['walk', 'culture'],
  },
  {
    id: 'late-night-eats',
    icon: '🍜',
    labelJa: '深夜グルメ',
    labelEn: 'Late Night Eats',
    moodKey: '🌃 深夜東京を感じたい',
    categories: ['food', 'nightlife'],
  },
  {
    id: 'photo',
    icon: '📸',
    labelJa: 'フォトスポット',
    labelEn: 'Photo Spots',
    moodKey: '✨ ローカル東京を感じたい',
    categories: ['walk', 'culture'],
  },
  {
    id: 'surprise',
    icon: '✨',
    labelJa: 'サプライズ',
    labelEn: 'Surprise Me',
    moodKey: null,
    surprise: true,
  },
];

export const DEFAULT_MOMENT_ID = 'tokyo-night';

const momentById = new Map(MOMENTS.map((m) => [m.id, m]));

export function getMomentById(id) {
  return momentById.get(id) ?? momentById.get(DEFAULT_MOMENT_ID);
}

export function getMomentLabel(momentId, locale = 'ja') {
  const m = getMomentById(momentId);
  return locale === 'en' ? m.labelEn : m.labelJa;
}

export function pickSurpriseMoment() {
  const pool = MOMENTS.filter((m) => !m.surprise);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function resolveMoment(momentId) {
  const m = getMomentById(momentId);
  if (m.surprise) return pickSurpriseMoment();
  return m;
}

export function getMomentCategories(momentId) {
  return resolveMoment(momentId)?.categories ?? ['walk', 'cafe'];
}

export function getMomentMoodKey(momentId) {
  return resolveMoment(momentId)?.moodKey ?? '🌃 深夜東京を感じたい';
}
