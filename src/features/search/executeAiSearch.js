import { parseSearchQuery, applySearchFilters } from './parseSearchQuery';
import { rankAiSearch } from './rankAiSearch';
import { buildSearchReason, buildSearchAiMessage } from './buildSearchReason';
import { AI_FILTER_CHIPS } from './searchChips';

export function executeAiSearch({
  query,
  context,
  activeFilters = [],
  excludeSpotIds = [],
  limit = 6,
}) {
  const baseParsed = parseSearchQuery(query);
  const parsed = applySearchFilters(baseParsed, activeFilters);

  const ranked = rankAiSearch(parsed, context, { limit, excludeSpotIds });

  const results = ranked.map(({ vibe, score }) => ({
    spotId: vibe.spotId,
    vibeId: vibe.id,
    vibe,
    shopName: vibe.shopName,
    area: vibe.area,
    category: vibe.category,
    image: vibe.image,
    rating: vibe.rating,
    priceRange: vibe.priceRange,
    walkMinutes: vibe.walkMinutes,
    lat: vibe.lat,
    lng: vibe.lng,
    reason: buildSearchReason(vibe, parsed, context),
    score,
  }));

  return {
    query,
    parsed,
    activeFilters,
    aiMessage: buildSearchAiMessage(query, results, parsed, context),
    results,
    availableFilters: AI_FILTER_CHIPS,
  };
}
