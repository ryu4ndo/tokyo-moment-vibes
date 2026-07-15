import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOCAL_FOOD_CATEGORIES, getFoodCategoryById, getFoodCategoryLabel } from '@/data/foodCategories';
import { getAreaLabel, getSpotAreaForLocation } from '@/data/areas';
import { getFoodSpots } from '@/utils/spotUtils';
import { useLocale } from '@/locales/LocaleContext';
import { FoodCategoryScroll } from '@/features/food/FoodCategoryScroll';
import { SpotCard } from '@/features/spots/SpotCard';
import { useAppState } from '@/contexts/AppStateContext';
import { applyProfileBoost } from '@/features/aiProfile/applyProfileBoost';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { AiSuggestionBanner } from '@/components/ui/AiSuggestionBanner';

function matchCategory(spot, category) {
  const keywords = category.keywords ?? [];
  const haystack = `${spot.name} ${spot.description ?? ''} ${spot.category ?? ''} ${spot.genreLabel ?? ''}`.toLowerCase();
  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export function LocalFoodPage({ initialMoodId, onInitialMoodConsumed }) {
  const { t, locale } = useLocale();
  const { location, savedSpotIds, toggleSaveSpot } = useAppState();
  const { profile } = useAiProfile();
  const [selectedId, setSelectedId] = useState(LOCAL_FOOD_CATEGORIES[0]?.id ?? null);

  useEffect(() => {
    if (!initialMoodId) return;
    const cat = getFoodCategoryById(initialMoodId);
    if (cat) setSelectedId(cat.id);
    onInitialMoodConsumed?.();
  }, [initialMoodId, onInitialMoodConsumed]);

  const selectedCategory = useMemo(
    () => getFoodCategoryById(selectedId),
    [selectedId]
  );

  const results = useMemo(() => {
    if (!selectedCategory) return [];
    const area = getSpotAreaForLocation(location);
    const matched = getFoodSpots().filter((spot) => matchCategory(spot, selectedCategory));
    const local = matched.filter((spot) => spot.area === area || spot.area === location);
    const ranked = (local.length >= 3 ? local : matched)
      .map((spot) => ({
        spot,
        score: applyProfileBoost(spot.rating ?? 4, spot, profile),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ spot }) => spot);
    return ranked.slice(0, 12);
  }, [selectedCategory, location, profile]);

  return (
    <div className="space-y-6">
      <AiSuggestionBanner page="food" />

      <div className="rounded-[24px] border border-white/10 bg-[#0c0c10] p-6 sm:p-8">
        <p className="text-pink-300/70 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
          {t('food.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">{t('food.localMoodTitle')}</h2>
        <p className="text-white/45 text-sm">{t('food.localMoodSubtitle')}</p>
      </div>

      <section className="space-y-4">
        <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/60 uppercase px-1">
          {t('food.categories')}
        </p>
        <FoodCategoryScroll
          categories={LOCAL_FOOD_CATEGORIES}
          selectedId={selectedId}
          locale={locale}
          onSelect={(cat) => setSelectedId(cat.id)}
        />
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-5"
        >
          {selectedCategory && (
            <div className="flex items-center gap-3 px-1">
              <span className="text-3xl">{selectedCategory.icon}</span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/60 uppercase">
                  {t('food.aiPicksFor')}
                </p>
                <h3 className="text-xl font-bold">
                  {getFoodCategoryLabel(selectedCategory, locale)}
                </h3>
              </div>
            </div>
          )}

          <p className="text-white/35 text-sm px-1">
            {results.length} {t('food.spotCount')}
          </p>

          <div className="space-y-5">
            {results.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={{ ...spot, area: getAreaLabel(spot.area, locale) }}
                saved={savedSpotIds.includes(spot.id)}
                onToggleSave={toggleSaveSpot}
                delay={Math.min(index * 0.04, 0.4)}
                experienceMode="local"
              />
            ))}
            {results.length === 0 && (
              <p className="text-white/40 text-sm text-center py-8">{t('vibes.noResults')}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
