/** Vibes Explore — Pinterest / Instagram Explore categories */

export const EXPLORE_CATEGORIES = [
  { id: 'all', labelJa: 'すべて', labelEn: 'All' },
  { id: 'food', labelJa: 'Food', labelEn: 'Food' },
  { id: 'cafe', labelJa: 'Cafe', labelEn: 'Cafe' },
  { id: 'travel', labelJa: 'Travel', labelEn: 'Travel' },
  { id: 'date', labelJa: 'Date', labelEn: 'Date' },
  { id: 'nightlife', labelJa: 'Night Life', labelEn: 'Night Life' },
  { id: 'events', labelJa: 'Events', labelEn: 'Events' },
  { id: 'hidden', labelJa: 'Hidden Gems', labelEn: 'Hidden Gems' },
];

const CATEGORY_MAP = {
  food: (v) => v.category === 'food',
  cafe: (v) => v.category === 'cafe' || v.category === 'chill',
  travel: (v) => v.category === 'nightview' || v.category === 'rooftop',
  date: (v) => v.suitableFor?.includes('date') || ['rooftop', 'nightview', 'bar'].includes(v.category),
  nightlife: (v) => v.category === 'bar' || v.category === 'music' || v.lateNight,
  events: (v) => v.category === 'music' || v.isPopular,
  hidden: (v) =>
    v.experienceModes?.includes('hidden') ||
    v.localKeywordIds?.includes('hole-in-wall') ||
    v.travelerKeywordIds?.includes('hidden-gems') ||
    (v.rating >= 4.7 && !v.isPopular),
};

export function getExploreCategoryLabel(cat, locale) {
  return locale === 'en' ? cat.labelEn : cat.labelJa;
}

export function filterByExploreCategory(vibes, categoryId) {
  if (!categoryId || categoryId === 'all') return vibes;
  const matcher = CATEGORY_MAP[categoryId];
  return matcher ? vibes.filter(matcher) : vibes;
}
