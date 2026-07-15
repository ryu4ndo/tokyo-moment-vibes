import { getInterestLabel } from './types';

const RECENCY_MS = {
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

function recencyWeight(timestamp) {
  const age = Date.now() - timestamp;
  if (age <= RECENCY_MS.week) return 3;
  if (age <= RECENCY_MS.month) return 1.5;
  return 0.5;
}

function tallyWeighted(items, keyFn, weightFn = recencyWeight) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    const w = weightFn(item.timestamp ?? Date.now());
    map.set(key, (map.get(key) ?? 0) + w);
  }
  return [...map.entries()]
    .map(([id, weight]) => ({ id, weight }))
    .sort((a, b) => b.weight - a.weight);
}

function priceToYen(range) {
  const map = { '¥': 1500, '¥¥': 3500, '¥¥¥': 7000, '¥¥¥¥': 12000 };
  return map[range] ?? 3500;
}

function yenToLabel(yen, locale) {
  if (yen <= 2000) return locale === 'en' ? 'under ¥2,000' : '〜2000円';
  if (yen <= 4000) return locale === 'en' ? '¥2,000–5,000' : '3000〜5000円';
  if (yen <= 7000) return locale === 'en' ? '¥5,000–8,000' : '5000〜8000円';
  return locale === 'en' ? '¥8,000+' : '8000円以上';
}

function detectTimeOfDay(views) {
  const buckets = { day: 0, night: 0 };
  for (const v of views) {
    const hour = new Date(v.timestamp).getHours();
    if (hour >= 6 && hour < 17) buckets.day += recencyWeight(v.timestamp);
    else buckets.night += recencyWeight(v.timestamp);
  }
  return buckets.night >= buckets.day ? 'night' : 'day';
}

function detectCompanionTendency(views) {
  const tallies = tallyWeighted(views, (v) => v.companion);
  return tallies[0]?.id ?? 'solo';
}

function detectLocalVsMainstream(views, saves, experienceMode) {
  let local = 0;
  let mainstream = 0;
  const all = [...views, ...saves];
  for (const item of all) {
    const w = recencyWeight(item.timestamp);
    const modes = item.experienceModes ?? [];
    if (modes.includes('local') || modes.includes('hidden')) local += w;
    if (modes.includes('classic') || modes.includes('traveler')) mainstream += w;
  }
  if (experienceMode === 'local') local += 2;
  if (experienceMode === 'traveler') mainstream += 1;
  if (local >= mainstream * 1.2) return 'local';
  if (mainstream >= local * 1.2) return 'mainstream';
  return 'balanced';
}

function detectCafeVsIzakaya(views, saves) {
  const cats = tallyWeighted(
    [...views, ...saves],
    (i) => (i.category === 'cafe' || i.category === 'chill' ? 'cafe' : i.category === 'food' || i.category === 'bar' ? 'izakaya' : null),
  );
  if (!cats.length) return 'balanced';
  return cats[0].id;
}

function detectFoodCrawlVsExperience(views) {
  let crawl = 0;
  let experience = 0;
  for (const v of views) {
    const w = recencyWeight(v.timestamp);
    if (['food', 'cafe'].includes(v.category)) crawl += w;
    if (['nightview', 'rooftop', 'music', 'culture', 'chill'].includes(v.category)) experience += w;
  }
  if (crawl >= experience * 1.3) return 'foodwalk';
  if (experience >= crawl * 1.3) return 'experience';
  return 'balanced';
}

function detectRecentTrend(views) {
  const recent = views.filter((v) => Date.now() - v.timestamp <= RECENCY_MS.week);
  const cats = tallyWeighted(recent, (v) => v.category);
  return cats[0]?.id ?? null;
}

function avgWalkMinutes(views, saves) {
  const all = [...views, ...saves];
  if (!all.length) return 10;
  const sum = all.reduce((acc, i) => acc + (i.walkMinutes ?? 5), 0);
  return Math.round(sum / all.length);
}

/** Build analyzed profile from raw signals + manual interests */
export function analyzeProfile(profileData, { experienceMode, companion, locale = 'ja' } = {}) {
  const { signals, manualInterests, hiddenInterests } = profileData;
  const views = signals.views ?? [];
  const saves = signals.saves ?? [];

  const topCategories = tallyWeighted(
    [...views, ...saves.map((s) => ({ ...s, category: s.category }))],
    (i) => i.category,
  ).slice(0, 5);

  const topAreas = tallyWeighted([...views, ...saves], (i) => i.area).slice(0, 4);

  const priceItems = [...views, ...saves].filter((i) => i.priceRange);
  const avgPrice =
    priceItems.length > 0
      ? priceItems.reduce((sum, i) => sum + priceToYen(i.priceRange), 0) / priceItems.length
      : 3500;

  const timeOfDay = detectTimeOfDay(views);
  const companionTendency = detectCompanionTendency(views) || companion;
  const localVsMainstream = detectLocalVsMainstream(views, saves, experienceMode);
  const cafeVsIzakaya = detectCafeVsIzakaya(views, saves);
  const foodCrawlVsExperience = detectFoodCrawlVsExperience(views);
  const recentTrend = detectRecentTrend(views);
  const walkPreference = avgWalkMinutes(views, saves);

  const activeInterests = [
    ...manualInterests,
    ...topCategories.map((c) => categoryToInterest(c.id)),
    timeOfDay === 'night' ? 'nightlife' : 'walk',
    localVsMainstream === 'local' ? 'local' : null,
    companionTendency === 'couple' ? 'date' : null,
    cafeVsIzakaya === 'cafe' ? 'cafe' : cafeVsIzakaya === 'izakaya' ? 'izakaya' : null,
    foodCrawlVsExperience === 'foodwalk' ? 'foodwalk' : foodCrawlVsExperience === 'experience' ? 'culture' : null,
    recentTrend ? categoryToInterest(recentTrend) : null,
  ].filter(Boolean);

  const uniqueInterests = [...new Set(activeInterests)].filter((id) => !hiddenInterests.includes(id));

  return {
    topCategories,
    topAreas,
    budgetLabel: yenToLabel(avgPrice, locale),
    budgetYen: avgPrice,
    walkPreference,
    timeOfDay,
    companionTendency,
    localVsMainstream,
    cafeVsIzakaya,
    foodCrawlVsExperience,
    recentTrend,
    activeInterests: uniqueInterests,
    signalCount: views.length + saves.length,
    hasData: views.length + saves.length >= 2,
  };
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
  return map[category] ?? category;
}

export function buildInsightCards(profile, locale = 'ja') {
  if (!profile.hasData && profile.activeInterests.length === 0) {
    return [
      {
        id: 'learning',
        emoji: '✨',
        text: locale === 'en'
          ? 'Keep exploring — your concierge is learning your taste.'
          : '使うほど、あなたの好みを学習していきます。',
      },
    ];
  }

  const cards = [];

  if (profile.timeOfDay === 'night') {
    cards.push({
      id: 'night',
      emoji: '🌃',
      text: locale === 'en' ? 'You enjoy going out at night' : '夜のお出かけが好き',
    });
  }

  if (profile.cafeVsIzakaya === 'cafe' || profile.topCategories.some((c) => c.id === 'cafe')) {
    cards.push({
      id: 'cafe',
      emoji: '☕',
      text: locale === 'en' ? 'You love cafe hopping' : 'カフェ巡りが好き',
    });
  }

  if (profile.localVsMainstream === 'local') {
    cards.push({
      id: 'local',
      emoji: '🏮',
      text: locale === 'en' ? 'You often save local hidden gems' : 'ローカルなお店をよく保存しています',
    });
  }

  if (profile.walkPreference <= 12) {
    cards.push({
      id: 'walk',
      emoji: '🚶',
      text:
        locale === 'en'
          ? `You prefer walks under ${profile.walkPreference} min`
          : `徒歩${profile.walkPreference}分以内を好みます`,
    });
  }

  if (profile.budgetLabel) {
    cards.push({
      id: 'budget',
      emoji: '💰',
      text:
        locale === 'en'
          ? `You often pick spots around ${profile.budgetLabel}`
          : `${profile.budgetLabel}のお店をよく利用します`,
    });
  }

  if (profile.companionTendency === 'couple' || profile.activeInterests.includes('date')) {
    cards.push({
      id: 'date',
      emoji: '✨',
      text: locale === 'en' ? 'You often browse date spots' : 'デート向けスポットをよく閲覧しています',
    });
  }

  if (profile.topAreas[0]) {
    cards.push({
      id: 'area',
      emoji: '📍',
      text:
        locale === 'en'
          ? `${profile.topAreas[0].id} is your go-to area`
          : `${profile.topAreas[0].id}エリアがお好き`,
    });
  }

  if (profile.recentTrend === 'nightview') {
    cards.push({
      id: 'trend-nightview',
      emoji: '🌉',
      text: locale === 'en' ? 'Lately into night views' : '最近は夜景スポットをよく見ています',
    });
  }

  for (const interestId of profile.activeInterests) {
    if (cards.length >= 6) break;
    if (cards.some((c) => c.id === interestId)) continue;
    cards.push({
      id: interestId,
      emoji: '✦',
      text: getInterestLabel(interestId, locale),
    });
  }

  return cards.slice(0, 6);
}
