import { getAreaLabel } from '@/data/areas';

export function getAiSuggestion(profile, page, { locale = 'ja', location } = {}) {
  const area = profile.topAreas[0]?.id ?? location;
  const areaLabel = area ? getAreaLabel(area, locale) : locale === 'en' ? 'Tokyo' : '東京';

  const trend = profile.recentTrend;
  const templates = SUGGESTIONS[locale] ?? SUGGESTIONS.ja;

  if (trend === 'nightview' && templates.nightview) {
    return templates.nightview(areaLabel);
  }
  if (profile.localVsMainstream === 'local' && profile.cafeVsIzakaya === 'izakaya' && templates.localIzakaya) {
    return templates.localIzakaya();
  }
  if (profile.topAreas[0] && templates.favoriteArea) {
    return templates.favoriteArea(areaLabel);
  }
  if (profile.cafeVsIzakaya === 'cafe' && trend === 'cafe' && templates.cafeTrend) {
    return templates.cafeTrend();
  }
  if (profile.companionTendency === 'couple' && page === 'plan' && templates.datePlan) {
    return templates.datePlan(areaLabel);
  }
  if (profile.foodCrawlVsExperience === 'foodwalk' && page === 'food' && templates.foodwalk) {
    return templates.foodwalk(areaLabel);
  }

  const pageDefault = templates.byPage?.[page];
  if (pageDefault) return pageDefault(areaLabel, profile);

  return templates.default(areaLabel);
}

const SUGGESTIONS = {
  ja: {
    nightview: () => `最近夜景スポットを見ることが多いので、新しく話題の夜景をご紹介します。`,
    localIzakaya: () => `ローカル居酒屋がお好きなので、観光客が少ない名店をおすすめします。`,
    favoriteArea: (area) => `保存履歴から、${area}エリアがお好きだと判断しました。`,
    cafeTrend: () => `最近カフェをよく見ているので、静かに過ごせる新店をピックアップしました。`,
    datePlan: (area) => `${area}でデートにぴったりの流れを組みました。`,
    foodwalk: (area) => `${area}周辺の食べ歩きルートを厳選しました。`,
    default: (area) => `${area}で、あなたの好みに合うスポットを選んでいます。`,
    byPage: {
      home: (area) => `おかえりなさい。${area}で今夜のおすすめを用意しました。`,
      vibes: (area) => `あなたの閲覧傾向から、${area}のスポットを優先して表示しています。`,
      plan: (area, p) =>
        p.timeOfDay === 'night'
          ? `夜型のあなたに合わせ、${area}のナイトプランを提案します。`
          : `空き時間に合わせた${area}のプランを組み立てました。`,
      food: (area, p) =>
        p.cafeVsIzakaya === 'cafe'
          ? `カフェ派のあなたへ——${area}のおすすめを集めました。`
          : `${area}で地元民気のグルメをピックアップしました。`,
    },
  },
  en: {
    nightview: () => `You've been into night views lately — here's what's trending.`,
    localIzakaya: () => `You love local izakaya — we picked spots tourists rarely find.`,
    favoriteArea: (area) => `From your saves, ${area} seems to be your favorite area.`,
    cafeTrend: () => `You've been browsing cafes — here are quiet new picks.`,
    datePlan: (area) => `A date-friendly flow around ${area}, tailored for you.`,
    foodwalk: (area) => `A food-walk route around ${area}, based on your taste.`,
    default: (area) => `Picks around ${area} that match your profile.`,
    byPage: {
      home: (area) => `Welcome back — tonight's picks near ${area} are ready.`,
      vibes: (area) => `Showing ${area} spots first, based on what you browse.`,
      plan: (area, p) =>
        p.timeOfDay === 'night'
          ? `Night-owl picks for ${area}, sized to your free time.`
          : `A plan around ${area} that fits your window.`,
      food: (area, p) =>
        p.cafeVsIzakaya === 'cafe'
          ? `Cafe picks in ${area} — curated for you.`
          : `Local favorites in ${area}, matched to your taste.`,
    },
  },
};
