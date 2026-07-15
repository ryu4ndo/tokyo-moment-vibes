/** Unified weather → category mapping for AI scoring */

export const WEATHER_CATEGORIES = {
  rain: ['cafe', 'chill', 'bar', 'food', 'music', 'culture'],
  snow: ['cafe', 'chill', 'food', 'culture'],
  cloudy: ['cafe', 'walk', 'chill', 'food', 'culture'],
  clear: ['rooftop', 'nightview', 'bar', 'walk', 'food'],
};

export const WEATHER_AI_HINTS = {
  ja: {
    rain: '雨の日は屋内のカフェ・美術館・バーがおすすめです。',
    snow: '雪の日は温かいカフェや屋内スポットが心地よいです。',
    cloudy: '曇りの日は散歩しながらカフェ巡りも良いです。',
    clear: '晴れの日は公園・散歩・テラス席が気持ちいいです。',
  },
  en: {
    rain: 'Rainy day — indoor cafés, galleries, and cozy bars work best.',
    snow: 'Snowy day — warm cafés and indoor culture spots shine.',
    cloudy: 'Cloudy skies — great for café hops and neighborhood walks.',
    clear: 'Clear skies — parks, walks, and terrace seats are perfect.',
  },
};

export function getWeatherCategories(condition) {
  return WEATHER_CATEGORIES[condition] ?? WEATHER_CATEGORIES.clear;
}

export function isWeatherMatch(condition, category) {
  return getWeatherCategories(condition).includes(category);
}

export function weatherCategoryBoost(condition, category) {
  if (condition === 'rain' || condition === 'snow') {
    if (isWeatherMatch(condition, category)) return 15;
    if (['walk', 'rooftop'].includes(category)) return -12;
  }
  if (condition === 'clear' && isWeatherMatch('clear', category)) return 8;
  if (condition === 'cloudy' && isWeatherMatch('cloudy', category)) return 6;
  return 0;
}

export function getWeatherAiHint(condition, locale = 'ja') {
  const hints = WEATHER_AI_HINTS[locale] ?? WEATHER_AI_HINTS.ja;
  return hints[condition] ?? hints.clear;
}
