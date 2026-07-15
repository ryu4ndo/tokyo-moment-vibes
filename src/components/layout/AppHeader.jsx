import { Bell } from 'lucide-react';
import { getMoodLabel } from '@/data/moods';
import { getMomentLabel } from '@/data/moments';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ExperienceSelector } from '@/components/ui/ExperienceSelector';
import { CompanionSelector } from '@/components/ui/CompanionSelector';
import { HomeHero } from './HomeHero';
import { LocationSelector } from './LocationSelector';
import { TimeSelector } from './TimeSelector';
import { AiSearchTrigger } from '@/features/search/AiSearchTrigger';

export function AppHeader({ onOpenProfile, onOpenSearch, onOpenNotifications }) {
  const { t, locale } = useLocale();
  const { mood, experienceMode, setExperienceMode, companion, setCompanion, selectedMomentId } = useAppState();
  const { avatarUrl, displayName } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <header className="px-5 pt-5 pb-3">
      <div className="rounded-[20px] border border-white/[0.06] bg-[#111] p-5">
        <div className="flex items-start justify-between gap-3">
          <HomeHero />
          {onOpenProfile && (
            <div className="shrink-0 flex items-center gap-1.5">
              {onOpenNotifications && (
                <button
                  type="button"
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition"
                  aria-label={t('notifications.title')}
                >
                  <Bell className="w-4 h-4 text-white/55" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition"
              >
                <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-[10px] font-semibold text-white/60 max-w-[72px] truncate hidden sm:block">
                  {displayName}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <LocationSelector />
          <TimeSelector />
        </div>

        {onOpenSearch && (
          <div className="mt-4">
            <AiSearchTrigger onClick={onOpenSearch} />
          </div>
        )}

        <div className="mt-4 space-y-3">
          <ExperienceSelector compact value={experienceMode} onChange={setExperienceMode} />
          <CompanionSelector compact value={companion} onChange={setCompanion} />
        </div>

        <p className="text-white/30 text-xs mt-4 truncate">
          {getMomentLabel(selectedMomentId, locale)} · {getMoodLabel(mood, locale)}
        </p>
      </div>
    </header>
  );
}
