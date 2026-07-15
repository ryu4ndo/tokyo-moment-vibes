import { isDbEnabled } from '../db/pool.js';
import { loadStore, saveStore, migrate } from '../db/repository.js';
import { defaultPlatformStore } from '../db/repository.js';

/** Unified platform data access — PostgreSQL when DATABASE_URL is set, else in-memory. */

let cache = null;
let dbReady = false;

export async function initPlatformData() {
  if (isDbEnabled()) {
    dbReady = await migrate();
    if (dbReady) {
      cache = await loadStore();
      return cache;
    }
  }
  cache = defaultPlatformStore();
  cache.adminMetrics = {
    dau: 2840,
    mau: 18200,
    newUsers: 312,
    popularAreas: [{ area: '渋谷', count: 4200 }, { area: '新宿', count: 3800 }],
    popularCategories: [{ category: 'food', count: 5100 }, { category: 'cafe', count: 4200 }],
    popularSpots: cache.businesses.slice(0, 5).map((b, i) => ({ spotId: b.spotId, name: b.name, count: 900 - i * 120 })),
    searchRanking: [{ query: '夜景', count: 890 }],
    saveRanking: cache.businesses.slice(0, 5).map((b, i) => ({ spotId: b.spotId, name: b.name, count: 400 - i * 50 })),
    aiUsage: 12400,
    plansCreated: 3280,
  };
  return cache;
}

export function getStore() {
  if (!cache) cache = defaultPlatformStore();
  if (!cache.adminMetrics) {
    cache.adminMetrics = { dau: 2840, mau: 18200, newUsers: 312, popularAreas: [], popularCategories: [], popularSpots: [], searchRanking: [], saveRanking: [], aiUsage: 0, plansCreated: 0 };
  }
  return cache;
}

export async function persistStore(store) {
  cache = store;
  if (dbReady) await saveStore(store);
}

export function isUsingDatabase() {
  return dbReady;
}
