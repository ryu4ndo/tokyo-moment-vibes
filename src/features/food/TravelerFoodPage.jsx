import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getTravelerFoodLabel, getTravelerFood } from '@/data/travelerFoods';
import { getTravelerFoodRecommendations } from '@/features/food/travelerFoodRecommendations';
import { TravelerFoodChoose } from '@/features/food/TravelerFoodChoose';
import { TravelerFoodIntro } from '@/features/food/TravelerFoodIntro';
import { TravelerFoodSpotList } from '@/features/food/TravelerFoodSpotList';
import { TravelerFoodSpotDetail } from '@/features/food/TravelerFoodSpotDetail';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppState } from '@/contexts/AppStateContext';

/** Traveler Mode — choose dish first, then AI-matched restaurants */
export function TravelerFoodPage() {
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

  const [step, setStep] = useState('choose');
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const recommendations = useMemo(() => {
    if (!selectedFoodId || step !== 'spots') return [];
    return getTravelerFoodRecommendations(selectedFoodId, {
      location,
      companion,
      mood,
      freeTime,
      locale,
      experienceMode,
    });
  }, [selectedFoodId, step, location, companion, mood, freeTime, locale, experienceMode]);

  const handleSelectFood = (foodId) => {
    setSelectedFoodId(foodId);
    setStep('intro');
  };

  const handleFindSpots = () => setStep('spots');

  return (
    <div className="space-y-8">
      <GlassCard className="p-6 sm:p-8" delay={0}>
        <p className="text-cyan-300/80 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
          {t('food.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t('food.travelerTitle')}</h2>
        <p className="text-white/45 text-sm">{t('food.travelerSubtitle')}</p>
        {selectedFoodId && step !== 'choose' && (
          <p className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-xs text-cyan-100">
            {getTravelerFood(selectedFoodId)?.icon}{' '}
            {getTravelerFoodLabel(getTravelerFood(selectedFoodId), locale)}
          </p>
        )}
      </GlassCard>

      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <TravelerFoodChoose key="choose" onSelect={handleSelectFood} />
        )}
        {step === 'intro' && selectedFoodId && (
          <TravelerFoodIntro
            key="intro"
            foodId={selectedFoodId}
            onBack={() => setStep('choose')}
            onFindSpots={handleFindSpots}
          />
        )}
        {step === 'spots' && selectedFoodId && (
          <TravelerFoodSpotList
            key="spots"
            foodId={selectedFoodId}
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
            foodId={selectedFoodId}
            saved={savedSpotIds.includes(selectedSpot.id)}
            onToggleSave={() => toggleSaveSpot(selectedSpot.id)}
            onClose={() => setSelectedSpot(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
