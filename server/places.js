import { spots, AREA_COORDINATES } from '../src/data/spots.js';

function getApiKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || null;
}

function hashRating(id) {
  return Number((4.1 + (id.length % 8) / 10).toFixed(1));
}

function estimateWalkMinutes(fromArea, toLat, toLng) {
  const base = AREA_COORDINATES[fromArea];
  if (!base || !toLat || !toLng) return null;
  const latDiff = Math.abs(base.lat - toLat);
  const lngDiff = Math.abs(base.lng - toLng);
  const km = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111;
  return Math.max(3, Math.min(25, Math.round(km / 0.08)));
}

function formatOpeningHours(periods, weekdayText, locale = 'ja') {
  if (weekdayText?.length) {
    return locale === 'en' ? weekdayText.join(' · ') : weekdayText.join(' / ');
  }
  if (!periods?.length) return null;
  return periods
    .slice(0, 2)
    .map((p) => {
      const open = p.open?.time ?? '';
      const close = p.close?.time ?? '';
      return `${open.slice(0, 2)}:${open.slice(2)} – ${close.slice(0, 2)}:${close.slice(2)}`;
    })
    .join(' / ');
}

function buildLocalPlaceDetail(spot, { fromArea, locale = 'ja' } = {}) {
  const rating = hashRating(spot.id);
  const walkMinutes = estimateWalkMinutes(fromArea ?? spot.area, spot.lat, spot.lng);

  return {
    placeId: spot.id,
    spotId: spot.id,
    name: spot.name,
    address: locale === 'en' ? `${spot.area}, Tokyo` : `東京都${spot.area}`,
    lat: spot.lat,
    lng: spot.lng,
    rating,
    reviewCount: 80 + (spot.id.length % 400),
    category: spot.category,
    description: spot.description,
    openingHours: formatHoursByCategory(spot.category, locale),
    openNow: true,
    walkMinutes: walkMinutes ?? 8,
    photos: [getCategoryPhoto(spot.category)],
    reviews: buildLocalReviews(spot, locale),
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.area + ' Tokyo')}`,
    reservationLinks: buildReservationLinks(spot.name, spot.area, spot.category),
    source: 'local',
  };
}

function formatHoursByCategory(category, locale) {
  const hours = {
    wine: { ja: '17:00 – 24:00', en: '5:00 PM – 12:00 AM' },
    cafe: { ja: '08:00 – 22:00', en: '8:00 AM – 10:00 PM' },
    food: { ja: '11:30 – 23:30', en: '11:30 AM – 11:30 PM' },
    nightlife: { ja: '18:00 – 02:00', en: '6:00 PM – 2:00 AM' },
    walk: { ja: '24時間', en: '24 hours' },
    culture: { ja: '10:00 – 18:00', en: '10:00 AM – 6:00 PM' },
  };
  const h = hours[category] ?? hours.food;
  return locale === 'en' ? h.en : h.ja;
}

function getCategoryPhoto(category) {
  const photos = {
    wine: 'https://images.unsplash.com/photo-1510812431400-5740424cf0ef?w=800&q=80',
    cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    food: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    nightlife: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    walk: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    culture: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  };
  return photos[category] ?? photos.food;
}

function buildLocalReviews(spot, locale) {
  const ja = [
    { author: '地元の常連', text: `${spot.name}は雰囲気が最高。`, rating: 5 },
    { author: '東京ナイト派', text: 'また来たいと思える一軒。', rating: 4 },
  ];
  const en = [
    { author: 'Local regular', text: `Great atmosphere at ${spot.name}.`, rating: 5 },
    { author: 'Night explorer', text: 'Would definitely come back.', rating: 4 },
  ];
  return locale === 'en' ? en : ja;
}

function buildReservationLinks(name, area, category) {
  const q = encodeURIComponent(`${name} ${area}`);
  const links = [
    { id: 'tabelog', label: '食べログ', url: `https://tabelog.com/rstLst/?sk=${q}` },
    { id: 'hotpepper', label: 'ホットペッパー', url: `https://www.hotpepper.jp/strJ1010/?key=${q}` },
  ];
  if (['wine', 'food', 'nightlife'].includes(category)) {
    links.push({
      id: 'tablecheck',
      label: 'TableCheck',
      url: `https://www.tablecheck.com/en/shops/search?q=${encodeURIComponent(name + ' ' + area + ' Tokyo')}`,
    });
    links.push({
      id: 'opentable',
      label: 'OpenTable',
      url: `https://www.opentable.com/s?term=${encodeURIComponent(name + ' ' + area + ' Tokyo')}`,
    });
  }
  return links;
}

function searchSpotsLocal(query, area) {
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

function mapGooglePlace(place, key) {
  return {
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    rating: place.rating,
    reviewCount: place.user_ratings_total,
    lat: place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng,
    openNow: place.opening_hours?.open_now,
    photos: (place.photos ?? []).slice(0, 4).map(
      (p) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${key}`
    ),
    googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    source: 'google',
  };
}

export async function searchPlaces({ query, area, location = 'Tokyo', locale = 'ja' }) {
  const key = getApiKey();
  const localResults = searchSpotsLocal(query, area).map((spot) =>
    buildLocalPlaceDetail(spot, { fromArea: area, locale })
  );

  if (!key || !query?.trim()) {
    return { places: localResults, source: 'local' };
  }

  try {
    const searchQuery = encodeURIComponent(`${query} ${area && area !== 'all' ? area : ''} ${location}`.trim());
    const lang = locale === 'en' ? 'en' : 'ja';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&language=${lang}&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return { places: localResults, source: 'local', warning: data.status };
    }

    const googlePlaces = (data.results ?? []).slice(0, 8).map((p) => mapGooglePlace(p, key));
    const merged = [...googlePlaces];
    for (const local of localResults) {
      if (!merged.some((p) => p.name === local.name)) merged.push(local);
    }
    return { places: merged.slice(0, 12), source: 'mixed' };
  } catch {
    return { places: localResults, source: 'local' };
  }
}

export async function getPlaceDetails({ placeId, spotId, fromArea, locale = 'ja' }) {
  if (spotId) {
    const spot = spots.find((s) => s.id === spotId);
    if (spot) return buildLocalPlaceDetail(spot, { fromArea: fromArea ?? spot.area, locale });
  }

  const key = getApiKey();
  if (!key || !placeId) return null;

  try {
    const lang = locale === 'en' ? 'en' : 'ja';
    const fields = [
      'name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total',
      'opening_hours', 'url', 'website', 'photos', 'reviews', 'types',
    ].join(',');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=${lang}&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK') return null;
    const p = data.result;

    const photos = (p.photos ?? []).slice(0, 6).map(
      (photo) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photo_reference=${photo.photo_reference}&key=${key}`
    );

    const reviews = (p.reviews ?? []).slice(0, 5).map((r) => ({
      author: r.author_name,
      text: r.text,
      rating: r.rating,
      time: r.relative_time_description,
    }));

    const category = p.types?.includes('bar') ? 'nightlife' : p.types?.includes('cafe') ? 'cafe' : 'food';

    return {
      placeId,
      spotId: spotId ?? null,
      name: p.name,
      address: p.formatted_address,
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
      rating: p.rating,
      reviewCount: p.user_ratings_total,
      openNow: p.opening_hours?.open_now,
      openingHours: formatOpeningHours(p.opening_hours?.periods, p.opening_hours?.weekday_text, locale),
      walkMinutes: estimateWalkMinutes(fromArea, p.geometry?.location?.lat, p.geometry?.location?.lng),
      photos: photos.length ? photos : [getCategoryPhoto(category)],
      reviews,
      website: p.website,
      googleMapsUrl: p.url ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reservationLinks: buildReservationLinks(p.name, fromArea ?? 'Tokyo', category),
      source: 'google',
    };
  } catch {
    return null;
  }
}
