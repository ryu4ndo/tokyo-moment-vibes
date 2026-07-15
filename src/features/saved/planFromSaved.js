import { ENRICHED_VIBES } from '@/data/vibes';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { conciergeToPlan } from '@/features/concierge/conciergeToPlan';

/** Build AI plan recommendations from saved spot IDs */
export function buildPlanFromSaved({
  savedSpotIds = [],
  location = '渋谷',
  profile = null,
  locale = 'ja',
  freeTime = '2時間',
  companion = 'solo',
  experienceMode = 'local',
  limit = 4,
}) {
  const vibes = savedSpotIds
    .map((spotId) => ENRICHED_VIBES.find((v) => v.spotId === spotId))
    .filter(Boolean)
    .map((vibe) => ({
      vibe,
      score: applyProfileBoost(vibe.rating ?? 4, vibe, profile),
    }))
    .sort((a, b) => {
      const areaBoost = (v) => (v.vibe.area === location ? 10 : 0);
      return b.score + areaBoost(b) - (a.score + areaBoost(a));
    })
    .slice(0, limit)
    .map(({ vibe }) => vibe);

  if (vibes.length < 2) return null;

  const recommendations = vibes.map((v) => ({
    spotId: v.spotId,
    shopName: v.shopName,
    area: v.area,
    category: v.category,
    image: v.image,
    rating: v.rating,
    priceRange: v.priceRange,
    walkMinutes: v.walkMinutes,
    lat: v.lat,
    lng: v.lng,
  }));

  const plan = conciergeToPlan(recommendations, {
    locale,
    location,
    freeTime,
    companion,
    experienceMode,
  });

  if (!plan) return null;

  return {
    ...plan,
    id: `saved-plan-${Date.now()}`,
    title: locale === 'en' ? 'Plan from Saved' : '保存スポットからのプラン',
    aiReason:
      locale === 'en'
        ? `AI connected ${vibes.length} of your saved spots into one route.`
        : `保存した${vibes.length}スポットをAIが自然なルートにつなぎました。`,
    isSavedPlan: true,
  };
}
