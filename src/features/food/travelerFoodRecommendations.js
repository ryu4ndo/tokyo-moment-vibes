import { spots } from '@/data/spots';
import { getSpotAreaForLocation } from '@/data/areas';
import { getTravelerFood } from '@/data/travelerFoods';
import { getBudgetForCategory } from '@/utils/spotUtils';

function hashScore(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

const COMPANION_BOOST = {
  solo: { cafe: 2, food: 1 },
  couple: { wine: 2, food: 2, cafe: 1 },
  friends: { nightlife: 3, food: 2 },
  family: { food: 3, cafe: 2 },
  business: { cafe: 2, food: 1 },
  backpacker: { food: 2, nightlife: 1 },
};

const MOOD_BOOST = {
  '🌃 深夜東京を感じたい': { nightlife: 3, food: 1 },
  '🍷 しっぽり飲みたい': { wine: 3, nightlife: 2 },
  '☕ 一人で落ち着きたい': { cafe: 3 },
  '🚶 雨の夜を歩きたい': { cafe: 2, food: 1 },
  '✨ ローカル東京を感じたい': { food: 2, nightlife: 2 },
};

function spotMatchesFood(spot, food) {
  const text = `${spot.name} ${spot.description ?? ''}`.toLowerCase();
  return (
    food.keywords.some((kw) => text.includes(kw.toLowerCase())) ||
    food.spotCategories.includes(spot.category)
  );
}

function scoreSpot(spot, food, { location, companion, mood, freeTime }) {
  let score = hashScore(spot.id) % 10;

  const spotArea = getSpotAreaForLocation(location);
  if (spot.area === spotArea) score += 25;
  else if (spot.area === location) score += 20;

  if (spotMatchesFood(spot, food)) score += 30;

  const moodBoost = MOOD_BOOST[mood] ?? {};
  score += moodBoost[spot.category] ?? 0;

  const compBoost = COMPANION_BOOST[companion] ?? {};
  score += compBoost[spot.category] ?? 0;

  if (freeTime === '終電まで' || freeTime === '半日') {
    if (['nightlife', 'food', 'wine'].includes(spot.category)) score += 5;
  }

  return score;
}

function buildAiReason(spot, food, { locale, location, companion, mood }) {
  const foodLabel = locale === 'en' ? food.labelEn : food.labelJa;
  const reasons = {
    ja: [
      `${foodLabel}を楽しめる、${location}エリアのおすすめ。`,
      `旅行者に人気の${foodLabel}スポット。英語対応しやすい雰囲気。`,
      `あなたのムード「${mood.replace(/^.\s*/, '')}」に合う${foodLabel}の一軒。`,
      `${companion === 'couple' ? 'カップル' : companion === 'friends' ? '友達' : '一人'}でも入りやすい店。`,
    ],
    en: [
      `Great ${foodLabel} pick near ${location}.`,
      `Popular with travelers — easy ${foodLabel} experience.`,
      `Matches your mood for tonight.`,
      `Welcoming for ${companion === 'couple' ? 'couples' : companion === 'friends' ? 'groups' : 'solo diners'}.`,
    ],
  };
  const list = reasons[locale] ?? reasons.ja;
  return list[hashScore(spot.id + food.id) % list.length];
}

export function getTravelerFoodRecommendations(foodId, context = {}) {
  const food = getTravelerFood(foodId);
  if (!food) return [];

  const {
    location = '渋谷',
    companion = 'solo',
    mood = '✨ ローカル東京を感じたい',
    freeTime = '2時間',
    locale = 'ja',
    limit = 8,
  } = context;

  const spotArea = getSpotAreaForLocation(location);
  const candidates = spots
    .filter((s) => food.spotCategories.includes(s.category) || spotMatchesFood(s, food))
    .map((spot) => ({
      ...spot,
      budget: spot.budget ?? getBudgetForCategory(spot.category),
      rating: (4.0 + (hashScore(spot.id) % 10) / 10).toFixed(1),
      walkMinutes: 3 + (hashScore(spot.id) % 12),
      popularity: 60 + (hashScore(spot.id) % 35),
      aiReason: buildAiReason(spot, food, { locale, location: spotArea, companion, mood }),
      _score: scoreSpot(spot, food, { location, companion, mood, freeTime }),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  if (candidates.length < 3) {
    const fallback = spots
      .filter((s) => ['food', 'cafe', 'nightlife'].includes(s.category))
      .slice(0, limit)
      .map((spot) => ({
        ...spot,
        budget: getBudgetForCategory(spot.category),
        rating: (4.0 + (hashScore(spot.id) % 10) / 10).toFixed(1),
        walkMinutes: 5 + (hashScore(spot.id) % 10),
        popularity: 55 + (hashScore(spot.id) % 30),
        aiReason: buildAiReason(spot, food, { locale, location: spotArea, companion, mood }),
        _score: 0,
      }));
    return fallback;
  }

  return candidates.map(({ _score, ...rest }) => rest);
}
