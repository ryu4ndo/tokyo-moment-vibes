import { AREA_COORDINATES } from '@/data/areas';
import { isApiData } from '@/config/dataSource';
import { postApi } from './apiClient';
import { getAllSpotsNormalized } from '@/domain/mock/vibesMock';

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateWalkMinutes(distanceMeters) {
  return Math.max(3, Math.min(30, Math.round(distanceMeters / 80)));
}

/** Google Maps deep link — ready for Directions API swap */
export function buildMapsDirectionsUrl({ origin, destination, locale = 'ja' }) {
  const hl = locale === 'en' ? 'en' : 'ja';
  const originQ = `${origin.lat},${origin.lng}`;
  const destQ = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originQ}&destination=${destQ}&travelmode=walking&hl=${hl}`;
}

export function buildMapsSearchUrl({ lat, lng, locale = 'ja' }) {
  const hl = locale === 'en' ? 'en' : 'ja';
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=&hl=${hl}`;
}

export async function fetchNearbySpots({ lat, lng, area, limit = 10, locale = 'ja' }) {
  if (isApiData) {
    const result = await postApi('/api/maps/nearby', { lat, lng, area, limit, locale });
    return result.nearby ?? [];
  }

  const origin = lat && lng ? { lat, lng } : AREA_COORDINATES[area] ?? AREA_COORDINATES['渋谷'];
  const spots = getAllSpotsNormalized(locale);

  return spots
    .map((spot) => {
      const distanceMeters = haversineMeters(origin.lat, origin.lng, spot.lat, spot.lng);
      return {
        spot,
        walkMinutes: estimateWalkMinutes(distanceMeters),
        distanceMeters: Math.round(distanceMeters),
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}

export async function fetchRoute({ from, to, locale = 'ja' }) {
  if (isApiData) {
    const result = await postApi('/api/maps/route', { from, to, locale });
    return result.route;
  }

  const distanceMeters = haversineMeters(from.lat, from.lng, to.lat, to.lng);
  const walkMinutes = estimateWalkMinutes(distanceMeters);

  return {
    walkMinutes,
    distanceMeters: Math.round(distanceMeters),
    polyline: null,
    mapsUrl: buildMapsDirectionsUrl({ origin: from, destination: to, locale }),
    source: 'mock',
  };
}

export function getWalkMinutesBetween(from, to) {
  const distanceMeters = haversineMeters(from.lat, from.lng, to.lat, to.lng);
  return estimateWalkMinutes(distanceMeters);
}
