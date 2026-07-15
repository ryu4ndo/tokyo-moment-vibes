import { ENRICHED_VIBES } from '@/data/vibes';
import { isApiData } from '@/config/dataSource';
import { getApi } from './apiClient';
import { getMockVibes } from '@/domain/mock/vibesMock';

/** Vibes feed — mock sync or API async */
export async function fetchVibes(filters = {}) {
  if (isApiData) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') params.set(k, String(v));
    });
    const { vibes } = await getApi(`/api/vibes?${params}`);
    return vibes;
  }
  return getMockVibes(filters);
}

export function getVibesSync() {
  return ENRICHED_VIBES;
}
