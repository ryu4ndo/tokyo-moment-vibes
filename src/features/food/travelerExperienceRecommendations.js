import { spots } from '@/data/spots';
import { getSpotAreaForLocation } from '@/data/areas';
import { getTravelerExperience } from '@/data/travelerExperiences';
import { getBudgetForCategory } from '@/utils/spotUtils';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';

function hashScore(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

function spotMatchesKeywords(spot, keywords = []) {
  if (!keywords.length) return false;
  const text = `${spot.name} ${spot.description ?? ''}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw.toLowerCase()));
}

function scoreSpot(spot, experience, context) {
  const { location, companion, mood } = context;
  let score = hashScore(spot.id) % 12;

  const spotArea = getSpotAreaForLocation(location);
  if (spot.area === spotArea) score += 25;
  else if (spot.area === location) score += 18;

  if (experience.categories.includes(spot.category)) score += 20;
  if (spotMatchesKeywords(spot, experience.keywords)) score += 25;

  const rating = parseFloat(spot.rating) || 4.0;
  if (experience.minRating && rating >= experience.minRating) score += 15;
  if (experience.popular && rating >= 4.5) score += 12;
  if (experience.trending && hashScore(spot.id) % 3 === 0) score += 14;
  if (experience.preferHidden && hashScore(spot.id) % 4 !== 0) score += 10;

  const budget = spot.budget ?? getBudgetForCategory(spot.category);
  if (experience.maxBudget && (budget === '¥' || budget === '¥¥')) score += 12;
  if (experience.minBudget === '¥¥¥' && budget === '¥¥¥') score += 15;
  if (experience.solo && ['cafe', 'food'].includes(spot.category)) score += 8;
  if (experience.family && spot.category === 'food') score += 8;
  if (experience.cultural) score += 6;

  if (companion === 'couple' && ['wine', 'food'].includes(spot.category)) score += 5;
  if (companion === 'friends' && ['nightlife', 'food'].includes(spot.category)) score += 5;

  return score;
}

function buildAiReason(spot, experience, { locale, location }) {
  const label = locale === 'en' ? experience.labelEn : experience.labelJa;
  const reasons = {
    ja: [
      `「${label}」にぴったりの${location}エリアの一軒。`,
      `この体験を求める旅行者に人気のスポットです。`,
      `あなたのムードに合う、おすすめの選択肢。`,
    ],
    en: [
      `Perfect for "${label}" near ${location}.`,
      `A favorite among travelers seeking this experience.`,
      `Matches your mood for tonight.`,
    ],
  };
  const list = reasons[locale] ?? reasons.ja;
  return list[hashScore(spot.id + experience.id) % list.length];
}

export function getTravelerExperienceRecommendations(experienceId, context = {}) {
  const experience = getTravelerExperience(experienceId);
  if (!experience) return [];

  const {
    location = '渋谷',
    companion = 'solo',
    mood = '✨ ローカル東京を感じたい',
    locale = 'ja',
    limit = 8,
  } = context;

  const spotArea = getSpotAreaForLocation(location);

  const candidates = spots
    .filter(
      (s) =>
        experience.categories.includes(s.category) ||
        spotMatchesKeywords(s, experience.keywords)
    )
    .map((spot) => ({
      ...spot,
      budget: spot.budget ?? getBudgetForCategory(spot.category),
      rating: (4.0 + (hashScore(spot.id) % 10) / 10).toFixed(1),
      walkMinutes: 3 + (hashScore(spot.id) % 12),
      popularity: 60 + (hashScore(spot.id) % 35),
      aiReason: buildAiReason(spot, experience, { locale, location: spotArea, companion, mood }),
      _score: applyProfileBoost(
        scoreSpot(spot, experience, { location, companion, mood }),
        { ...spot, category: spot.category, area: spot.area, priceRange: spot.budget },
        context.profile,
      ),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  if (candidates.length < 3) {
    return spots
      .filter((s) => ['food', 'cafe', 'nightlife'].includes(s.category))
      .slice(0, limit)
      .map((spot) => ({
        ...spot,
        budget: getBudgetForCategory(spot.category),
        rating: (4.0 + (hashScore(spot.id) % 10) / 10).toFixed(1),
        walkMinutes: 5 + (hashScore(spot.id) % 10),
        popularity: 55 + (hashScore(spot.id) % 30),
        aiReason: buildAiReason(spot, experience, { locale, location: spotArea, companion, mood }),
      }));
  }

  return candidates.map(({ _score, ...rest }) => rest);
}
