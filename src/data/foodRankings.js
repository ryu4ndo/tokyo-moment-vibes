import { spots } from '@/data/spots';

function hashScore(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

const FOOD_CATS = new Set(['food', 'wine', 'nightlife', 'cafe']);

function getFoodSpots() {
  return spots.filter((s) => FOOD_CATS.has(s.category));
}

function enrichSpot(spot, index, locale) {
  const score = 4.1 + (hashScore(spot.id) % 8) / 10;
  const popularity = 60 + (hashScore(spot.id) % 40);
  const foodImages = [
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec524e3a456d?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563613112-6b56f2f7c0e8?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
  ];
  const reasons = {
    ja: [
      '地元の人に愛される味。',
      '初めての東京でも安心の一軒。',
      '深夜まで営業で二次会にも。',
      'コスパ良く満足度高め。',
    ],
    en: [
      'Loved by locals for authentic flavor.',
      'Welcoming for first-time Tokyo visitors.',
      'Open late — perfect for after-party.',
      'Great value with high satisfaction.',
    ],
  };
  const reasonList = locale === 'en' ? reasons.en : reasons.ja;
  return {
    ...spot,
    rating: Number(score.toFixed(1)),
    popularity,
    aiReason: reasonList[index % reasonList.length],
    dish: spot.name,
    walkMinutes: 3 + (hashScore(spot.id) % 12),
    budget: spot.budget ?? '¥¥',
    image: foodImages[hashScore(spot.id) % foodImages.length],
  };
}

export function getFoodRankingSections(locale = 'ja', experienceMode = 'local') {
  const all = getFoodSpots().map((s, i) => enrichSpot(s, i, locale));
  const byRating = [...all].sort((a, b) => b.rating - a.rating);
  const travelerSorted = [...all]
    .filter((s) => ['food', 'cafe'].includes(s.category))
    .sort((a, b) => b.rating - a.rating);
  const top10 =
    experienceMode === 'traveler' ? travelerSorted.slice(0, 10) : byRating.slice(0, 10);

  return {
    top10,
    top20: byRating.slice(0, 20),
    todayPicks: byRating.filter((_, i) => i % 3 === 0).slice(0, 8),
    hiddenGems: byRating.filter((s) => s.rating >= 4.3 && s.popularity < 80).slice(0, 10),
    localFavorites: byRating.filter((s) => hashScore(s.id) % 2 === 0).slice(0, 10),
    travelerPicks: byRating.filter((s) => ['food', 'cafe'].includes(s.category)).slice(0, 10),
    lateNight: all.filter((s) => ['food', 'nightlife', 'wine'].includes(s.category)).slice(0, 10),
    michelin: byRating.filter((s) => s.rating >= 4.6).slice(0, 8),
    bestValue: byRating.filter((s) => s.budget === '¥' || s.budget === '¥¥').slice(0, 10),
  };
}
