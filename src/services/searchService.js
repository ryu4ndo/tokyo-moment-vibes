import { isApiData } from '@/config/dataSource';
import { postApi } from './apiClient';
import { executeAiSearch } from '@/features/search/executeAiSearch';

export async function searchWithAi({ query, context, activeFilters = [], excludeSpotIds = [] }) {
  if (isApiData) {
    try {
      return await postApi('/api/search', { query, context, activeFilters, excludeSpotIds });
    } catch {
      /* fall through to client */
    }
  }
  return executeAiSearch({ query, context, activeFilters, excludeSpotIds });
}
