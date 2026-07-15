import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { ENRICHED_VIBES } from '@/data/vibes';
import { JOURNEY_ROUTE_TYPES, getRouteTypeLabel } from '@/data/journeyRouteTypes';
import {
  generateAiJourney,
  getAlternativeVibes,
  getFilteredVibePool,
  inferRouteType,
  regenerateJourneyTail,
} from '@/features/vibes/generateAiJourney';
import { journeyToPlan } from '@/features/vibes/journeyToPlan';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { AiJourneyTimeline } from '@/features/vibes/detail/AiJourneyTimeline';
import { getFreeTimeOptions } from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useData } from '@/contexts/DataContext';

export function AiJourneySection({ startVibe, onSelectVibe, onAddToPlan }) {
  const { t, locale } = useLocale();
  const { experienceMode, companion, freeTime } = useAppState();
  const { weatherLegacy: weather } = useData();
  const { profile } = useAiProfile();

  const vibePool = useMemo(
    () => getFilteredVibePool(ENRICHED_VIBES, experienceMode, companion),
    [experienceMode, companion],
  );

  const defaultRouteType = useMemo(
    () => inferRouteType({ companion, weather, experienceMode, vibe: startVibe }),
    [companion, weather, experienceMode, startVibe],
  );

  const [routeType, setRouteType] = useState(defaultRouteType);
  const [journeyFreeTime, setJourneyFreeTime] = useState(freeTime ?? '2時間');
  const [journey, setJourney] = useState(null);

  const buildJourney = useCallback(
    (overrides = {}) => {
      const raw = generateAiJourney({
        vibes: vibePool,
        startVibe,
        routeType: overrides.routeType ?? routeType,
        freeTime: overrides.freeTime ?? journeyFreeTime,
        experienceMode,
        companion,
        locale,
        fixedStops: overrides.fixedStops,
        profile,
      });
      return {
        ...raw,
        stops: raw.stops.map((s) => ({
          ...s,
          vibe: localizeVibe(s.vibe, { locale, experienceMode }),
        })),
      };
    },
    [vibePool, startVibe, routeType, journeyFreeTime, experienceMode, companion, locale, profile],
  );

  useEffect(() => {
    setRouteType(defaultRouteType);
  }, [startVibe?.id, defaultRouteType]);

  useEffect(() => {
    setJourney(buildJourney());
  }, [startVibe?.id, routeType, journeyFreeTime, buildJourney]);

  const handleRouteTypeChange = (id) => {
    setRouteType(id);
  };

  const handleFreeTimeChange = (value) => {
    setJourneyFreeTime(value);
  };

  const handleRemove = (index) => {
    const next = regenerateJourneyTail({
      vibes: vibePool,
      journey,
      startVibe,
      routeType,
      freeTime: journeyFreeTime,
      experienceMode,
      companion,
      locale,
      removeIndex: index,
      profile,
    });
    setJourney({
      ...next,
      stops: next.stops.map((s) => ({
        ...s,
        vibe: localizeVibe(s.vibe, { locale, experienceMode }),
      })),
    });
  };

  const handleMove = (index, direction) => {
    const next = regenerateJourneyTail({
      vibes: vibePool,
      journey,
      startVibe,
      routeType,
      freeTime: journeyFreeTime,
      experienceMode,
      companion,
      locale,
      reorderFrom: index,
      direction,
      profile,
    });
    setJourney({
      ...next,
      stops: next.stops.map((s) => ({
        ...s,
        vibe: localizeVibe(s.vibe, { locale, experienceMode }),
      })),
    });
  };

  const handleSwap = (index) => {
    const alts = getAlternativeVibes(vibePool, journey, index, experienceMode, companion);
    if (!alts.length) return;
    const currentId = journey.stops[index].vibe.id;
    const nextAlt = alts.find((a) => a.id !== currentId) ?? alts[0];
    const regenerated = regenerateJourneyTail({
      vibes: vibePool,
      journey,
      startVibe,
      routeType,
      freeTime: journeyFreeTime,
      experienceMode,
      companion,
      locale,
      swapIndex: index,
      alternativeVibe: nextAlt,
      profile,
    });
    setJourney({
      ...regenerated,
      stops: regenerated.stops.map((s) => ({
        ...s,
        vibe: localizeVibe(s.vibe, { locale, experienceMode }),
      })),
    });
  };

  const handleAddToPlan = () => {
    if (!journey) return;
    const plan = journeyToPlan(journey, { locale, companion, experienceMode });
    onAddToPlan?.(plan);
  };

  if (!journey?.stops?.length) return null;

  const freeTimeOptions = getFreeTimeOptions(locale);

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <h2 className="text-lg font-semibold tracking-tight text-white">{t('vibes.aiJourneyTitle')}</h2>
        </div>
        <p className="text-sm text-white/40 leading-relaxed">{t('vibes.aiJourneySub')}</p>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t('vibes.journeyRouteType')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {JOURNEY_ROUTE_TYPES.map((rt) => {
            const active = routeType === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                onClick={() => handleRouteTypeChange(rt.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/[0.05] text-white/55 hover:text-white/80 border border-white/[0.06]'
                }`}
              >
                <span className="mr-1">{rt.icon}</span>
                {getRouteTypeLabel(rt.id, locale)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('vibes.journeyFreeTime')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {freeTimeOptions.map((opt) => {
            const active = journeyFreeTime === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleFreeTimeChange(opt.value)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border border-transparent'
                    : 'bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/75'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-white/30">
          {locale === 'en'
            ? `${journey.stops.length} stops · ~${journey.totalWalkMinutes} min walking`
            : `${journey.stops.length}スポット · 徒歩約${journey.totalWalkMinutes}分`}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
        <AiJourneyTimeline
          journey={journey}
          onSelectVibe={onSelectVibe}
          onRemoveStop={handleRemove}
          onMoveStop={handleMove}
          onSwapStop={handleSwap}
        />
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToPlan}
        className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold tracking-tight hover:opacity-95 transition"
      >
        {t('vibes.addJourneyToPlan')}
      </motion.button>
    </section>
  );
}
