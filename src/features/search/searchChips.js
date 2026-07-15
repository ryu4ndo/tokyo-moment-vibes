/** Mode-specific quick search chips + time-based popular + post-search AI filters */

export const AI_FILTER_CHIPS = [
  { id: 'quieter', labelJa: 'もう少し静かなお店', labelEn: 'Quieter spots', icon: '🤫' },
  { id: 'cheaper', labelJa: '予算を安くする', labelEn: 'Lower budget', icon: '💴' },
  { id: 'walk10', labelJa: '徒歩10分以内', labelEn: 'Within 10 min walk', icon: '🚶' },
  { id: 'locals', labelJa: '地元の人が多い', labelEn: 'Where locals go', icon: '🏠' },
  { id: 'sns', labelJa: 'SNSで人気', labelEn: 'Trending on social', icon: '📸' },
  { id: 'date', labelJa: 'デート向け', labelEn: 'Date-friendly', icon: '💕' },
];

export const TRAVELER_SEARCH_CHIPS = [
  { id: 'classic', queryJa: '東京の王道スポット', queryEn: 'Classic Tokyo must-sees' },
  { id: 'local', queryJa: '地元の人が行くお店', queryEn: 'Where locals actually go' },
  { id: 'culture', queryJa: '日本文化を体験できる場所', queryEn: 'Japanese culture experiences' },
  { id: 'trending', queryJa: '今日人気のスポット', queryEn: "Today's trending spots" },
  { id: 'english', queryJa: '英語メニューがあるレストラン', queryEn: 'Restaurants with English menus' },
  { id: 'photo', queryJa: '写真映えする夜景スポット', queryEn: 'Instagram-worthy night views' },
];

export const LOCAL_SEARCH_CHIPS = [
  { id: 'afterwork', queryJa: '仕事終わりにサクッと飲める', queryEn: 'Quick after-work drinks' },
  { id: 'date', queryJa: 'デートにおすすめの場所', queryEn: 'Great for a date' },
  { id: 'solo', queryJa: '一人でゆっくり飲める居酒屋', queryEn: 'Solo-friendly izakaya' },
  { id: 'rain', queryJa: '雨の日でも楽しめる屋内', queryEn: 'Rainy day indoor spots' },
  { id: 'cospa', queryJa: 'コスパのいいグルメ', queryEn: 'Best value eats' },
  { id: 'latenight', queryJa: '終電まで遊べる場所', queryEn: 'Fun until last train' },
];

const POPULAR_NIGHT = [
  { queryJa: '居酒屋', queryEn: 'Izakaya' },
  { queryJa: 'バー', queryEn: 'Bars' },
  { queryJa: '夜景', queryEn: 'Night views' },
  { queryJa: '深夜カフェ', queryEn: 'Late-night cafés' },
];

const POPULAR_LUNCH = [
  { queryJa: 'ランチ', queryEn: 'Lunch' },
  { queryJa: 'カフェ', queryEn: 'Cafés' },
  { queryJa: '食べ歩き', queryEn: 'Food crawl' },
  { queryJa: 'ラーメン', queryEn: 'Ramen' },
];

const POPULAR_AFTERNOON = [
  { queryJa: 'カフェ', queryEn: 'Cafés' },
  { queryJa: '美術館', queryEn: 'Museums' },
  { queryJa: '散歩コース', queryEn: 'Walking routes' },
  { queryJa: 'チル', queryEn: 'Chill spots' },
];

const POPULAR_MORNING = [
  { queryJa: 'モーニングカフェ', queryEn: 'Morning cafés' },
  { queryJa: '朝ごはん', queryEn: 'Breakfast' },
  { queryJa: '公園散歩', queryEn: 'Park walks' },
];

export function getPopularSearches(date = new Date()) {
  const hour = date.getHours();
  const day = date.getDay();
  let pool = POPULAR_AFTERNOON;

  if (hour >= 18 || hour < 2) pool = POPULAR_NIGHT;
  else if (hour >= 11 && hour < 14) pool = POPULAR_LUNCH;
  else if (hour < 11) pool = POPULAR_MORNING;

  if (day === 5 || day === 6) {
    pool = [...pool, { queryJa: '週末デート', queryEn: 'Weekend date' }];
  }

  return pool.slice(0, 4);
}

export function getModeChips(experienceMode) {
  return experienceMode === 'traveler' ? TRAVELER_SEARCH_CHIPS : LOCAL_SEARCH_CHIPS;
}

export function getChipQuery(chip, locale) {
  return locale === 'en' ? chip.queryEn : chip.queryJa;
}

export function getFilterLabel(filterId, locale) {
  const chip = AI_FILTER_CHIPS.find((c) => c.id === filterId);
  if (!chip) return filterId;
  return locale === 'en' ? chip.labelEn : chip.labelJa;
}
