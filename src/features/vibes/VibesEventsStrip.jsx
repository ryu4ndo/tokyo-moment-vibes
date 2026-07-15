import { Sparkles } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

const TYPE_LABELS = {
  ja: {
    fireworks: '花火大会',
    exhibition: '展示会',
    festival: 'お祭り',
    popup: 'ポップアップ',
    seasonal: '期間限定',
    culture: 'イベント',
  },
  en: {
    fireworks: 'Fireworks',
    exhibition: 'Exhibition',
    festival: 'Festival',
    popup: 'Pop-up',
    seasonal: 'Limited',
    culture: 'Event',
  },
};

function EventChip({ event, locale }) {
  const title = locale === 'en' ? event.titleEn : event.titleJa;
  const typeLabel = TYPE_LABELS[locale]?.[event.type] ?? event.type;

  return (
    <div className="flex-shrink-0 w-[220px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-300/80">{typeLabel}</p>
      <p className="mt-1 text-sm font-semibold text-white line-clamp-2">{title}</p>
      <p className="mt-1 text-[11px] text-white/40">{event.area}</p>
    </div>
  );
}

export function VibesEventsStrip({ events }) {
  const { locale } = useLocale();
  const today = events?.today ?? [];
  const thisWeek = events?.thisWeek ?? [];
  const limited = events?.limited ?? [];
  const chips = [...today, ...thisWeek.slice(0, 2), ...limited.slice(0, 1)];

  if (!chips.length) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
          {locale === 'en' ? 'Happening now' : 'いま開催中'}
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {chips.map((event) => (
          <EventChip key={event.id} event={event} locale={locale} />
        ))}
      </div>
    </section>
  );
}
