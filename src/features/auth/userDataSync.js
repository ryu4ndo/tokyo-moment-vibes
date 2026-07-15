import { PROFILE_STORAGE_KEY } from '@/features/aiProfile/types';

const USER_DATA_PREFIX = 'tokyo-moment-user-data-';

const APP_KEYS = {
  savedSpotIds: 'tokyo-ai-vibes-saved-spots',
  recentlyViewedIds: 'tokyo-moment-vibes-recent',
  experienceMode: 'tokyo-moment-vibes-experience',
  companion: 'tokyo-moment-vibes-companion',
  location: 'tokyo-moment-vibes-location',
  savedPlans: 'tokyo-moment-vibes-plans',
  searchHistory: 'tokyo-moment-vibes-search',
  savedFolders: 'tokyo-moment-vibes-folders',
};

export function buildUserSnapshot({
  savedSpotIds = [],
  recentlyViewedIds = [],
  experienceMode = 'local',
  companion = 'solo',
  location = '渋谷',
  savedPlans = [],
  searchHistory = [],
  savedFolders = [],
  aiProfileData = null,
  userProfile = {},
  locale = 'ja',
}) {
  return {
    version: 1,
    savedAt: Date.now(),
    savedSpotIds,
    recentlyViewedIds,
    experienceMode,
    companion,
    location,
    savedPlans,
    searchHistory,
    savedFolders,
    aiProfile: aiProfileData,
    userProfile,
    locale,
  };
}

export function saveUserSnapshot(userId, snapshot) {
  if (!userId) return;
  try {
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
}

export function loadUserSnapshot(userId) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Write snapshot into global localStorage keys used by app contexts */
export function applyUserSnapshot(snapshot) {
  if (!snapshot) return;

  const write = (key, value) => {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else if (typeof value === 'string') localStorage.setItem(key, value);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  };

  if (snapshot.savedSpotIds) write(APP_KEYS.savedSpotIds, snapshot.savedSpotIds);
  if (snapshot.recentlyViewedIds) write(APP_KEYS.recentlyViewedIds, snapshot.recentlyViewedIds);
  if (snapshot.experienceMode) write(APP_KEYS.experienceMode, snapshot.experienceMode);
  if (snapshot.companion) write(APP_KEYS.companion, snapshot.companion);
  if (snapshot.location) write(APP_KEYS.location, snapshot.location);
  if (snapshot.savedPlans) write(APP_KEYS.savedPlans, snapshot.savedPlans);
  if (snapshot.searchHistory) write(APP_KEYS.searchHistory, snapshot.searchHistory);
  if (snapshot.savedFolders) write(APP_KEYS.savedFolders, snapshot.savedFolders);
  if (snapshot.aiProfile) write(PROFILE_STORAGE_KEY, snapshot.aiProfile);
}

export function collectCurrentSnapshot(userProfile, locale) {
  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      if (raw.startsWith('[') || raw.startsWith('{')) return JSON.parse(raw);
      return raw;
    } catch {
      return fallback;
    }
  };

  let aiProfile = null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    aiProfile = raw ? JSON.parse(raw) : null;
  } catch {
    /* ignore */
  }

  return buildUserSnapshot({
    savedSpotIds: read(APP_KEYS.savedSpotIds, []),
    recentlyViewedIds: read(APP_KEYS.recentlyViewedIds, []),
    experienceMode: read(APP_KEYS.experienceMode, 'local'),
    companion: read(APP_KEYS.companion, 'solo'),
    location: read(APP_KEYS.location, '渋谷'),
    savedPlans: read(APP_KEYS.savedPlans, []),
    searchHistory: read(APP_KEYS.searchHistory, []),
    savedFolders: read(APP_KEYS.savedFolders, []),
    aiProfileData: aiProfile,
    userProfile,
    locale,
  });
}

export { APP_KEYS };
