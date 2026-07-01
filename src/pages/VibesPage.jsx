import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ENRICHED_VIBES, VIBE_CATEGORIES } from '@/data/vibes';
import {
  getKeywordsForMood,
  getTrendingTags,
  QUICK_FILTERS,
} from '@/data/vibeKeywords';
import { applyVibeFilters, getTodayPick } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { assignGridLayout } from '@/features/vibes/gridLayout';
import { VibeCard } from '@/features/vibes/VibeCard';
import { VibeFeaturedCard } from '@/features/vibes/VibeFeaturedCard';
import { MOODS, getMoodLabel } from '@/data/moods';
import { getAreaLabel } from '@/data/areas';
import { TravelerExperiencePanel, LocalPriorityPanel } from '@/components/ui/ExperienceModePanel';
import { formatFreeTime } from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

export function VibesPage({
  onMoodChange,
  onCreatePlan,
  onSelectVibe,
}) {
  const { t, locale } = useLocale();
  const {
    mood,
    experienceMode,
    companion,
    location,
    freeTime,
    weather,
    savedSpotIds,
    toggleSaveSpot,
    travelerExperience,
    localPriority,
  } = useAppState();
  const [category, setCategory] = useState('all');
  const [keywordId, setKeywordId] = useState(null);
  const [quickFilters, setQuickFilters] = useState([]);

  const aiKeywords = useMemo(
    () => getKeywordsForMood(mood, experienceMode, t),
    [mood, experienceMode, t]
  );

  const trendingTags = useMemo(
    () => getTrendingTags(experienceMode, locale),
    [experienceMode, locale]
  );

  useEffect(() => {
    setKeywordId(null);
  }, [mood, experienceMode, companion]);

  const filtered = useMemo(() => {
    const raw = applyVibeFilters(ENRICHED_VIBES, {
      category,
      keywordId,
      quickFilters,
      experienceMode,
      companion,
      travelerExperience,
      localPriority,
    });
    return localizeVibes(raw, { locale, experienceMode });
  }, [category, keywordId, quickFilters, experienceMode, companion, locale, travelerExperience, localPriority]);

  const todayPick = useMemo(
    () => getTodayPick(filtered, experienceMode, companion),
    [filtered, experienceMode, companion]
  );
  const gridVibes = useMemo(
    () => assignGridLayout(filtered.filter((v) => v.id !== todayPick?.id)),
    [filtered, todayPick]
  );

  const toggleQuickFilter = (id) => {
    setQuickFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSelectVibe = (vibe) => {
    onMoodChange(vibe.mood);
    onSelectVibe?.(vibe);
  };

  const experienceLabel =
    experienceMode === 'local' ? t('vibes.localMode') : t('vibes.travelerMode');

  return (
    <div className="space-y-10 sm:space-y-12 px-0.5">
      <header className="px-1">
        <p className="text-white/30 text-[10px] font-medium tracking-[0.35em] uppercase mb-4">
          {t('vibes.eyebrow')}
        </p>
        <h2 className="text-[2rem] sm:text-[2.5rem] font-semibold leading-[1.15] mb-4 tracking-tight">
          {t('vibes.title')}
          <br />
          <span className="text-gradient-soft">{t('vibes.titleAccent')}</span>
        </h2>
        <p className="text-white/40 text-sm max-w-md leading-relaxed">
          {experienceMode === 'traveler' ? t('vibes.worldTraveler') : t('vibes.worldLocal')}
        </p>
      </header>

      {experienceMode === 'traveler' ? <TravelerExperiencePanel /> : <LocalPriorityPanel />}

      {/* Tonight in Tokyo — trending */}
      <section className="px-1">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase mb-4">
          {t('vibes.tonightInTokyo')}
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {trendingTags.map((tag) => (
            <motion.button
              key={tag}
              type="button"
              whileTap={{ scale: 0.96 }}
              className="shrink-0 px-4 py-2 rounded-full glass-panel text-xs font-medium text-white/60 hover:text-white/85 transition-colors"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </section>

      <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl px-4 py-3">
        <p className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase mb-2">
          {t('vibes.aiContextTitle')}
        </p>
        <div className="flex flex-wrap gap-2 text-[10px] text-white/50">
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextLanguage')}: {locale === 'ja' ? '🇯🇵' : '🌍'}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextExperience')}: {experienceLabel}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextCompanion')}: {t(`companions.${companion}`)}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextMood')}: {getMoodLabel(mood, locale)}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextLocation')}: {getAreaLabel(location, locale)}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextTime')}: {formatFreeTime(freeTime, locale)}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {t('vibes.aiContextWeather')}: {t(`weather.${weather}`)}
          </span>
        </div>
      </div>

      <section>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-3">
          {t('vibes.chooseVibe')}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {MOODS.map((item) => {
            const label = locale === 'en' ? item.labelEn : item.labelJa;
            const active = mood === item.labelJa;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onMoodChange(item.labelJa)}
                whileTap={{ scale: 0.96 }}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold border backdrop-blur-xl transition ${
                  active
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400/40 text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/55 hover:text-white/80'
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </section>

      {mood && (
        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
          <span className="text-white/45">{t('vibes.yourVibe')}</span>
          <span className="font-semibold text-pink-200">{getMoodLabel(mood, locale)}</span>
        </motion.div>
      )}

      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-purple-300/80 uppercase mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('vibes.aiKeywords')}
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {aiKeywords.map((kw) => {
            const active = keywordId === kw.id;
            return (
              <motion.button
                key={kw.id}
                layout
                type="button"
                onClick={() => setKeywordId((prev) => (prev === kw.id ? null : kw.id))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 border-purple-400/50 text-white shadow-[0_0_24px_rgba(168,85,247,0.45)] scale-105'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/65 hover:border-white/20'
                }`}
              >
                {kw.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {QUICK_FILTERS.map((f) => {
          const active = quickFilters.includes(f.id);
          return (
            <motion.button
              key={f.id}
              layout
              type="button"
              onClick={() => toggleQuickFilter(f.id)}
              whileTap={{ scale: 0.96 }}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-semibold border backdrop-blur-xl ${
                active
                  ? 'bg-white/15 border-white/25 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/70'
              }`}
            >
              {t(`filters.${f.id}`)}
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {VIBE_CATEGORIES.map((chip) => {
          const isActive = category === chip.id;
          return (
            <motion.button
              key={chip.id}
              type="button"
              onClick={() => setCategory(chip.id)}
              whileTap={{ scale: 0.96 }}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-xl ${
                isActive
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/55'
              }`}
            >
              {t(`categories.${chip.id}`)}
            </motion.button>
          );
        })}
      </div>

      {todayPick && (
        <section>
          <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/80 uppercase mb-4">
            {t('vibes.todayPick')}
          </p>
          <VibeFeaturedCard
            vibe={todayPick}
            saved={savedSpotIds.includes(todayPick.spotId)}
            onSelect={handleSelectVibe}
            onToggleSave={toggleSaveSpot}
            experienceMode={experienceMode}
            companion={companion}
          />
        </section>
      )}

      <LayoutGroup>
        <motion.div layout className="columns-2 md:columns-3 gap-5 md:gap-7">
          <AnimatePresence mode="popLayout">
            {gridVibes.map((vibe, index) => (
              <motion.div
                key={vibe.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.25) }}
                className="break-inside-avoid mb-5 md:mb-7"
              >
                <VibeCard
                  vibe={vibe}
                  saved={savedSpotIds.includes(vibe.spotId)}
                  onSelect={handleSelectVibe}
                  onToggleSave={toggleSaveSpot}
                  delay={Math.min(index * 0.04, 0.4)}
                  experienceMode={experienceMode}
                  companion={companion}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="text-center text-white/30 py-20 text-sm">
          {t('vibes.noResults')}
        </p>
      )}

    </div>
  );
}
