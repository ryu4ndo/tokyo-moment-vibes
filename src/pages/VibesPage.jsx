import { useMemo, useState } from 'react';
import { ENRICHED_VIBES } from '@/data/vibes';
import { filterByExploreCategory } from '@/data/exploreCategories';
import { applyVibeFilters } from '@/features/vibes/vibeFilters';
import { localizeVibes } from '@/features/vibes/localizeVibe';
import { assignGridLayout } from '@/features/vibes/gridLayout';
import { sortExploreFeed, shuffleExploreFeed } from '@/features/vibes/exploreRecommendations';
import { ExploreCategoryBar } from '@/features/vibes/ExploreCategoryBar';
import { ExploreMasonryGrid } from '@/features/vibes/ExploreMasonryGrid';
import { AiSuggestionBanner } from '@/components/ui/AiSuggestionBanner';
import { AiSearchTrigger } from '@/features/search/AiSearchTrigger';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useData } from '@/contexts/DataContext';
import { VibesEventsStrip } from '@/features/vibes/VibesEventsStrip';

export function VibesPage({ onMoodChange, onSelectVibe, onOpenSearch }) {
  const { t, locale } = useLocale();
  const {
    experienceMode,
    companion,
    location,
    savedSpotIds,
    recentlyViewedIds,
    toggleSaveSpot,
    travelerExperience,
    localPriority,
  } = useAppState();
  const { profile } = useAiProfile();
  const { weatherLegacy: weather, events } = useData();

  const [category, setCategory] = useState('all');

  const exploreContext = useMemo(
    () => ({ location, weather, savedSpotIds, recentlyViewedIds, companion }),
    [location, weather, savedSpotIds, recentlyViewedIds, companion],
  );

  const baseFiltered = useMemo(() => {
    const raw = applyVibeFilters(ENRICHED_VIBES, {
      category: 'all',
      experienceMode,
      companion,
      travelerExperience,
      localPriority,
    });
    return localizeVibes(raw, { locale, experienceMode });
  }, [experienceMode, companion, locale, travelerExperience, localPriority]);

  const feedVibes = useMemo(() => {
    const filtered = filterByExploreCategory(baseFiltered, category);
    const ordered =
      category === 'all'
        ? sortExploreFeed(filtered, exploreContext, profile)
        : shuffleExploreFeed(filtered, category);
    return assignGridLayout(ordered);
  }, [baseFiltered, category, exploreContext, profile]);

  const handleSelectVibe = (vibe) => {
    onMoodChange?.(vibe.mood);
    onSelectVibe?.(vibe);
  };

  return (
    <div className="-mx-1 sm:-mx-2 space-y-3">
      <AiSuggestionBanner page="vibes" />
      {onOpenSearch && <AiSearchTrigger onClick={onOpenSearch} />}
      <VibesEventsStrip events={events} />
      <ExploreCategoryBar value={category} onChange={setCategory} />

      <div className="pt-2">
        <ExploreMasonryGrid
          vibes={feedVibes}
          savedSpotIds={savedSpotIds}
          onSelect={handleSelectVibe}
          onToggleSave={toggleSaveSpot}
        />

        {feedVibes.length === 0 && (
          <p className="text-center text-white/35 py-20 text-sm">{t('vibes.noResults')}</p>
        )}
      </div>
    </div>
  );
}
