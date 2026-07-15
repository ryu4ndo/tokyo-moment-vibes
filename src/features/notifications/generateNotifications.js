import { ENRICHED_VIBES } from '@/data/vibes';
import { getSpotAreaForLocation } from '@/data/areas';

const NOTIF_ICONS = {
  today: '✨',
  event: '🎉',
  nearby: '📍',
  saved: '💜',
};

export function generateNotifications({
  locale = 'ja',
  location = '渋谷',
  experienceMode = 'local',
  weather = null,
  events = null,
  savedSpotIds = [],
  todayHero = null,
}) {
  const isEn = locale === 'en';
  const items = [];
  const dateKey = new Date().toISOString().slice(0, 10);
  const now = Date.now();

  if (todayHero) {
    items.push({
      id: `today-${dateKey}`,
      type: 'today',
      icon: NOTIF_ICONS.today,
      title: isEn ? "Today's AI Pick" : '今日のAIおすすめ',
      body: todayHero.shopName ?? todayHero.name,
      createdAt: now,
      read: false,
      spotId: todayHero.spotId ?? null,
    });
  }

  const todayEvents = events?.today ?? [];
  todayEvents.slice(0, 2).forEach((event, i) => {
    items.push({
      id: `event-${event.id}-${dateKey}`,
      type: 'event',
      icon: NOTIF_ICONS.event,
      title: isEn ? 'Happening today' : '今日のイベント',
      body: isEn ? event.titleEn : event.titleJa,
      createdAt: now - i * 1000,
      read: false,
      eventId: event.id,
      area: event.area,
    });
  });

  const area = getSpotAreaForLocation(location);
  const nearbySaved = savedSpotIds
    .map((id) => ENRICHED_VIBES.find((v) => v.spotId === id))
    .filter((v) => v && (v.area === area || v.area === location))
    .slice(0, 1);

  nearbySaved.forEach((vibe) => {
    items.push({
      id: `nearby-${vibe.spotId}-${dateKey}`,
      type: 'nearby',
      icon: NOTIF_ICONS.nearby,
      title: isEn ? 'Saved spot nearby' : '保存スポットが近くに',
      body: isEn
        ? `${vibe.shopName} is in ${vibe.area} — you're close!`
        : `${vibe.shopName}（${vibe.area}）が近くにあります`,
      createdAt: now - 5000,
      read: false,
      spotId: vibe.spotId,
    });
  });

  if (weather?.condition === 'rain') {
    items.push({
      id: `weather-rain-${dateKey}`,
      type: 'today',
      icon: '🌧️',
      title: isEn ? 'Rainy day picks' : '雨の日のおすすめ',
      body: isEn
        ? 'Indoor cafés and galleries match today’s weather.'
        : '屋内カフェ・美術館が今日の天気にぴったりです。',
      createdAt: now - 3000,
      read: false,
      action: 'search',
    });
  }

  return items.slice(0, 8);
}
