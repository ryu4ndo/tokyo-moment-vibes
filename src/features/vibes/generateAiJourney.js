import { ROUTE_CATEGORY_FLOW } from '@/data/journeyRouteTypes';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';

const TRAVELER_MODES = ['classic', 'hidden', 'traveler'];

const FREE_TIME_CONFIG = {
  '30分': { maxStops: 2, dwellMinutes: 20 },
  '1時間': { maxStops: 3, dwellMinutes: 25 },
  '2時間': { maxStops: 4, dwellMinutes: 30 },
  '3時間': { maxStops: 5, dwellMinutes: 35 },
  '終電まで': { maxStops: 5, dwellMinutes: 40 },
  '半日': { maxStops: 6, dwellMinutes: 45 },
};

const REASONS = {
  ja: {
    start: 'ここから街歩きをスタート。',
    afterFood: '食後に人気のカフェです。',
    nightAtmosphere: '夜になると雰囲気が最高です。',
    travelerPopular: '外国人にも人気のスポットです。',
    walkable: '徒歩圏内なので移動が少なく済みます。',
    dateSpot: 'デートで選ばれることが多い場所です。',
    localFavorite: '地元の人がよく立ち寄る一軒。',
    rainyDay: '雨の日でもゆっくり過ごせます。',
    liveMusic: 'ライブ感のある夜を楽しめます。',
    hiddenGem: '観光地っぽくない、隠れ家的な雰囲気。',
    default: 'AIが今の流れに合うと判断しました。',
  },
  en: {
    start: 'Start your walk from here.',
    afterFood: 'A popular cafe after dinner.',
    nightAtmosphere: 'The vibe peaks at night.',
    travelerPopular: 'A favorite among international visitors.',
    walkable: 'Close enough to walk — minimal travel.',
    dateSpot: 'Often picked for date nights.',
    localFavorite: 'Where locals actually stop by.',
    rainyDay: 'Comfortable even on rainy days.',
    liveMusic: 'Great for a live-music night.',
    hiddenGem: 'Hidden-gem atmosphere, not touristy.',
    default: 'AI matched this to your flow.',
  },
};

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

function passesExperience(vibe, experienceMode) {
  if (experienceMode === 'traveler') {
    return vibe.experienceModes?.some((m) => TRAVELER_MODES.includes(m));
  }
  if (experienceMode === 'local') {
    return vibe.experienceModes?.includes('local');
  }
  return true;
}

function passesCompanion(vibe, companion) {
  if (!companion) return true;
  return vibe.companionFit?.includes(companion);
}

export function inferRouteType({ companion, weather, experienceMode, vibe }) {
  if (weather === 'rain') return 'rainy';
  if (experienceMode === 'traveler') return 'travel';
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 15) return 'daywalk';
  if (hour >= 21 || hour < 3) return 'nightlife';
  if (vibe?.category === 'food') return 'foodwalk';
  if (companion === 'couple') return 'date';
  if (companion === 'friends') return 'friends';
  if (companion === 'family') return 'family';
  if (companion === 'solo') return 'solo';
  return 'foodwalk';
}

export function estimateWalkMinutes(from, to) {
  if (!from || !to) return 5;
  if (from.area === to.area) return 3 + (hashId(`${from.id}-${to.id}`) % 6);
  return 7 + (hashId(`${from.id}-${to.id}`) % 8);
}

function scoreCandidate(vibe, { prev, routeType, area, profile }) {
  let score = vibe.rating * 10;
  if (vibe.area === area || vibe.area === prev?.area) score += 25;
  if (vibe.aiPick) score += 12;
  if (routeType === 'date' && vibe.suitableFor?.includes('date')) score += 15;
  if (routeType === 'rainy' && ['cafe', 'chill', 'music'].includes(vibe.category)) score += 18;
  if (routeType === 'nightlife' && ['bar', 'music', 'nightview'].includes(vibe.category)) score += 15;
  if (profile) score = applyProfileBoost(score, vibe, profile);
  return score;
}

export function buildStopReason(vibe, { prevVibe, routeType, locale, experienceMode, walkMinutes, isStart }) {
  const t = REASONS[locale] ?? REASONS.ja;
  if (isStart) return t.start;

  const pool = [];
  if (prevVibe?.category === 'food' && vibe.category === 'cafe') pool.push(t.afterFood);
  if (['bar', 'nightview', 'rooftop'].includes(vibe.category)) pool.push(t.nightAtmosphere);
  if (experienceMode === 'traveler') pool.push(t.travelerPopular);
  if (walkMinutes <= 6) pool.push(t.walkable);
  if (routeType === 'date') pool.push(t.dateSpot);
  if (routeType === 'rainy') pool.push(t.rainyDay);
  if (vibe.category === 'music') pool.push(t.liveMusic);
  if (vibe.experienceModes?.includes('hidden')) pool.push(t.hiddenGem);
  if (experienceMode === 'local') pool.push(t.localFavorite);
  pool.push(t.default);

  return pool[hashId(vibe.id + (prevVibe?.id ?? '')) % pool.length];
}

function pickNextVibe(vibes, { category, usedIds, prev, routeType, area, profile }) {
  const candidates = vibes
    .filter((v) => {
      if (usedIds.has(v.id)) return false;
      if (v.category !== category) return false;
      return true;
    })
    .sort((a, b) => scoreCandidate(b, { prev, routeType, area, profile }) - scoreCandidate(a, { prev, routeType, area, profile }));

  return candidates[0] ?? null;
}

function buildFlowCategories(startVibe, routeType) {
  const base = ROUTE_CATEGORY_FLOW[routeType] ?? ROUTE_CATEGORY_FLOW.foodwalk;
  const withoutStartCat = base.filter((c) => c !== startVibe.category);
  return [startVibe.category, ...withoutStartCat];
}

export function generateAiJourney({
  vibes,
  startVibe,
  routeType,
  freeTime = '2時間',
  experienceMode = 'local',
  companion = 'solo',
  locale = 'ja',
  fixedStops = null,
  profile = null,
}) {
  const config = FREE_TIME_CONFIG[freeTime] ?? FREE_TIME_CONFIG['2時間'];
  const usedIds = new Set();
  const stops = [];
  const legs = [];

  const seedStops = fixedStops?.length ? fixedStops : [startVibe];

  for (const vibe of seedStops) {
    if (!vibe) continue;
    const prev = stops[stops.length - 1]?.vibe;
    const walkMinutes = prev ? estimateWalkMinutes(prev, vibe) : 0;
    if (prev) legs.push({ walkMinutes, fromIndex: stops.length - 1, toIndex: stops.length });
    stops.push({
      vibe,
      aiReason: buildStopReason(vibe, {
        prevVibe: prev,
        routeType,
        locale,
        experienceMode,
        walkMinutes,
        isStart: !prev,
      }),
      dwellMinutes: config.dwellMinutes,
      isStart: !prev,
    });
    usedIds.add(vibe.id);
  }

  const categories = buildFlowCategories(startVibe, routeType);
  let catIndex = 0;
  while (stops.length < config.maxStops) {
    const prev = stops[stops.length - 1].vibe;
    const targetCategory = categories[catIndex % categories.length];
    catIndex += 1;

    const next = pickNextVibe(vibes, {
      category: targetCategory,
      usedIds,
      prev,
      routeType,
      area: startVibe.area,
      profile,
    });

    if (!next) {
      if (catIndex > categories.length * 2) break;
      continue;
    }

    const walkMinutes = estimateWalkMinutes(prev, next);
    legs.push({ walkMinutes, fromIndex: stops.length - 1, toIndex: stops.length });
    stops.push({
      vibe: next,
      aiReason: buildStopReason(next, {
        prevVibe: prev,
        routeType,
        locale,
        experienceMode,
        walkMinutes,
        isStart: false,
      }),
      dwellMinutes: config.dwellMinutes,
      isStart: false,
    });
    usedIds.add(next.id);
  }

  const totalWalk = legs.reduce((sum, l) => sum + l.walkMinutes, 0);
  const totalDwell = stops.reduce((sum, s) => sum + s.dwellMinutes, 0);

  return {
    id: `journey-${startVibe.id}-${routeType}`,
    routeType,
    freeTime,
    stops,
    legs,
    totalWalkMinutes: totalWalk,
    totalMinutes: totalWalk + totalDwell,
  };
}

export function getFilteredVibePool(vibes, experienceMode, companion) {
  return vibes.filter((v) => passesExperience(v, experienceMode) && passesCompanion(v, companion));
}

export function regenerateJourneyTail({
  vibes,
  journey,
  startVibe,
  routeType,
  freeTime,
  experienceMode,
  companion,
  locale,
  removeIndex,
  reorderFrom,
  direction,
  swapIndex,
  alternativeVibe,
  profile = null,
}) {

  let stopVibes = journey.stops.map((s) => s.vibe);

  if (typeof removeIndex === 'number' && removeIndex > 0) {
    stopVibes = stopVibes.filter((_, i) => i !== removeIndex);
  }

  if (reorderFrom !== undefined && reorderFrom > 0) {
    const dir = params.direction;
    const to = dir === 'left' ? reorderFrom - 1 : reorderFrom + 1;
    if (to > 0 && to < stopVibes.length) {
      const next = [...stopVibes];
      [next[reorderFrom], next[to]] = [next[to], next[reorderFrom]];
      stopVibes = next;
    }
  }

  if (typeof swapIndex === 'number' && alternativeVibe) {
    stopVibes = stopVibes.map((v, i) => (i === swapIndex ? alternativeVibe : v));
  }

  return generateAiJourney({
    vibes,
    startVibe: stopVibes[0] ?? startVibe,
    routeType,
    freeTime,
    experienceMode,
    companion,
    locale,
    fixedStops: stopVibes,
    profile,
  });
}

export function getAlternativeVibes(vibes, journey, stopIndex, experienceMode, companion) {
  const stop = journey.stops[stopIndex];
  if (!stop) return [];
  const usedIds = new Set(journey.stops.map((s) => s.vibe.id));
  const category = stop.vibe.category;
  const prev = journey.stops[stopIndex - 1]?.vibe;

  return vibes
    .filter((v) => {
      if (v.id === stop.vibe.id) return false;
      if (v.category !== category) return false;
      if (!passesExperience(v, experienceMode)) return false;
      if (!passesCompanion(v, companion)) return false;
      return true;
    })
    .sort((a, b) => scoreCandidate(b, { prev, routeType: journey.routeType, area: stop.vibe.area }) - scoreCandidate(a, { prev, routeType: journey.routeType, area: stop.vibe.area }))
    .slice(0, 5);
}

export function fitsFreeTime(journey, freeTime) {
  const config = FREE_TIME_CONFIG[freeTime] ?? FREE_TIME_CONFIG['2時間'];
  return journey.stops.length <= config.maxStops && journey.totalMinutes <= config.dwellMinutes * config.maxStops + 30;
}
