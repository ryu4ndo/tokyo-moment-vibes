import { getRouteTypeLabel } from '@/data/journeyRouteTypes';
import { formatFreeTime } from '@/utils/formatters';

function vibeToSpot(vibe) {
  return {
    id: vibe.spotId ?? vibe.id,
    name: vibe.shopName ?? vibe.name,
    area: vibe.area,
    lat: vibe.lat,
    lng: vibe.lng,
    walkMinutes: vibe.walkMinutes ?? 5,
    category: vibe.category,
    description: vibe.spotDescription ?? vibe.description ?? '',
    budget: vibe.priceRange,
    image: vibe.image,
    duration: 45,
  };
}

function getStartDate() {
  const now = new Date();
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 15) * 15;
  now.setMinutes(rounded, 0, 0);
  return now;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatTime(date, locale) {
  return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Convert AI Journey to Plan page seed plan */
export function journeyToPlan(journey, { locale = 'ja', companion, experienceMode }) {
  const location = journey.stops[0]?.vibe?.area ?? '渋谷';
  const spots = journey.stops.map((s) => vibeToSpot(s.vibe));
  let current = getStartDate();
  const schedule = [];

  const startLabel =
    locale === 'en' ? `Start at ${spots[0]?.name}` : `${spots[0]?.name}からスタート`;
  schedule.push({ time: formatTime(current, locale), activity: startLabel, spotName: spots[0]?.name });

  for (let i = 1; i < journey.stops.length; i += 1) {
    const leg = journey.legs[i - 1];
    const stop = journey.stops[i];
    const spot = spots[i];
    current = addMinutes(current, leg?.walkMinutes ?? 5);
    const walkLabel =
      locale === 'en'
        ? `Walk ${leg?.walkMinutes ?? 5} min → ${spot.name}`
        : `徒歩${leg?.walkMinutes ?? 5}分 → ${spot.name}`;
    schedule.push({ time: formatTime(current, locale), activity: walkLabel, spotName: spot.name });
    current = addMinutes(current, stop.dwellMinutes ?? 30);
    const stayLabel =
      locale === 'en' ? `At ${spot.name}` : `${spot.name}で過ごす`;
    schedule.push({ time: formatTime(current, locale), activity: stayLabel, spotName: spot.name });
  }

  const routeLabel = getRouteTypeLabel(journey.routeType, locale);
  const freeLabel = formatFreeTime(journey.freeTime, locale);

  return {
    id: `journey-plan-${Date.now()}`,
    title: locale === 'en' ? 'AI Journey' : 'AIジャーニー',
    summary:
      locale === 'en'
        ? `${location} · ${freeLabel} · ${routeLabel}`
        : `${location} · ${freeLabel} · ${routeLabel}`,
    aiReason:
      locale === 'en'
        ? `A ${routeLabel.toLowerCase()} route with ${journey.stops.length} stops — ${journey.totalWalkMinutes} min walking total.`
        : `${routeLabel}向けの${journey.stops.length}スポットルート。徒歩合計約${journey.totalWalkMinutes}分。`,
    schedule,
    steps: schedule.map((item) => `${item.time} ${item.activity}`),
    spots,
    experienceMode,
    companion,
    locale,
    journeyId: journey.id,
    isJourneyPlan: true,
  };
}
