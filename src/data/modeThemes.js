/** Mode-specific discovery categories & AI copy */

export const LOCAL_HOME_CATEGORIES = [
  { id: 'today', icon: '✨', labelJa: '今日のおすすめ', labelEn: "Today's Picks", mood: '✨ ローカル東京を感じたい' },
  { id: 'cafe', icon: '☕', labelJa: 'カフェ', labelEn: 'Cafe', category: 'cafe' },
  { id: 'izakaya', icon: '🍶', labelJa: '居酒屋', labelEn: 'Izakaya', keyword: '居酒屋' },
  { id: 'date', icon: '🍷', labelJa: 'デート', labelEn: 'Date Night', mood: '🍷 しっぽり飲みたい' },
  { id: 'nightview', icon: '🌃', labelJa: '夜景', labelEn: 'Night Views', category: 'nightview' },
  { id: 'event', icon: '🎆', labelJa: 'イベント', labelEn: 'Events', mood: '✨ ローカル東京を感じたい' },
  { id: 'outing', icon: '🚶', labelJa: 'おでかけ', labelEn: 'Go Out', mood: '🚶 雨の夜を歩きたい' },
  { id: 'popular', icon: '🔥', labelJa: '人気スポット', labelEn: 'Popular Spots', popular: true },
];

export const TRAVELER_HOME_CATEGORIES = [
  { id: 'local-fav', icon: '🏠', labelJa: '地元の店', labelEn: 'Local favorites', experienceId: 'local-favorite' },
  { id: 'classic', icon: '⭐', labelJa: '王道グルメ', labelEn: 'Classic eats', experienceId: 'classic-popular' },
  { id: 'sns', icon: '📱', labelJa: 'SNS話題', labelEn: 'Trending now', experienceId: 'sns-trending' },
  { id: 'hidden', icon: '💎', labelJa: '隠れ家', labelEn: 'Hidden gems', experienceId: 'hidden-gem' },
  { id: 'culture', icon: '🏮', labelJa: '日本文化', labelEn: 'Culture', experienceId: 'japanese-culture' },
  { id: 'market', icon: '🏪', labelJa: '食べ歩き', labelEn: 'Food walk', experienceId: 'market-walk' },
];

// Re-export for backward compatibility
export { LOCAL_FOOD_CATEGORIES as LOCAL_FOOD_MOODS } from '@/data/foodCategories';

const LOCAL_AI_MESSAGES = {
  ja: [
    (ctx) => `今日は仕事終わりですね。${ctx.areaLabel}の焼鳥がおすすめです。`,
    (ctx) => `今夜は${ctx.areaLabel}で居酒屋はいかが？地元の人気店をピックアップしました。`,
    (ctx) => `${ctx.areaLabel}のカフェで一息つくのも良さそうです。`,
    (ctx) => `空き時間${ctx.timeLabel}——${ctx.areaLabel}周辺の夜景スポットが映えます。`,
  ],
  en: [
    (ctx) => `Long day? Yakitori in ${ctx.areaLabel} hits different tonight.`,
    (ctx) => `Izakaya night in ${ctx.areaLabel} — we picked local favorites.`,
    (ctx) => `A calm cafe break in ${ctx.areaLabel} sounds perfect.`,
    (ctx) => `${ctx.timeLabel} free — night views near ${ctx.areaLabel} are stunning.`,
  ],
};

const TRAVELER_AI_MESSAGES = {
  ja: [
    () => `今夜は東京の隠れ家フードストリートを探索するのにぴったりです。`,
    () => `本場の寿司体験——ガイドブックにない一軒を見つけましょう。`,
    () => `日本文化を味わえるスポットを厳選しました。`,
    () => `Welcome to Tokyo — あなただけの東京の一瞬を見つけましょう。`,
  ],
  en: [
    () => `Tonight is perfect for discovering Tokyo's hidden food streets.`,
    () => `Authentic sushi awaits — beyond the guidebook.`,
    () => `We curated spots where Japanese culture comes alive.`,
    () => `Welcome to Tokyo — let's find your moment tonight.`,
  ],
};

export function getModeAICopy(mode, context, locale = 'ja') {
  const pool = mode === 'traveler' ? TRAVELER_AI_MESSAGES : LOCAL_AI_MESSAGES;
  const messages = pool[locale] ?? pool.ja;
  const hour = new Date().getHours();
  const idx = hour % messages.length;
  return messages[idx](context);
}

export function getCategoryLabel(item, locale) {
  return locale === 'en' ? item.labelEn : item.labelJa;
}
