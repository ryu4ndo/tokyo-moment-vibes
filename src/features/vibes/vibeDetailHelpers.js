import {
  getBestTime,
  getLocalTip,
  getVibeComment,
  getVibeReason,
} from '@/features/vibes/vibeFilters';

const TRAVELER_MODES = ['classic', 'hidden', 'traveler'];

const CATEGORY_FLOW = {
  cafe: ['nightview', 'food', 'bar'],
  food: ['bar', 'nightview', 'music'],
  bar: ['nightview', 'food', 'music'],
  rooftop: ['bar', 'nightview', 'food'],
  nightview: ['bar', 'rooftop', 'food'],
  music: ['bar', 'food', 'nightview'],
  chill: ['cafe', 'food', 'nightview'],
};

const FLOW_LABELS = {
  ja: {
    cafe: 'カフェ',
    food: '食事',
    bar: 'バー',
    rooftop: 'ルーフトップ',
    nightview: '夜景',
    music: 'ライブ',
    chill: 'チル',
  },
  en: {
    cafe: 'Cafe',
    food: 'Dining',
    bar: 'Bar',
    rooftop: 'Rooftop',
    nightview: 'Night view',
    music: 'Live music',
    chill: 'Chill',
  },
};

function passesExperienceFilter(vibe, experienceMode) {
  if (experienceMode === 'traveler') {
    return vibe.experienceModes?.some((m) => TRAVELER_MODES.includes(m));
  }
  if (experienceMode === 'local') {
    return vibe.experienceModes?.includes('local');
  }
  return true;
}

function passesCompanionFilter(vibe, companion) {
  if (!companion) return true;
  return vibe.companionFit?.includes(companion);
}

function scoreNearby(vibe, current) {
  let score = vibe.rating * 10;
  if (vibe.area === current.area) score += 30;
  if (vibe.aiPick) score += 12;
  return score;
}

/** Same area or walkable — spots to explore around this one */
export function getNearbyVibes(vibes, current, experienceMode, companion, limit = 4) {
  return vibes
    .filter((v) => {
      if (v.id === current.id) return false;
      if (!passesExperienceFilter(v, experienceMode)) return false;
      if (!passesCompanionFilter(v, companion)) return false;
      return v.area === current.area || v.category !== current.category;
    })
    .sort((a, b) => scoreNearby(b, current) - scoreNearby(a, current))
    .slice(0, limit);
}

/** Journey flow: cafe → night view → bar */
export function getJourneySuggestions(vibes, current, experienceMode, companion, limit = 3) {
  const flow = CATEGORY_FLOW[current.category] ?? ['bar', 'nightview', 'food'];
  const picks = [];
  const used = new Set([current.id]);

  for (const category of flow) {
    const candidates = vibes
      .filter((v) => {
        if (used.has(v.id)) return false;
        if (v.category !== category) return false;
        if (!passesExperienceFilter(v, experienceMode)) return false;
        if (!passesCompanionFilter(v, companion)) return false;
        return true;
      })
      .sort((a, b) => {
        const areaBoost = (v) => (v.area === current.area ? 20 : 0);
        return b.rating + areaBoost(b) - (a.rating + areaBoost(a));
      });

    const match = candidates[0];
    if (match) {
      picks.push({ vibe: match, fromCategory: current.category, toCategory: category });
      used.add(match.id);
    }
    if (picks.length >= limit) break;
  }

  return picks;
}

export function getCategoryFlowLabel(category, locale = 'ja') {
  return FLOW_LABELS[locale]?.[category] ?? category;
}

export function getSpotIntroduction(vibe, experienceMode, companion, locale) {
  const headline = getVibeReason(vibe, experienceMode, locale);
  const detail = getVibeComment(vibe, { experienceMode, companion, locale });
  return { headline, detail };
}

export function getSpotHighlights(vibe, locale) {
  const highlights = [
    getLocalTip(vibe, locale),
    locale === 'en'
      ? `Best around ${getBestTime(vibe, locale)}`
      : `${getBestTime(vibe, locale)}がおすすめ`,
  ];

  if (vibe.mood) highlights.push(vibe.mood.replace(/^.\s*/, '') || vibe.mood);
  if (vibe.suitableFor?.includes('date')) {
    highlights.push(locale === 'en' ? 'Great for dates' : 'デートにぴったり');
  }
  if (vibe.lateNight) {
    highlights.push(locale === 'en' ? 'Open late' : '深夜まで楽しめる');
  }
  if (vibe.reservable) {
    highlights.push(locale === 'en' ? 'Reservations available' : '予約可能');
  }

  return [...new Set(highlights)].slice(0, 4);
}

export function getCrowdPercent(crowdLevel) {
  const map = { quiet: 25, moderate: 55, busy: 85 };
  return map[crowdLevel] ?? 50;
}
