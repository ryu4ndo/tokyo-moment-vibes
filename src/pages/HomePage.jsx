import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Timer } from 'lucide-react';
import { generateTokyoPlans } from '@/features/plan/generateTokyoPlans';
import { estimatePlanBudget } from '@/utils/spotUtils';
import { getPlanReason } from '@/utils/displayUtils';
import { getAreaLabel } from '@/data/areas';
import { getMomentLabel } from '@/data/moments';
import { formatFreeTime } from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { RecommendedPlanCard } from '@/features/plan/RecommendedPlanCard';
import { WhyThisPlan } from '@/features/plan/WhyThisPlan';
import { OpenAIErrorDetail } from '@/components/OpenAIErrorDetail';
import { MomentPicker } from '@/features/home/MomentPicker';
import { HomeDiscover } from '@/features/home/HomeDiscover';
import { getHomeDiscover } from '@/features/home/homeContent';
import { useAppState } from '@/contexts/AppStateContext';

export function HomePage({
  onSelectPlan,
  onSelectVibe,
  onGoToVibes,
  onGoToSaved,
  aiPlans,
  isGenerating,
  planError,
  planErrorDetail,
  onGenerateAI,
}) {
  const { t, locale } = useLocale();
  const {
    location,
    freeTime,
    nextPlan,
    localLevel,
    mood,
    experienceMode,
    companion,
    planInput,
    weather,
    savedSpotIds,
    selectedMomentId,
    setSelectedMoment,
    surpriseResolvedId,
    recentlyViewedIds,
    continueMomentId,
  } = useAppState();

  const discover = useMemo(
    () =>
      getHomeDiscover({
        locale,
        experienceMode,
        companion,
        location,
        weather,
        savedSpotIds,
        recentlyViewedIds,
      }),
    [locale, experienceMode, companion, location, weather, savedSpotIds, recentlyViewedIds]
  );

  const localPlans = useMemo(
    () =>
      generateTokyoPlans(planInput).map((plan) => ({
        ...plan,
        location: getAreaLabel(location, locale),
        duration: formatFreeTime(freeTime, locale),
        budget: estimatePlanBudget(plan.spots),
        reason: getPlanReason(plan, mood, { experienceMode, companion, locale }),
      })),
    [planInput, location, freeTime, mood, experienceMode, companion, locale]
  );

  const displayAiPlans = useMemo(
    () =>
      (aiPlans ?? []).map((plan) => ({
        ...plan,
        location: getAreaLabel(location, locale),
        duration: formatFreeTime(freeTime, locale),
        budget: estimatePlanBudget(plan.spots),
        reason: getPlanReason(plan, mood, { experienceMode, companion, locale }),
      })),
    [aiPlans, location, freeTime, mood, experienceMode, companion, locale]
  );

  return (
    <div className="space-y-8">
      <GlassCard className="p-6 sm:p-8 overflow-hidden relative" delay={0}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute -left-12 bottom-0 w-32 h-32 rounded-full bg-cyan-500/8 blur-3xl" />
        <p className="text-pink-300/80 text-[10px] font-bold tracking-[0.35em] uppercase mb-3">
          {t('home.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.08] mb-3 max-w-xl tracking-tight">
          {t('home.title')}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-fuchsia-300 to-cyan-300">
            {t('home.titleAccent')}
          </span>
        </h2>
        <p className="text-white/45 text-sm sm:text-base max-w-md leading-relaxed mb-5">
          {t('home.subtitle')}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <MapPin className="w-3.5 h-3.5 text-pink-300" />
            {getAreaLabel(location, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Timer className="w-3.5 h-3.5 text-cyan-300" />
            {formatFreeTime(freeTime, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-400/25 text-pink-100/90">
            {getMomentLabel(selectedMomentId, locale)}
          </span>
        </div>
      </GlassCard>

      <MomentPicker
        selectedMomentId={selectedMomentId}
        onSelect={setSelectedMoment}
        surpriseReveal={
          surpriseResolvedId ? getMomentLabel(surpriseResolvedId, locale) : null
        }
      />

      <HomeDiscover
        discover={discover}
        continueMomentId={continueMomentId}
        onSelectVibe={onSelectVibe}
        onContinueJourney={() => setSelectedMoment(continueMomentId)}
        onGoToVibes={onGoToVibes}
        onGoToSaved={onGoToSaved}
      />

      <section>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-white/35 uppercase mb-1">
              {t('home.recommendedEyebrow')}
            </p>
            <h3 className="text-xl font-bold">{t('home.recommended')}</h3>
            <p className="text-[11px] text-white/35 mt-0.5">{t('home.recommendedSub')}</p>
          </div>
          <span className="text-xs text-white/30">{localPlans.length} {t('home.routes')}</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
          {localPlans.map((plan, index) => (
            <div key={plan.id} className="snap-start">
              <RecommendedPlanCard
                plan={plan}
                location={getAreaLabel(location, locale)}
                freeTime={formatFreeTime(freeTime, locale)}
                mood={mood}
                onSelect={onSelectPlan}
                delay={index * 0.08}
                variant="local"
              />
            </div>
          ))}
        </div>
      </section>

      <GlassCard className="p-6 sm:p-8" delay={0.1}>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-pink-300/70" />
          <div>
            <h3 className="text-lg font-semibold">{t('home.aiSection')}</h3>
            <p className="text-[11px] text-white/35">{t('home.aiDesc')}</p>
          </div>
        </div>
        <WhyThisPlan />
        <div className="mt-6">
          <NeonButton onClick={onGenerateAI} disabled={isGenerating}>
            {isGenerating ? t('home.generating') : t('home.aiButton')}
          </NeonButton>
        </div>
        {planError && <p className="mt-4 text-amber-300/90 text-sm">{planError}</p>}
        <OpenAIErrorDetail detail={planErrorDetail} />
      </GlassCard>

      <AnimatePresence>
        {displayAiPlans.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4 px-1">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-pink-300/60 uppercase mb-1">
                  {t('home.aiPlansEyebrow')}
                </p>
                <h3 className="text-xl font-bold">{t('home.aiPlans')}</h3>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
              {displayAiPlans.map((plan, index) => (
                <div key={`ai-${plan.id}`} className="snap-start">
                  <RecommendedPlanCard
                    plan={plan}
                    location={getAreaLabel(location, locale)}
                    freeTime={formatFreeTime(freeTime, locale)}
                    mood={mood}
                    onSelect={onSelectPlan}
                    delay={index * 0.1}
                    variant="ai"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
