import { MapPin, Navigation } from 'lucide-react';
import { getAreaOptions } from '@/data/areas';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

const selectClass =
  'rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl px-3 py-2.5 text-sm';

export function LocationSelector() {
  const { t, locale } = useLocale();
  const { location, setLocation, useCurrentLocation, isLocating, locationError } = useAppState();
  const areaOptions = getAreaOptions(locale);

  return (
    <div>
      <label className="text-[9px] text-white/30 uppercase tracking-wider mb-1 block">
        {t('brand.location')}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`${selectClass} w-full pl-9`}
        >
          {areaOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={isLocating}
        className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-medium text-white/55 hover:text-white/80 hover:border-white/15 transition disabled:opacity-50"
      >
        <Navigation className={`w-3 h-3 ${isLocating ? 'animate-pulse' : ''}`} />
        {isLocating ? t('location.detecting') : t('location.useCurrent')}
      </button>
      {locationError && (
        <p className="mt-1 text-[10px] text-amber-300/80">{t('location.error')}</p>
      )}
    </div>
  );
}
