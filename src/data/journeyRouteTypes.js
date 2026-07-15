/** AI Journey route types — category sequences per purpose */

export const JOURNEY_ROUTE_TYPES = [
  { id: 'date', icon: '💑' },
  { id: 'friends', icon: '👥' },
  { id: 'solo', icon: '👤' },
  { id: 'family', icon: '👨‍👩‍👧' },
  { id: 'travel', icon: '✈️' },
  { id: 'foodwalk', icon: '🍜' },
  { id: 'rainy', icon: '☔' },
  { id: 'nightlife', icon: '🌃' },
  { id: 'daywalk', icon: '☀️' },
  { id: 'culture', icon: '🎭' },
];

export const ROUTE_CATEGORY_FLOW = {
  date: ['food', 'cafe', 'nightview', 'bar'],
  friends: ['food', 'bar', 'music', 'nightview'],
  solo: ['cafe', 'chill', 'food', 'nightview'],
  family: ['food', 'cafe', 'nightview', 'chill'],
  travel: ['nightview', 'food', 'cafe', 'bar'],
  foodwalk: ['food', 'food', 'cafe', 'bar'],
  rainy: ['cafe', 'chill', 'food', 'music'],
  nightlife: ['food', 'bar', 'music', 'bar'],
  daywalk: ['cafe', 'chill', 'food', 'nightview'],
  culture: ['chill', 'cafe', 'nightview', 'music'],
};

export const ROUTE_LABELS = {
  ja: {
    date: 'デート',
    friends: '友達',
    solo: '一人',
    family: '家族',
    travel: '旅行',
    foodwalk: '食べ歩き',
    rainy: '雨の日',
    nightlife: '夜遊び',
    daywalk: '昼散歩',
    culture: '文化体験',
  },
  en: {
    date: 'Date',
    friends: 'Friends',
    solo: 'Solo',
    family: 'Family',
    travel: 'Travel',
    foodwalk: 'Food crawl',
    rainy: 'Rainy day',
    nightlife: 'Night out',
    daywalk: 'Day stroll',
    culture: 'Culture',
  },
};

export function getRouteTypeLabel(id, locale = 'ja') {
  return ROUTE_LABELS[locale]?.[id] ?? id;
}
