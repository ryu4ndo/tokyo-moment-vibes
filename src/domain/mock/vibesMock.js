import { ENRICHED_VIBES } from '@/data/vibes';
import { applyVibeFilters } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { getAllSpotsNormalized, getSpotByIdNormalized } from '@/domain/adapters/normalizeSpot';

export function getMockVibes(filters = {}) {
  const {
    experienceMode = 'local',
    companion = 'solo',
    locale = 'ja',
    category = 'all',
    location,
  } = filters;

  let vibes = applyVibeFilters(ENRICHED_VIBES, {
    category,
    experienceMode,
    companion,
  });

  if (location) {
    vibes = vibes.filter((v) => v.area === location);
  }

  return localizeVibes(vibes, { locale, experienceMode });
}

export function getMockVibesSync() {
  return ENRICHED_VIBES;
}

export { getAllSpotsNormalized, getSpotByIdNormalized };
