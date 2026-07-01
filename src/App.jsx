import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { PlanDetail } from '@/features/plan/PlanDetail';
import { HomePage } from '@/pages/HomePage';
import { FoodPage } from '@/pages/FoodPage';
import { VibesPage } from '@/pages/VibesPage';
import { SavedPage } from '@/pages/SavedPage';
import { PlanPage } from '@/pages/PlanPage';
import { AIChat } from '@/features/chat/AIChat';
import { VibeDetail } from '@/features/vibes/VibeDetail';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { PageTransition } from '@/components/ui/PageTransition';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AREA_COORDINATES, AREAS } from '@/data/spots';
import { useAppState } from '@/contexts/AppStateContext';
import { usePlanGeneration } from '@/hooks/usePlanGeneration';

export default function App() {
  const {
    location,
    setMood,
    setLocation,
    setFreeTime,
    setNextPlan,
    setLocalLevel,
    setExperienceMode,
    setCompanion,
    savedSpotIds,
    toggleSaveSpot,
    addRecentlyViewed,
    planInput,
  } = useAppState();

  const [page, setPage] = useState('HOME');
  const [detailVibe, setDetailVibe] = useState(null);
  const [detailPlan, setDetailPlan] = useState(null);
  const [seedPlan, setSeedPlan] = useState(null);

  const {
    aiPlans,
    isGenerating,
    planError,
    planErrorDetail,
    planSyncKey,
    generateAI,
    regenerateFromChat,
  } = usePlanGeneration(planInput);

  const startPoint = AREA_COORDINATES[location] ?? AREA_COORDINATES['渋谷'];

  const handleSelectVibe = useCallback(
    (vibe) => {
      if (vibe?.id) addRecentlyViewed(vibe.id);
      setDetailVibe(vibe);
    },
    [addRecentlyViewed]
  );

  const handleGoToPlan = (plan) => {
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
    [planInput, regenerateFromChat, setLocation, setFreeTime, setMood, setNextPlan, setExperienceMode, setCompanion]
  );

  return (
    <div className="min-h-screen text-white selection:bg-pink-500/30 font-sans">
      <AmbientBackground />

      <div className={`relative z-10 mx-auto ${page === 'VIBES' ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <AppHeader />

        <main className="p-5 pb-32">
          <PageTransition pageKey={page}>
            {page === 'HOME' && (
              <HomePage
                onSelectPlan={setDetailPlan}
                onSelectVibe={handleSelectVibe}
                onGoToVibes={() => setPage('VIBES')}
                onGoToSaved={() => setPage('SAVED')}
                aiPlans={aiPlans}
                isGenerating={isGenerating}
                planError={planError}
                planErrorDetail={planErrorDetail}
                onGenerateAI={generateAI}
              />
            )}
            {page === 'FOOD' && <FoodPage />}
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
                />
              </ErrorBoundary>
            )}
            {page === 'SAVED' && <SavedPage onSelectVibe={handleSelectVibe} />}
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

      <AIChat onRegeneratePlan={handleChatRegeneratePlan} />

      <AnimatePresence>
        {detailVibe && (
          <VibeDetail
            vibe={detailVibe}
            saved={savedSpotIds.includes(detailVibe.spotId)}
            onClose={() => setDetailVibe(null)}
            onToggleSave={() => toggleSaveSpot(detailVibe.spotId)}
            onCreatePlan={(v) => {
              setDetailVibe(null);
              setMood(v.mood);
              if (AREAS.includes(v.area)) setLocation(v.area);
              setPage('PLAN');
            }}
            onSelectVibe={handleSelectVibe}
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
    </div>
  );
}
