import { ENRICHED_VIBES } from '../src/data/vibes.js';

const WEATHER_INDOOR = ['cafe', 'chill', 'bar', 'food', 'music'];
const WEATHER_ANY = ['nightview', 'rooftop', 'walk', 'culture'];

function scoreVibe(vibe, ctx) {
  let score = 0;
  const {
    location,
    mood = '',
    experienceMode = 'local',
    companion = 'solo',
    weather = 'clear',
    events = [],
    savedSpotIds = [],
    recentlyViewedIds = [],
    profile = {},
    currentPage = 'HOME',
    detailSpotId = null,
  } = ctx;

  if (location && vibe.area === location) score += 25;
  else if (location && vibe.area?.includes(location)) score += 12;

  if (weather === 'rain' || weather === 'snow') {
    if (WEATHER_INDOOR.includes(vibe.category)) score += 15;
    if (vibe.category === 'walk' || vibe.category === 'rooftop') score -= 10;
  } else if (weather === 'clear') {
    if (WEATHER_ANY.includes(vibe.category)) score += 8;
  }

  if (events.length > 0 && events.some((e) => e.area === vibe.area)) score += 12;

  if (mood && vibe.mood === mood) score += 20;
  if (mood && vibe.mood?.includes(mood.replace(/^.\s*/, ''))) score += 10;

  if (experienceMode === 'local' && vibe.experienceModes?.includes('local')) score += 8;
  if (experienceMode === 'traveler' && vibe.experienceModes?.includes('traveler')) score += 8;

  if (companion === 'couple' && vibe.suitableFor?.includes('date')) score += 10;
  if (companion === 'friends' && vibe.suitableFor?.includes('friends')) score += 8;
  if (companion === 'solo' && vibe.suitableFor?.includes('solo')) score += 6;

  for (const { id, weight } of profile.topCategories ?? []) {
    if (id === vibe.category) score += weight * 12;
  }
  for (const { id, weight } of profile.topAreas ?? []) {
    if (id === vibe.area) score += weight * 10;
  }
  for (const interest of profile.activeInterests ?? []) {
    if (interest.id === 'nightlife' && ['bar', 'music'].includes(vibe.category)) score += 6;
    if (interest.id === 'cafe' && ['cafe', 'chill'].includes(vibe.category)) score += 6;
    if (interest.id === 'izakaya' && vibe.category === 'food') score += 6;
    if (interest.id === 'nightview' && ['nightview', 'rooftop'].includes(vibe.category)) score += 6;
    if (interest.id === 'budget' && (vibe.priceRange === '¥' || vibe.priceRange === '¥¥')) score += 5;
    if (interest.id === 'premium' && (vibe.priceRange === '¥¥¥' || vibe.priceRange === '¥¥¥¥')) score += 5;
  }

  if (savedSpotIds.includes(vibe.spotId)) score += 4;
  if (recentlyViewedIds.includes(vibe.id)) score -= 6;

  if (vibe.aiPick) score += 5;
  score += (vibe.rating ?? 4) * 2;

  if (currentPage === 'FOOD' && ['food', 'cafe', 'bar'].includes(vibe.category)) score += 8;
  if (currentPage === 'VIBES') score += 2;
  if (currentPage === 'SAVED' && savedSpotIds.includes(vibe.spotId)) score += 15;
  if (detailSpotId && vibe.spotId !== detailSpotId) {
    const detail = ENRICHED_VIBES.find((v) => v.spotId === detailSpotId);
    if (detail?.area === vibe.area) score += 8;
    if (detail?.category === vibe.category) score += 4;
  }

  return score;
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

export function buildSpotCatalog() {
  return ENRICHED_VIBES.map((v) => ({
    spotId: v.spotId,
    shopName: v.shopName,
    area: v.area,
    category: v.category,
    mood: v.mood,
    priceRange: v.priceRange,
    rating: v.rating,
  }));
}
