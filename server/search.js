import { executeAiSearch } from '../src/features/search/executeAiSearch.js';

export function searchSpots({ query, context, activeFilters = [], excludeSpotIds = [] }) {
  return executeAiSearch({ query, context, activeFilters, excludeSpotIds });
}
