import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Map as MapIcon, MessageSquare, Sparkles } from 'lucide-react';
import { AREAS } from '@/data/spots';
import { PLAN_EXAMPLE_PROMPTS } from '@/data/planExamplePrompts';
import { generateTokyoPlans } from '@/features/plan/generateTokyoPlans';
import { generatePlansWithAI, ApiError } from '@/services/planService';
import { generatePlanFromText } from '@/services/planFromTextService';
import {
  formatFreeTime,
  getFreeTimeOptions,
  getPlanBudgetOptions,
  getPlanPurposeOptions,
} from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { CompanionSelector } from '@/components/ui/CompanionSelector';
import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { OpenAIErrorDetail } from '@/components/OpenAIErrorDetail';
import { buildPlanFromSaved } from '@/features/saved/planFromSaved';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useAppState } from '@/contexts/AppStateContext';
import { AiSuggestionBanner } from '@/components/ui/AiSuggestionBanner';

const Map = lazy(() => import('@/features/plan/Map').then((m) => ({ default: m.Map })));

export function PlanPage({
  onLocationChange,
  onFreeTimeChange,
  startPoint,
  seedPlan,
  onSeedPlanConsumed,
  syncedPlans,
  planSyncKey = 0,
}) {
  const { t, locale } = useLocale();
  const {
    location,
    freeTime,
    mood,
    experienceMode,
    companion,
    setCompanion,
    planInput,
    localLevel,
    recordSearch,
    savedSpotIds,
  } = useAppState();
  const { profile } = useAiProfile();

  const [textPlanInput, setTextPlanInput] = useState('');
  const [planPurpose, setPlanPurpose] = useState('food');
  const [planBudget, setPlanBudget] = useState('all');
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [planExtracted, setPlanExtracted] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [planErrorDetail, setPlanErrorDetail] = useState(null);
  const mapRef = useRef(null);

  const extendedParams = {
    ...planInput,
    planPurpose,
    planBudget,
    companion,
  };

  const examplePrompts = PLAN_EXAMPLE_PROMPTS[locale] ?? PLAN_EXAMPLE_PROMPTS.ja;

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
    setPlanError(null);
  }, [planSyncKey, syncedPlans]);

  const selectedPlan = plans.find((p) => p.id === selectedId);

  const applyExtracted = useCallback(
    (extracted) => {
      if (!extracted) return;
      if (extracted.location && extracted.location !== location) {
        onLocationChange(extracted.location);
      }
      if (extracted.freeTime && extracted.freeTime !== freeTime) {
        onFreeTimeChange(extracted.freeTime);
      }
    },
    [freeTime, location, onFreeTimeChange, onLocationChange],
  );

  const handlePlanFromSaved = useCallback(() => {
    const plan = buildPlanFromSaved({
      savedSpotIds,
      location,
      profile,
      locale,
      freeTime,
      companion,
      experienceMode,
    });
    if (plan) {
      setPlans([plan]);
      setSelectedId(plan.id);
      setPlanError(null);
    }
  }, [savedSpotIds, location, profile, locale, freeTime, companion, experienceMode]);

  const handleGenerate = useCallback(() => {
    const generated = generateTokyoPlans(extendedParams);
    setPlans(generated);
    setSelectedId(generated[0]?.id ?? null);
    setPlanError(null);
    setPlanErrorDetail(null);
  }, [extendedParams]);

  const handleConsultAi = useCallback(async () => {
    const text = textPlanInput.trim();
    setIsConsulting(true);
    setPlanError(null);
    setPlanErrorDetail(null);

    try {
      if (text) {
        recordSearch(text);
        const { extracted, plans: generated } = await generatePlanFromText({
          text,
          defaultLocation: location,
          freeTime,
          mood,
          planPurpose,
          planBudget,
          experienceMode,
          companion,
          locale,
          localLevel,
        });
        setPlanExtracted(extracted);
        applyExtracted(extracted);
        setPlans(generated);
        setSelectedId(generated[0]?.id ?? null);
      } else {
        const generated = await generatePlansWithAI(extendedParams);
        setPlans(generated);
        setSelectedId(generated[0]?.id ?? null);
        setPlanExtracted(null);
      }
    } catch (error) {
      const fallback = generateTokyoPlans(extendedParams);
      setPlans(fallback);
      setSelectedId(fallback[0]?.id ?? null);
      setPlanError(error instanceof ApiError ? error.message : error.message);
      setPlanErrorDetail(error instanceof ApiError ? error.detail : null);
    } finally {
      setIsConsulting(false);
    }
  }, [
    applyExtracted,
    companion,
    experienceMode,
    extendedParams,
    freeTime,
    locale,
    localLevel,
    location,
    mood,
    planBudget,
    planPurpose,
    textPlanInput,
    recordSearch,
  ]);

  const selectClass =
    'w-full rounded-2xl bg-[#111116] border border-white/10 px-4 py-3 text-sm text-white';

  return (
    <div className="space-y-6">
      <AiSuggestionBanner page="plan" />

      {savedSpotIds.length >= 2 && (
        <GlassCard className="p-5 sm:p-6" delay={0.02}>
          <p className="text-[10px] font-bold tracking-[0.2em] text-purple-300/70 uppercase mb-2">
            {t('plan.fromSavedTitle')}
          </p>
          <p className="text-sm text-white/45 mb-4">{t('plan.fromSavedDesc')}</p>
          <NeonButton variant="primary" onClick={handlePlanFromSaved} className="w-full sm:w-auto">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('plan.fromSavedCta')} ({savedSpotIds.length})
            </span>
          </NeonButton>
        </GlassCard>
      )}

      <AnimatePresence>
        {isConsulting && <LoadingOverlay message={t('plan.parsingOverlay')} />}
      </AnimatePresence>

      <GlassCard className="p-6 sm:p-8 relative overflow-hidden" delay={0}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-cyan-500/5 pointer-events-none" />

        <div className="relative">
          <p className="text-pink-300/70 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
            {t('plan.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">{t('plan.title')}</h2>
          <p className="text-white/45 text-sm mb-3 leading-relaxed">{t('plan.subtitle')}</p>
          <p className="text-white/30 text-xs mb-6">{t('plan.useCases')}</p>

          <div className="rounded-2xl border border-pink-400/25 bg-[#0d0d12]/80 p-4 sm:p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-pink-300/80" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/70 uppercase">
                {t('plan.textTitle')}
              </p>
            </div>
            <textarea
              value={textPlanInput}
              onChange={(e) => setTextPlanInput(e.target.value)}
              placeholder={t('plan.textPlaceholder')}
              rows={4}
              className="w-full rounded-xl bg-[#111116] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-pink-400/40 transition"
            />
            <NeonButton
              onClick={handleConsultAi}
              disabled={isConsulting}
              className="w-full mt-4"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isConsulting ? t('plan.textParsing') : t('plan.consultLabel')}
              </span>
            </NeonButton>
          </div>

          <div className="mb-2">
            <p className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase mb-2">
              {t('plan.examplesLabel')}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setTextPlanInput(prompt)}
                  className="shrink-0 px-3.5 py-2 rounded-full text-xs font-medium bg-[#111116] border border-white/10 text-white/55 hover:text-white/85 hover:border-white/20 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8" delay={0.05}>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-1">
          {t('plan.filtersTitle')}
        </p>
        <p className="text-white/35 text-xs mb-5">{t('plan.filtersHint')}</p>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-2 block">
                {t('plan.location')}
              </label>
              <select
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className={selectClass}
              >
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-2 block">
                {t('plan.freeTime')}
              </label>
              <select
                value={freeTime}
                onChange={(e) => onFreeTimeChange(e.target.value)}
                className={selectClass}
              >
                {getFreeTimeOptions(locale).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-2 block">
              {t('plan.budget')}
            </label>
            <select
              value={planBudget}
              onChange={(e) => setPlanBudget(e.target.value)}
              className={selectClass}
            >
              {getPlanBudgetOptions(locale).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <CompanionSelector value={companion} onChange={setCompanion} compact />

          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-2 block">
              {t('plan.purpose')}
            </label>
            <div className="flex flex-wrap gap-2">
              {getPlanPurposeOptions(locale).map((opt) => {
                const active = planPurpose === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPlanPurpose(opt.value)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white'
                        : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/75'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <NeonButton onClick={handleGenerate} variant="ghost" className="!text-white w-full sm:w-auto">
            {t('plan.generate')}
          </NeonButton>
        </div>
      </GlassCard>

      {planExtracted && (
        <GlassCard className="p-5" delay={0.1}>
          <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300/70 uppercase mb-3">
            {t('plan.extracted')}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
              {planExtracted.location}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
              {formatFreeTime(planExtracted.freeTime, locale)}
            </span>
            {planExtracted.mood && (
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                {planExtracted.mood}
              </span>
            )}
            {planExtracted.purpose && planExtracted.purpose !== '予定なし' && (
              <span className="px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-200/80">
                {planExtracted.purpose}
              </span>
            )}
          </div>
        </GlassCard>
      )}

      {planError && <p className="text-amber-300/90 text-sm px-1">{planError}</p>}
      <OpenAIErrorDetail detail={planErrorDetail} />

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-caption text-purple-300/70 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('plan.timeline')}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-white">{selectedPlan.title}</h3>
                  <p className="text-sm text-white/40 mt-2 leading-relaxed">{selectedPlan.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => mapRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  {t('plan.toMap')}
                </button>
              </div>

              {selectedPlan.aiReason && (
                <p className="text-sm text-white/60 mb-8 p-4 rounded-[16px] gradient-border-ai leading-relaxed">
                  {selectedPlan.aiReason}
                </p>
              )}

              {plans.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mb-8 pb-1 scrollbar-hide">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedId(plan.id)}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                        selectedId === plan.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/[0.04] border border-white/[0.08] text-white/50'
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
            <p className="text-caption text-white/40 mb-4">
              {t('plan.routeMap')}
            </p>
            <Suspense
              fallback={
                <div className="h-[360px] rounded-2xl bg-[#111116] border border-white/10 animate-pulse" />
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
