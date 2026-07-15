import { useMemo, useState } from 'react';
import { FolderPlus, Heart, Map, Sparkles, Trash2 } from 'lucide-react';
import { ENRICHED_VIBES } from '@/data/vibes';
import { getFoodSpots } from '@/utils/spotUtils';
import { localizeVibe } from '@/features/vibes/localizeVibe';
import { buildPlanFromSaved } from '@/features/saved/planFromSaved';
import { useLocale } from '@/locales/LocaleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { VibeCard } from '@/features/vibes/VibeCard';
import { SpotCard } from '@/features/spots/SpotCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { NeonButton } from '@/components/ui/NeonButton';
import { SavedFolderMenu } from '@/features/saved/SavedFolderMenu';
import { useAppState } from '@/contexts/AppStateContext';
import { useAiProfile } from '@/contexts/AiProfileContext';

const SMART_COLLECTIONS = [
  { id: 'night', labelJa: 'Tokyo Night', labelEn: 'Tokyo Night', match: (v) => ['bar', 'nightview', 'music', 'rooftop'].includes(v.category) },
  { id: 'hidden', labelJa: 'Hidden Bars', labelEn: 'Hidden Bars', match: (v) => v.category === 'bar' || v.experienceModes?.includes('hidden') },
  { id: 'date', labelJa: 'Date', labelEn: 'Date', match: (v) => ['rooftop', 'wine', 'nightview'].includes(v.category) || v.suitableFor?.includes('date') },
  { id: 'cafe', labelJa: 'Cafe', labelEn: 'Cafe', match: (v) => ['cafe', 'chill'].includes(v.category) },
];

export function SavedPage({ onSelectVibe, onGoToPlan }) {
  const { t, locale } = useLocale();
  const {
    experienceMode,
    companion,
    location,
    freeTime,
    savedSpotIds,
    savedPlans,
    savedFolders,
    createFolder,
    deleteFolder,
    addSpotToFolder,
    removeSpotFromFolder,
    toggleSaveSpot,
    removeSavedPlan,
  } = useAppState();
  const { profile } = useAiProfile();
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const savedVibes = useMemo(
    () =>
      ENRICHED_VIBES.filter((v) => savedSpotIds.includes(v.spotId)).map((v) =>
        localizeVibe(v, { locale, experienceMode }),
      ),
    [savedSpotIds, locale, experienceMode],
  );

  const savedFood = useMemo(
    () => getFoodSpots().filter((s) => savedSpotIds.includes(s.id)),
    [savedSpotIds],
  );

  const smartCollections = useMemo(
    () =>
      SMART_COLLECTIONS.map((col) => ({
        ...col,
        label: locale === 'en' ? col.labelEn : col.labelJa,
        items: savedVibes.filter(col.match),
      })).filter((col) => col.items.length > 0),
    [savedVibes, locale],
  );

  const userFolders = useMemo(
    () =>
      savedFolders.map((folder) => ({
        ...folder,
        items: folder.spotIds
          .map((id) => savedVibes.find((v) => v.spotId === id))
          .filter(Boolean),
      })).filter((f) => f.items.length > 0 || savedFolders.length <= 3),
    [savedFolders, savedVibes],
  );

  const uncategorized = useMemo(() => {
    const inFolder = new Set(savedFolders.flatMap((f) => f.spotIds));
    const inSmart = new Set(smartCollections.flatMap((c) => c.items.map((v) => v.id)));
    return savedVibes.filter((v) => !inFolder.has(v.spotId) && !inSmart.has(v.id));
  }, [savedVibes, savedFolders, smartCollections]);

  const handleCreatePlan = () => {
    const plan = buildPlanFromSaved({
      savedSpotIds,
      location,
      profile,
      locale,
      freeTime,
      companion,
      experienceMode,
    });
    if (plan) onGoToPlan?.(plan);
  };

  const handleAddFolder = () => {
    if (createFolder(newFolderName)) {
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const renderVibeCard = (vibe, index) => (
    <div key={vibe.id} className="relative">
      <VibeCard
        vibe={vibe}
        saved
        onSelect={onSelectVibe}
        onToggleSave={toggleSaveSpot}
        delay={index * 0.04}
        experienceMode={experienceMode}
      />
      <SavedFolderMenu
        spotId={vibe.spotId}
        folders={savedFolders}
        onAdd={addSpotToFolder}
        onRemove={removeSpotFromFolder}
      />
    </div>
  );

  const isEmpty = savedSpotIds.length === 0 && savedPlans.length === 0;

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

        {savedSpotIds.length >= 2 && (
          <NeonButton variant="primary" onClick={handleCreatePlan} className="mt-5 w-full sm:w-auto">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('saved.createAiPlan')}
            </span>
          </NeonButton>
        )}
      </GlassCard>

      {savedPlans.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-semibold px-1 text-white/80 flex items-center gap-2">
            <Map className="w-4 h-4 text-purple-300" />
            {t('saved.savedPlans')}
          </h3>
          <div className="space-y-2">
            {savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-2 rounded-[16px] border border-white/[0.06] bg-[#111] p-4"
              >
                <button
                  type="button"
                  onClick={() => onGoToPlan?.(plan)}
                  className="flex-1 text-left hover:opacity-90 transition"
                >
                  <p className="font-semibold text-white text-sm">{plan.title}</p>
                  <p className="text-xs text-white/40 mt-1 line-clamp-1">{plan.summary}</p>
                </button>
                <button
                  type="button"
                  onClick={() => removeSavedPlan(plan.id)}
                  className="p-2 rounded-full text-white/30 hover:text-red-300/80 transition"
                  aria-label={t('saved.deletePlan')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-semibold text-white/80">{t('saved.myFolders')}</h3>
          <button
            type="button"
            onClick={() => setShowNewFolder((v) => !v)}
            className="flex items-center gap-1 text-xs text-purple-300/80 hover:text-purple-300 transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            {t('saved.newFolder')}
          </button>
        </div>
        {showNewFolder && (
          <div className="flex gap-2">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={t('saved.folderName')}
              className="flex-1 rounded-[14px] bg-white/[0.05] border border-white/[0.08] px-4 py-2.5 text-sm text-white"
            />
            <NeonButton variant="primary" onClick={handleAddFolder}>
              {t('saved.add')}
            </NeonButton>
          </div>
        )}
        {userFolders.map((folder) => (
          <section key={folder.id}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-sm font-semibold text-white/70">{folder.name}</h4>
              <button
                type="button"
                onClick={() => deleteFolder(folder.id)}
                className="text-[10px] text-white/25 hover:text-red-300/70"
              >
                {t('saved.deleteFolder')}
              </button>
            </div>
            {folder.items.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {folder.items.map((vibe, index) => renderVibeCard(vibe, index))}
              </div>
            ) : (
              <p className="text-xs text-white/25 px-1">{t('saved.emptyFolder')}</p>
            )}
          </section>
        ))}
      </section>

      {smartCollections.map((col) => (
        <section key={col.id}>
          <h3 className="text-base font-semibold mb-4 px-1 text-white/80">{col.label}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {col.items.map((vibe, index) => renderVibeCard(vibe, index))}
          </div>
        </section>
      ))}

      {uncategorized.length > 0 && (
        <section>
          <h3 className="text-base font-semibold mb-4 px-1 text-white/80">{t('saved.vibes')}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {uncategorized.map((vibe, index) => renderVibeCard(vibe, index))}
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

      {isEmpty && (
        <EmptyState
          icon={Heart}
          title={t('saved.empty')}
          description={t('saved.emptyDesc')}
        />
      )}
    </div>
  );
}
