import { getMoodLabel } from '@/data/moods';
import { getMomentLabel } from '@/data/moments';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { ExperienceSelector } from '@/components/ui/ExperienceSelector';
import { CompanionSelector } from '@/components/ui/CompanionSelector';
import { HomeHero } from './HomeHero';
import { LocationSelector } from './LocationSelector';
import { TimeSelector } from './TimeSelector';

export function AppHeader() {
  const { locale } = useLocale();
  const { mood, experienceMode, setExperienceMode, companion, setCompanion, selectedMomentId } = useAppState();

  return (
    <header className="p-5 pb-2">
      <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <HomeHero />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <LocationSelector />
          <TimeSelector />
        </div>

        <div className="mt-4 space-y-3">
          <ExperienceSelector compact value={experienceMode} onChange={setExperienceMode} />
          <CompanionSelector compact value={companion} onChange={setCompanion} />
        </div>

        <p className="text-white/30 text-xs mt-3 truncate">
          {getMomentLabel(selectedMomentId, locale)} · {getMoodLabel(mood, locale)}
        </p>
      </div>
    </header>
  );
}
