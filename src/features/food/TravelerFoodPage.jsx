import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  getTravelerExperience,
  getTravelerExperienceLabel,
} from '@/data/travelerExperiences';
import { getTravelerExperienceRecommendations } from '@/features/food/travelerExperienceRecommendations';
import { TravelerExperienceChoose } from '@/features/food/TravelerExperienceChoose';
import { TravelerExperienceIntro } from '@/features/food/TravelerExperienceIntro';
import { TravelerFoodSpotList } from '@/features/food/TravelerFoodSpotList';
import { TravelerFoodSpotDetail } from '@/features/food/TravelerFoodSpotDetail';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { AiSuggestionBanner } from '@/components/ui/AiSuggestionBanner';
import { useAiProfile } from '@/contexts/AiProfileContext';

/** Traveler Mode — choose experience first, then AI-matched spots */
export function TravelerFoodPage({ initialExperienceId, onInitialConsumed }) {
  const { t, locale } = useLocale();
  const {
    location,
    mood,
    companion,
    freeTime,
    experienceMode,
    savedSpotIds,
    toggleSaveSpot,
  } = useAppState();
  const { profile } = useAiProfile();

  const [step, setStep] = useState('choose');
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    if (!initialExperienceId || !getTravelerExperience(initialExperienceId)) return;
    setSelectedExperienceId(initialExperienceId);
    setStep('intro');
    onInitialConsumed?.();
  }, [initialExperienceId, onInitialConsumed]);

  const recommendations = useMemo(() => {
    if (!selectedExperienceId || step !== 'spots') return [];
    return getTravelerExperienceRecommendations(selectedExperienceId, {
      location,
      companion,
      mood,
      freeTime,
      locale,
      experienceMode,
      profile,
    });
  }, [selectedExperienceId, step, location, companion, mood, freeTime, locale, experienceMode, profile]);

  const handleSelectExperience = (id) => {
    setSelectedExperienceId(id);
    setStep('intro');
  };

  const experience = getTravelerExperience(selectedExperienceId);

  return (
    <div className="space-y-8">
      <AiSuggestionBanner page="food" />

      <div className="rounded-[24px] border border-white/10 bg-[#0c0c10] p-6 sm:p-8">
        <p className="text-pink-300/70 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
          {t('food.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
          {t('travelerFood.experienceChooseTitle')}
        </h2>
        <p className="text-white/45 text-sm">{t('travelerFood.experienceChooseSubtitle')}</p>
        {selectedExperienceId && step !== 'choose' && experience && (
          <p className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/25 text-xs text-white/80">
            {experience.icon} {getTravelerExperienceLabel(experience, locale)}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <TravelerExperienceChoose key="choose" onSelect={handleSelectExperience} />
        )}
        {step === 'intro' && selectedExperienceId && (
          <TravelerExperienceIntro
            key="intro"
            experienceId={selectedExperienceId}
            onBack={() => setStep('choose')}
            onFindSpots={() => setStep('spots')}
          />
        )}
        {step === 'spots' && selectedExperienceId && (
          <TravelerFoodSpotList
            key="spots"
            experienceId={selectedExperienceId}
            spots={recommendations}
            onBack={() => setStep('intro')}
            onSelectSpot={setSelectedSpot}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSpot && (
          <TravelerFoodSpotDetail
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
            saved={savedSpotIds.includes(selectedSpot.id)}
            onToggleSave={() => toggleSaveSpot(selectedSpot.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
