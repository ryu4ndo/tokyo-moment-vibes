import { useMemo, useState } from 'react';
import { MapPin, Search, Utensils, Wallet } from 'lucide-react';
import { getAreaOptions, getAreaLabel, getSpotAreaForLocation } from '@/data/areas';
import { getFoodRankingSections } from '@/data/foodRankings';
import { FOOD_CATEGORIES } from '@/data/experienceModes';
import { filterFoodSpots, getGenreLabel } from '@/utils/spotUtils';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { FilterChip } from '@/components/ui/FilterChip';
import { SpotCard } from '@/features/spots/SpotCard';
import { FoodRankingCard } from '@/features/food/FoodRankingCard';
import { useAppState } from '@/contexts/AppStateContext';

const GENRES = ['all', 'food', 'wine', 'cafe', 'nightlife'];
const BUDGETS = ['all', '¥', '¥¥', '¥¥¥'];

function RankingSection({ title, spots, t }) {
  if (!spots?.length) return null;
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold text-white/70 px-1">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {spots.map((spot, index) => (
          <FoodRankingCard
            key={`${title}-${spot.id}`}
            spot={spot}
            rank={title.includes('TOP') ? index + 1 : undefined}
            delay={index * 0.04}
          />
        ))}
      </div>
    </section>
  );
}

/** Local Mode — search by restaurant, rankings, filters */
export function LocalFoodPage() {
  const { t, locale } = useLocale();
  const { savedSpotIds, toggleSaveSpot } = useAppState();
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('all');
  const [genre, setGenre] = useState('all');
  const [budget, setBudget] = useState('all');
  const [foodCategory, setFoodCategory] = useState('all');

  const rankings = useMemo(() => getFoodRankingSections(locale), [locale]);
  const areaOptions = getAreaOptions(locale);

  const results = useMemo(() => {
    const filterArea = area === 'all' ? 'all' : getSpotAreaForLocation(area);
    return filterFoodSpots({ search, area: filterArea, genre, budget, foodCategory });
  }, [search, area, genre, budget, foodCategory]);

  return (
    <div className="space-y-8">
      <GlassCard className="p-6 sm:p-8" delay={0}>
        <p className="text-cyan-300/80 text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
          {t('food.eyebrow')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t('food.localTitle')}</h2>
        <p className="text-white/45 text-sm">{t('food.localSubtitle')}</p>
      </GlassCard>

      <section className="space-y-6">
        <h2 className="text-xl font-bold px-1">{t('food.rankingTitle')}</h2>
        <RankingSection title={t('food.top10')} spots={rankings.top10} t={t} />
        <RankingSection title={t('food.top20')} spots={rankings.top20} t={t} />
        <RankingSection title={t('food.todayPicks')} spots={rankings.todayPicks} t={t} />
        <RankingSection title={t('food.hiddenGems')} spots={rankings.hiddenGems} t={t} />
        <RankingSection title={t('food.michelin')} spots={rankings.michelin} t={t} />
        <RankingSection title={t('food.bestValue')} spots={rankings.bestValue} t={t} />
        <RankingSection title={t('food.localFavorites')} spots={rankings.localFavorites} t={t} />
        <RankingSection title={t('food.lateNight')} spots={rankings.lateNight} t={t} />
      </section>

      <section>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-3 px-1">
          {t('food.categories')}
        </p>
        <div className="flex flex-wrap gap-2">
          {FOOD_CATEGORIES.map((cat) => {
            const active = foodCategory === cat.id;
            const label = locale === 'en' ? cat.labelEn : cat.labelJa;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFoodCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                  active
                    ? 'bg-white/15 border-white/25 text-white'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('food.searchPlaceholder')}
          className="w-full rounded-[24px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl pl-14 pr-5 py-5 text-base text-white placeholder:text-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        <FilterChip
          label={t('food.area')}
          value={area}
          onChange={setArea}
          icon={MapPin}
          options={[
            { value: 'all', label: t('food.allAreas') },
            ...areaOptions.map((a) => ({ value: a.value, label: a.label })),
          ]}
        />
        <FilterChip
          label={t('food.genre')}
          value={genre}
          onChange={setGenre}
          icon={Utensils}
          options={[
            { value: 'all', label: t('food.allGenres') },
            ...GENRES.filter((g) => g !== 'all').map((g) => ({
              value: g,
              label: getGenreLabel(g, locale),
            })),
          ]}
        />
        <FilterChip
          label={t('food.budget')}
          value={budget}
          onChange={setBudget}
          icon={Wallet}
          options={[
            { value: 'all', label: t('food.allBudgets') },
            ...BUDGETS.filter((b) => b !== 'all').map((b) => ({ value: b, label: b })),
          ]}
        />
      </div>

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
      </div>
    </div>
  );
}
