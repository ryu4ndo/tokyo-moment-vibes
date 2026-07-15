import { ENRICHED_VIBES } from '@/data/vibes';
import { EVENTS_CATALOG } from '@/data/eventsCatalog';
import { DEFAULT_AI_PRIORITY } from '@/platform/domain/types';

const STORAGE_KEY = 'tokyo-platform-store-v1';

function seedBusinesses() {
  return ENRICHED_VIBES.slice(0, 8).map((v, i) => ({
    id: `biz-${v.spotId}`,
    ownerId: i < 2 ? 'owner-demo' : `owner-${i}`,
    name: v.shopName,
    nameEn: v.shopName,
    description: v.aiComment ?? `${v.area}の${v.category}スポット`,
    descriptionEn: `A ${v.category} spot in ${v.area}`,
    photos: [v.image, ...(v.images ?? [])].filter(Boolean).slice(0, 5),
    videos: v.isVideo && v.videoUrl ? [v.videoUrl] : [],
    menu: ['Signature dish', 'Chef special', 'Seasonal item'],
    priceRange: v.priceRange ?? '¥¥',
    hours: { open: '11:00', close: '23:00', closedDays: ['月'] },
    address: `東京都${v.area}`,
    area: v.area,
    phone: '03-0000-0000',
    instagram: '@tokyo_moment',
    website: '',
    spotId: v.spotId,
    status: i < 6 ? 'verified' : 'pending',
    featured: Boolean(v.aiPick),
    sponsored: i === 0,
    lat: v.lat,
    lng: v.lng,
    category: v.category,
    updatedAt: Date.now() - i * 86400000,
  }));
}

function seedPlatformEvents() {
  const year = new Date().getFullYear();
  return EVENTS_CATALOG.map((e) => ({
    id: e.id,
    type: e.type === 'fireworks' ? 'fireworks' : e.type === 'festival' ? 'festival' : e.type === 'popup' ? 'popup' : 'seasonal',
    titleJa: e.titleJa,
    titleEn: e.titleEn,
    area: e.area,
    startDate: `${year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`,
    endDate: `${year}-${String(e.month).padStart(2, '0')}-${String(e.day + (e.durationDays ?? 1) - 1).padStart(2, '0')}`,
    showOnToday: true,
    showOnVibes: true,
    active: true,
  }));
}

function seedFeatured() {
  return [
    { id: 'feat-spring', slug: 'spring', titleJa: '春特集', titleEn: 'Spring in Tokyo', descriptionJa: '桜と新緑のシーズン', descriptionEn: 'Cherry blossoms & fresh green', spotIds: ENRICHED_VIBES.slice(0, 4).map((v) => v.spotId), season: 'spring', active: true },
    { id: 'feat-summer', slug: 'summer', titleJa: '夏特集', titleEn: 'Summer nights', descriptionJa: '花火と屋台の季節', descriptionEn: 'Fireworks & festivals', spotIds: ENRICHED_VIBES.slice(4, 8).map((v) => v.spotId), season: 'summer', active: true },
    { id: 'feat-date', slug: 'date', titleJa: 'デート特集', titleEn: 'Date night', descriptionJa: '二人で過ごす東京の夜', descriptionEn: 'Tokyo nights for two', spotIds: ENRICHED_VIBES.filter((v) => v.suitableFor?.includes('date')).slice(0, 5).map((v) => v.spotId), season: 'all', active: true },
    { id: 'feat-rain', slug: 'rainy', titleJa: '雨の日特集', titleEn: 'Rainy day', descriptionJa: '屋内で楽しむ東京', descriptionEn: 'Indoor Tokyo picks', spotIds: ENRICHED_VIBES.filter((v) => ['cafe', 'chill', 'food'].includes(v.category)).slice(0, 5).map((v) => v.spotId), season: 'all', active: true },
    { id: 'feat-foodwalk', slug: 'foodwalk', titleJa: '食べ歩き特集', titleEn: 'Food crawl', descriptionJa: '街歩きグルメ', descriptionEn: 'Street food & bites', spotIds: ENRICHED_VIBES.filter((v) => v.category === 'food').slice(0, 6).map((v) => v.spotId), season: 'all', active: true },
  ];
}

function defaultStore() {
  const businesses = seedBusinesses();
  return {
    businesses,
    businessEvents: [
      { id: 'be-1', businessId: businesses[0].id, type: 'happy_hour', titleJa: 'ハッピーアワー 17-19時', titleEn: 'Happy Hour 5-7pm', descriptionJa: 'ドリンク20%OFF', descriptionEn: '20% off drinks', startDate: '2026-01-01', endDate: '2026-12-31', active: true },
      { id: 'be-2', businessId: businesses[0].id, type: 'limited_menu', titleJa: '期間限定メニュー', titleEn: 'Limited menu', descriptionJa: '夏限定カクテル', descriptionEn: 'Summer cocktails', startDate: '2026-06-01', endDate: '2026-09-30', active: true },
    ],
    coupons: [
      { id: 'cp-1', businessId: businesses[0].id, type: 'percent', labelJa: '10% OFF', labelEn: '10% OFF', discountPercent: 10, startDate: '2026-01-01', endDate: '2026-12-31', active: true },
      { id: 'cp-2', businessId: businesses[1]?.id, type: 'free_item', labelJa: 'ドリンク1杯無料', labelEn: 'Free drink', freeItem: 'Welcome drink', startDate: '2026-01-01', endDate: '2026-12-31', active: true },
    ],
    reviews: [
      { id: 'rv-1', businessId: businesses[0].id, author: 'Alex', rating: 5, text: 'Amazing atmosphere!', reply: null, createdAt: Date.now() - 86400000 },
      { id: 'rv-2', businessId: businesses[0].id, author: 'Yuki', rating: 4, text: '地元の人にも人気', reply: 'ご来店ありがとうございます！', createdAt: Date.now() - 172800000 },
    ],
    platformEvents: seedPlatformEvents(),
    featuredCollections: seedFeatured(),
    ads: [
      { id: 'ad-1', type: 'sponsor', labelJa: 'スポンサー', labelEn: 'Sponsored', businessId: businesses[0].id, spotId: businesses[0].spotId, active: true, isSponsored: true },
      { id: 'ad-2', type: 'area', labelJa: '渋谷エリア広告', labelEn: 'Shibuya promo', area: '渋谷', active: true, isSponsored: true },
    ],
    aiPriority: { ...DEFAULT_AI_PRIORITY },
    adminMetrics: {
      dau: 2840,
      mau: 18200,
      newUsers: 312,
      popularAreas: [{ area: '渋谷', count: 4200 }, { area: '新宿', count: 3800 }, { area: '浅草', count: 2100 }],
      popularCategories: [{ category: 'food', count: 5100 }, { category: 'cafe', count: 4200 }, { category: 'bar', count: 3900 }],
      popularSpots: businesses.slice(0, 5).map((b, i) => ({ spotId: b.spotId, name: b.name, count: 900 - i * 120 })),
      searchRanking: [{ query: '夜景', count: 890 }, { query: '焼鳥', count: 720 }, { query: '渋谷デート', count: 650 }],
      saveRanking: businesses.slice(0, 5).map((b, i) => ({ spotId: b.spotId, name: b.name, count: 400 - i * 50 })),
      aiUsage: 12400,
      plansCreated: 3280,
    },
    users: [
      { id: 'u-1', name: 'Demo User', email: 'demo@example.com', role: 'consumer', status: 'active', createdAt: Date.now() - 30 * 86400000 },
      { id: 'u-2', name: 'Reported User', email: 'bad@example.com', role: 'consumer', status: 'reported', createdAt: Date.now() - 5 * 86400000 },
    ],
    inquiries: [
      { id: 'inq-1', email: 'partner@shop.jp', subject: '掲載について', body: '掲載申請をしたいです', status: 'open', createdAt: Date.now() - 86400000 },
    ],
    reports: [
      { id: 'rep-1', userId: 'u-2', reason: 'spam', status: 'pending', createdAt: Date.now() - 3600000 },
    ],
  };
}

let memoryStore = null;

export function getPlatformStore() {
  if (memoryStore) return memoryStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memoryStore = raw ? JSON.parse(raw) : defaultStore();
  } catch {
    memoryStore = defaultStore();
  }
  return memoryStore;
}

export function savePlatformStore(store) {
  memoryStore = store;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

export function resetPlatformStore() {
  memoryStore = defaultStore();
  savePlatformStore(memoryStore);
  return memoryStore;
}

export function getBusinessAnalytics(businessId) {
  const seed = businessId.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
  const hours = ['6', '12', '18', '21'];
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  return {
    businessId,
    views: 1200 + (seed % 800),
    saves: 180 + (seed % 100),
    aiRecommendations: 420 + (seed % 200),
    hourlyViews: Object.fromEntries(hours.map((h, i) => [h, 100 + (seed % 50) * (i + 1)])),
    weekdayViews: Object.fromEntries(days.map((d, i) => [d, 80 + (seed % 40) * (i % 3 + 1)])),
    tagPopularity: { date: 45, nightview: 38, local: 52, cafe: 30 },
    travelerRatio: 0.35 + (seed % 20) / 100,
    localRatio: 0.65 - (seed % 20) / 100,
    userAttributes: { couple: 40, solo: 35, friends: 25 },
  };
}

export function generateAiBusinessAdvice(analytics, business, locale = 'ja') {
  const isEn = locale === 'en';
  const tips = [];
  const peakHour = Object.entries(analytics.hourlyViews).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (peakHour && Number(peakHour) >= 18) {
    tips.push(isEn ? 'Evening visits dominate — consider a night-only menu or late happy hour.' : '夜の利用が多いため、夜限定メニューや深夜ハッピーアワーがおすすめです。');
  }
  if (analytics.travelerRatio > 0.4) {
    tips.push(isEn ? 'International visitors are growing — add English menu photos and clear pricing.' : '外国人ユーザーが増えています。英語メニューと写真の追加を検討してください。');
  }
  if ((business.photos?.length ?? 0) < 3) {
    tips.push(isEn ? 'Adding more photos could improve save rates significantly.' : '写真を追加すると保存率が上がる可能性があります。');
  }
  if (analytics.saves / Math.max(analytics.views, 1) < 0.12) {
    tips.push(isEn ? 'Try a limited-time coupon to boost saves and visits.' : '期間限定クーポンで保存数・来店数の向上が期待できます。');
  }
  return tips.length ? tips : [isEn ? 'Keep your hours and events updated — AI picks fresh listings.' : '営業時間とイベント情報を最新に保つと、AIおすすめに載りやすくなります。'];
}
