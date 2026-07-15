/** AI Profile — interest IDs & extensible schema */

export const PROFILE_STORAGE_KEY = 'tokyo-moment-vibes-ai-profile';

export const AVAILABLE_INTERESTS = [
  { id: 'nightlife', emoji: '🌃', labelJa: '夜のお出かけ', labelEn: 'Night out' },
  { id: 'cafe', emoji: '☕', labelJa: 'カフェ巡り', labelEn: 'Cafe hopping' },
  { id: 'izakaya', emoji: '🍶', labelJa: '居酒屋', labelEn: 'Izakaya' },
  { id: 'nightview', emoji: '🌉', labelJa: '夜景', labelEn: 'Night views' },
  { id: 'date', emoji: '💑', labelJa: 'デート', labelEn: 'Date spots' },
  { id: 'local', emoji: '🏮', labelJa: 'ローカル志向', labelEn: 'Local gems' },
  { id: 'travel', emoji: '✈️', labelJa: '旅行・観光', labelEn: 'Travel' },
  { id: 'foodwalk', emoji: '🍜', labelJa: '食べ歩き', labelEn: 'Food crawl' },
  { id: 'culture', emoji: '🎭', labelJa: '文化体験', labelEn: 'Culture' },
  { id: 'walk', emoji: '🚶', labelJa: '散策', labelEn: 'Walking' },
  { id: 'budget', emoji: '💰', labelJa: 'コスパ重視', labelEn: 'Value picks' },
  { id: 'premium', emoji: '✨', labelJa: '特別な体験', labelEn: 'Premium' },
];

export const DEFAULT_PROFILE_DATA = {
  version: 1,
  signals: { views: [], saves: [] },
  manualInterests: [],
  hiddenInterests: [],
  extensions: {
    seasons: {},
    weatherPatterns: {},
    events: [],
    travelHistory: [],
    favoriteAreas: [],
  },
};

export function getInterestMeta(id) {
  return AVAILABLE_INTERESTS.find((i) => i.id === id);
}

export function getInterestLabel(id, locale = 'ja') {
  const meta = getInterestMeta(id);
  if (!meta) return id;
  return locale === 'en' ? meta.labelEn : meta.labelJa;
}
