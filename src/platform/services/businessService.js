import { isApiData } from '@/config/dataSource';
import { getApi, postApi, putApi } from '@/services/apiClient';
import { isSupabaseEnabled } from '@/lib/supabaseClient';
import { signInWithGoogle, signInWithEmail } from '@/lib/portalAuth';
import {
  getPlatformStore,
  savePlatformStore,
  getBusinessAnalytics,
  generateAiBusinessAdvice,
} from '@/platform/mock/platformStore';

const OWNER_SESSION_KEY = 'tokyo-owner-session';

export function getOwnerSession() {
  try {
    const raw = localStorage.getItem(OWNER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setOwnerSession(session) {
  if (session) localStorage.setItem(OWNER_SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(OWNER_SESSION_KEY);
}

export async function ownerLogin({ provider, email, password }) {
  if (isSupabaseEnabled && provider === 'google') {
    await signInWithGoogle(`${window.location.origin}/owner`);
    return null;
  }
  if (isSupabaseEnabled && provider === 'email' && email) {
    const user = await signInWithEmail(email, password ?? '');
    const store = getPlatformStore();
    const business = store.businesses.find((b) => b.ownerId === user.id) ?? store.businesses.find((b) => b.ownerId === 'owner-demo') ?? store.businesses[0];
    const session = { user, businessId: business.id };
    setOwnerSession(session);
    return session;
  }
  if (isApiData) {
    const session = await postApi('/api/business/auth/login', { provider, email, password });
    setOwnerSession(session);
    return session;
  }
  const user = {
    id: provider === 'google' ? 'owner-google' : 'owner-demo',
    email: email ?? 'owner@shop.example.com',
    name: provider === 'google' ? 'Google Owner' : 'Shop Owner',
    provider,
  };
  const store = getPlatformStore();
  const business = store.businesses.find((b) => b.ownerId === 'owner-demo') ?? store.businesses[0];
  const session = { user, businessId: business.id };
  setOwnerSession(session);
  return session;
}

export function ownerLogout() {
  setOwnerSession(null);
}

export async function fetchOwnerBusiness(businessId) {
  if (isApiData) return getApi(`/api/business/profile/${businessId}`);
  const store = getPlatformStore();
  return store.businesses.find((b) => b.id === businessId) ?? null;
}

export async function updateOwnerBusiness(businessId, patch) {
  if (isApiData) return putApi(`/api/business/profile/${businessId}`, patch);
  const store = getPlatformStore();
  const idx = store.businesses.findIndex((b) => b.id === businessId);
  if (idx < 0) throw new Error('Business not found');
  store.businesses[idx] = { ...store.businesses[idx], ...patch, updatedAt: Date.now() };
  savePlatformStore(store);
  return store.businesses[idx];
}

export async function fetchBusinessEvents(businessId) {
  if (isApiData) return getApi(`/api/business/${businessId}/events`);
  const store = getPlatformStore();
  return store.businessEvents.filter((e) => e.businessId === businessId);
}

export async function saveBusinessEvent(businessId, event) {
  if (isApiData) return postApi(`/api/business/${businessId}/events`, event);
  const store = getPlatformStore();
  const item = { ...event, id: event.id ?? `be-${Date.now()}`, businessId };
  const idx = store.businessEvents.findIndex((e) => e.id === item.id);
  if (idx >= 0) store.businessEvents[idx] = item;
  else store.businessEvents.push(item);
  savePlatformStore(store);
  return item;
}

export async function fetchBusinessCoupons(businessId) {
  if (isApiData) return getApi(`/api/business/${businessId}/coupons`);
  const store = getPlatformStore();
  return store.coupons.filter((c) => c.businessId === businessId);
}

export async function saveBusinessCoupon(businessId, coupon) {
  if (isApiData) return postApi(`/api/business/${businessId}/coupons`, coupon);
  const store = getPlatformStore();
  const item = { ...coupon, id: coupon.id ?? `cp-${Date.now()}`, businessId };
  const idx = store.coupons.findIndex((c) => c.id === item.id);
  if (idx >= 0) store.coupons[idx] = item;
  else store.coupons.push(item);
  savePlatformStore(store);
  return item;
}

export async function fetchBusinessReviews(businessId) {
  if (isApiData) return getApi(`/api/business/${businessId}/reviews`);
  const store = getPlatformStore();
  return store.reviews.filter((r) => r.businessId === businessId);
}

export async function replyToReview(reviewId, reply) {
  if (isApiData) return putApi(`/api/business/reviews/${reviewId}`, { reply });
  const store = getPlatformStore();
  const review = store.reviews.find((r) => r.id === reviewId);
  if (review) review.reply = reply;
  savePlatformStore(store);
  return review;
}

export async function fetchBusinessAnalytics(businessId, locale) {
  if (isApiData) return getApi(`/api/business/${businessId}/analytics`);
  const store = getPlatformStore();
  const business = store.businesses.find((b) => b.id === businessId);
  const analytics = getBusinessAnalytics(businessId);
  const advice = generateAiBusinessAdvice(analytics, business, locale);
  return { analytics, advice };
}

export function getActiveAds() {
  const store = getPlatformStore();
  return store.ads.filter((a) => a.active);
}

export function getAiPriorityConfig() {
  return getPlatformStore().aiPriority;
}

export function isSponsoredSpot(spotId) {
  const store = getPlatformStore();
  return store.ads.some((a) => a.active && a.isSponsored && a.spotId === spotId);
}
