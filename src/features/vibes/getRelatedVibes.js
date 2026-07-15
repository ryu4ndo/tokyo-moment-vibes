import { ENRICHED_VIBES } from '@/data/vibes';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';

export function getRelatedVibes(vibe, { limit = 4, profile = null, experienceMode = 'local' } = {}) {
  if (!vibe) return [];

  return ENRICHED_VIBES.filter((v) => v.id !== vibe.id && v.spotId !== vibe.spotId)
    .map((v) => {
      let score = v.rating ?? 4;
      if (v.area === vibe.area) score += 8;
      if (v.category === vibe.category) score += 6;
      if (v.mood === vibe.mood) score += 4;
      if (v.experienceModes?.includes(experienceMode)) score += 3;
      score = applyProfileBoost(score, v, profile);
      return { vibe: v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ vibe: v }) => v);
}
