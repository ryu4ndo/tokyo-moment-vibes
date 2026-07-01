import { Timer } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';
import { getFreeTimeOptions } from '@/utils/formatters';

const selectClass =
  'rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl px-3 py-2.5 text-sm';

export function TimeSelector() {
  const { locale, t } = useLocale();
  const { freeTime, setFreeTime } = useAppState();
  const freeTimeOptions = getFreeTimeOptions(locale);

  return (
    <div>
      <label className="text-[9px] text-white/30 uppercase tracking-wider mb-1 block">
        {t('brand.availableTime')}
      </label>
      <div className="relative">
        <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        <select
          value={freeTime}
          onChange={(e) => setFreeTime(e.target.value)}
          className={`${selectClass} w-full pl-9`}
        >
          {freeTimeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
