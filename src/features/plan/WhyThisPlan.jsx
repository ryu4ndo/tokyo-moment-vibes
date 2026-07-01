import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { formatFreeTime } from '@/utils/formatters';
import { getMoodLabel } from '@/data/moods';
import { getWhyPlanSummary } from '@/utils/displayUtils';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

export function WhyThisPlan() {
  const { t, locale } = useLocale();
  const { location, freeTime, mood, experienceMode, companion } = useAppState();

  const summary = getWhyPlanSummary({
    location,
    freeTime,
    mood,
    experienceMode,
    companion,
    locale,
  });

  return (
    <div className="rounded-[20px] glass-panel p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-pink-300/70" />
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase">
          {t('home.whyThisPlan')}
        </p>
      </div>

      <p className="text-xs text-white/35 leading-relaxed">{t('home.whyBecause')}</p>

      <div className="flex flex-wrap gap-2">
        {summary.factors.map((factor) => (
          <span
            key={factor}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-white/70"
          >
            {factor}
          </span>
        ))}
      </div>

      <p className="text-sm text-white/55 leading-relaxed border-t border-white/[0.06] pt-4">
        {summary.explanation}
      </p>
    </div>
  );
}
