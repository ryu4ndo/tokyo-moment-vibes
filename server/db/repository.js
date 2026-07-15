import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENRICHED_VIBES } from '../../src/data/vibes.js';
import { EVENTS_CATALOG } from '../../src/data/eventsCatalog.js';
import { DEFAULT_AI_PRIORITY } from '../../src/platform/domain/types.js';
import { isDbEnabled, query } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    descriptionJa: e.descriptionJa ?? '',
    descriptionEn: e.descriptionEn ?? '',
  }));
}

export function defaultPlatformStore() {
  const businesses = seedBusinesses();
  return {
    businesses,
    businessEvents: [
      { id: 'be-1', businessId: businesses[0].id, type: 'happy_hour', titleJa: 'ハッピーアワー', titleEn: 'Happy Hour', descriptionJa: '', descriptionEn: '', startDate: '2026-01-01', endDate: '2026-12-31', active: true },
    ],
    coupons: [
      { id: 'cp-1', businessId: businesses[0].id, type: 'percent', labelJa: '10% OFF', labelEn: '10% OFF', discountPercent: 10, startDate: '2026-01-01', endDate: '2026-12-31', active: true },
    ],
    reviews: [
      { id: 'rv-1', businessId: businesses[0].id, author: 'Alex', rating: 5, text: 'Amazing!', reply: null, createdAt: Date.now() },
    ],
    platformEvents: seedPlatformEvents(),
    featuredCollections: [
      { id: 'feat-spring', slug: 'spring', titleJa: '春特集', titleEn: 'Spring', descriptionJa: '桜シーズン', descriptionEn: 'Cherry blossom season', spotIds: ENRICHED_VIBES.slice(0, 4).map((v) => v.spotId), season: 'spring', active: true },
      { id: 'feat-date', slug: 'date', titleJa: 'デート特集', titleEn: 'Date night', descriptionJa: '二人の夜', descriptionEn: 'For two', spotIds: ENRICHED_VIBES.filter((v) => v.suitableFor?.includes('date')).slice(0, 5).map((v) => v.spotId), season: 'all', active: true },
    ],
    ads: [
      { id: 'ad-1', type: 'sponsor', labelJa: 'スポンサー', labelEn: 'Sponsored', businessId: businesses[0].id, spotId: businesses[0].spotId, active: true, isSponsored: true },
    ],
    aiPriority: { ...DEFAULT_AI_PRIORITY },
    users: [
      { id: 'u-1', name: 'Demo User', email: 'demo@example.com', role: 'consumer', status: 'active', createdAt: Date.now() },
    ],
    inquiries: [],
    reports: [],
  };
}

function rowToBusiness(r) {
  return {
    id: r.id,
    ownerId: r.owner_id,
    spotId: r.spot_id,
    name: r.name,
    nameEn: r.name_en,
    description: r.description,
    descriptionEn: r.description_en,
    photos: r.photos ?? [],
    videos: r.videos ?? [],
    menu: r.menu ?? [],
    priceRange: r.price_range,
    hours: r.hours ?? {},
    address: r.address,
    area: r.area,
    phone: r.phone,
    instagram: r.instagram,
    website: r.website,
    status: r.status,
    featured: r.featured,
    sponsored: r.sponsored,
    stripeCustomerId: r.stripe_customer_id,
    stripeSubscriptionId: r.stripe_subscription_id,
    subscriptionStatus: r.subscription_status,
    lat: r.lat,
    lng: r.lng,
    category: r.category,
    updatedAt: Number(r.updated_at),
  };
}

export async function loadStore() {
  const [businesses, businessEvents, coupons, reviews, platformEvents, featuredCollections, ads, aiPriority, users, inquiries, reports] =
    await Promise.all([
      query('SELECT * FROM businesses'),
      query('SELECT * FROM business_events'),
      query('SELECT * FROM coupons'),
      query('SELECT * FROM reviews'),
      query('SELECT * FROM platform_events'),
      query('SELECT * FROM featured_collections'),
      query('SELECT * FROM ads'),
      query('SELECT * FROM ai_priority WHERE id = 1'),
      query('SELECT * FROM platform_users'),
      query('SELECT * FROM inquiries'),
      query('SELECT * FROM reports'),
    ]);

  return {
    businesses: businesses.rows.map(rowToBusiness),
    businessEvents: businessEvents.rows.map((r) => ({
      id: r.id, businessId: r.business_id, type: r.type, titleJa: r.title_ja, titleEn: r.title_en,
      descriptionJa: r.description_ja, descriptionEn: r.description_en, startDate: r.start_date, endDate: r.end_date, active: r.active,
    })),
    coupons: coupons.rows.map((r) => ({
      id: r.id, businessId: r.business_id, type: r.type, labelJa: r.label_ja, labelEn: r.label_en,
      discountPercent: r.discount_percent, freeItem: r.free_item, startDate: r.start_date, endDate: r.end_date, active: r.active,
    })),
    reviews: reviews.rows.map((r) => ({
      id: r.id, businessId: r.business_id, author: r.author, rating: r.rating, text: r.text, reply: r.reply, createdAt: Number(r.created_at),
    })),
    platformEvents: platformEvents.rows.map((r) => ({
      id: r.id, type: r.type, titleJa: r.title_ja, titleEn: r.title_en, area: r.area,
      startDate: r.start_date, endDate: r.end_date, showOnToday: r.show_on_today, showOnVibes: r.show_on_vibes,
      active: r.active, descriptionJa: r.description_ja, descriptionEn: r.description_en,
    })),
    featuredCollections: featuredCollections.rows.map((r) => ({
      id: r.id, slug: r.slug, titleJa: r.title_ja, titleEn: r.title_en, descriptionJa: r.description_ja,
      descriptionEn: r.description_en, spotIds: r.spot_ids ?? [], season: r.season, active: r.active,
    })),
    ads: ads.rows.map((r) => ({
      id: r.id, type: r.type, labelJa: r.label_ja, labelEn: r.label_en, spotId: r.spot_id,
      businessId: r.business_id, area: r.area, active: r.active, isSponsored: r.is_sponsored,
    })),
    aiPriority: aiPriority.rows[0] ? {
      eventBoost: aiPriority.rows[0].event_boost,
      sponsorBoost: aiPriority.rows[0].sponsor_boost,
      localBoost: aiPriority.rows[0].local_boost,
      newStoreBoost: aiPriority.rows[0].new_store_boost,
      trendingBoost: aiPriority.rows[0].trending_boost,
    } : { ...DEFAULT_AI_PRIORITY },
    users: users.rows.map((r) => ({
      id: r.id, name: r.name, email: r.email, role: r.role, status: r.status, createdAt: Number(r.created_at),
    })),
    inquiries: inquiries.rows.map((r) => ({
      id: r.id, email: r.email, subject: r.subject, body: r.body, status: r.status, createdAt: Number(r.created_at),
    })),
    reports: reports.rows.map((r) => ({
      id: r.id, userId: r.user_id, reason: r.reason, status: r.status, createdAt: Number(r.created_at),
    })),
  };
}

export async function saveStore(store) {
  await query('DELETE FROM business_events');
  await query('DELETE FROM coupons');
  await query('DELETE FROM reviews');
  await query('DELETE FROM ads');
  await query('DELETE FROM businesses');

  for (const b of store.businesses) {
    await query(
      `INSERT INTO businesses (id, owner_id, spot_id, name, name_en, description, description_en, photos, videos, menu, price_range, hours, address, area, phone, instagram, website, status, featured, sponsored, stripe_customer_id, stripe_subscription_id, subscription_status, lat, lng, category, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)`,
      [b.id, b.ownerId, b.spotId, b.name, b.nameEn, b.description, b.descriptionEn, JSON.stringify(b.photos ?? []), JSON.stringify(b.videos ?? []), JSON.stringify(b.menu ?? []), b.priceRange, JSON.stringify(b.hours ?? {}), b.address, b.area, b.phone, b.instagram, b.website, b.status, b.featured, b.sponsored, b.stripeCustomerId ?? null, b.stripeSubscriptionId ?? null, b.subscriptionStatus ?? null, b.lat, b.lng, b.category, b.updatedAt ?? Date.now()],
    );
  }
  for (const e of store.businessEvents) {
    await query(`INSERT INTO business_events VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [e.id, e.businessId, e.type, e.titleJa, e.titleEn, e.descriptionJa, e.descriptionEn, e.startDate, e.endDate, e.active]);
  }
  for (const c of store.coupons) {
    await query(`INSERT INTO coupons VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [c.id, c.businessId, c.type, c.labelJa, c.labelEn, c.discountPercent ?? null, c.freeItem ?? null, c.startDate, c.endDate, c.active]);
  }
  for (const r of store.reviews) {
    await query(`INSERT INTO reviews VALUES ($1,$2,$3,$4,$5,$6,$7)`, [r.id, r.businessId, r.author, r.rating, r.text, r.reply, r.createdAt]);
  }
  for (const e of store.platformEvents) {
    await query(`INSERT INTO platform_events (id, type, title_ja, title_en, area, start_date, end_date, show_on_today, show_on_vibes, active, description_ja, description_en) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (id) DO UPDATE SET type=$2, title_ja=$3, title_en=$4, area=$5, start_date=$6, end_date=$7, show_on_today=$8, show_on_vibes=$9, active=$10, description_ja=$11, description_en=$12`, [e.id, e.type, e.titleJa, e.titleEn, e.area, e.startDate, e.endDate, e.showOnToday !== false, e.showOnVibes !== false, e.active !== false, e.descriptionJa ?? '', e.descriptionEn ?? '']);
  }
  for (const f of store.featuredCollections) {
    await query(`INSERT INTO featured_collections (id, slug, title_ja, title_en, description_ja, description_en, spot_ids, season, active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO UPDATE SET slug=$2, title_ja=$3, title_en=$4, description_ja=$5, description_en=$6, spot_ids=$7, season=$8, active=$9`, [f.id, f.slug, f.titleJa, f.titleEn, f.descriptionJa, f.descriptionEn, JSON.stringify(f.spotIds ?? []), f.season, f.active !== false]);
  }
  for (const a of store.ads) {
    await query(`INSERT INTO ads VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [a.id, a.type, a.labelJa, a.labelEn, a.spotId ?? null, a.businessId ?? null, a.area ?? null, a.active, a.isSponsored !== false]);
  }
  const p = store.aiPriority ?? DEFAULT_AI_PRIORITY;
  await query(`UPDATE ai_priority SET event_boost=$1, sponsor_boost=$2, local_boost=$3, new_store_boost=$4, trending_boost=$5 WHERE id=1`, [p.eventBoost, p.sponsorBoost, p.localBoost, p.newStoreBoost, p.trendingBoost]);
}

export async function seedDatabase() {
  const store = defaultPlatformStore();
  await saveStore(store);
  for (const u of store.users) {
    await query(`INSERT INTO platform_users VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`, [u.id, u.name, u.email, u.role, u.status, u.createdAt]);
  }
  return store;
}

export async function migrate() {
  if (!isDbEnabled()) {
    console.log('[db] DATABASE_URL not set — using in-memory store');
    return false;
  }
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(schema);
  const { rows } = await query('SELECT COUNT(*)::int AS c FROM businesses');
  if (rows[0].c === 0) {
    console.log('[db] Seeding platform data...');
    await seedDatabase();
  }
  console.log('[db] PostgreSQL ready');
  return true;
}

export async function getUserSnapshot(userId) {
  const { rows } = await query('SELECT snapshot FROM user_snapshots WHERE user_id = $1', [userId]);
  return rows[0]?.snapshot ?? null;
}

export async function saveUserSnapshot(userId, snapshot) {
  await query(
    `INSERT INTO user_snapshots (user_id, snapshot, updated_at) VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET snapshot = $2, updated_at = $3`,
    [userId, JSON.stringify(snapshot), Date.now()],
  );
}
