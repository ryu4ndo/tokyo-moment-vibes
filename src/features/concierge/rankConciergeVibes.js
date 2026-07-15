import { ENRICHED_VIBES } from '@/data/vibes';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { weatherCategoryBoost } from '@/domain/weather/categories';

function scoreVibe(vibe, ctx) {
  let score = 10;
  const {
    location,
    mood,
    experienceMode,
    companion,
    weather,
    events = [],
    savedSpotIds = [],
    recentlyViewedIds = [],
    profile,
    currentPage,
    detailSpotId,
  } = ctx;

  if (location && vibe.area === location) score += 25;
  const wBoost = weatherCategoryBoost(weather, vibe.category);
  if (wBoost) score += wBoost;
  if (weather === 'rain' && ['walk', 'rooftop'].includes(vibe.category)) score -= 10;
  if (events.length > 0 && events.some((e) => e.area === vibe.area)) score += 12;
  if (mood && vibe.mood === mood) score += 20;
  if (experienceMode === 'local' && vibe.experienceModes?.includes('local')) score += 8;
  if (experienceMode === 'traveler' && vibe.experienceModes?.includes('traveler')) score += 8;
  if (companion === 'couple' && vibe.suitableFor?.includes('date')) score += 10;
  if (savedSpotIds.includes(vibe.spotId)) score += 4;
  if (recentlyViewedIds.includes(vibe.id)) score -= 6;
  if (vibe.aiPick) score += 5;
  score += (vibe.rating ?? 4) * 2;
  if (currentPage === 'FOOD' && ['food', 'cafe', 'bar'].includes(vibe.category)) score += 8;
  if (currentPage === 'SAVED' && savedSpotIds.includes(vibe.spotId)) score += 15;
  if (detailSpotId) {
    const detail = ENRICHED_VIBES.find((v) => v.spotId === detailSpotId);
    if (detail?.area === vibe.area) score += 8;
  }

  return applyProfileBoost(score, vibe, profile ?? {});
}

export function rankConciergeVibes(ctx, { limit = 3, excludeSpotIds = [] } = {}) {
  const excluded = new Set(excludeSpotIds);
  return [...ENRICHED_VIBES]
    .filter((v) => !excluded.has(v.spotId))
    .sort((a, b) => scoreVibe(b, ctx) - scoreVibe(a, ctx))
    .slice(0, limit);
}

export function toRecommendationPayload(vibe, reason = '') {
  return {
    spotId: vibe.spotId,
    vibeId: vibe.id,
    shopName: vibe.shopName,
    area: vibe.area,
    category: vibe.category,
    image: vibe.image,
    rating: vibe.rating,
    priceRange: vibe.priceRange,
    walkMinutes: vibe.walkMinutes,
    lat: vibe.lat,
    lng: vibe.lng,
    reason,
  };
}

export function buildFallbackConciergeResponse({ messages, context, locale }) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const text = lastUser?.content ?? '';
  const excludeSpotIds = messages
    .flatMap((m) => m.excludeSpotIds ?? [])
    .filter(Boolean);

  const vibes = rankConciergeVibes(context, { limit: 3, excludeSpotIds });
  const recommendations = vibes.map((v) =>
    toRecommendationPayload(
      v,
      locale === 'en'
        ? `Matches your vibe in ${v.area} — ${v.category}.`
        : `${v.area}で今の気分に合う${v.category}スポットです。`,
    ),
  );

  const reply =
    locale === 'en'
      ? `Here are my picks for "${text}". Tap a card for details, or tell me more about your budget and walking preference.`
      : `「${text}」に合いそうなスポットをセレクトしました。カードをタップで詳細へ。予算や徒歩の希望があれば教えてください。`;

  const followUpQuestions =
    locale === 'en'
      ? ['What\'s your budget?', 'Is walking OK?', 'Want a café after?']
      : ['予算はいくらですか？', '徒歩でも大丈夫ですか？', '食事のあとカフェも行きますか？'];

  return {
    reply,
    followUpQuestions: followUpQuestions.slice(0, 2),
    recommendations,
    mapCenter: recommendations[0] ? { lat: recommendations[0].lat, lng: recommendations[0].lng } : null,
    shouldRegeneratePlan: false,
    shouldCreatePlan: false,
    shouldNavigate: false,
    navigateTo: null,
    updates: {},
    excludeSpotIds: recommendations.map((r) => r.spotId),
    model: 'fallback',
  };
}
