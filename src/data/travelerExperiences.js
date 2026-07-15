/** Traveler Mode — choose an experience, not a dish */

export const TRAVELER_EXPERIENCES = [
  {
    id: 'local-favorite',
    icon: '🏠',
    labelJa: '地元の人が普段行くお店',
    labelEn: 'Where locals actually go',
    descriptionJa: 'ガイドブックに載らない、地元の人だけが知る名店。本物の東京の日常を味わえます。',
    descriptionEn: 'Off-guidebook spots where Tokyoites actually eat — taste real local life.',
    categories: ['food', 'nightlife', 'cafe'],
    preferHidden: true,
  },
  {
    id: 'classic-popular',
    icon: '⭐',
    labelJa: '王道の人気グルメ',
    labelEn: 'Classic must-eats',
    descriptionJa: '東京を代表する定番グルメ。初めてでも外さない、王道の美味しさ。',
    descriptionEn: 'Tokyo classics you cannot miss — reliable favorites every visitor loves.',
    categories: ['food'],
    minRating: 4.5,
  },
  {
    id: 'sns-trending',
    icon: '📱',
    labelJa: '今SNSで話題',
    labelEn: 'Trending on social',
    descriptionJa: '今InstagramやTikTokでバズっている話題の店。映えも味も妥協なし。',
    descriptionEn: 'The spots blowing up on Instagram and TikTok right now.',
    categories: ['food', 'cafe'],
    trending: true,
  },
  {
    id: 'popular-today',
    icon: '🔥',
    labelJa: '今日人気のお店',
    labelEn: 'Popular today',
    descriptionJa: '今夜特に人気の店をピックアップ。行列の先にある美味しさを。',
    descriptionEn: 'Tonight\'s hottest picks — worth the wait.',
    categories: ['food', 'nightlife'],
    popular: true,
  },
  {
    id: 'hidden-gem',
    icon: '💎',
    labelJa: '隠れた名店',
    labelEn: 'Hidden gems',
    descriptionJa: '路地裏の隠れ家。知る人ぞ知る、特別な一軒を見つけましょう。',
    descriptionEn: 'Alleyway secrets — discover a place only insiders know.',
    categories: ['food', 'nightlife'],
    preferHidden: true,
  },
  {
    id: 'japanese-culture',
    icon: '🏮',
    labelJa: '日本文化を体験',
    labelEn: 'Japanese culture',
    descriptionJa: '食を通じて日本文化に触れる体験。職人の技、伝統の味わい。',
    descriptionEn: 'Experience Japanese culture through food — craft, tradition, ritual.',
    categories: ['food', 'cafe'],
    cultural: true,
  },
  {
    id: 'value',
    icon: '💰',
    labelJa: 'コスパ重視',
    labelEn: 'Great value',
    descriptionJa: '満足度の高い、お財布に優しい選択肢。質は落とさずコスパ良く。',
    descriptionEn: 'High satisfaction without breaking the bank.',
    categories: ['food', 'cafe'],
    maxBudget: '¥¥',
  },
  {
    id: 'luxury',
    icon: '✨',
    labelJa: '高級グルメ',
    labelEn: 'Fine dining',
    descriptionJa: '特別な夜のための上質な体験。記憶に残る一皿を。',
    descriptionEn: 'A special night deserves an unforgettable meal.',
    categories: ['food', 'wine'],
    minBudget: '¥¥¥',
  },
  {
    id: 'solo-friendly',
    icon: '🧘',
    labelJa: '一人でも入りやすい',
    labelEn: 'Solo-friendly',
    descriptionJa: '一人でも気軽に入れる、居心地の良い店。カウンター席も充実。',
    descriptionEn: 'Easy and comfortable for solo diners — counter seats welcome.',
    categories: ['food', 'cafe', 'nightlife'],
    solo: true,
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    labelJa: '家族向け',
    labelEn: 'Family-friendly',
    descriptionJa: '家族みんなで楽しめる、安心して入れるお店。',
    descriptionEn: 'Welcoming spots the whole family can enjoy.',
    categories: ['food', 'cafe'],
    family: true,
  },
  {
    id: 'izakaya-night',
    icon: '🍶',
    labelJa: '夜の居酒屋体験',
    labelEn: 'Izakaya night',
    descriptionJa: 'ビールと小皿、東京の夜の定番体験。路地裏の雰囲気も楽しめます。',
    descriptionEn: 'Beer, small plates, and Tokyo nightlife — the classic izakaya experience.',
    categories: ['nightlife', 'food'],
    keywords: ['居酒屋', 'izakaya', '焼き鳥', '横丁'],
  },
  {
    id: 'market-walk',
    icon: '🏪',
    labelJa: '市場・食べ歩き',
    labelEn: 'Market & street food',
    descriptionJa: '市場や商店街を歩きながら味わう、食べ歩き体験。',
    descriptionEn: 'Stroll markets and food streets — taste Tokyo as you walk.',
    categories: ['food', 'walk'],
    keywords: ['市場', '食べ歩き', 'ストリート', 'market'],
  },
];

const byId = new Map(TRAVELER_EXPERIENCES.map((e) => [e.id, e]));

export function getTravelerExperience(id) {
  return byId.get(id);
}

export function getTravelerExperienceLabel(exp, locale) {
  if (!exp) return '';
  return locale === 'en' ? exp.labelEn : exp.labelJa;
}

export function getTravelerExperienceDescription(exp, locale) {
  if (!exp) return '';
  return locale === 'en' ? exp.descriptionEn : exp.descriptionJa;
}
