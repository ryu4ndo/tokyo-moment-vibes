import { ENRICHED_VIBES } from '@/data/vibes';
import { spots } from '@/data/spots';
import { getSpotById } from '@/utils/spotLookup';

export function normalizeSpotFromVibe(vibe, locale = 'ja') {
  const spot = vibe.spotId ? getSpotById(vibe.spotId) : null;
  const photos = vibe.images?.length ? vibe.images : [vibe.image].filter(Boolean);
  const videos = vibe.isVideo && vibe.videoUrl ? [vibe.videoUrl] : [];

  return {
    id: vibe.spotId ?? vibe.id,
    name: vibe.shopName ?? spot?.name ?? '',
    photos,
    videos,
    openingHours: vibe.openingHours ?? '—',
    priceRange: vibe.priceRange ?? '¥¥',
    genre: vibe.categoryLabel ?? vibe.category ?? spot?.category ?? '',
    category: vibe.category ?? spot?.category ?? 'food',
    address: locale === 'en' ? `${vibe.area}, Tokyo` : `東京都${vibe.area}`,
    area: vibe.area ?? spot?.area ?? '東京',
    rating: vibe.rating ?? 4.5,
    reviewCount: vibe.reviewCount ?? 0,
    reviews: vibe.reviewSnippet
      ? [{ text: vibe.reviewSnippet, rating: vibe.rating ?? 4.5, author: 'Guest' }]
      : [],
    lat: vibe.lat ?? spot?.lat ?? 0,
    lng: vibe.lng ?? spot?.lng ?? 0,
    walkMinutes: vibe.walkMinutes,
    googleMapsUrl: vibe.googleMapsUrl,
    placeId: vibe.placeId ?? vibe.spotId,
    source: 'mock',
  };
}

export function normalizeSpotFromRaw(spot, locale = 'ja') {
  const vibe = ENRICHED_VIBES.find((v) => v.spotId === spot.id);
  if (vibe) return normalizeSpotFromVibe(vibe, locale);

  return {
    id: spot.id,
    name: spot.name,
    photos: [],
    videos: [],
    openingHours: '—',
    priceRange: spot.budget ?? '¥¥',
    genre: spot.category,
    category: spot.category,
    address: locale === 'en' ? `${spot.area}, Tokyo` : `東京都${spot.area}`,
    area: spot.area,
    rating: 4.5,
    reviewCount: 0,
    reviews: spot.description ? [{ text: spot.description, rating: 4.5 }] : [],
    lat: spot.lat ?? 0,
    lng: spot.lng ?? 0,
    walkMinutes: null,
    source: 'mock',
  };
}

export function getAllSpotsNormalized(locale = 'ja') {
  return ENRICHED_VIBES.map((v) => normalizeSpotFromVibe(v, locale));
}

export function getSpotByIdNormalized(spotId, locale = 'ja') {
  const vibe = ENRICHED_VIBES.find((v) => v.spotId === spotId || v.id === spotId);
  if (vibe) return normalizeSpotFromVibe(vibe, locale);
  const spot = spots.find((s) => s.id === spotId);
  return spot ? normalizeSpotFromRaw(spot, locale) : null;
}
