import { spots } from '@/data/spots';
import { getSpotAreaForLocation } from '@/data/areas';
import { getMomentCategories } from '@/data/moments';
import { getCompanionCategories } from '@/data/companions';
import { formatFreeTime, formatNextPlan } from '@/utils/formatters';
import { getMoodLabel } from '@/data/moods';

const MOOD_CATEGORIES = {
  '🌃 深夜東京を感じたい': ['nightlife', 'walk', 'culture'],
  '🍷 しっぽり飲みたい': ['wine', 'cafe', 'food'],
  '☕ 一人で落ち着きたい': ['cafe', 'walk', 'culture'],
  '🚶 雨の夜を歩きたい': ['walk', 'cafe', 'culture'],
  '✨ ローカル東京を感じたい': ['nightlife', 'walk', 'food', 'wine'],
};

const COMPANION_CATEGORIES = {
  solo: ['cafe', 'culture', 'walk', 'wine'],
  couple: ['wine', 'walk', 'culture'],
  friends: ['nightlife', 'food', 'wine'],
  family: ['food', 'cafe', 'walk'],
  business: ['cafe', 'wine', 'culture'],
  backpacker: ['food', 'nightlife', 'walk'],
};

const EXPERIENCE_CATEGORIES = {
  local: ['nightlife', 'food', 'walk'],
  traveler: ['wine', 'cafe', 'culture', 'walk'],
};

const TIME_SPOT_COUNT = {
  '30分': 1,
  '1時間': 2,
  '2時間': 3,
  '3時間': 4,
  '終電まで': 4,
  '半日': 5,
};

const PURPOSE_CATEGORIES = {
  food: ['food', 'nightlife', 'wine'],
  sightseeing: ['walk', 'culture', 'nightview'],
  date: ['wine', 'walk', 'cafe', 'nightview'],
  cafe: ['cafe', 'chill'],
  nightlife: ['nightlife', 'wine', 'food'],
  walk: ['walk', 'culture', 'cafe'],
};

const PLAN_TITLES = {
  ja: ['今すぐできるプラン', 'ムードに合うプラン', '別のおすすめ'],
  en: ['Do this now', 'Mood match', 'Another option'],
};

const COMPANION_LABELS = {
  ja: {
    solo: '一人',
    couple: 'カップル',
    friends: '友達',
    family: '家族',
    business: 'ビジネス',
    backpacker: 'バックパッカー',
  },
  en: {
    solo: 'solo',
    couple: 'couple',
    friends: 'friends',
    family: 'family',
    business: 'business',
    backpacker: 'backpacker',
  },
};

function getMoodCategories(mood) {
  return MOOD_CATEGORIES[mood] ?? ['walk', 'cafe'];
}

function getSpotCount(freeTime) {
  return TIME_SPOT_COUNT[freeTime] ?? 2;
}

function getPurposeCategories(purpose, mood) {
  if (purpose && PURPOSE_CATEGORIES[purpose]) {
    return PURPOSE_CATEGORIES[purpose];
  }
  return getMoodCategories(mood);
}

function matchesBudget(spot, planBudget) {
  if (!planBudget || planBudget === 'all') return true;
  return spot.budget === planBudget;
}

function scoreSpot(spot, categories, experienceMode, companion) {
  const moodIndex = categories.indexOf(spot.category);
  const moodScore = moodIndex === -1 ? 0 : categories.length - moodIndex;
  const expCats = EXPERIENCE_CATEGORIES[experienceMode] ?? [];
  const expIndex = expCats.indexOf(spot.category);
  const expScore = expIndex === -1 ? 0 : expCats.length - expIndex;
  const compCats = companion ? (COMPANION_CATEGORIES[companion] ?? getCompanionCategories(companion)) : [];
  const compIndex = compCats.indexOf(spot.category);
  const compScore = compIndex === -1 ? 0 : compCats.length - compIndex;
  return moodScore * 10 + expScore * 5 + compScore * 3;
}

function getAreaSpots(area) {
  const spotArea = getSpotAreaForLocation(area);
  return spots.filter((spot) => spot.area === spotArea);
}

function pickSpots(areaSpots, categories, count, variant, usedIds, experienceMode, companion, planBudget) {
  const filtered = planBudget && planBudget !== 'all'
    ? areaSpots.filter((s) => matchesBudget(s, planBudget))
    : areaSpots;
  const pool = filtered.length >= count ? filtered : areaSpots;

  const ranked = [...pool].sort((a, b) => {
    const scoreDiff =
      scoreSpot(b, categories, experienceMode, companion) -
      scoreSpot(a, categories, experienceMode, companion);
    if (scoreDiff !== 0) return scoreDiff;
    return a.name.localeCompare(b.name, 'ja');
  });

  const rotated = [...ranked.slice(variant), ...ranked.slice(0, variant)];
  const picked = [];

  for (const spot of rotated) {
    if (usedIds.has(spot.id)) continue;
    picked.push(spot);
    usedIds.add(spot.id);
    if (picked.length >= count) break;
  }

  if (picked.length < count) {
    for (const spot of areaSpots) {
      if (usedIds.has(spot.id)) continue;
      picked.push(spot);
      usedIds.add(spot.id);
      if (picked.length >= count) break;
    }
  }

  return picked;
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

function formatTime(date, locale = 'ja') {
  return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getIntervalMinutes(freeTime) {
  if (freeTime === '30分') return 20;
  if (freeTime === '1時間') return 25;
  if (freeTime === '2時間') return 35;
  if (freeTime === '3時間') return 40;
  if (freeTime === '終電まで') return 50;
  return 60;
}

function buildSchedule(location, selectedSpots, freeTime, locale = 'ja', planPartySize = '1') {
  let current = getStartDate();
  const interval = getIntervalMinutes(freeTime);
  const startLabel =
    locale === 'en'
      ? `Start near ${location}`
      : `${location}周辺からスタート`;
  const schedule = [{ time: formatTime(current, locale), activity: startLabel }];

  for (const spot of selectedSpots) {
    current = addMinutes(current, interval);
    const walkLabel =
      locale === 'en'
        ? `${spot.name} · ~${spot.walkMinutes ?? 5} min walk`
        : `${spot.name} · 徒歩${spot.walkMinutes ?? 5}分`;
    schedule.push({ time: formatTime(current, locale), activity: walkLabel, spotName: spot.name });
  }

  current = addMinutes(current, Math.min(interval, 25));
  const partyLabel =
    locale === 'en'
      ? { '1': 'solo', '2': 'for two', '3-4': 'small group', '5+': 'group' }[planPartySize] ?? ''
      : { '1': '一人', '2': '二人', '3-4': '3〜4人', '5+': '5人以上' }[planPartySize] ?? '';
  const endLabel =
    locale === 'en'
      ? `Free time well spent${partyLabel ? ` (${partyLabel})` : ''}`
      : `空き時間を満喫${partyLabel ? `（${partyLabel}）` : ''}`;
  schedule.push({ time: formatTime(current, locale), activity: endLabel });

  return schedule;
}

function buildPlan(
  {
    location,
    freeTime,
    nextPlan,
    localLevel,
    mood,
    experienceMode = 'local',
    companion = 'solo',
    locale = 'ja',
    selectedMomentId,
    planPurpose,
    planBudget,
    planPartySize,
  },
  variant,
  usedIds
) {
  const momentCategories = selectedMomentId ? getMomentCategories(selectedMomentId) : null;
  const categories = momentCategories ?? getPurposeCategories(planPurpose, mood);
  const count = getSpotCount(freeTime);
  const areaSpots = getAreaSpots(location);
  const selectedSpots = pickSpots(
    areaSpots,
    categories,
    count,
    variant,
    usedIds,
    experienceMode,
    companion,
    planBudget
  );
  const moodLabel = getMoodLabel(mood, locale);
  const moodShort = moodLabel.replace(/^.\s*/, '');
  const schedule = buildSchedule(location, selectedSpots, freeTime, locale, planPartySize);
  const companionLabel = COMPANION_LABELS[locale]?.[companion] ?? companion;
  const purposeLabel =
    locale === 'en'
      ? { food: 'dining', sightseeing: 'sightseeing', date: 'date', cafe: 'cafe', nightlife: 'nightlife', walk: 'stroll' }[planPurpose] ?? 'explore'
      : { food: '食事', sightseeing: '観光', date: 'デート', cafe: 'カフェ', nightlife: '夜遊び', walk: '散策' }[planPurpose] ?? 'おでかけ';

  const aiReason =
    locale === 'en'
      ? `${formatFreeTime(freeTime, 'en')} free near ${location} — optimized for ${purposeLabel}, ${companionLabel}.`
      : `空き時間${formatFreeTime(freeTime, 'ja')}・${location}エリアで「${purposeLabel}」に最適なルート（${companionLabel}向け）。`;

  return {
    id: `plan-${variant}`,
    title: PLAN_TITLES[locale]?.[variant] ?? PLAN_TITLES.ja[variant],
    summary:
      locale === 'en'
        ? `${location} · ${formatFreeTime(freeTime, 'en')} · ${purposeLabel}`
        : `${location} · 空き${formatFreeTime(freeTime, 'ja')} · ${purposeLabel}`,
    aiReason,
    schedule,
    steps: schedule.map((item) => `${item.time} ${item.activity}`),
    spots: selectedSpots,
    experienceMode,
    companion,
    locale,
  };
}

export function generateTokyoPlans({
  location,
  freeTime,
  nextPlan,
  localLevel,
  mood,
  experienceMode = 'local',
  companion = 'solo',
  locale = 'ja',
  selectedMomentId,
  planPurpose = 'food',
  planBudget = 'all',
  planPartySize = '1',
}) {
  const usedIds = new Set();
  return [0, 1, 2].map((variant) =>
    buildPlan(
      {
        location,
        freeTime,
        nextPlan,
        localLevel,
        mood,
        experienceMode,
        companion,
        locale,
        selectedMomentId,
        planPurpose,
        planBudget,
        planPartySize,
      },
      variant,
      usedIds
    )
  );
}
