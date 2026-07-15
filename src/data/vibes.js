import { enrichWithSpotData } from '@/utils/spotLookup';

export const VIBE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'bar', label: 'Bar' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'food', label: 'Food' },
  { id: 'rooftop', label: 'Rooftop' },
  { id: 'nightview', label: 'Night View' },
  { id: 'music', label: 'Music' },
  { id: 'chill', label: 'Chill' },
];

const IMG = {
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=85&auto=format&fit=crop&sat=-15&warm',
  bar2: 'https://images.unsplash.com/photo-1572116469696-31de07719aa2?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  cafe: 'https://images.unsplash.com/photo-1509048191087-dc4f030d9e71?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  cafe2: 'https://images.unsplash.com/photo-1445112254802-cb0b785fa227?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  food: 'https://images.unsplash.com/photo-1594212699903-ec524e3a456d?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  izakaya: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  rooftop: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  rooftop2: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  night: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  neon: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=85&auto=format&fit=crop&sat=-5&warm',
  rain: 'https://images.unsplash.com/photo-1513407030344-c6b029d0d041?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  music: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  jazz: 'https://images.unsplash.com/photo-1415201364774-f6f0f293b086?w=900&q=85&auto=format&fit=crop&sat=-10&warm',
  chill: 'https://images.unsplash.com/photo-1509048191087-dc4f030d9e71?w=900&q=85&auto=format&fit=crop&sat=-15&warm',
  chill2: 'https://images.unsplash.com/photo-1445112254802-cb0b785fa227?w=900&q=85&auto=format&fit=crop&sat=-15&warm',
};

export const VIBES = [
  {
    id: 'vibe-bar-01',
    spotId: 'ebisu-wine-01',
    vibeName: 'Neon Wine Night',
    shopName: 'ナチュラルワインバー恵比寿',
    category: 'bar',
    categoryLabel: 'Bar',
    image: IMG.bar,
    rating: 4.8,
    walkMinutes: 5,
    isOpen: true,
    aiPick: true,
    mood: '🍷 しっぽり飲みたい',
    height: 'tall',
  },
  {
    id: 'vibe-bar-02',
    spotId: 'ebisu-wine-02',
    vibeName: 'Hidden Speakeasy',
    shopName: 'Bar Trench',
    category: 'bar',
    categoryLabel: 'Bar',
    image: IMG.bar2,
    rating: 4.9,
    walkMinutes: 7,
    isOpen: true,
    aiPick: false,
    mood: '🌃 深夜東京を感じたい',
    height: 'medium',
  },
  {
    id: 'vibe-bar-03',
    spotId: 'nakame-wine-03',
    vibeName: 'Standing Wine Bar',
    shopName: '中目黒ワイン酒場',
    category: 'bar',
    categoryLabel: 'Bar',
    image: IMG.neon,
    rating: 4.7,
    walkMinutes: 4,
    isOpen: true,
    aiPick: true,
    mood: '🍷 しっぽり飲みたい',
    height: 'short',
  },
  {
    id: 'vibe-cafe-01',
    spotId: 'ebisu-cafe-01',
    vibeName: 'Slow Morning',
    shopName: '猿田彦珈琲 恵比寿店',
    category: 'cafe',
    categoryLabel: 'Cafe',
    image: IMG.cafe,
    rating: 4.8,
    walkMinutes: 3,
    isOpen: true,
    aiPick: true,
    mood: '☕ 一人で落ち着きたい',
    height: 'medium',
  },
  {
    id: 'vibe-cafe-02',
    spotId: 'nakame-cafe-01',
    vibeName: 'Riverside Coffee',
    shopName: 'Onibus Coffee',
    category: 'cafe',
    categoryLabel: 'Cafe',
    image: IMG.cafe2,
    rating: 4.9,
    walkMinutes: 6,
    isOpen: true,
    aiPick: false,
    mood: '☕ 一人で落ち着きたい',
    height: 'tall',
  },
  {
    id: 'vibe-cafe-03',
    spotId: 'daikanyama-cafe-01',
    vibeName: 'Bookstore Cafe',
    shopName: '代官山カフェ カドヤ',
    category: 'cafe',
    categoryLabel: 'Cafe',
    image: IMG.chill,
    rating: 4.6,
    walkMinutes: 8,
    isOpen: true,
    aiPick: false,
    mood: '☕ 一人で落ち着きたい',
    height: 'short',
  },
  {
    id: 'vibe-food-01',
    spotId: 'ebisu-food-01',
    vibeName: 'Yakitori Alley',
    shopName: '恵比寿焼肉街',
    category: 'food',
    categoryLabel: 'Food',
    image: IMG.izakaya,
    rating: 4.7,
    walkMinutes: 5,
    isOpen: true,
    aiPick: true,
    mood: '✨ ローカル東京を感じたい',
    height: 'tall',
  },
  {
    id: 'vibe-food-02',
    spotId: 'nakame-food-01',
    vibeName: 'Late Night Ramen',
    shopName: '中目黒ラーメン',
    category: 'food',
    categoryLabel: 'Food',
    image: IMG.food,
    rating: 4.5,
    walkMinutes: 4,
    isOpen: true,
    aiPick: false,
    mood: '🌃 深夜東京を感じたい',
    height: 'medium',
  },
  {
    id: 'vibe-food-03',
    spotId: 'shimokita-food-01',
    vibeName: 'Local Izakaya',
    shopName: '下北沢焼き鳥横丁',
    category: 'food',
    categoryLabel: 'Food',
    image: IMG.izakaya,
    rating: 4.8,
    walkMinutes: 6,
    isOpen: false,
    aiPick: false,
    mood: '✨ ローカル東京を感じたい',
    height: 'short',
  },
  {
    id: 'vibe-roof-01',
    spotId: 'ebisu-walk-02',
    vibeName: 'City Lights',
    shopName: '恵比寿ガーデンプレイス',
    category: 'rooftop',
    categoryLabel: 'Rooftop',
    image: IMG.rooftop,
    rating: 4.9,
    walkMinutes: 7,
    isOpen: true,
    aiPick: true,
    mood: '🌃 深夜東京を感じたい',
    height: 'tall',
  },
  {
    id: 'vibe-roof-02',
    spotId: 'roppongi-walk-01',
    vibeName: 'Skyline Terrace',
    shopName: '六本木ヒルズ展望',
    category: 'rooftop',
    categoryLabel: 'Rooftop',
    image: IMG.rooftop2,
    rating: 4.8,
    walkMinutes: 10,
    isOpen: true,
    aiPick: false,
    mood: '🌃 深夜東京を感じたい',
    height: 'medium',
  },
  {
    id: 'vibe-roof-03',
    spotId: 'daikanyama-walk-01',
    vibeName: 'Hillside Terrace',
    shopName: '代官山ヒルサイドテラス',
    category: 'rooftop',
    categoryLabel: 'Rooftop',
    image: IMG.rooftop2,
    rating: 4.7,
    walkMinutes: 9,
    isOpen: true,
    aiPick: false,
    mood: '✨ ローカル東京を感じたい',
    height: 'short',
  },
  {
    id: 'vibe-night-01',
    spotId: 'nakame-walk-03',
    vibeName: 'River Neon Walk',
    shopName: '目黒川ネオン散歩',
    category: 'nightview',
    categoryLabel: 'Night View',
    image: IMG.night,
    rating: 4.9,
    walkMinutes: 3,
    isOpen: true,
    aiPick: true,
    mood: '🚶 雨の夜を歩きたい',
    height: 'tall',
  },
  {
    id: 'vibe-night-02',
    spotId: 'shibuya-walk-01',
    vibeName: 'Scramble Nights',
    shopName: '渋谷スクランブル',
    category: 'nightview',
    categoryLabel: 'Night View',
    image: IMG.neon,
    rating: 4.8,
    walkMinutes: 5,
    isOpen: true,
    aiPick: false,
    mood: '🌃 深夜東京を感じたい',
    height: 'medium',
  },
  {
    id: 'vibe-night-03',
    spotId: 'asakusa-walk-01',
    vibeName: 'Rainy Lantern',
    shopName: '浅草寺',
    category: 'nightview',
    categoryLabel: 'Night View',
    image: IMG.rain,
    rating: 4.7,
    walkMinutes: 8,
    isOpen: true,
    aiPick: false,
    mood: '🚶 雨の夜を歩きたい',
    height: 'short',
  },
  {
    id: 'vibe-music-01',
    spotId: 'ebisu-night-02',
    vibeName: 'Live House Vibes',
    shopName: 'ライブハウス恵比寿',
    category: 'music',
    categoryLabel: 'Music',
    image: IMG.music,
    rating: 4.8,
    walkMinutes: 6,
    isOpen: true,
    aiPick: true,
    mood: '🌃 深夜東京を感じたい',
    height: 'tall',
  },
  {
    id: 'vibe-music-02',
    spotId: 'shimokita-night-01',
    vibeName: 'Jazz & Vinyl',
    shopName: '下北沢ジャズバー',
    category: 'music',
    categoryLabel: 'Music',
    image: IMG.jazz,
    rating: 4.9,
    walkMinutes: 4,
    isOpen: true,
    aiPick: false,
    mood: '🍷 しっぽり飲みたい',
    height: 'medium',
  },
  {
    id: 'vibe-music-03',
    spotId: 'shinjuku-night-01',
    vibeName: 'Golden Gai',
    shopName: '新宿ゴールデン街',
    category: 'music',
    categoryLabel: 'Music',
    image: IMG.neon,
    rating: 4.6,
    walkMinutes: 7,
    isOpen: true,
    aiPick: false,
    mood: '✨ ローカル東京を感じたい',
    height: 'short',
  },
  {
    id: 'vibe-chill-01',
    spotId: 'ebisu-culture-01',
    vibeName: 'Quiet Gallery',
    shopName: '東京都写真美術館',
    category: 'chill',
    categoryLabel: 'Chill',
    image: IMG.chill2,
    rating: 4.8,
    walkMinutes: 5,
    isOpen: true,
    aiPick: true,
    mood: '☕ 一人で落ち着きたい',
    height: 'medium',
  },
  {
    id: 'vibe-chill-02',
    spotId: 'nakame-walk-01',
    vibeName: 'Canal Stroll',
    shopName: '中目黒川沿い散歩',
    category: 'chill',
    categoryLabel: 'Chill',
    image: IMG.rain,
    rating: 4.7,
    walkMinutes: 2,
    isOpen: true,
    aiPick: false,
    mood: '🚶 雨の夜を歩きたい',
    height: 'tall',
  },
  {
    id: 'vibe-chill-03',
    spotId: 'kagurazaka-walk-01',
    vibeName: 'Stone Path Calm',
    shopName: '神楽坂石畳散歩',
    category: 'chill',
    categoryLabel: 'Chill',
    image: IMG.chill,
    rating: 4.6,
    walkMinutes: 9,
    isOpen: true,
    aiPick: false,
    mood: '☕ 一人で落ち着きたい',
    height: 'short',
  },
];

const VIDEO_URLS = {
  tokyo: 'https://videos.pexels.com/video-files/3254765/3254765-hd_1920_1080_30fps.mp4',
  bar: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4',
  cafe: 'https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_30fps.mp4',
  food: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4',
};

const AI_COMMENTS_BY_MODE = {
  local: {
    ja: [
      '地元の人に人気の店。',
      '東京の人が本当に通う場所。',
      '22時以降がちょうどいい。',
      '近所の人のお気に入り。',
    ],
    en: [
      'Perfect after 10 PM.',
      'Loved by locals.',
      'Great first Tokyo night.',
      'English menu available.',
      'Rainy day recommendation.',
      'Where Tokyo people actually go.',
      'A true neighborhood favorite.',
    ],
  },
  traveler: {
    ja: [
      '初めての東京夜にぴったり。',
      '海外からの旅行者にも安心。',
      '観光地っぽくない、本物の東京。',
      'スタッフが旅行者をよく迎えてくれる。',
    ],
    en: [
      'Great first Tokyo experience.',
      'Easy for international visitors.',
      'Iconic, but still feels real.',
      'Staff are used to welcoming travelers.',
    ],
  },
};

const AI_REASONS_BY_MODE = {
  local: {
    ja: '仕事帰りに地元の人が立ち寄る場所。有名だからではなく、空気感が本物の東京だから選ばれています。',
    en: 'Locals come here after work — not because it is famous, but because the atmosphere is genuinely Tokyo.',
  },
  traveler: {
    ja: '初めての東京でも迷わず楽しめるのに、観光地感がない一軒。AIが「東京に恋する体験」を求める人向けに選びました。',
    en: 'A must-visit that still delivers an authentic Tokyo night — memorable without feeling touristy.',
  },
};

const KEYWORD_MAP = {
  bar: ['bar', 'hidden', 'cocktail', 'late-night', 'wine-bar'],
  cafe: ['night-cafe', 'chill', 'solo', 'quiet', 'photogenic'],
  food: ['izakaya', 'late-food', 'local', 'friends'],
  rooftop: ['rooftop', 'night-view', 'photogenic', 'date'],
  nightview: ['night-view', 'night-walk', 'neon', 'photogenic', 'rain'],
  music: ['jazz', 'bar', 'late-night', 'local'],
  chill: ['chill', 'solo', 'quiet', 'rain', 'gallery'],
};

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

function enrichVibe(vibe) {
  const h = hashId(vibe.id);
  const priceByCategory = {
    bar: '¥¥¥', cafe: '¥', food: '¥¥', rooftop: '¥¥¥',
    nightview: '¥', music: '¥¥', chill: '¥',
  };
  const hoursByCategory = {
    bar: '17:00 – 02:00', cafe: '08:00 – 22:00', food: '11:30 – 23:30',
    rooftop: '16:00 – 24:00', nightview: '24時間', music: '18:00 – 02:00', chill: '10:00 – 20:00',
  };
  const suitableMap = {
    bar: ['date', 'friends', 'solo'],
    cafe: ['solo', 'date'],
    food: ['friends', 'date'],
    rooftop: ['date', 'friends'],
    nightview: ['solo', 'friends', 'date'],
    music: ['friends', 'date'],
    chill: ['solo'],
  };

  const isVideo =
    h % 4 === 0 ||
    ['vibe-bar-01', 'vibe-night-01', 'vibe-music-01', 'vibe-roof-01', 'vibe-food-01'].includes(vibe.id);
  const videoKey = vibe.category === 'food' ? 'food' : vibe.category === 'cafe' ? 'cafe' : vibe.category === 'bar' ? 'bar' : 'tokyo';

  const aspectVariants = ['aspect-[2/3]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[5/4]', 'aspect-[3/5]'];
  const sizeVariants = vibe.aiPick ? 'featured' : vibe.rating >= 4.8 ? 'large' : 'normal';

  const experienceModes = (() => {
    if (h % 5 === 0) return ['local'];
    if (h % 5 === 1) return ['classic', 'hidden'];
    if (h % 5 === 2) return ['local', 'classic'];
    if (h % 5 === 3) return ['hidden', 'classic'];
    return ['local', 'hidden'];
  })();

  const travelerKeywordIds = ['english-menu', 'cashless', 'reservation', 'hidden-gems', 'photo-spot'];
  const localKeywordIds = ['value', 'hole-in-wall', 'after-party', 'until-last-train', 'local', 'izakaya'];

  const reviewSnippets = {
    travelerJa: [
      '英語メニューがあり、旅行者にも安心でした。',
      'カード決済OK。初めての東京でも迷わず楽しめます。',
      '予約しやすく、スタッフが親切でした。',
    ],
    travelerEn: [
      'English menu made ordering easy — felt welcome as a visitor.',
      'Cashless payment and smooth service. Great first Tokyo night.',
      'Easy to reserve and staff were helpful with recommendations.',
    ],
    localJa: [
      '地元の人で賑わう、ガイドブックにない一軒。',
      'コスパ良く、二次会にもぴったり。',
      '終電ギリギリまで営業。東京の夜を味わえる。',
    ],
    localEn: [
      'Packed with locals — nowhere near the tourist trail.',
      'Great value and perfect for a spontaneous after-party stop.',
      'Open late enough for a real Tokyo night out.',
    ],
  };

  const companionFit = (() => {
    const fits = new Set();
    const cat = vibe.category;
    const suitable = suitableMap[cat] ?? [];
    if (suitable.includes('solo') || cat === 'cafe' || cat === 'chill') fits.add('solo');
    if (suitable.includes('date') || cat === 'rooftop' || cat === 'nightview') fits.add('couple');
    if (suitable.includes('friends') || cat === 'food' || cat === 'bar' || cat === 'music') fits.add('friends');
    if (cat === 'food' || cat === 'cafe') fits.add('family');
    if (cat === 'cafe' || (cat === 'bar' && h % 3 === 0)) fits.add('business');
    if (priceByCategory[cat] === '¥' || priceByCategory[cat] === '¥¥' || cat === 'food') fits.add('backpacker');
    if (fits.size === 0) fits.add('solo');
    return [...fits];
  })();

  const aiCommentByMode = {
    local: {
      ja: AI_COMMENTS_BY_MODE.local.ja[h % AI_COMMENTS_BY_MODE.local.ja.length],
      en: AI_COMMENTS_BY_MODE.local.en[h % AI_COMMENTS_BY_MODE.local.en.length],
    },
    traveler: {
      ja: AI_COMMENTS_BY_MODE.traveler.ja[h % AI_COMMENTS_BY_MODE.traveler.ja.length],
      en: AI_COMMENTS_BY_MODE.traveler.en[h % AI_COMMENTS_BY_MODE.traveler.en.length],
    },
  };

  const base = {
    ...vibe,
    area: vibe.area ?? (vibe.shopName.includes('恵比寿') ? '恵比寿' : vibe.shopName.includes('中目黒') ? '中目黒' : vibe.shopName.includes('渋谷') ? '渋谷' : vibe.shopName.includes('代官山') ? '代官山' : vibe.shopName.includes('六本木') ? '六本木' : vibe.shopName.includes('浅草') ? '浅草' : vibe.shopName.includes('新宿') ? '新宿' : vibe.shopName.includes('下北沢') ? '下北沢' : '東京'),
    priceRange: priceByCategory[vibe.category] ?? '¥¥',
    photoCount: 6 + (h % 12),
    aiCommentByMode,
    aiComment: aiCommentByMode.local.ja,
    aiReasonByMode: AI_REASONS_BY_MODE,
    aiReason: AI_REASONS_BY_MODE.local.ja,
    companionFit,
    travelerKeywordIds,
    localKeywordIds,
    reviewSnippetTravelerJa: reviewSnippets.travelerJa[h % reviewSnippets.travelerJa.length],
    reviewSnippetTravelerEn: reviewSnippets.travelerEn[h % reviewSnippets.travelerEn.length],
    reviewSnippetLocalJa: reviewSnippets.localJa[h % reviewSnippets.localJa.length],
    reviewSnippetLocalEn: reviewSnippets.localEn[h % reviewSnippets.localEn.length],
    bestTimeJa: '20時以降',
    bestTimeEn: 'After 8 PM',
    localTipJa: 'カウンター席を狙うと雰囲気がいい。',
    localTipEn: 'Ask for a counter seat for the best vibe.',
    experienceModes,
    keywordIds: KEYWORD_MAP[vibe.category] ?? ['local'],
    isPopular: vibe.rating >= 4.8,
    reservable: vibe.aiPick || vibe.rating >= 4.7,
    suitableFor: suitableMap[vibe.category] ?? ['friends'],
    lateNight: ['bar', 'food', 'music', 'nightview'].includes(vibe.category),
    openingHours: hoursByCategory[vibe.category] ?? '11:00 – 22:00',
    reviewCount: 80 + (h % 400),
    reviewSnippet: '雰囲気が最高で、また来たいと思えるお店でした。',
    images: [vibe.image, IMG.neon, IMG.night, IMG.bar].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    saveCount: 40 + (h % 800),
    popularity: 55 + (h % 45),
    crowdLevel: ['quiet', 'moderate', 'busy'][h % 3],
    isVideo,
    videoUrl: isVideo ? VIDEO_URLS[videoKey] : null,
    videoDuration: 15,
    mediaType: isVideo ? 'video' : (6 + (h % 12) > 5 ? 'carousel' : 'photo'),
    cardAspect: aspectVariants[h % aspectVariants.length],
    cardSize: sizeVariants,
  };

  return enrichWithSpotData(base);
}

export const ENRICHED_VIBES = VIBES.map(enrichVibe);

export function filterVibes(category = 'all') {
  if (category === 'all') return ENRICHED_VIBES;
  return ENRICHED_VIBES.filter((vibe) => vibe.category === category);
}
