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

function loadContinueMoment() {
  try {
    return localStorage.getItem(CONTINUE_KEY) || null;
  } catch {
    return null;
  }
}

function getWeatherSnapshot() {
  const hour = new Date().getHours();
  if (hour >= 18 && hour % 3 === 0) return 'rain';
  if (hour >= 12) return 'cloudy';
  return 'clear';
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
  const [weather] = useState(getWeatherSnapshot);
  const [savedSpotIds, setSavedSpotIds] = useState(loadSavedSpots);
  const [travelerExperience, setTravelerExperienceState] = useState(loadTravelerExperience);
  const [travelerMood, setTravelerMood] = useState(null);
  const [localPriority, setLocalPriorityState] = useState(loadLocalPriority);
  const [selectedMomentId, setSelectedMomentIdState] = useState(loadMoment);
  const [surpriseResolvedId, setSurpriseResolvedId] = useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(loadRecentlyViewed);
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
      weather,
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
      weather,
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
