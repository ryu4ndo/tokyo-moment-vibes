import { spots } from '@/data/spots';

const BUDGET_BY_CATEGORY = {
  cafe: '¥',
  walk: '¥',
  culture: '¥',
  food: '¥¥',
  nightlife: '¥¥',
  wine: '¥¥¥',
};

const GENRE_LABELS = {
  ja: {
    wine: 'ワイン',
    cafe: 'カフェ',
    food: '食事',
    nightlife: '居酒屋・バー',
    walk: '散歩',
    culture: '文化',
  },
  en: {
    wine: 'Wine',
    cafe: 'Cafe',
    food: 'Food',
    nightlife: 'Izakaya & Bar',
    walk: 'Walk',
    culture: 'Culture',
  },
};

const FOOD_CATEGORIES = ['food', 'wine', 'cafe', 'nightlife'];

export function getBudgetForCategory(category) {
  return BUDGET_BY_CATEGORY[category] ?? '¥¥';
}

export function getGenreLabel(category, locale = 'ja') {
  return GENRE_LABELS[locale]?.[category] ?? GENRE_LABELS.ja[category] ?? category;
}

export function estimatePlanBudget(planSpots = []) {
  if (planSpots.length === 0) return '¥¥';
  const levels = planSpots.map((spot) => getBudgetForCategory(spot.category));
  if (levels.includes('¥¥¥')) return '¥¥¥';
  if (levels.includes('¥¥')) return '¥¥';
  return '¥';
}

export function getFoodSpots() {
  return spots
    .filter((spot) => FOOD_CATEGORIES.includes(spot.category))
    .map((spot) => ({
      ...spot,
      genre: spot.category,
      genreLabel: getGenreLabel(spot.category),
      budget: getBudgetForCategory(spot.category),
    }));
}

export function filterFoodSpots({ search = '', area = 'all', genre = 'all', budget = 'all', foodCategory = 'all' }) {
  const query = search.trim().toLowerCase();

  const CATEGORY_KEYWORDS = {
    ramen: ['ラーメン', 'ramen', 'つけ麺'],
    sushi: ['寿司', 'sushi'],
    izakaya: ['居酒屋', '焼き鳥', '横丁', 'nightlife'],
    yakiniku: ['焼肉', 'yakiniku'],
    cafe: ['カフェ', 'cafe', '珈琲', 'コーヒー'],
    wine: ['ワイン', 'wine', 'バー'],
    'late-night': ['深夜', 'late', 'nightlife', 'food'],
  };

  return getFoodSpots().filter((spot) => {
    const matchesArea = area === 'all' || spot.area === area;
    const matchesGenre = genre === 'all' || spot.genre === genre;
    const matchesBudget = budget === 'all' || spot.budget === budget;
    const matchesCategory =
      foodCategory === 'all' ||
      (CATEGORY_KEYWORDS[foodCategory] ?? []).some(
        (kw) => spot.name.includes(kw) || spot.description?.includes(kw) || spot.category.includes(kw)
      );
    const matchesSearch =
      !query ||
      spot.name.toLowerCase().includes(query) ||
      spot.area.includes(query) ||
      spot.description.includes(query) ||
      spot.genreLabel.includes(query);

    return matchesArea && matchesGenre && matchesBudget && matchesCategory && matchesSearch;
  });
}
