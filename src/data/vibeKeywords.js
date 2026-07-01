export const EXPERIENCE_MODES = [
  {
    id: 'local',
    localLevel: 'Hidden Local',
    icon: '🏠',
  },
  {
    id: 'traveler',
    localLevel: 'Tourist Friendly',
    icon: '✈️',
  },
];

export const TRENDING_TAGS = {
  local: {
    ja: ['#隠れ家バー', '#夜景', '#深夜カフェ', '#ジャズ', '#カクテル', '#地元のお気に入り', '#ネオン散歩'],
    en: ['#HiddenBar', '#NightView', '#LateCafe', '#Jazz', '#Cocktail', '#LocalFavorite', '#NeonWalk'],
  },
  traveler: {
    ja: ['#HiddenBar', '#夜景', '#LateCafe', '#ジャズ', '#カクテル', '#EnglishMenu', '#Cashless'],
    en: ['#HiddenBar', '#NightView', '#LateCafe', '#Jazz', '#Cocktail', '#EnglishMenu', '#Cashless'],
  },
};

export function getTrendingTags(experienceMode = 'local', locale = 'ja') {
  return TRENDING_TAGS[experienceMode]?.[locale] ?? TRENDING_TAGS.local.ja;
}

import { getMoodByLabel } from './moods';

const MOOD_KEYWORD_IDS = {
  midnight: [
    'deep-tokyo', 'bar', 'izakaya', 'hidden', 'rooftop', 'night-view',
    'late-food', 'photo-spot', 'chill', 'rain', 'local',
  ],
  wine: [
    'wine-bar', 'bar', 'hidden', 'cocktail', 'date', 'chill', 'jazz', 'photo-spot', 'local',
  ],
  calm: [
    'night-cafe', 'chill', 'solo', 'quiet', 'rain', 'photo-spot', 'local', 'gallery',
  ],
  rain: [
    'rain', 'night-walk', 'night-view', 'night-cafe', 'photo-spot', 'chill', 'local', 'neon',
  ],
  local: [
    'local', 'izakaya', 'hidden', 'late-food', 'bar', 'friends', 'photo-spot', 'rooftop',
  ],
};

/** @deprecated legacy JA mood keys — kept for backward compat */
const LEGACY_MOOD_KEYWORDS = {
  '🌃 深夜東京を感じたい': MOOD_KEYWORD_IDS.midnight,
  '🍷 しっぽり飲みたい': MOOD_KEYWORD_IDS.wine,
  '☕ 一人で落ち着きたい': MOOD_KEYWORD_IDS.calm,
  '🚶 雨の夜を歩きたい': MOOD_KEYWORD_IDS.rain,
  '✨ ローカル東京を感じたい': MOOD_KEYWORD_IDS.local,
};

const EXPERIENCE_KEYWORD_IDS = {
  local: ['local', 'hidden', 'izakaya', 'deep-tokyo', 'value', 'hole-in-wall', 'after-party', 'until-last-train'],
  traveler: ['photo-spot', 'night-view', 'english-menu', 'cashless', 'reservation', 'hidden-gems', 'rooftop', 'bar'],
};

export const QUICK_FILTERS = [
  { id: 'popular' },
  { id: 'open' },
  { id: 'reservable' },
  { id: 'date' },
  { id: 'solo' },
  { id: 'lateNight' },
  { id: 'walk5' },
  { id: 'budget' },
];

export function localLevelToExperience(localLevel) {
  if (localLevel === 'Tourist Friendly' || localLevel === 'Semi Local') return 'traveler';
  return 'local';
}

export function experienceToLocalLevel(experienceId) {
  return EXPERIENCE_MODES.find((m) => m.id === experienceId)?.localLevel ?? 'Hidden Local';
}

export function getKeywordsForMood(mood, experienceMode = 'local', t) {
  const moodObj = getMoodByLabel(mood);
  const moodIds =
    MOOD_KEYWORD_IDS[moodObj?.id] ??
    LEGACY_MOOD_KEYWORDS[mood] ??
    MOOD_KEYWORD_IDS.midnight;
  const expIds = EXPERIENCE_KEYWORD_IDS[experienceMode] ?? [];
  const seen = new Set();
  const ids = [...expIds, ...moodIds].filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return ids.map((id) => ({
    id,
    label: t ? t(`keywords.${id}`) : id,
  }));
}
