import { isApiData } from '@/config/dataSource';
import { getApi, postApi, putApi, deleteApi } from '@/services/apiClient';
import { isSupabaseEnabled } from '@/lib/supabaseClient';
import { signInWithEmail } from '@/lib/portalAuth';
import { getPlatformStore, savePlatformStore } from '@/platform/mock/platformStore';
import { ENRICHED_VIBES } from '@/data/vibes';

const ADMIN_SESSION_KEY = 'tokyo-admin-session';
const ADMIN_DEMO = { id: 'admin-demo', email: 'admin@tokyomomentvibes.app', name: 'Platform Admin' };

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(session) {
  if (session) localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(ADMIN_SESSION_KEY);
}

export async function adminLogin({ email, password }) {
  if (isSupabaseEnabled && email) {
    const user = await signInWithEmail(email, password ?? 'demo');
    const session = { user: { ...user, role: user.role === 'admin' ? 'admin' : user.role } };
    setAdminSession(session);
    return session;
  }
  if (isApiData) {
    const session = await postApi('/api/admin/auth/login', { email, password });
    setAdminSession(session);
    return session;
  }
  const session = { user: { ...ADMIN_DEMO, email: email ?? ADMIN_DEMO.email } };
  setAdminSession(session);
  return session;
}

export function adminLogout() {
  setAdminSession(null);
}

export async function fetchAdminMetrics() {
  if (isApiData) return getApi('/api/admin/metrics');
  return getPlatformStore().adminMetrics;
}

export async function fetchAdminBusinesses() {
  if (isApiData) return getApi('/api/admin/businesses');
  return getPlatformStore().businesses;
}

export async function updateBusinessStatus(businessId, status) {
  if (isApiData) return putApi(`/api/admin/businesses/${businessId}`, { status });
  const store = getPlatformStore();
  const b = store.businesses.find((x) => x.id === businessId);
  if (b) b.status = status;
  savePlatformStore(store);
  return b;
}

export async function updateBusinessFlags(businessId, flags) {
  if (isApiData) return putApi(`/api/admin/businesses/${businessId}`, flags);
  const store = getPlatformStore();
  const b = store.businesses.find((x) => x.id === businessId);
  if (b) Object.assign(b, flags);
  savePlatformStore(store);
  return b;
}

export async function fetchPlatformEvents() {
  if (isApiData) return getApi('/api/admin/events');
  return getPlatformStore().platformEvents;
}

export async function savePlatformEvent(event) {
  if (isApiData) return postApi('/api/admin/events', event);
  const store = getPlatformStore();
  const item = { ...event, id: event.id ?? `pe-${Date.now()}` };
  const idx = store.platformEvents.findIndex((e) => e.id === item.id);
  if (idx >= 0) store.platformEvents[idx] = item;
  else store.platformEvents.push(item);
  savePlatformStore(store);
  return item;
}

export async function deletePlatformEvent(id) {
  if (isApiData) return deleteApi(`/api/admin/events/${id}`);
  const store = getPlatformStore();
  store.platformEvents = store.platformEvents.filter((e) => e.id !== id);
  savePlatformStore(store);
}

export async function fetchFeaturedCollections() {
  if (isApiData) return getApi('/api/admin/features');
  return getPlatformStore().featuredCollections;
}

export async function saveFeaturedCollection(collection) {
  if (isApiData) return postApi('/api/admin/features', collection);
  const store = getPlatformStore();
  const item = { ...collection, id: collection.id ?? `feat-${Date.now()}` };
  const idx = store.featuredCollections.findIndex((f) => f.id === item.id);
  if (idx >= 0) store.featuredCollections[idx] = item;
  else store.featuredCollections.push(item);
  savePlatformStore(store);
  return item;
}

export async function fetchAdminUsers() {
  if (isApiData) return getApi('/api/admin/users');
  return getPlatformStore().users;
}

export async function updateUserStatus(userId, status) {
  if (isApiData) return putApi(`/api/admin/users/${userId}`, { status });
  const store = getPlatformStore();
  const u = store.users.find((x) => x.id === userId);
  if (u) u.status = status;
  savePlatformStore(store);
  return u;
}

export async function fetchReports() {
  if (isApiData) return getApi('/api/admin/reports');
  return getPlatformStore().reports;
}

export async function fetchInquiries() {
  if (isApiData) return getApi('/api/admin/inquiries');
  return getPlatformStore().inquiries;
}

export async function fetchAiPriority() {
  if (isApiData) return getApi('/api/admin/ai-priority');
  return getPlatformStore().aiPriority;
}

export async function saveAiPriority(config) {
  if (isApiData) return putApi('/api/admin/ai-priority', config);
  const store = getPlatformStore();
  store.aiPriority = { ...store.aiPriority, ...config };
  savePlatformStore(store);
  return store.aiPriority;
}

export async function fetchAds() {
  if (isApiData) return getApi('/api/admin/ads');
  return getPlatformStore().ads;
}

export async function saveAd(ad) {
  if (isApiData) return postApi('/api/admin/ads', ad);
  const store = getPlatformStore();
  const item = { ...ad, id: ad.id ?? `ad-${Date.now()}`, isSponsored: true };
  const idx = store.ads.findIndex((a) => a.id === item.id);
  if (idx >= 0) store.ads[idx] = item;
  else store.ads.push(item);
  savePlatformStore(store);
  return item;
}

export async function fetchAdminSpots() {
  if (isApiData) return getApi('/api/admin/spots');
  const store = getPlatformStore();
  return ENRICHED_VIBES.map((v) => {
    const biz = store.businesses.find((b) => b.spotId === v.spotId);
    return {
      spotId: v.spotId,
      name: v.shopName,
      area: v.area,
      category: v.category,
      rating: v.rating,
      featured: Boolean(biz?.featured ?? v.aiPick),
      trending: Boolean(v.isPopular),
      sponsored: Boolean(biz?.sponsored),
    };
  });
}

export async function updateAdminSpot(spotId, patch) {
  if (isApiData) return putApi(`/api/admin/spots/${spotId}`, patch);
  const store = getPlatformStore();
  let biz = store.businesses.find((b) => b.spotId === spotId);
  if (!biz) {
    const vibe = ENRICHED_VIBES.find((v) => v.spotId === spotId);
    if (!vibe) return null;
    biz = { id: `biz-${spotId}`, spotId, name: vibe.shopName, ownerId: 'admin', status: 'verified', featured: false, sponsored: false };
    store.businesses.push(biz);
  }
  if (patch.featured != null) biz.featured = patch.featured;
  if (patch.sponsored != null) biz.sponsored = patch.sponsored;
  if (patch.trending != null) {
    const vibe = ENRICHED_VIBES.find((v) => v.spotId === spotId);
    if (vibe) vibe.isPopular = patch.trending;
  }
  savePlatformStore(store);
  return biz;
}
