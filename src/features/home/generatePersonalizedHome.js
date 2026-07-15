import { ENRICHED_VIBES } from '@/data/vibes';
import { getSpotAreaForLocation } from '@/data/areas';
import { getInterestLabel } from '@/features/aiProfile/types';
import { applyVibeFilters } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';

import { WEATHER_CATEGORIES, weatherCategoryBoost } from '@/domain/weather/categories';

const INTEREST_FILTERS = {
  nightlife: (v) => ['bar', 'music'].includes(v.category),
  cafe: (v) => ['cafe', 'chill'].includes(v.category),
  izakaya: (v) => ['food', 'bar'].includes(v.category),
  nightview: (v) => ['nightview', 'rooftop'].includes(v.category),
  date: (v) => v.suitableFor?.includes('date'),
  local: (v) => v.experienceModes?.includes('local') || v.experienceModes?.includes('hidden'),
  travel: (v) => v.experienceModes?.some((m) => ['traveler', 'classic'].includes(m)),
  foodwalk: (v) => ['food', 'cafe'].includes(v.category),
  culture: (v) => ['music', 'chill', 'culture', 'nightview'].includes(v.category),
  walk: (v) => (v.walkMinutes ?? 10) <= 12,
  budget: (v) => v.priceRange === '¥' || v.priceRange === '¥¥',
  premium: (v) => v.priceRange === '¥¥¥' || v.priceRange === '¥¥¥¥',
};

const TRAVEL_THEMES = [
  { id: 'culture', interestId: 'culture', labelJa: '日本文化', labelEn: 'Japanese culture' },
  { id: 'local', interestId: 'local', labelJa: 'ローカル体験', labelEn: 'Local experiences' },
  { id: 'seasonal', interestId: 'travel', labelJa: '季節限定', labelEn: 'Seasonal only' },
  { id: 'foodwalk', interestId: 'foodwalk', labelJa: '食べ歩き', labelEn: 'Food crawl' },
];

const CATEGORY_LABELS = {
  bar: { ja: 'バー', en: 'Bars' },
  cafe: { ja: 'カフェ', en: 'Cafés' },
  food: { ja: 'グルメ', en: 'Food' },
  nightview: { ja: '夜景', en: 'Night views' },
  rooftop: { ja: 'ルーフトップ', en: 'Rooftops' },
  music: { ja: '音楽', en: 'Music' },
  chill: { ja: 'チル', en: 'Chill' },
};

function scoreVibe(vibe, ctx, extras = {}) {
  let score = (vibe.rating ?? 4) * 10;
  const { location, weather, profile, events = [] } = ctx;
  const spotArea = getSpotAreaForLocation(location);

  if (vibe.area === spotArea || vibe.area === location) score += 15;
  if (vibe.isPopular) score += extras.popularBoost ?? 6;
  if (vibe.aiPick) score += 5;
  if (extras.lateNight && vibe.lateNight) score += 8;
  if (extras.hidden && (vibe.experienceModes?.includes('hidden') || !vibe.isPopular)) score += 10;
  if (extras.weekend && (vibe.suitableFor?.includes('date') || vibe.lateNight)) score += 6;

  const wBoost = weatherCategoryBoost(weather, vibe.category);
  if (wBoost) score += wBoost;
  if (events.length > 0 && events.some((e) => e.area === vibe.area)) score += 10;

  return applyProfileBoost(score, vibe, profile);
}

function rankPool(pool, ctx, { filter, limit = 10, excludeIds = new Set(), sortFn } = {}) {
  let candidates = filter ? pool.filter(filter) : pool;
  candidates = candidates.filter((v) => !excludeIds.has(v.id));

  const scored = candidates
    .map((vibe) => ({
      vibe,
      score: sortFn ? sortFn(vibe) : scoreVibe(vibe, ctx),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ vibe }) => vibe);
}

function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

function isNearWeekend(date = new Date()) {
  const day = date.getDay();
  return day === 4 || day === 5 || day === 6 || day === 0;
}

function buildForYouMessage(ctx) {
  const { locale, weather, profile, experienceMode, location, date = new Date() } = ctx;
  const isEn = locale === 'en';
  const timeOfDay = getTimeOfDay(date);
  const day = date.getDay();
  const spotArea = getSpotAreaForLocation(location);

  if (weather === 'rain') {
    return isEn
      ? 'Rain today — cozy indoor cafés and bars are your best bet.'
      : '今日は雨なので屋内カフェがおすすめです。';
  }

  if (profile?.recentTrend === 'nightview') {
    return isEn
      ? "You've been exploring night views — here are fresh rooftops and skyline spots."
      : '最近夜景スポットを見ることが多いので、新しい夜景スポットをご紹介します。';
  }

  if (profile?.recentTrend === 'cafe' || profile?.cafeVsIzakaya === 'cafe') {
    return isEn
      ? 'Your café streak continues — new picks matched to your taste.'
      : 'カフェ巡りがお好みのようです。今日のおすすめカフェをセレクトしました。';
  }

  if (profile?.recentTrend === 'food' || profile?.cafeVsIzakaya === 'izakaya') {
    return isEn
      ? 'Based on your food explorations — tonight’s local gems near you.'
      : 'グルメ探索の傾向から、今夜のローカルグルメをピックアップしました。';
  }

  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return isEn
      ? `Evening in ${spotArea} — curated for your mood and tonight’s weather.`
      : `${spotArea}の夜に合わせて、あなた向けのスポットを厳選しました。`;
  }

  if (day === 5 || day === 6) {
    return isEn
      ? "Weekend energy — bars, rooftops, and date-worthy spots picked for you."
      : '週末前の金土 — バー・夜景・デート向けスポットをあなた用にセレクト。';
  }

  if (experienceMode === 'traveler') {
    return isEn
      ? 'Your Japan moment starts here — experiences matched to how you explore.'
      : 'あなたの旅スタイルに合わせた、今日の日本体験をセレクトしました。';
  }

  if (profile?.hasData) {
    return isEn
      ? 'Personalized from your taste, location, and what you’ve been exploring.'
      : 'あなたの好み・現在地・閲覧履歴から、今日のおすすめを組み立てました。';
  }

  return isEn
    ? `Discover ${spotArea} — picks that shift with your mood and the hour.`
    : `${spotArea}周辺から、今の時間帯に合うスポットをピックアップしました。`;
}

function getTopInterests(profile, limit = 3) {
  const fromManual = profile?.activeInterests ?? [];
  if (fromManual.length) return fromManual.slice(0, limit);

  const fromTrend = profile?.recentTrend
    ? [categoryToInterest(profile.recentTrend)].filter(Boolean)
    : [];

  const fromCategories = (profile?.topCategories ?? [])
    .map((c) => categoryToInterest(c.id))
    .filter(Boolean);

  const merged = [...new Set([...fromManual, ...fromTrend, ...fromCategories])];
  if (merged.length) return merged.slice(0, limit);

  return ['cafe', 'nightview', 'izakaya'].slice(0, limit);
}

function categoryToInterest(category) {
  const map = {
    bar: 'nightlife',
    cafe: 'cafe',
    chill: 'cafe',
    food: 'izakaya',
    nightview: 'nightview',
    rooftop: 'nightview',
    music: 'culture',
  };
  return map[category] ?? null;
}

export function generatePersonalizedHome({
  locale = 'ja',
  experienceMode = 'local',
  companion = 'solo',
  location = '渋谷',
  weather = 'clear',
  savedSpotIds = [],
  recentlyViewedIds = [],
  profile = null,
  date = new Date(),
  events = null,
  featuredCollections = [],
}) {
  const eventList = events?.today ?? events?.all ?? events ?? [];
  const ctx = { locale, experienceMode, companion, location, weather, savedSpotIds, profile, date, events: eventList };
  const base = applyVibeFilters(ENRICHED_VIBES, { experienceMode, companion });
  const pool = localizeVibes(base, { locale, experienceMode });
  const usedIds = new Set();

  const forYouMessage = buildForYouMessage(ctx);
  const forYouPicks = rankPool(pool, ctx, {
    limit: 8,
    excludeIds: usedIds,
    sortFn: (v) => scoreVibe(v, ctx, { popularBoost: 4 }),
  });
  forYouPicks.forEach((v) => usedIds.add(v.id));

  const continueExploring = recentlyViewedIds
    .map((id) => pool.find((v) => v.id === id))
    .filter(Boolean)
    .slice(0, 10);

  const interestIds = getTopInterests(profile, 3);
  const interestSections = interestIds
    .map((interestId) => {
      const filter = INTEREST_FILTERS[interestId];
      if (!filter) return null;
      const items = rankPool(pool, ctx, {
        filter,
        limit: 8,
        excludeIds: usedIds,
      });
      items.forEach((v) => usedIds.add(v.id));
      if (!items.length) return null;
      return {
        id: `interest-${interestId}`,
        interestId,
        title: getInterestLabel(interestId, locale),
        items,
      };
    })
    .filter(Boolean);

  const spotArea = getSpotAreaForLocation(location);
  const trendingNearYou = rankPool(
    pool,
    ctx,
    {
      filter: (v) => v.area === spotArea || v.area === location,
      limit: 10,
      sortFn: (v) => scoreVibe(v, ctx, { popularBoost: 10 }),
    },
  );

  const hiddenGems = rankPool(pool, ctx, {
    filter: (v) =>
      v.experienceModes?.includes('hidden') ||
      v.experienceModes?.includes('local') ||
      !v.isPopular,
    limit: 10,
    excludeIds: usedIds,
    sortFn: (v) => scoreVibe(v, ctx, { hidden: true }),
  });

  const showWeekend = isNearWeekend(date);
  const weekendIdeas = showWeekend
    ? rankPool(pool, ctx, {
        limit: 10,
        sortFn: (v) => scoreVibe(v, ctx, { weekend: true, lateNight: true }),
      })
    : [];

  const travelInspiration =
    experienceMode === 'traveler'
      ? TRAVEL_THEMES.map((theme) => {
          const filter = INTEREST_FILTERS[theme.interestId];
          const items = filter
            ? rankPool(pool, ctx, { filter, limit: 8 })
            : rankPool(pool, ctx, { limit: 8 });
          if (!items.length) return null;
          return {
            id: `travel-${theme.id}`,
            title: locale === 'en' ? theme.labelEn : theme.labelJa,
            items,
          };
        }).filter(Boolean)
      : [];

  const featuredSections = (featuredCollections ?? [])
    .filter((f) => f.active !== false)
    .map((f) => {
      const items = (f.spotIds ?? [])
        .map((spotId) => pool.find((v) => v.spotId === spotId))
        .filter(Boolean)
        .slice(0, 8);
      if (!items.length) return null;
      return {
        id: f.id,
        slug: f.slug,
        title: locale === 'en' ? f.titleEn : f.titleJa,
        subtitle: locale === 'en' ? f.descriptionEn : f.descriptionJa,
        items,
      };
    })
    .filter(Boolean);

  return {
    forYouMessage,
    forYouPicks,
    continueExploring,
    interestSections,
    featuredSections,
    trendingNearYou,
    hiddenGems,
    weekendIdeas,
    showWeekend,
    travelInspiration,
    areaLabel: spotArea,
  };
}

export { CATEGORY_LABELS };
