import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Map as MapIcon, Route, Sparkles, Wand2 } from 'lucide-react';
import { AREAS } from '@/data/spots';
import { getMoodLabel } from '@/data/moods';
import { generateTokyoPlans } from '@/features/plan/generateTokyoPlans';
import { generatePlansWithAI, ApiError } from '@/services/planService';
import { generatePlanFromText } from '@/services/planFromTextService';
import { formatFreeTime, formatNextPlan, getFreeTimeOptions, getNextPlanOptions } from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { OpenAIErrorDetail } from '@/components/OpenAIErrorDetail';
import { useAppState } from '@/contexts/AppStateContext';

const Map = lazy(() => import('@/features/plan/Map').then((m) => ({ default: m.Map })));

export function PlanPage({
  onLocationChange,
  onFreeTimeChange,
  onNextPlanChange,
  onLocalLevelChange,
  startPoint,
  seedPlan,
  onSeedPlanConsumed,
  syncedPlans,
  planSyncKey = 0,
}) {
  const { t, locale: ctxLocale } = useLocale();
  const {
    location,
    freeTime,
    nextPlan,
    localLevel,
    mood,
    experienceMode,
    companion,
    planInput,
  } = useAppState();
  const locale = ctxLocale;

  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [textPlanInput, setTextPlanInput] = useState(
    locale === 'en'
      ? 'Dinner at 8 PM, 3 hours free until then. Want wine.'
      : '20時に会食、それまで3時間空いている。ワインが飲みたい'
  );
  const [planExtracted, setPlanExtracted] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [planErrorDetail, setPlanErrorDetail] = useState(null);
  const mapRef = useRef(null);

  const planParams = planInput;

  useEffect(() => {
    if (!seedPlan) return;
    setPlans([seedPlan]);
    setSelectedId(seedPlan.id);
    onSeedPlanConsumed?.();
  }, [seedPlan, onSeedPlanConsumed]);

  useEffect(() => {
    if (!syncedPlans?.length || planSyncKey === 0) return;
    setPlans(syncedPlans);
    setSelectedId(syncedPlans[0]?.id ?? null);
    setPlanExtracted(null);
    setPlanError(null);
  }, [planSyncKey, syncedPlans]);

  const selectedPlan = plans.find((p) => p.id === selectedId);

  const handleLocalGenerate = useCallback(() => {
    const generated = generateTokyoPlans(planParams);
    setPlans(generated);
    setSelectedId(generated[0]?.id ?? null);
    setPlanExtracted(null);
    setPlanError(null);
    setPlanErrorDetail(null);
  }, [location, freeTime, nextPlan, localLevel, mood, experienceMode, companion, locale]);

  const handleAiGenerate = useCallback(async () => {
    setIsAiGenerating(true);
    setPlanError(null);
    setPlanErrorDetail(null);
    try {
      const generated = await generatePlansWithAI(planParams);
      setPlans(generated);
      setSelectedId(generated[0]?.id ?? null);
    } catch (error) {
      const fallback = generateTokyoPlans(planParams);
      setPlans(fallback);
      setSelectedId(fallback[0]?.id ?? null);
      setPlanError(error instanceof ApiError ? error.message : error.message);
      setPlanErrorDetail(error instanceof ApiError ? error.detail : null);
    } finally {
      setIsAiGenerating(false);
    }
  }, [location, freeTime, nextPlan, localLevel, mood, experienceMode, companion, locale]);

  const handlePlanFromText = useCallback(async () => {
    setIsGenerating(true);
    setPlanError(null);
    setPlanErrorDetail(null);
    try {
      const { extracted, plans: generated } = await generatePlanFromText({
        text: textPlanInput,
        defaultLocation: location,
        experienceMode,
        companion,
        locale,
        localLevel,
      });
      setPlanExtracted(extracted);
      setPlans(generated);
      setSelectedId(generated[0]?.id ?? null);
    } catch (error) {
      setPlanError(error instanceof ApiError ? error.message : error.message);
      setPlanErrorDetail(error instanceof ApiError ? error.detail : null);
    } finally {
      setIsGenerating(false);
    }
  }, [textPlanInput, location, experienceMode, companion, locale]);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectClass =
    'rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl px-4 py-3 text-sm';

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {(isGenerating || isAiGenerating) && (
          <LoadingOverlay
            message={isGenerating ? t('plan.parsingOverlay') : undefined}
          />
        )}
      </AnimatePresence>
      <GlassCard className="p-6 sm:p-8" delay={0}>
        <p className="text-emerald-300/80 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
          {t('plan.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t('plan.title')}</h2>
        <p className="text-white/45 text-sm mb-6">{t('plan.subtitle')}</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <select value={location} onChange={(e) => onLocationChange(e.target.value)} className={selectClass}>
            {AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <select value={freeTime} onChange={(e) => onFreeTimeChange(e.target.value)} className={selectClass}>
            {getFreeTimeOptions(locale).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select value={nextPlan} onChange={(e) => onNextPlanChange(e.target.value)} className={selectClass}>
            {getNextPlanOptions(locale).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className={`${selectClass} flex items-center justify-between text-white/60`}>
            <span>{experienceMode === 'traveler' ? t('vibes.travelerMode') : t('vibes.localMode')}</span>
            <span className="text-white/35 text-xs">{t(`companions.${companion}`)}</span>
          </div>
        </div>

        <p className="text-white/35 text-sm mb-4">
          {t('plan.mood')}: {getMoodLabel(mood, locale)}
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <NeonButton onClick={handleLocalGenerate} variant="ghost" className="!text-white">
            <span className="flex items-center justify-center gap-2">
              <Route className="w-4 h-4" />
              {t('plan.localGenerate')}
            </span>
          </NeonButton>
          <NeonButton onClick={handleAiGenerate} disabled={isAiGenerating}>
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isAiGenerating ? t('plan.aiGenerating') : t('plan.aiGenerate')}
            </span>
          </NeonButton>
        </div>
      </GlassCard>

      <GlassCard className="p-6" delay={0.08}>
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-5 h-5 text-pink-300" />
          <h3 className="text-lg font-bold">{t('plan.textTitle')}</h3>
        </div>
        <textarea
          value={textPlanInput}
          onChange={(e) => setTextPlanInput(e.target.value)}
          rows={3}
          className="w-full rounded-[20px] bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-sm text-white placeholder:text-white/25 mb-4 resize-none"
          placeholder={t('plan.textPlaceholder')}
        />
        <NeonButton onClick={handlePlanFromText} disabled={isGenerating}>
          {isGenerating ? t('plan.textParsing') : t('plan.textButton')}
        </NeonButton>
      </GlassCard>

      {planError && <p className="text-amber-300/90 text-sm px-1">{planError}</p>}
      <OpenAIErrorDetail detail={planErrorDetail} />

      {planExtracted && (
        <GlassCard className="p-5" delay={0}>
          <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/70 uppercase mb-3">
            {t('plan.extracted')}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
              <p className="text-white/35 text-xs mb-1">{t('plan.location')}</p>
              <p className="font-semibold">{planExtracted.location}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
              <p className="text-white/35 text-xs mb-1">{t('plan.time')}</p>
              <p className="font-semibold">{planExtracted.freeTime}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
              <p className="text-white/35 text-xs mb-1">{t('plan.mood')}</p>
              <p className="font-semibold">{planExtracted.mood}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
              <p className="text-white/35 text-xs mb-1">{t('plan.purpose')}</p>
              <p className="font-semibold">{planExtracted.purpose ?? '—'}</p>
            </div>
          </div>
        </GlassCard>
      )}

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-300/70 uppercase mb-1">
                    {t('plan.timeline')}
                  </p>
                  <h3 className="text-xl font-bold">{selectedPlan.title}</h3>
                </div>
                <motion.button
                  type="button"
                  onClick={scrollToMap}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <MapIcon className="w-4 h-4" />
                  {t('plan.toMap')}
                </motion.button>
              </div>

              {plans.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedId(plan.id)}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition ${
                        selectedId === plan.id
                          ? 'bg-emerald-400 text-black shadow-[0_0_16px_rgba(52,211,153,0.4)]'
                          : 'bg-white/[0.06] text-white/60 hover:text-white'
                      }`}
                    >
                      {plan.title}
                    </button>
                  ))}
                </div>
              )}

              <PlanTimeline schedule={selectedPlan.schedule} spots={selectedPlan.spots} />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPlan && (
        <div ref={mapRef}>
          <GlassCard className="p-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-300/70 uppercase mb-4">
              {t('plan.routeMap')}
            </p>
            <Suspense
              fallback={
                <div className="h-[400px] rounded-3xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
              }
            >
              <Map spots={selectedPlan.spots} startPoint={startPoint} />
            </Suspense>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
