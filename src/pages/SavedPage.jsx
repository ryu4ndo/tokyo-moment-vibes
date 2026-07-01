import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { ENRICHED_VIBES } from '@/data/vibes';
import { getFoodSpots } from '@/utils/spotUtils';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibeCard } from '@/features/vibes/VibeCard';
import { SpotCard } from '@/features/spots/SpotCard';
import { useAppState } from '@/contexts/AppStateContext';

const COLLECTIONS = [
  { id: 'night', labelJa: 'Tokyo Night', labelEn: 'Tokyo Night', match: (v) => ['bar', 'nightview', 'music', 'rooftop'].includes(v.category) },
  { id: 'hidden', labelJa: 'Hidden Bars', labelEn: 'Hidden Bars', match: (v) => v.category === 'bar' || v.experienceModes?.includes('hidden') },
  { id: 'date', labelJa: 'Date', labelEn: 'Date', match: (v) => ['rooftop', 'wine', 'nightview'].includes(v.category) || v.suitableFor?.includes('date') },
  { id: 'cafe', labelJa: 'Cafe', labelEn: 'Cafe', match: (v) => ['cafe', 'chill'].includes(v.category) },
];

export function SavedPage({ onSelectVibe }) {
  const { t, locale } = useLocale();
  const { experienceMode, savedSpotIds, toggleSaveSpot } = useAppState();

  const savedVibes = useMemo(
    () =>
      ENRICHED_VIBES.filter((v) => savedSpotIds.includes(v.spotId)).map((v) =>
        localizeVibe(v, { locale, experienceMode })
      ),
    [savedSpotIds, locale, experienceMode]
  );

  const savedFood = useMemo(
    () => getFoodSpots().filter((s) => savedSpotIds.includes(s.id)),
    [savedSpotIds]
  );

  const collections = useMemo(
    () =>
      COLLECTIONS.map((col) => ({
        ...col,
        label: locale === 'en' ? col.labelEn : col.labelJa,
        items: savedVibes.filter(col.match),
      })).filter((col) => col.items.length > 0),
    [savedVibes, locale]
  );

  const uncategorized = useMemo(() => {
    const inCollection = new Set(collections.flatMap((c) => c.items.map((v) => v.id)));
    return savedVibes.filter((v) => !inCollection.has(v.id));
  }, [savedVibes, collections]);

  return (
    <div className="space-y-10">
      <GlassCard className="p-6 sm:p-8" delay={0}>
        <p className="text-white/30 text-[10px] font-medium tracking-[0.35em] uppercase mb-3">
          {t('saved.eyebrow')}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">{t('saved.collections')}</h2>
        <p className="text-white/40 text-sm leading-relaxed">{t('saved.subtitle')}</p>
        <p className="text-white/30 text-xs mt-4 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-pink-400/80 fill-pink-400/80" />
          {savedSpotIds.length} {t('saved.count')}
        </p>
      </GlassCard>

      {collections.map((col) => (
        <section key={col.id}>
          <h3 className="text-base font-semibold mb-4 px-1 text-white/80">{col.label}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {col.items.map((vibe, index) => (
              <VibeCard
                key={vibe.id}
                vibe={vibe}
                saved
                onSelect={onSelectVibe}
                onToggleSave={toggleSaveSpot}
                delay={index * 0.04}
                experienceMode={experienceMode}
              />
            ))}
          </div>
        </section>
      ))}

      {uncategorized.length > 0 && (
        <section>
          <h3 className="text-base font-semibold mb-4 px-1 text-white/80">{t('saved.vibes')}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {uncategorized.map((vibe, index) => (
              <VibeCard
                key={vibe.id}
                vibe={vibe}
                saved
                onSelect={onSelectVibe}
                onToggleSave={toggleSaveSpot}
                delay={index * 0.04}
                experienceMode={experienceMode}
              />
            ))}
          </div>
        </section>
      )}

      {savedFood.length > 0 && (
        <section>
          <h3 className="text-base font-semibold mb-4 px-1 text-white/80">{t('saved.food')}</h3>
          <div className="space-y-5">
            {savedFood.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                saved
                onToggleSave={toggleSaveSpot}
                delay={index * 0.04}
                experienceMode={experienceMode}
              />
            ))}
          </div>
        </section>
      )}

      {savedSpotIds.length === 0 && (
        <p className="text-center text-white/30 py-20 text-sm leading-relaxed">{t('saved.empty')}</p>
      )}
    </div>
  );
}
