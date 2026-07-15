import { ENRICHED_VIBES } from '@/data/vibes';
import { getSpotAreaForLocation } from '@/data/areas';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { weatherCategoryBoost } from '@/domain/weather/categories';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { getAiPriorityConfig } from '@/platform/services/businessService';
import { getPlatformStore } from '@/platform/mock/platformStore';

const PRICE_RANK = { '¥': 1, '¥¥': 2, '¥¥¥': 3, '¥¥¥¥': 4 };

function priceToRank(range) {
  return PRICE_RANK[range] ?? 2;
}

function budgetYenToRank(maxYen) {
  if (maxYen <= 3000) return 1;
  if (maxYen <= 5000) return 2;
  if (maxYen <= 10000) return 3;
  return 4;
}

function scoreVibe(vibe, parsed, ctx) {
  let score = (vibe.rating ?? 4) * 12;
  const spotArea = getSpotAreaForLocation(ctx.location);
  const targetAreas = parsed.areas.length ? parsed.areas : [ctx.location, spotArea];

  if (targetAreas.some((a) => vibe.area === a)) score += 30;
  else if (parsed.areas.length) score -= 15;

  for (const cat of parsed.categories) {
    if (vibe.category === cat) score += 22;
  }

  if (parsed.indoor || ctx.weather === 'rain') {
    if (['cafe', 'chill', 'bar', 'food', 'music', 'culture'].includes(vibe.category)) score += 18;
    if (['walk', 'rooftop'].includes(vibe.category)) score -= 12;
  }

  if (parsed.outdoor || ctx.weather === 'clear') {
    if (['rooftop', 'nightview', 'walk'].includes(vibe.category)) score += 12;
  }

  const wBoost = weatherCategoryBoost(ctx.weather, vibe.category);
  if (wBoost) score += wBoost;

  if (parsed.lateNight && (vibe.lateNight || vibe.category === 'bar')) score += 16;
  if (parsed.quiet && (vibe.crowd === 'quiet' || vibe.category === 'cafe')) score += 14;
  if (parsed.popular && (vibe.isPopular || vibe.aiPick)) score += 14;
  if (parsed.local && vibe.experienceModes?.includes('local')) score += 16;
  if (parsed.traveler && vibe.experienceModes?.includes('traveler')) score += 14;

  if (parsed.companion === 'couple' && vibe.suitableFor?.includes('date')) score += 18;
  if (parsed.companion === 'solo' && vibe.suitableFor?.includes('solo')) score += 12;

  if (parsed.budgetLevel === 'low' && priceToRank(vibe.priceRange) <= 2) score += 14;
  if (parsed.budgetLevel === 'high' && priceToRank(vibe.priceRange) >= 3) score += 12;

  if (parsed.budgetMax) {
    const maxRank = budgetYenToRank(parsed.budgetMax);
    const diff = maxRank - priceToRank(vibe.priceRange);
    if (diff >= 0) score += 10;
    else score -= diff * 8;
  }

  if (parsed.walkMax != null) {
    const walk = vibe.walkMinutes ?? 15;
    if (walk <= parsed.walkMax) score += 16;
    else score -= (walk - parsed.walkMax) * 3;
  }

  if (vibe.aiPick) score += 8;
  if (ctx.experienceMode === 'local' && vibe.experienceModes?.includes('local')) score += 6;
  if (ctx.experienceMode === 'traveler' && vibe.experienceModes?.includes('traveler')) score += 6;

  if (ctx.savedSpotIds?.includes(vibe.spotId)) score += 4;
  if (ctx.recentlyViewedIds?.includes(vibe.id)) score -= 20;

  const priority = getAiPriorityConfig();
  const store = getPlatformStore();
  const biz = store.businesses.find((b) => b.spotId === vibe.spotId);
  if (biz?.sponsored || store.ads.some((a) => a.active && a.spotId === vibe.spotId)) {
    score += priority.sponsorBoost ?? 0;
  }
  if (biz?.featured) score += (priority.trendingBoost ?? 0) * 0.5;
  if (vibe.isPopular) score += priority.trendingBoost ?? 0;
  if (vibe.experienceModes?.includes('local')) score += (priority.localBoost ?? 0) * 0.5;
  const daysSinceUpdate = biz?.updatedAt ? (Date.now() - biz.updatedAt) / 86400000 : 999;
  if (daysSinceUpdate < 14) score += priority.newStoreBoost ?? 0;

  return applyProfileBoost(score, vibe, ctx.profile ?? {});
}

export function rankAiSearch(parsed, ctx, { limit = 6, excludeSpotIds = [] } = {}) {
  const excluded = new Set(excludeSpotIds);
  const { locale = 'ja', experienceMode = 'local' } = ctx;

  return [...ENRICHED_VIBES]
    .filter((v) => !excluded.has(v.spotId))
    .map((vibe) => ({
      vibe: localizeVibe(vibe, { locale, experienceMode }),
      score: scoreVibe(vibe, parsed, ctx),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
