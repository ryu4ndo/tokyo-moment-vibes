import { getMockWeather } from '../src/domain/mock/weatherMock.js';
import { getEventsForDate } from '../src/data/eventsCatalog.js';
import { getAllSpotsNormalized } from '../src/domain/adapters/normalizeSpot.js';
import { ENRICHED_VIBES } from '../src/data/vibes.js';
import { applyVibeFilters } from '../src/features/vibes/vibeFilters.js';
import { localizeVibes } from '../src/features/vibes/localizeVibe.js';
import { AREA_COORDINATES } from '../src/data/areas.js';

export function getWeather({ area = '渋谷' }) {
  return getMockWeather(area);
}

export function getEvents({ date }) {
  const d = date ? new Date(date) : new Date();
  return getEventsForDate(d);
}

export function getSpots({ area, locale = 'ja' }) {
  let spots = getAllSpotsNormalized(locale);
  if (area) spots = spots.filter((s) => s.area === area);
  return spots;
}

export function getSpotById(spotId, locale = 'ja') {
  const spots = getAllSpotsNormalized(locale);
  return spots.find((s) => s.id === spotId) ?? null;
}

export function getVibes({ experienceMode = 'local', companion = 'solo', locale = 'ja', category = 'all', location }) {
  let vibes = applyVibeFilters(ENRICHED_VIBES, { category, experienceMode, companion });
  if (location) vibes = vibes.filter((v) => v.area === location);
  return localizeVibes(vibes, { locale, experienceMode });
}

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

export function getNearbySpots({ lat, lng, area, limit = 10, locale = 'ja' }) {
  const origin = lat && lng ? { lat: Number(lat), lng: Number(lng) } : AREA_COORDINATES[area] ?? AREA_COORDINATES['渋谷'];
  const spots = getAllSpotsNormalized(locale);

  return spots
    .map((spot) => {
      const distanceMeters = haversineMeters(origin.lat, origin.lng, spot.lat, spot.lng);
      return {
        spot,
        walkMinutes: Math.max(3, Math.min(30, Math.round(distanceMeters / 80))),
        distanceMeters: Math.round(distanceMeters),
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}

export function getRoute({ from, to }) {
  const distanceMeters = haversineMeters(from.lat, from.lng, to.lat, to.lng);
  const walkMinutes = Math.max(3, Math.min(30, Math.round(distanceMeters / 80)));
  return {
    walkMinutes,
    distanceMeters: Math.round(distanceMeters),
    polyline: null,
    mapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`,
    source: 'mock',
  };
}
