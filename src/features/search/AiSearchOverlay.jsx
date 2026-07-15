import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Loader2, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useData } from '@/contexts/DataContext';
import { buildAiContext } from '@/domain/ai/buildAiContext';
import { searchWithAi } from '@/services/searchService';
import {
  AI_FILTER_CHIPS,
  getChipQuery,
  getFilterLabel,
  getModeChips,
  getPopularSearches,
} from './searchChips';
import { AiSearchResultCard } from './AiSearchResultCard';
import { ErrorState } from '@/components/ui/ErrorState';

const EXAMPLE_QUERIES = {
  ja: [
    '渋谷で雰囲気のいい焼鳥屋',
    '今日雨だから屋内で楽しめる場所',
    '誕生日ディナー',
    '一人でゆっくりできるカフェ',
    '新宿で終電まで暇',
    '5000円以内で夜景デート',
  ],
  en: [
    'Atmospheric yakitori in Shibuya',
    'Indoor spots for a rainy day',
    'Birthday dinner',
    'Solo-friendly café to unwind',
    'Something fun in Shinjuku until last train',
    'Date night views under ¥5,000',
  ],
};

function ChipRow({ label, icon: Icon, children }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2 px-1">
        {Icon && <Icon className="w-3.5 h-3.5 text-purple-300/80" />}
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function QueryChip({ children, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-xs font-medium transition border ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent'
          : 'bg-white/[0.04] text-white/65 border-white/[0.08] hover:bg-white/[0.07] hover:text-white/85'
      }`}
    >
      {children}
    </button>
  );
}

export function AiSearchOverlay({ open, onClose, onSelectVibe, initialQuery = '' }) {
  const { t, locale } = useLocale();
  const {
    location,
    experienceMode,
    companion,
    savedSpotIds,
    recentlyViewedIds,
    searchHistory,
    recordSearch,
  } = useAppState();
  const { profile } = useAiProfile();
  const { weather, events } = useData();

  const [query, setQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchState, setSearchState] = useState(null);
  const inputRef = useRef(null);

  const context = useMemo(
    () =>
      buildAiContext({
        locale,
        experienceMode,
        companion,
        location,
        weather,
        events,
        profile,
        savedSpotIds,
        recentlyViewedIds,
        currentPage: 'SEARCH',
      }),
    [locale, experienceMode, companion, location, weather, events, profile, savedSpotIds, recentlyViewedIds],
  );

  const popular = useMemo(() => getPopularSearches(), []);
  const modeChips = useMemo(() => getModeChips(experienceMode), [experienceMode]);
  const examples = EXAMPLE_QUERIES[locale] ?? EXAMPLE_QUERIES.ja;

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery || '');
    setActiveFilters([]);
    setSearchState(null);
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [open, initialQuery]);

  const runSearch = useCallback(
    async (text, filters = activeFilters) => {
      const trimmed = text?.trim();
      if (!trimmed) return;

      setLoading(true);
      setError(null);
      recordSearch(trimmed);

      try {
        const result = await searchWithAi({
          query: trimmed,
          context,
          activeFilters: filters,
          excludeSpotIds: [],
        });
        setSearchState(result);
        setActiveFilters(filters);
      } catch (err) {
        setError(err?.message ?? t('search.error'));
        setSearchState(null);
      } finally {
        setLoading(false);
      }
    },
    [activeFilters, context, recordSearch],
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    runSearch(query);
  };

  const handleFilterToggle = (filterId) => {
    const next = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(next);
    if (searchState?.query) runSearch(searchState.query, next);
  };

  const handleChipQuery = (chipQuery) => {
    setQuery(chipQuery);
    runSearch(chipQuery, []);
  };

  if (!open) return null;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-[#0a0a0e]/98 backdrop-blur-xl"
      >
        <div className="h-full max-w-2xl mx-auto flex flex-col px-5 pt-safe pb-8">
          <header className="flex items-center gap-3 py-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-2 rounded-full hover:bg-white/[0.06] transition"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[0.3em] text-purple-300/70 uppercase">
                {t('search.eyebrow')}
              </p>
              <h1 className="text-lg font-semibold text-white">{t('search.title')}</h1>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="shrink-0 mb-5">
            <div className="relative rounded-[20px] border border-white/[0.1] bg-white/[0.04] focus-within:border-purple-500/40 transition">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent pl-11 pr-12 py-4 text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-40 transition"
                aria-label={t('search.submit')}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/30 mt-2 px-1">{t('search.hint')}</p>
          </form>

          <div className="flex-1 overflow-y-auto space-y-6 pb-24 scrollbar-hide">
            {!searchState && !loading && (
              <>
                <ChipRow label={t('search.modeChips')} icon={Sparkles}>
                  {modeChips.map((chip) => (
                    <QueryChip key={chip.id} onClick={() => handleChipQuery(getChipQuery(chip, locale))}>
                      {getChipQuery(chip, locale)}
                    </QueryChip>
                  ))}
                </ChipRow>

                <ChipRow label={t('search.popularNow')} icon={TrendingUp}>
                  {popular.map((item) => {
                    const q = locale === 'en' ? item.queryEn : item.queryJa;
                    return (
                      <QueryChip key={q} onClick={() => handleChipQuery(q)}>
                        {q}
                      </QueryChip>
                    );
                  })}
                </ChipRow>

                {searchHistory.length > 0 && (
                  <ChipRow label={t('search.recent')} icon={Clock}>
                    {searchHistory.slice(0, 6).map((q) => (
                      <QueryChip key={q} onClick={() => handleChipQuery(q)}>
                        {q}
                      </QueryChip>
                    ))}
                  </ChipRow>
                )}

                <ChipRow label={t('search.tryAsking')}>
                  {examples.map((ex) => (
                    <QueryChip key={ex} onClick={() => handleChipQuery(ex)}>
                      {ex}
                    </QueryChip>
                  ))}
                </ChipRow>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-sm text-white/45">{t('search.thinking')}</p>
              </div>
            )}

            {error && !loading && (
              <ErrorState
                title={t('search.errorTitle')}
                description={error}
                onRetry={() => runSearch(query)}
                retryLabel={t('search.retry')}
              />
            )}

            {searchState && !loading && !error && (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[20px] border border-purple-500/20 bg-purple-500/[0.06] p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">{searchState.aiMessage}</p>
                  </div>
                </motion.div>

                <ChipRow label={t('search.refineWithAi')}>
                  {AI_FILTER_CHIPS.map((chip) => (
                    <QueryChip
                      key={chip.id}
                      active={activeFilters.includes(chip.id)}
                      onClick={() => handleFilterToggle(chip.id)}
                    >
                      {chip.icon} {getFilterLabel(chip.id, locale)}
                    </QueryChip>
                  ))}
                </ChipRow>

                {searchState.results.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 px-1">
                      {searchState.results.length} {t('search.results')}
                    </p>
                    {searchState.results.map((result, i) => (
                      <AiSearchResultCard
                        key={result.spotId}
                        result={result}
                        index={i}
                        onSelect={(vibe) => {
                          onSelectVibe?.(vibe);
                          onClose();
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-white/40 text-sm py-12">{t('vibes.noResults')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
  );
}
