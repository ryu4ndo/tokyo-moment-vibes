import { getSpotAreaForLocation } from '@/data/areas';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { weatherCategoryBoost } from '@/domain/weather/categories';

const TIME_BOOST = {
  morning: ['cafe', 'chill'],
  afternoon: ['cafe', 'food', 'nightview'],
  evening: ['food', 'bar', 'rooftop', 'nightview', 'music'],
  night: ['bar', 'music', 'food', 'nightview'],
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 11) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function hashScore(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h) % 10;
}

function scoreVibe(vibe, { location, weather, savedSpotIds, recentlyViewedIds, companion }) {
  let score = vibe.rating * 12 + hashScore(vibe.id);

  const area = getSpotAreaForLocation(location);
  if (vibe.area === area || vibe.area === location) score += 28;

  const weatherBoost = weatherCategoryBoost(weather, vibe.category);
  if (weatherBoost) score += weatherBoost;

  const timeCats = TIME_BOOST[getTimeOfDay()] ?? [];
  if (timeCats.includes(vibe.category)) score += 12;

  if (vibe.aiPick) score += 22;
  if (vibe.companionFit?.includes(companion)) score += 15;

  if (savedSpotIds.includes(vibe.spotId)) score += 8;
  if (recentlyViewedIds.includes(vibe.id)) score -= 40;

  score += (vibe.popularity ?? 0) * 0.15;

  return score;
}

/** Score and sort vibes for a unified explore feed (no separate "For You" row) */
export function sortExploreFeed(vibes, context, profile = null) {
  return [...vibes]
    .map((vibe) => {
      let score = scoreVibe(vibe, context);
      if (profile) score = applyProfileBoost(score, vibe, profile);
      return { vibe, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ vibe }) => vibe);
}

/** Stable pseudo-random order when browsing a category */
export function shuffleExploreFeed(vibes, categoryId = 'all') {
  return [...vibes].sort((a, b) => {
    const ha = hashScore(`${categoryId}-${a.id}`);
    const hb = hashScore(`${categoryId}-${b.id}`);
    return ha - hb;
  });
}

/** @deprecated Use sortExploreFeed — kept for compatibility */
export function getVibesForYou(vibes, context, limit = 6) {
  const scored = vibes
    .map((v) => ({ vibe: v, score: scoreVibe(v, context) }))
    .sort((a, b) => b.score - a.score);

  const seen = new Set();
  const picks = [];
  for (const { vibe } of scored) {
    if (seen.has(vibe.id)) continue;
    seen.add(vibe.id);
    picks.push(vibe);
    if (picks.length >= limit) break;
  }
  return picks;
}
