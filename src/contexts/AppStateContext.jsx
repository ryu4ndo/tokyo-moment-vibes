import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COMPANION } from '@/data/companions';
import { DEFAULT_MOOD } from '@/data/moods';
import { DEFAULT_MOMENT_ID } from '@/data/moments';
import { findNearestArea } from '@/data/areas';
import { pickSurpriseMoment, resolveMoment } from '@/data/moments';
import { experienceToLocalLevel, localLevelToExperience } from '@/data/vibeKeywords';
import { useLocale } from '@/locales/LocaleContext';

const AppStateContext = createContext(null);

const EXPERIENCE_KEY = 'tokyo-moment-vibes-experience';
const COMPANION_KEY = 'tokyo-moment-vibes-companion';
const LOCATION_KEY = 'tokyo-moment-vibes-location';
const SAVED_SPOTS_KEY = 'tokyo-ai-vibes-saved-spots';
const TRAVELER_EXP_KEY = 'tokyo-moment-vibes-traveler-exp';
const LOCAL_PRIORITY_KEY = 'tokyo-moment-vibes-local-priority';
const MOMENT_KEY = 'tokyo-moment-vibes-moment';
const RECENTLY_VIEWED_KEY = 'tokyo-moment-vibes-recent';
const CONTINUE_KEY = 'tokyo-moment-vibes-continue';
const PLANS_HISTORY_KEY = 'tokyo-moment-vibes-plans';
const SEARCH_HISTORY_KEY = 'tokyo-moment-vibes-search';
const FOLDERS_KEY = 'tokyo-moment-vibes-folders';

function loadExperience() {
  try {
    const saved = localStorage.getItem(EXPERIENCE_KEY);
    if (saved === 'local' || saved === 'traveler') return saved;
  } catch {
    /* ignore */
  }
  return 'local';
}

function loadCompanion() {
  try {
    const saved = localStorage.getItem(COMPANION_KEY);
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_COMPANION;
}

function loadLocation() {
  try {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  return '渋谷';
}

function loadSavedSpots() {
  try {
    const raw = localStorage.getItem(SAVED_SPOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadTravelerExperience() {
  try {
    return localStorage.getItem(TRAVELER_EXP_KEY) || null;
  } catch {
    return null;
  }
}

function loadLocalPriority() {
  try {
    return localStorage.getItem(LOCAL_PRIORITY_KEY) || null;
  } catch {
    return null;
  }
}

function loadMoment() {
  try {
    return localStorage.getItem(MOMENT_KEY) || DEFAULT_MOMENT_ID;
  } catch {
    return DEFAULT_MOMENT_ID;
  }
}

function loadRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadSavedPlans() {
  try {
    const raw = localStorage.getItem(PLANS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadSearchHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadFolders() {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadContinueMoment() {
  try {
    return localStorage.getItem(CONTINUE_KEY) || null;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }) {
  const { locale } = useLocale();

  const [experienceMode, setExperienceModeState] = useState(loadExperience);
  const [companion, setCompanionState] = useState(loadCompanion);
  const [localLevel, setLocalLevel] = useState(() => experienceToLocalLevel(loadExperience()));
  const [mood, setMood] = useState(DEFAULT_MOOD);
  const [location, setLocationState] = useState(loadLocation);
  const [freeTime, setFreeTime] = useState('2時間');
  const [nextPlan, setNextPlan] = useState('ホテルへ');
  const [savedSpotIds, setSavedSpotIds] = useState(loadSavedSpots);
  const [travelerExperience, setTravelerExperienceState] = useState(loadTravelerExperience);
  const [travelerMood, setTravelerMood] = useState(null);
  const [localPriority, setLocalPriorityState] = useState(loadLocalPriority);
  const [selectedMomentId, setSelectedMomentIdState] = useState(loadMoment);
  const [surpriseResolvedId, setSurpriseResolvedId] = useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(loadRecentlyViewed);
  const [savedPlans, setSavedPlans] = useState(loadSavedPlans);
  const [searchHistory, setSearchHistory] = useState(loadSearchHistory);
  const [savedFolders, setSavedFolders] = useState(loadFolders);
  const [continueMomentId, setContinueMomentId] = useState(loadContinueMoment);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const setLocation = useCallback((next) => {
    setLocationState(next);
    setLocationError(null);
    try {
      localStorage.setItem(LOCATION_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('unsupported');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const area = findNearestArea(pos.coords.latitude, pos.coords.longitude);
        setLocation(area);
        setIsLocating(false);
      },
      () => {
        setLocationError('denied');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [setLocation]);

  useEffect(() => {
    localStorage.setItem(SAVED_SPOTS_KEY, JSON.stringify(savedSpotIds));
  }, [savedSpotIds]);

  useEffect(() => {
    localStorage.setItem(PLANS_HISTORY_KEY, JSON.stringify(savedPlans));
  }, [savedPlans]);

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(savedFolders));
  }, [savedFolders]);

  const setExperienceMode = useCallback((mode) => {
    setExperienceModeState(mode);
    setLocalLevel(experienceToLocalLevel(mode));
    try {
      localStorage.setItem(EXPERIENCE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, []);

  const setCompanion = useCallback((next) => {
    setCompanionState(next);
    try {
      localStorage.setItem(COMPANION_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocalLevelDirect = useCallback((level) => {
    setLocalLevel(level);
    const mode = localLevelToExperience(level);
    setExperienceModeState(mode);
    try {
      localStorage.setItem(EXPERIENCE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, []);

  const setTravelerExperience = useCallback((next) => {
    setTravelerExperienceState(next);
    try {
      if (next) localStorage.setItem(TRAVELER_EXP_KEY, next);
      else localStorage.removeItem(TRAVELER_EXP_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocalPriority = useCallback((next) => {
    setLocalPriorityState(next);
    try {
      if (next) localStorage.setItem(LOCAL_PRIORITY_KEY, next);
      else localStorage.removeItem(LOCAL_PRIORITY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setSelectedMoment = useCallback((momentId) => {
    setSelectedMomentIdState(momentId);
    const moment = resolveMoment(momentId);
    if (momentId === 'surprise') {
      const picked = pickSurpriseMoment();
      setSurpriseResolvedId(picked.id);
      setMood(picked.moodKey);
      setContinueMomentId(picked.id);
      try {
        localStorage.setItem(MOMENT_KEY, momentId);
        localStorage.setItem(CONTINUE_KEY, picked.id);
      } catch {
        /* ignore */
      }
      return;
    }
    setSurpriseResolvedId(null);
    if (moment.moodKey) setMood(moment.moodKey);
    setContinueMomentId(momentId);
    try {
      localStorage.setItem(MOMENT_KEY, momentId);
      localStorage.setItem(CONTINUE_KEY, momentId);
    } catch {
      /* ignore */
    }
  }, []);

  const addRecentlyViewed = useCallback((vibeId) => {
    if (!vibeId) return;
    setRecentlyViewedIds((prev) => {
      const next = [vibeId, ...prev.filter((id) => id !== vibeId)].slice(0, 8);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const addSavedPlan = useCallback((plan) => {
    if (!plan?.id) return;
    setSavedPlans((prev) => {
      const next = [{ ...plan, savedAt: Date.now() }, ...prev.filter((p) => p.id !== plan.id)].slice(0, 20);
      return next;
    });
  }, []);

  const removeSavedPlan = useCallback((planId) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
  }, []);

  const createFolder = useCallback((name) => {
    const trimmed = name?.trim();
    if (!trimmed) return null;
    const folder = { id: `folder-${Date.now()}`, name: trimmed, spotIds: [] };
    setSavedFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const deleteFolder = useCallback((folderId) => {
    setSavedFolders((prev) => prev.filter((f) => f.id !== folderId));
  }, []);

  const addSpotToFolder = useCallback((folderId, spotId) => {
    setSavedFolders((prev) =>
      prev.map((f) =>
        f.id === folderId && !f.spotIds.includes(spotId)
          ? { ...f, spotIds: [...f.spotIds, spotId] }
          : f,
      ),
    );
  }, []);

  const removeSpotFromFolder = useCallback((folderId, spotId) => {
    setSavedFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, spotIds: f.spotIds.filter((id) => id !== spotId) } : f,
      ),
    );
  }, []);

  const recordSearch = useCallback((query) => {
    const trimmed = query?.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, 12);
      return next;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeSearchHistoryItem = useCallback((query) => {
    setSearchHistory((prev) => prev.filter((q) => q !== query));
  }, []);

  const reloadFromStorage = useCallback(() => {
    setExperienceModeState(loadExperience());
    setLocalLevel(experienceToLocalLevel(loadExperience()));
    setCompanionState(loadCompanion());
    setLocationState(loadLocation());
    setSavedSpotIds(loadSavedSpots());
    setRecentlyViewedIds(loadRecentlyViewed());
    setSavedPlans(loadSavedPlans());
    setSearchHistory(loadSearchHistory());
    setSavedFolders(loadFolders());
  }, []);

  const toggleSaveSpot = useCallback((spotId) => {
    setSavedSpotIds((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  }, []);

  const planInput = useMemo(
    () => ({
      location,
      freeTime,
      nextPlan,
      localLevel,
      mood,
      experienceMode,
      companion,
      locale,
      travelerExperience,
      travelerMood,
      localPriority,
      selectedMomentId,
    }),
    [
      location,
      freeTime,
      nextPlan,
      localLevel,
      mood,
      experienceMode,
      companion,
      locale,
      travelerExperience,
      travelerMood,
      localPriority,
      selectedMomentId,
    ]
  );

  const value = useMemo(
    () => ({
      experienceMode,
      setExperienceMode,
      companion,
      setCompanion,
      localLevel,
      setLocalLevel: setLocalLevelDirect,
      mood,
      setMood,
      location,
      setLocation,
      freeTime,
      setFreeTime,
      nextPlan,
      setNextPlan,
      savedSpotIds,
      toggleSaveSpot,
      planInput,
      travelerExperience,
      setTravelerExperience,
      travelerMood,
      setTravelerMood,
      localPriority,
      setLocalPriority,
      selectedMomentId,
      setSelectedMoment,
      surpriseResolvedId,
      recentlyViewedIds,
      addRecentlyViewed,
      savedPlans,
      addSavedPlan,
      removeSavedPlan,
      savedFolders,
      createFolder,
      deleteFolder,
      addSpotToFolder,
      removeSpotFromFolder,
      searchHistory,
      recordSearch,
      clearSearchHistory,
      removeSearchHistoryItem,
      reloadFromStorage,
      continueMomentId,
      useCurrentLocation,
      isLocating,
      locationError,
    }),
    [
      experienceMode,
      setExperienceMode,
      companion,
      setCompanion,
      localLevel,
      setLocalLevelDirect,
      mood,
      location,
      setLocation,
      freeTime,
      nextPlan,
      savedSpotIds,
      toggleSaveSpot,
      planInput,
      travelerExperience,
      setTravelerExperience,
      travelerMood,
      localPriority,
      setLocalPriority,
      selectedMomentId,
      setSelectedMoment,
      surpriseResolvedId,
      recentlyViewedIds,
      addRecentlyViewed,
      savedPlans,
      addSavedPlan,
      removeSavedPlan,
      savedFolders,
      createFolder,
      deleteFolder,
      addSpotToFolder,
      removeSpotFromFolder,
      searchHistory,
      recordSearch,
      clearSearchHistory,
      removeSearchHistoryItem,
      reloadFromStorage,
      continueMomentId,
      useCurrentLocation,
      isLocating,
      locationError,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

/** @deprecated Use useAppState instead */
export function useAppPreferences() {
  const ctx = useAppState();
  return {
    experienceMode: ctx.experienceMode,
    setExperienceMode: ctx.setExperienceMode,
    companion: ctx.companion,
    setCompanion: ctx.setCompanion,
    localLevel: ctx.localLevel,
    setLocalLevel: ctx.setLocalLevel,
  };
}
