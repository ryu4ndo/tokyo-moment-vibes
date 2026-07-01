import { getReservationLinks } from '@/services/reservationService';
import { useLocale } from '@/locales/LocaleContext';

export function ReserveLinks({ spot, placeInfo, experienceMode, onSelect }) {
  const { locale, t } = useLocale();

  const links =
    placeInfo?.reservationLinks ??
    getReservationLinks(
      { name: spot?.shopName ?? spot?.name, area: spot?.area, category: spot?.category },
      { experienceMode, locale }
    );

  if (!links.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold tracking-wider text-white/35 uppercase">
        {t('vibes.reserveOptions')}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {links.slice(0, 4).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(link)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium hover:bg-white/[0.08] transition"
          >
            <span>{link.icon ?? '🔗'}</span>
            <span className="truncate">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
