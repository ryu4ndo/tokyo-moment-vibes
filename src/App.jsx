import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { PlanDetail } from '@/features/plan/PlanDetail';
import { HomePage } from '@/pages/HomePage';
import { FoodPage } from '@/pages/FoodPage';
import { VibesPage } from '@/pages/VibesPage';
import { SavedPage } from '@/pages/SavedPage';
import { PlanPage } from '@/pages/PlanPage';
import { AIChat, ConciergeFab } from '@/features/chat/AIChat';
import { VibeDetail } from '@/features/vibes/VibeDetail';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { LegalPage } from '@/pages/LegalPage';
import { AiProfilePage } from '@/pages/AiProfilePage';
import { NotificationInbox } from '@/features/notifications/NotificationInbox';
import { useAuth } from '@/contexts/AuthContext';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { PageTransition } from '@/components/ui/PageTransition';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AREA_COORDINATES, AREAS } from '@/data/spots';
import { useAppState } from '@/contexts/AppStateContext';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useConcierge } from '@/contexts/ConciergeContext';
import { conciergeToPlan } from '@/features/concierge/conciergeToPlan';
import { ENRICHED_VIBES } from '@/data/vibes';
import { useLocale } from '@/locales/LocaleContext';
import { AiSearchOverlay } from '@/features/search/AiSearchOverlay';

export default function App() {
  const { locale } = useLocale();
  const {
    location,
    setMood,
    setLocation,
    setFreeTime,
    setNextPlan,
    setLocalLevel,
    experienceMode,
    setExperienceMode,
    companion,
    setCompanion,
    freeTime,
    savedSpotIds,
    toggleSaveSpot,
    addRecentlyViewed,
    addSavedPlan,
    recordSearch,
    planInput,
  } = useAppState();

  const { isAuthenticated, userProfile, isAuthLoading, isHydrating } = useAuth();

  const { setCurrentPage, setDetailSpotId } = useConcierge();

  const [page, setPage] = useState('HOME');
  const [detailVibe, setDetailVibe] = useState(null);
  const [detailPlan, setDetailPlan] = useState(null);
  const [seedPlan, setSeedPlan] = useState(null);
  const [pendingFoodId, setPendingFoodId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchSeed, setSearchSeed] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiProfile, setShowAiProfile] = useState(false);
  const [legalType, setLegalType] = useState(null);

  const { recordView, recordSave } = useAiProfile();

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  useEffect(() => {
    setDetailSpotId(detailVibe?.spotId ?? null);
  }, [detailVibe, setDetailSpotId]);

  const {
    aiPlans,
    isGenerating,
    planSyncKey,
    regenerateFromChat,
  } = usePlanGeneration(planInput);

  const startPoint = AREA_COORDINATES[location] ?? AREA_COORDINATES['渋谷'];

  const handleSelectVibe = useCallback(
    (vibe) => {
      if (vibe?.id) addRecentlyViewed(vibe.id);
      recordView(vibe);
      setDetailVibe(vibe);
    },
    [addRecentlyViewed, recordView],
  );

  const handleToggleSave = useCallback(
    (spotId) => {
      const wasSaved = savedSpotIds.includes(spotId);
      toggleSaveSpot(spotId);
      if (!wasSaved) {
        const vibe = ENRICHED_VIBES.find((v) => v.spotId === spotId);
        const spot = vibe ?? { spotId, category: 'food', area: location };
        recordSave({
          spotId,
          category: spot.category,
          area: spot.area ?? location,
          priceRange: spot.priceRange,
          walkMinutes: spot.walkMinutes,
        });
      }
    },
    [savedSpotIds, toggleSaveSpot, recordSave, location],
  );

  const handleGoToFood = useCallback((foodId) => {
    if (foodId) setPendingFoodId(foodId);
    setPage('FOOD');
  }, []);

  const handleGoToPlan = (plan) => {
    if (plan) addSavedPlan(plan);
    setSeedPlan(plan);
    setDetailPlan(null);
    setPage('PLAN');
  };

  const handleChatRegeneratePlan = useCallback(
    async (updates) => {
      if (updates.location) setLocation(updates.location);
      if (updates.freeTime) setFreeTime(updates.freeTime);
      if (updates.mood) setMood(updates.mood);
      if (updates.nextPlan) setNextPlan(updates.nextPlan);
      if (updates.experienceMode) setExperienceMode(updates.experienceMode);
      if (updates.companion) setCompanion(updates.companion);

      setPage('PLAN');
      await regenerateFromChat(updates, planInput);
    },
    [planInput, regenerateFromChat, setLocation, setFreeTime, setMood, setNextPlan, setExperienceMode, setCompanion],
  );

  const handleCreatePlanFromRecs = useCallback(
    (recommendations) => {
      const plan = conciergeToPlan(recommendations, {
        locale,
        location,
        freeTime,
        companion,
        experienceMode,
      });
      if (plan) handleGoToPlan(plan);
    },
    [locale, location, freeTime, companion, experienceMode],
  );

  const handleChatNavigate = useCallback((tab) => {
    setPage(tab);
  }, []);

  if (isAuthLoading) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onOpenLegal={setLegalType} />
        <AnimatePresence>
          {legalType && <LegalPage type={legalType} onClose={() => setLegalType(null)} />}
        </AnimatePresence>
        {isHydrating && <LoadingOverlay />}
      </>
    );
  }

  if (!userProfile.onboardingCompleted) {
    return <OnboardingPage onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen text-white selection:bg-purple-500/30 font-sans">
      <AmbientBackground />

      <div className={`relative z-10 mx-auto ${page === 'VIBES' ? 'max-w-7xl' : 'max-w-2xl'}`}>
        <AppHeader
          onOpenProfile={() => setShowProfile(true)}
          onOpenSearch={() => {
            setSearchSeed('');
            setShowSearch(true);
          }}
          onOpenNotifications={() => setShowNotifications(true)}
        />

        <main className={page === 'VIBES' ? 'px-2 sm:px-3 pb-32' : 'p-5 pb-32'}>
          <PageTransition pageKey={page}>
            {page === 'HOME' && (
              <HomePage
                onSelectVibe={handleSelectVibe}
                onGoToVibes={() => setPage('VIBES')}
                onGoToFood={handleGoToFood}
              />
            )}
            {page === 'FOOD' && (
              <FoodPage
                initialFoodId={pendingFoodId}
                onInitialFoodConsumed={() => setPendingFoodId(null)}
              />
            )}
            {page === 'VIBES' && (
              <ErrorBoundary label="VIBES tab crashed">
                <VibesPage
                  onMoodChange={setMood}
                  onCreatePlan={(vibe) => {
                    setMood(vibe.mood);
                    if (AREAS.includes(vibe.area)) setLocation(vibe.area);
                    setPage('PLAN');
                  }}
                  onSelectVibe={handleSelectVibe}
                  onOpenSearch={() => {
                    setSearchSeed('');
                    setShowSearch(true);
                  }}
                />
              </ErrorBoundary>
            )}
            {page === 'SAVED' && (
              <SavedPage onSelectVibe={handleSelectVibe} onGoToPlan={handleGoToPlan} />
            )}
            {page === 'PLAN' && (
              <PlanPage
                onLocationChange={setLocation}
                onFreeTimeChange={setFreeTime}
                onNextPlanChange={setNextPlan}
                onLocalLevelChange={setLocalLevel}
                startPoint={startPoint}
                seedPlan={seedPlan}
                onSeedPlanConsumed={() => setSeedPlan(null)}
                syncedPlans={aiPlans}
                planSyncKey={planSyncKey}
              />
            )}
          </PageTransition>
        </main>
      </div>

      <BottomNav activeTab={page} onTabChange={setPage} />

      <ConciergeFab />
      <AIChat
        savedSpotIds={savedSpotIds}
        onRegeneratePlan={handleChatRegeneratePlan}
        onNavigate={handleChatNavigate}
        onOpenSpot={handleSelectVibe}
        onToggleSave={handleToggleSave}
        onCreatePlanFromRecs={handleCreatePlanFromRecs}
        onRecordSearch={recordSearch}
      />

      <AnimatePresence>
        {detailVibe && (
          <VibeDetail
            vibe={detailVibe}
            saved={savedSpotIds.includes(detailVibe.spotId)}
            onClose={() => setDetailVibe(null)}
            onToggleSave={() => handleToggleSave(detailVibe.spotId)}
            onCreatePlan={(v) => {
              setDetailVibe(null);
              setMood(v.mood);
              if (AREAS.includes(v.area)) setLocation(v.area);
              setPage('PLAN');
            }}
            onSelectVibe={handleSelectVibe}
            onAddJourneyToPlan={(plan) => {
              setDetailVibe(null);
              if (AREAS.includes(plan.spots?.[0]?.area)) setLocation(plan.spots[0].area);
              setSeedPlan(plan);
              setPage('PLAN');
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGenerating && <LoadingOverlay />}
      </AnimatePresence>

      <AnimatePresence>
        {detailPlan && (
          <PlanDetail
            plan={detailPlan}
            startPoint={startPoint}
            onClose={() => setDetailPlan(null)}
            onGoToPlan={() => handleGoToPlan(detailPlan)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <NotificationInbox
            open={showNotifications}
            onOpenSearch={() => {
              setShowNotifications(false);
              setSearchSeed('');
              setShowSearch(true);
            }}
            onClose={() => setShowNotifications(false)}
            onSelectSpot={(spotId) => {
              const vibe = ENRICHED_VIBES.find((v) => v.spotId === spotId);
              if (vibe) handleSelectVibe(vibe);
              setShowNotifications(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAiProfile && <AiProfilePage onClose={() => setShowAiProfile(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {legalType && <LegalPage type={legalType} onClose={() => setLegalType(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && (
          <AiSearchOverlay
            open={showSearch}
            onClose={() => {
              setShowSearch(false);
              setSearchSeed('');
            }}
            initialQuery={searchSeed}
            onSelectVibe={handleSelectVibe}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <ProfilePage
            onClose={() => setShowProfile(false)}
            onOpenAiProfile={() => {
              setShowProfile(false);
              setShowAiProfile(true);
            }}
            onOpenLegal={setLegalType}
            onSelectVibe={(v) => {
              setShowProfile(false);
              handleSelectVibe(v);
            }}
            onGoToSaved={() => {
              setShowProfile(false);
              setPage('SAVED');
            }}
            onGoToPlan={(plan) => {
              setShowProfile(false);
              handleGoToPlan(plan);
            }}
            onOpenSearch={(q) => {
              setShowProfile(false);
              setSearchSeed(q ?? '');
              setShowSearch(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
