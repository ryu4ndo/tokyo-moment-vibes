import { spots, AREA_COORDINATES } from '@/data/spots';
import { getPrimaryReservationUrl, getReservationLinks } from '@/services/reservationService';

const spotById = new Map(spots.map((s) => [s.id, s]));

export function getSpotById(spotId) {
  return spotById.get(spotId) ?? null;
}

export function getReservationUrl(spot, options) {
  if (!spot) return null;
  if (spot.reservationUrl) return spot.reservationUrl;
  return getPrimaryReservationUrl(spot, options);
}

export { getReservationLinks };

export function getGoogleMapsUrl(spot) {
  if (!spot?.lat || !spot?.lng) return null;
  const label = encodeURIComponent(spot.name);
  return `https://www.google.com/maps/search/?api=1&query=${label}&query_place_id=&center=${spot.lat},${spot.lng}`;
}

export function enrichWithSpotData(entity) {
  const spot = entity.spotId ? getSpotById(entity.spotId) : null;
  if (!spot) {
    const area = entity.area ?? '東京';
    const base = AREA_COORDINATES[area];
    return {
      ...entity,
      lat: entity.lat ?? base?.lat,
      lng: entity.lng ?? base?.lng,
      reservationUrl: entity.reservationUrl ?? null,
    };
  }
  return {
    ...entity,
    lat: spot.lat,
    lng: spot.lng,
    area: spot.area,
    spotDescription: spot.description,
    reservationUrl: getReservationUrl(spot),
    googleMapsUrl: getGoogleMapsUrl(spot),
    openingHours: entity.openingHours,
    priceRange: entity.priceRange ?? spot.budget,
  };
}

export function searchSpotsLocal(query, area) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return spots
    .filter((s) => {
      if (area && area !== 'all' && s.area !== area) return false;
      return (
        s.name.toLowerCase().includes(q) ||
        s.area.includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.includes(q)
      );
    })
    .slice(0, 10);
}
