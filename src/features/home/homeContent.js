import { ENRICHED_VIBES } from '@/data/vibes';
import { spots } from '@/data/spots';
import { getTrendingTags } from '@/data/vibeKeywords';
import { applyVibeFilters, getTodayPick } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { getSpotAreaForLocation } from '@/data/areas';

const WEATHER_CATEGORIES = {
  rain: ['cafe', 'bar', 'chill'],
  cloudy: ['cafe', 'walk', 'chill'],
  clear: ['rooftop', 'nightview', 'bar'],
};

export function getHomeDiscover({
  locale,
  experienceMode,
  companion,
  location,
  weather,
  savedSpotIds = [],
  recentlyViewedIds = [],
}) {
  const spotArea = getSpotAreaForLocation(location);
  const base = applyVibeFilters(ENRICHED_VIBES, { experienceMode, companion });
  const todayPick = getTodayPick(
    localizeVibes(base, { locale, experienceMode }),
    experienceMode,
    companion
  );
  const localized = localizeVibes(base, { locale, experienceMode });

  const weatherCats = WEATHER_CATEGORIES[weather] ?? WEATHER_CATEGORIES.clear;
  const weatherPicks = base
    .filter((v) => weatherCats.includes(v.category))
    .slice(0, 6);
  const weatherPicksLocalized = localizeVibes(weatherPicks, { locale, experienceMode });

  const popularTonight = [...base]
    .sort((a, b) => b.rating - a.rating)
    .filter((v) => v.lateNight || v.isPopular)
    .slice(0, 8);
  const popularTonightLocalized = localizeVibes(popularTonight, { locale, experienceMode });

  const savedMoments = base
    .filter((v) => savedSpotIds.includes(v.spotId))
    .slice(0, 6);
  const savedMomentsLocalized = localizeVibes(savedMoments, { locale, experienceMode });

  const recentlyViewed = recentlyViewedIds
    .map((id) => base.find((v) => v.id === id))
    .filter(Boolean)
    .slice(0, 6);
  const recentlyViewedLocalized = localizeVibes(recentlyViewed, { locale, experienceMode });

  const areaVibes = base
    .filter((v) => v.area === spotArea || v.area === location)
    .slice(0, 6);
  const areaVibesLocalized = localizeVibes(areaVibes, { locale, experienceMode });

  const trending = getTrendingTags(experienceMode, locale);

  const savedFood = spots
    .filter((s) => savedSpotIds.includes(s.id) && ['food', 'wine', 'cafe', 'nightlife'].includes(s.category))
    .slice(0, 4);

  return {
    todayPick,
    trending,
    weatherPicks: weatherPicksLocalized,
    popularTonight: popularTonightLocalized,
    savedMoments: savedMomentsLocalized,
    recentlyViewed: recentlyViewedLocalized,
    areaVibes: areaVibesLocalized,
    savedFood,
  };
}
