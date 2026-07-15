import { isApiData } from '@/config/dataSource';
import { getApi } from './apiClient';
import {
  getAllSpotsNormalized,
  getSpotByIdNormalized,
  getMockVibes,
} from '@/domain/mock/vibesMock';
import { searchPlaces, fetchPlaceDetails } from './placesService';

export async function fetchSpots({ area, locale = 'ja' } = {}) {
  if (isApiData) {
    const params = new URLSearchParams({ area: area ?? '', locale });
    const { spots } = await getApi(`/api/spots?${params}`);
    return spots;
  }
  let spots = getAllSpotsNormalized(locale);
  if (area) spots = spots.filter((s) => s.area === area);
  return spots;
}

export async function fetchSpotById(spotId, locale = 'ja') {
  if (isApiData) {
    const { spot } = await getApi(`/api/spots/${spotId}?locale=${locale}`);
    return spot;
  }
  return getSpotByIdNormalized(spotId, locale);
}

export function getSpotsSync(locale = 'ja') {
  return getAllSpotsNormalized(locale);
}

export async function searchSpots({ query, area, locale = 'ja' }) {
  if (isApiData) {
    const result = await searchPlaces({ query, area, locale });
    return result.places ?? [];
  }
  const q = query?.trim().toLowerCase() ?? '';
  return getAllSpotsNormalized(locale).filter(
    (s) =>
      (!area || s.area === area) &&
      (!q || s.name.toLowerCase().includes(q) || s.area.includes(q) || s.genre.includes(q)),
  );
}

export async function fetchSpotDetails({ spotId, fromArea, locale = 'ja' }) {
  const result = await fetchPlaceDetails({ spotId, fromArea, locale });
  return result.place;
}

export { getMockVibes };
