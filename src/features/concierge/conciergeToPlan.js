import { formatFreeTime } from '@/utils/formatters';
import { ENRICHED_VIBES } from '@/data/vibes';

function vibeToSpot(vibe) {
  return {
    id: vibe.spotId ?? vibe.id,
    name: vibe.shopName ?? vibe.name,
    area: vibe.area,
    lat: vibe.lat,
    lng: vibe.lng,
    walkMinutes: vibe.walkMinutes ?? 5,
    category: vibe.category,
    description: vibe.description ?? '',
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

/** Build a Plan seed from concierge recommendations */
export function conciergeToPlan(recommendations, { locale = 'ja', location, freeTime, companion, experienceMode }) {
  const vibes = recommendations
    .map((rec) => ENRICHED_VIBES.find((v) => v.spotId === rec.spotId))
    .filter(Boolean);

  if (!vibes.length) return null;

  const spots = vibes.map(vibeToSpot);
  const area = location ?? spots[0]?.area ?? '渋谷';
  let current = getStartDate();
  const schedule = [];

  schedule.push({
    time: formatTime(current, locale),
    activity: locale === 'en' ? `Start at ${spots[0].name}` : `${spots[0].name}からスタート`,
    spotName: spots[0].name,
  });

  for (let i = 1; i < spots.length; i += 1) {
    const walkMin = spots[i].walkMinutes ?? 5;
    current = addMinutes(current, walkMin);
    schedule.push({
      time: formatTime(current, locale),
      activity:
        locale === 'en'
          ? `Walk ${walkMin} min → ${spots[i].name}`
          : `徒歩${walkMin}分 → ${spots[i].name}`,
      spotName: spots[i].name,
    });
    current = addMinutes(current, 30);
    schedule.push({
      time: formatTime(current, locale),
      activity: locale === 'en' ? `At ${spots[i].name}` : `${spots[i].name}で過ごす`,
      spotName: spots[i].name,
    });
  }

  const freeLabel = formatFreeTime(freeTime ?? '2時間', locale);

  return {
    id: `concierge-plan-${Date.now()}`,
    title: locale === 'en' ? 'Concierge Plan' : 'コンシェルジュプラン',
    summary: locale === 'en' ? `${area} · ${freeLabel}` : `${area} · ${freeLabel}`,
    aiReason:
      locale === 'en'
        ? `Curated from your concierge chat — ${spots.length} stops in ${area}.`
        : `AIコンシェルジュの会話から作成 — ${area}で${spots.length}スポット。`,
    schedule,
    steps: schedule.map((item) => `${item.time} ${item.activity}`),
    spots,
    experienceMode,
    companion,
    locale,
    isConciergePlan: true,
  };
}
