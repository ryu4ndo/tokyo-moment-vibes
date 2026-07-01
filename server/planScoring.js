import { spots } from '../src/data/spots.js';

const MOOD_CATEGORIES = {
  '🌃 深夜東京を感じたい': ['nightlife', 'walk', 'culture', 'wine'],
  '🍷 しっぽり飲みたい': ['wine', 'cafe', 'food', 'nightlife'],
  '☕ 一人で落ち着きたい': ['cafe', 'walk', 'culture'],
  '🚶 雨の夜を歩きたい': ['walk', 'cafe', 'culture'],
  '✨ ローカル東京を感じたい': ['nightlife', 'walk', 'food', 'wine'],
};

const COMPANION_CATEGORIES = {
  solo: ['cafe', 'culture', 'walk', 'wine'],
  couple: ['wine', 'walk', 'culture', 'nightlife'],
  friends: ['nightlife', 'food', 'wine'],
  family: ['food', 'cafe', 'walk'],
  business: ['cafe', 'wine', 'culture'],
  backpacker: ['food', 'nightlife', 'walk'],
};

const EXPERIENCE_CATEGORIES = {
  local: ['nightlife', 'food', 'walk', 'wine'],
  traveler: ['wine', 'cafe', 'culture', 'walk'],
};

const TIME_SPOT_COUNT = {
  '30分': 1,
  '1時間': 2,
  '2時間': 2,
  '終電まで': 3,
  '半日': 4,
};

export function getSpotCount(freeTime) {
  return TIME_SPOT_COUNT[freeTime] ?? 2;
}

export function scoreSpot(spot, { mood, experienceMode = 'local', companion = 'solo' }) {
  const categories = MOOD_CATEGORIES[mood] ?? ['walk', 'cafe'];
  const moodIndex = categories.indexOf(spot.category);
  const moodScore = moodIndex === -1 ? 0 : categories.length - moodIndex;

  const expCats = EXPERIENCE_CATEGORIES[experienceMode] ?? [];
  const expIndex = expCats.indexOf(spot.category);
  const expScore = expIndex === -1 ? 0 : expCats.length - expIndex;

  const compCats = COMPANION_CATEGORIES[companion] ?? [];
  const compIndex = compCats.indexOf(spot.category);
  const compScore = compIndex === -1 ? 0 : compCats.length - compIndex;

  return moodScore * 10 + expScore * 5 + compScore * 3;
}

export function rankSpotsForContext({ location, mood, experienceMode, companion, limit = 12 }) {
  const areaSpots = spots.filter((s) => s.area === location);
  return [...areaSpots]
    .sort((a, b) => scoreSpot(b, { mood, experienceMode, companion }) - scoreSpot(a, { mood, experienceMode, companion }))
    .slice(0, limit);
}

export function pickSpotsForPlan({ location, mood, experienceMode, companion, freeTime, variant = 0, usedIds = new Set() }) {
  const count = getSpotCount(freeTime);
  const ranked = rankSpotsForContext({ location, mood, experienceMode, companion, limit: 30 });
  const rotated = [...ranked.slice(variant), ...ranked.slice(0, variant)];
  const picked = [];

  for (const spot of rotated) {
    if (usedIds.has(spot.id)) continue;
    picked.push(spot);
    usedIds.add(spot.id);
    if (picked.length >= count) break;
  }

  return picked;
}

export function matchSpotsFromSchedule(schedule, areaSpots, preferredSpots = []) {
  const matched = [];
  const used = new Set();
  const pool = [...preferredSpots, ...areaSpots];

  for (const item of schedule) {
    const activity = item.activity ?? '';
    const normalized = activity.replace(/へ$|から.*$/, '').trim();

    let spot = pool.find(
      (candidate) =>
        !used.has(candidate.id) &&
        (activity.includes(candidate.name) ||
          candidate.name.includes(normalized) ||
          normalized.includes(candidate.name))
    );

    if (!spot && normalized.length > 2) {
      spot = pool.find(
        (candidate) =>
          !used.has(candidate.id) &&
          candidate.name.split(/\s+/).some((part) => part.length > 1 && normalized.includes(part))
      );
    }

    if (spot) {
      matched.push(spot);
      used.add(spot.id);
    }
  }

  return matched;
}

export function buildPlanAiReason({ location, mood, experienceMode, companion, locale = 'ja' }) {
  const moodShort = mood?.replace(/^.\s*/, '') ?? '';
  if (locale === 'en') {
    const mode = experienceMode === 'traveler' ? 'visitor-friendly picks' : 'local hidden gems';
    const comp = {
      solo: 'solo-friendly', couple: 'great for couples', friends: 'lively with friends',
      family: 'family-friendly', business: 'quiet for business', backpacker: 'budget-friendly',
    }[companion] ?? '';
    return `Curated for ${moodShort} in ${location} — ${mode}, ${comp}.`;
  }
  const mode = experienceMode === 'traveler' ? '旅行者向け' : '地元の穴場';
  const comp = {
    solo: '一人向け', couple: 'デート向け', friends: '友達と', family: '家族向け',
    business: 'ビジネス向け', backpacker: 'コスパ重視',
  }[companion] ?? '';
  return `${location}で「${moodShort}」に合う${mode}ルート（${comp}）。`;
}
