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
  '2時間': 2,
  '終電まで': 3,
  '半日': 4,
};

const PLAN_TITLES = {
  ja: ['おすすめルート', 'ムード別ルート', '別案ルート'],
  en: ['Top Pick Route', 'Mood Match Route', 'Alt Route'],
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

function pickSpots(areaSpots, categories, count, variant, usedIds, experienceMode, companion) {
  const ranked = [...areaSpots].sort((a, b) => {
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
  if (freeTime === '30分') return 30;
  if (freeTime === '1時間') return 30;
  if (freeTime === '2時間') return 45;
  if (freeTime === '終電まで') return 60;
  return 90;
}

function buildSchedule(location, selectedSpots, nextPlan, freeTime, locale = 'ja') {
  let current = getStartDate();
  const interval = getIntervalMinutes(freeTime);
  const startLabel = locale === 'en' ? `Start from ${location}` : `${location}からスタート`;
  const schedule = [{ time: formatTime(current, locale), activity: startLabel }];

  for (const spot of selectedSpots) {
    current = addMinutes(current, interval);
    schedule.push({ time: formatTime(current, locale), activity: spot.name });
  }

  current = addMinutes(current, interval);
  const endLabel = locale === 'en' ? `Head to ${formatNextPlan(nextPlan, 'en')}` : `${nextPlan}へ`;
  schedule.push({ time: formatTime(current, locale), activity: endLabel });

  return schedule;
}

function buildPlan(
  { location, freeTime, nextPlan, localLevel, mood, experienceMode = 'local', companion = 'solo', locale = 'ja', selectedMomentId },
  variant,
  usedIds
) {
  const momentCategories = selectedMomentId ? getMomentCategories(selectedMomentId) : null;
  const categories = momentCategories ?? getMoodCategories(mood);
  const count = getSpotCount(freeTime);
  const areaSpots = getAreaSpots(location);
  const selectedSpots = pickSpots(
    areaSpots,
    categories,
    count,
    variant,
    usedIds,
    experienceMode,
    companion
  );
  const moodLabel = getMoodLabel(mood, locale);
  const moodShort = moodLabel.replace(/^.\s*/, '');
  const schedule = buildSchedule(location, selectedSpots, nextPlan, freeTime, locale);
  const companionLabel = COMPANION_LABELS[locale]?.[companion] ?? companion;
  const modeLabel = experienceMode === 'traveler'
    ? (locale === 'en' ? 'Traveler' : 'トラベラー')
    : (locale === 'en' ? 'Local' : 'ローカル');

  const aiReason =
    locale === 'en'
      ? `Built for "${moodShort}" in ${location} — ${modeLabel} mode, ideal for ${companionLabel}.`
      : `「${moodShort}」に合う${location}の${modeLabel}ルート（${companionLabel}向け）。`;

  return {
    id: `plan-${variant}`,
    title: PLAN_TITLES[locale]?.[variant] ?? PLAN_TITLES.ja[variant],
    summary:
      locale === 'en'
        ? `${location} · ${formatFreeTime(freeTime, 'en')} · ${moodShort} (${modeLabel}, ${companionLabel})`
        : `${location} + ${freeTime} + ${moodShort}（${modeLabel}・${companionLabel}）`,
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
}) {
  const usedIds = new Set();
  return [0, 1, 2].map((variant) =>
    buildPlan(
      { location, freeTime, nextPlan, localLevel, mood, experienceMode, companion, locale, selectedMomentId },
      variant,
      usedIds
    )
  );
}
