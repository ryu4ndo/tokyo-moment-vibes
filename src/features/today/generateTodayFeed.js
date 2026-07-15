import { ENRICHED_VIBES } from '@/data/vibes';
import { getTodayEvents } from '@/data/todayEvents';
import { applyVibeFilters } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { getSpotAreaForLocation } from '@/data/areas';

import { WEATHER_CATEGORIES } from '@/domain/weather/categories';

const LOCAL_CATEGORIES = [
  {
    id: 'food',
    labelJa: '今日人気のグルメ',
    labelEn: 'Trending food',
    accent: 'food',
    categories: ['food'],
    preferPopular: true,
  },
  {
    id: 'cafe',
    labelJa: '今日人気のカフェ',
    labelEn: 'Trending cafés',
    accent: 'cafe',
    categories: ['cafe', 'chill'],
  },
  {
    id: 'event',
    labelJa: '今日のイベント',
    labelEn: "Today's events",
    accent: 'culture',
    eventLinked: true,
  },
  {
    id: 'limited',
    labelJa: '今日だけの限定',
    labelEn: 'Today only',
    accent: 'luxury',
    badgeJa: '限定',
    badgeEn: 'Limited',
    preferAiPick: true,
  },
  {
    id: 'weather',
    labelJa: '天気に合うスポット',
    labelEn: 'Weather picks',
    accent: 'nightview',
    weatherBased: true,
  },
  {
    id: 'night',
    labelJa: '夜おすすめ',
    labelEn: 'Tonight',
    accent: 'bar',
    lateNight: true,
  },
  {
    id: 'trending',
    labelJa: '今話題の場所',
    labelEn: 'Trending now',
    accent: 'ai',
    preferPopular: true,
  },
];

const TRAVELER_CATEGORIES = [
  {
    id: 'festival',
    labelJa: '今日開催のお祭り',
    labelEn: "Today's festivals",
    accent: 'culture',
    eventLinked: true,
  },
  {
    id: 'seasonal',
    labelJa: '季節限定グルメ',
    labelEn: 'Seasonal eats',
    accent: 'food',
    categories: ['food'],
    seasonal: true,
  },
  {
    id: 'rising',
    labelJa: '外国人に人気急上昇',
    labelEn: 'Rising with visitors',
    accent: 'nightview',
    travelerOnly: true,
    preferPopular: true,
  },
  {
    id: 'culture',
    labelJa: '日本文化イベント',
    labelEn: 'Culture events',
    accent: 'culture',
    categories: ['music', 'chill', 'nightview'],
  },
  {
    id: 'exclusive',
    labelJa: '今しかできない体験',
    labelEn: 'Only right now',
    accent: 'luxury',
    badgeJa: '限定体験',
    badgeEn: 'Limited',
    preferAiPick: true,
  },
  {
    id: 'weather',
    labelJa: '天気に合うスポット',
    labelEn: 'Weather picks',
    accent: 'nightview',
    weatherBased: true,
  },
  {
    id: 'night',
    labelJa: '夜おすすめ',
    labelEn: 'Tonight',
    accent: 'bar',
    lateNight: true,
  },
];

const AI_COMMENT_TEMPLATES = {
  ja: {
    default: [
      '今日の東京、あなたの気分に合うスポットをセレクトしました。',
      'AIが今日の文脈から、いま行くべき場所を厳選しています。',
      '毎日変わるToday — 今日だけの東京をのぞいてみましょう。',
    ],
    local: [
      '地元の人が今日行っているお店をピックアップしました。',
      '新オープン・限定メニューなど、今日の東京ネタをまとめました。',
    ],
    traveler: [
      '日本ならではの体験を、今日の文脈でセレクトしました。',
      '旅行者に人気のスポットと、今しかできない体験を集めました。',
    ],
  },
  en: {
    default: [
      "Today's Tokyo — curated for your mood and context.",
      'AI picked what to do in Tokyo right now.',
      'Fresh every day. Here is what matters today.',
    ],
    local: [
      'What locals are doing in Tokyo today.',
      'New openings, limited menus, and tonight’s buzz.',
    ],
    traveler: [
      'Japan-only experiences selected for today.',
      'Rising visitor favorites and limited-time moments.',
    ],
  },
};

export function getDateSeed(date = new Date()) {
  const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatDateLabel(date, locale) {
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ja-JP', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function seededIndex(seed, offset, length) {
  if (!length) return 0;
  return (seed + offset * 17) % length;
}

function scoreVibe(vibe, { profile, location, preferPopular, preferAiPick, lateNight, travelerOnly }) {
  let score = vibe.rating ?? 4;
  const spotArea = getSpotAreaForLocation(location);
  if (vibe.area === spotArea || vibe.area === location) score += 3;
  if (preferPopular && vibe.isPopular) score += 4;
  if (preferAiPick && vibe.aiPick) score += 5;
  if (lateNight && vibe.lateNight) score += 4;
  if (travelerOnly && vibe.experienceModes?.includes('traveler')) score += 5;
  return applyProfileBoost(score, vibe, profile);
}

function pickVibeForCategory(cat, pool, ctx) {
  const { seed, index, weather, events, location } = ctx;
  let candidates = [...pool];

  if (cat.weatherBased) {
    const cats = WEATHER_CATEGORIES[weather] ?? WEATHER_CATEGORIES.clear;
    candidates = candidates.filter((v) => cats.includes(v.category));
  }

  if (cat.lateNight) {
    candidates = candidates.filter((v) => v.lateNight || v.category === 'bar');
  }

  if (cat.categories?.length) {
    const filtered = candidates.filter((v) => cat.categories.includes(v.category));
    if (filtered.length) candidates = filtered;
  }

  if (cat.eventLinked && events.length > 0) {
    const eventArea = events[0].area;
    const inArea = candidates.filter((v) => v.area === eventArea);
    if (inArea.length) candidates = inArea;
  }

  if (cat.travelerOnly) {
    const traveler = candidates.filter((v) =>
      v.experienceModes?.some((m) => ['traveler', 'classic'].includes(m)),
    );
    if (traveler.length) candidates = traveler;
  }

  if (!candidates.length) candidates = [...pool];

  const used = ctx.usedIds ?? new Set();
  const scored = candidates
    .filter((v) => !used.has(v.id))
    .map((v) => ({
      vibe: v,
      score: scoreVibe(v, {
        profile: ctx.profile,
        location,
        preferPopular: cat.preferPopular,
        preferAiPick: cat.preferAiPick,
        lateNight: cat.lateNight,
        travelerOnly: cat.travelerOnly,
      }),
    }))
    .sort((a, b) => b.score - a.score);

  const pick = scored[seededIndex(seed, index, scored.length)]?.vibe ?? scored[0]?.vibe;
  if (pick) used.add(pick.id);
  return pick;
}

export function buildTodayAiComment({
  locale = 'ja',
  experienceMode = 'local',
  weather = 'clear',
  events = [],
  date = new Date(),
  location = '渋谷',
}) {
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const isEn = locale === 'en';

  if (events.length > 0) {
    const e = events[0];
    return isEn
      ? `${e.nameEn} is happening — the ${e.area} area will be especially lively today.`
      : `今日は${e.nameJa}があるため、${e.area}エリアが賑わっています。`;
  }

  if (weather === 'rain') {
    return isEn
      ? 'Rainy today — cool indoor spots and cozy cafés are your best move.'
      : '今日は雨なので、涼しく過ごせる屋内スポットがおすすめです。';
  }

  if (month >= 6 && month <= 9 && weather === 'clear') {
    return isEn
      ? "It's warm today — air-conditioned cafés and evening rooftops work beautifully."
      : '今日は気温が高いので、涼しい屋内スポットがおすすめです。';
  }

  if (day === 5) {
    return isEn
      ? "It's Friday — izakaya and bars are especially popular tonight."
      : '金曜日なので居酒屋・バーが人気です。';
  }

  if (day === 6) {
    return isEn
      ? 'Saturday night in Tokyo — rooftops and nightlife are buzzing.'
      : '土曜の夜は夜景スポットとバーが特に賑わいます。';
  }

  const seed = getDateSeed(date);
  const templates = AI_COMMENT_TEMPLATES[isEn ? 'en' : 'ja'];
  const pool =
    experienceMode === 'traveler'
      ? [...templates.traveler, ...templates.default]
      : [...templates.local, ...templates.default];
  return pool[seed % pool.length];
}

export function generateTodayFeed({
  locale = 'ja',
  experienceMode = 'local',
  companion = 'solo',
  location = '渋谷',
  weather = 'clear',
  profile = null,
  date = new Date(),
  events: eventsOverride = null,
}) {
  const seed = getDateSeed(date);
  const events =
    eventsOverride?.today?.map((e) => ({
      id: e.id,
      nameJa: e.titleJa ?? e.nameJa,
      nameEn: e.titleEn ?? e.nameEn,
      area: e.area,
      type: e.type,
    })) ??
    getTodayEvents(date);
  const categories = experienceMode === 'traveler' ? TRAVELER_CATEGORIES : LOCAL_CATEGORIES;

  const base = applyVibeFilters(ENRICHED_VIBES, { experienceMode, companion });
  const pool = localizeVibes(base, { locale, experienceMode });

  const usedIds = new Set();
  const items = categories
    .map((cat, index) => {
      const vibe = pickVibeForCategory(cat, pool, {
        seed,
        index,
        weather,
        events,
        location,
        profile,
        usedIds,
      });
      if (!vibe) return null;

      return {
        id: `today-${cat.id}-${seed}`,
        categoryId: cat.id,
        label: locale === 'en' ? cat.labelEn : cat.labelJa,
        badge: cat.badgeJa ? (locale === 'en' ? cat.badgeEn : cat.badgeJa) : null,
        accent: cat.accent,
        vibe,
        event: cat.eventLinked && events[0] ? events[0] : null,
      };
    })
    .filter(Boolean);

  const aiComment = buildTodayAiComment({
    locale,
    experienceMode,
    weather,
    events,
    date,
    location,
  });

  const title =
    experienceMode === 'traveler'
      ? locale === 'en'
        ? 'Today in Japan'
        : 'Today in Japan'
      : locale === 'en'
        ? 'Today in Tokyo'
        : 'Today in Tokyo';

  return {
    title,
    dateLabel: formatDateLabel(date, locale),
    aiComment,
    events,
    items,
    heroVibe: items[0]?.vibe ?? pool[seededIndex(seed, 0, pool.length)],
  };
}
