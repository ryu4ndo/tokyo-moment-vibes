import { getApi, postApi } from './apiClient.js';

export async function searchPlaces({ query, area, location }) {
  return postApi('/api/places/search', { query, area, location });
}

export async function fetchPlaceDetails({ placeId, spotId, fromArea, locale }) {
  const params = new URLSearchParams({
    placeId: placeId ?? '',
    spotId: spotId ?? '',
    fromArea: fromArea ?? '',
    locale: locale ?? 'ja',
  });
  return getApi(`/api/places/details?${params}`);
}
