import { getAreaLabel } from '@/data/areas';

const SHOP_NAME_EN = {
  'ナチュラルワインバー恵比寿': 'Natural Wine Bar Ebisu',
  '中目黒ワイン酒場': 'Nakameguro Wine Stand',
  '猿田彦珈琲 恵比寿店': 'Sarutahiko Coffee Ebisu',
  '代官山カフェ カドヤ': 'Daikanyama Cafe Kadoya',
  '恵比寿焼肉街': 'Ebisu Yakiniku Alley',
  '中目黒ラーメン': 'Nakameguro Ramen',
  '下北沢焼き鳥横丁': 'Shimokitazawa Yakitori Alley',
  '恵比寿ガーデンプレイス': 'Ebisu Garden Place',
  '六本木ヒルズ展望': 'Roppongi Hills Observatory',
  '代官山ヒルサイドテラス': 'Daikanyama Hillside Terrace',
  '目黒川ネオン散歩': 'Meguro River Neon Walk',
  '渋谷スクランブル': 'Shibuya Scramble Crossing',
  '浅草寺': 'Senso-ji Temple',
  'ライブハウス恵比寿': 'Ebisu Live House',
  '下北沢ジャズバー': 'Shimokitazawa Jazz Bar',
  '新宿ゴールデン街': 'Shinjuku Golden Gai',
  '東京都写真美術館': 'Tokyo Photographic Art Museum',
  '中目黒川沿い散歩': 'Meguro River Stroll',
  '神楽坂石畳散歩': 'Kagurazaka Cobblestone Walk',
};

const VIBE_NAME_EN = {
  'Neon Wine Night': 'Neon Wine Night',
  'Hidden Speakeasy': 'Hidden Speakeasy',
  'Standing Wine Bar': 'Standing Wine Bar',
  'Slow Morning': 'Slow Morning',
  'Riverside Coffee': 'Riverside Coffee',
  'Bookstore Cafe': 'Bookstore Cafe',
};

const TRAVELER_TAG_POOL = {
  ja: ['English Menu', 'Cashless', 'Reservation', 'Hidden Gems', 'Photo Spot', 'Easy Access'],
  en: ['English Menu', 'Cashless', 'Reservation', 'Hidden Gems', 'Photo Spot', 'Easy Access'],
};

const LOCAL_TAG_POOL = {
  ja: ['コスパ', '穴場', '二次会', '終電まで', '地元の味', '深夜営業'],
  en: ['Great Value', 'Hole-in-the-Wall', 'After-Party', 'Until Last Train', 'Local Favorite', 'Late Night'],
};

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

export function getShopNameEn(shopName) {
  return SHOP_NAME_EN[shopName] ?? shopName;
}

export function getVibeNameEn(vibeName) {
  return VIBE_NAME_EN[vibeName] ?? vibeName;
}

export function getExperienceTags(vibe, experienceMode, locale = 'ja') {
  const pool = experienceMode === 'traveler' ? TRAVELER_TAG_POOL : LOCAL_TAG_POOL;
  const tags = pool[locale] ?? pool.ja;
  const h = hashId(vibe.id + experienceMode);
  const count = experienceMode === 'traveler' ? 3 : 2;
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    const tag = tags[(h + i) % tags.length];
    if (!picked.includes(tag)) picked.push(tag);
  }
  return picked;
}

export function localizeVibe(vibe, { locale = 'ja', experienceMode = 'local' } = {}) {
  const shopName = locale === 'en' ? getShopNameEn(vibe.shopName) : vibe.shopName;
  const vibeName = locale === 'en' ? getVibeNameEn(vibe.vibeName) : vibe.vibeName;
  const reviewSnippet =
    experienceMode === 'traveler'
      ? (locale === 'en' ? vibe.reviewSnippetTravelerEn : vibe.reviewSnippetTravelerJa)
      : (locale === 'en' ? vibe.reviewSnippetLocalEn : vibe.reviewSnippetLocalJa);

  return {
    ...vibe,
    shopName,
    vibeName,
    area: getAreaLabel(vibe.area, locale),
    reviewSnippet: reviewSnippet ?? vibe.reviewSnippet,
    experienceTags: getExperienceTags(vibe, experienceMode, locale),
    keywordIds:
      experienceMode === 'traveler'
        ? [...new Set([...(vibe.travelerKeywordIds ?? []), ...(vibe.keywordIds ?? [])])]
        : [...new Set([...(vibe.localKeywordIds ?? []), ...(vibe.keywordIds ?? [])])],
  };
}

export function localizeVibes(vibes, options) {
  return vibes.map((v) => localizeVibe(v, options));
}
