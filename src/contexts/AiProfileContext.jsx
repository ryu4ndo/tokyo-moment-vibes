import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { useLocale } from '@/locales/LocaleContext';
import { analyzeProfile, buildInsightCards } from '@/features/aiProfile/analyzeProfile';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { getAiSuggestion } from '@/features/aiProfile/generateSuggestion';
import { loadProfileData, saveProfileData } from '@/features/aiProfile/profileStorage';
import { recordSaveSignal, recordViewSignal } from '@/features/aiProfile/recordSignals';
import { DEFAULT_PROFILE_DATA } from '@/features/aiProfile/types';

const AiProfileContext = createContext(null);

export function AiProfileProvider({ children }) {
  const { locale } = useLocale();
  const { experienceMode, companion, location } = useAppState();
  const [profileData, setProfileData] = useState(loadProfileData);

  const recordView = useCallback(
    (vibe) => {
      if (!vibe?.id) return;
      setProfileData((prev) => {
        const next = recordViewSignal(prev, {
          vibeId: vibe.id,
          spotId: vibe.spotId,
          category: vibe.category,
          area: vibe.area,
          priceRange: vibe.priceRange,
          walkMinutes: vibe.walkMinutes,
          companion,
          experienceMode,
          suitableFor: vibe.suitableFor,
          experienceModes: vibe.experienceModes,
        });
        saveProfileData(next);
        return next;
      });
    },
    [companion, experienceMode],
  );

  const recordSave = useCallback((meta) => {
    if (!meta?.spotId) return;
    setProfileData((prev) => {
      const next = recordSaveSignal(prev, meta);
      saveProfileData(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const next = { ...DEFAULT_PROFILE_DATA, signals: { views: [], saves: [] } };
    setProfileData(next);
    saveProfileData(next);
  }, []);

  const addInterest = useCallback((interestId) => {
    setProfileData((prev) => {
      if (prev.manualInterests.includes(interestId)) return prev;
      const next = {
        ...prev,
        manualInterests: [...prev.manualInterests, interestId],
        hiddenInterests: prev.hiddenInterests.filter((id) => id !== interestId),
      };
      saveProfileData(next);
      return next;
    });
  }, []);

  const hideInterest = useCallback((interestId) => {
    setProfileData((prev) => {
      if (prev.hiddenInterests.includes(interestId)) return prev;
      const next = {
        ...prev,
        hiddenInterests: [...prev.hiddenInterests, interestId],
        manualInterests: prev.manualInterests.filter((id) => id !== interestId),
      };
      saveProfileData(next);
      return next;
    });
  }, []);

  const unhideInterest = useCallback((interestId) => {
    setProfileData((prev) => {
      const next = {
        ...prev,
        hiddenInterests: prev.hiddenInterests.filter((id) => id !== interestId),
      };
      saveProfileData(next);
      return next;
    });
  }, []);

  const profile = useMemo(
    () => analyzeProfile(profileData, { experienceMode, companion, locale }),
    [profileData, experienceMode, companion, locale],
  );

  const insights = useMemo(() => buildInsightCards(profile, locale), [profile, locale]);

  const getSuggestion = useCallback(
    (page) => getAiSuggestion(profile, page, { locale, location }),
    [profile, locale, location],
  );

  const boostScore = useCallback(
    (baseScore, item) => applyProfileBoost(baseScore, item, profile),
    [profile],
  );

  const reloadFromStorage = useCallback(() => {
    setProfileData(loadProfileData());
  }, []);

  const value = useMemo(
    () => ({
      profile,
      insights,
      profileData,
      getSuggestion,
      recordView,
      recordSave,
      resetProfile,
      addInterest,
      hideInterest,
      unhideInterest,
      boostScore,
      reloadFromStorage,
    }),
    [
      profile,
      insights,
      profileData,
      getSuggestion,
      recordView,
      recordSave,
      resetProfile,
      addInterest,
      hideInterest,
      unhideInterest,
      boostScore,
      reloadFromStorage,
    ],
  );

  return <AiProfileContext.Provider value={value}>{children}</AiProfileContext.Provider>;
}

export function useAiProfile() {
  const ctx = useContext(AiProfileContext);
  if (!ctx) throw new Error('useAiProfile must be used within AiProfileProvider');
  return ctx;
}
