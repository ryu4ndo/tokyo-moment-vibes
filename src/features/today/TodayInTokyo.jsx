import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sparkles, Sun } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getCategoryAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';
import { useData } from '@/contexts/DataContext';

function TodayCard({ item, onSelect, index }) {
  const { locale } = useLocale();
  const accent = getCategoryAccent(item.accent === 'ai' ? 'ai' : item.vibe?.category ?? item.accent);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect?.(item.vibe)}
      className="shrink-0 w-[152px] sm:w-[168px] cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(item.vibe)}
    >
      <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden bg-[#111] border border-white/[0.06]">
        <VibeImage
          vibe={item.vibe}
          alt={item.vibe.shopName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 card-photo-overlay" />

        <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1">
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}
          >
            {item.label}
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-yellow-500/15 text-yellow-200 border border-yellow-500/25">
              {item.badge}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-[13px] font-semibold text-white leading-tight line-clamp-2 tracking-tight">
            {item.vibe.shopName}
          </h3>
          <p className="text-[10px] text-white/45 mt-1">{item.vibe.area}</p>
        </div>
      </div>

      {item.event && (
        <p className="mt-1.5 px-0.5 text-[10px] text-white/35 line-clamp-1">
          {locale === 'en' ? item.event.nameEn : item.event.nameJa}
        </p>
      )}
    </motion.article>
  );
}

export function TodayInTokyo({ feed, onSelect }) {
  const { t, locale } = useLocale();
  const { weather, loading } = useData();

  if (!feed?.items?.length) return null;

  const WeatherIcon = weather?.condition === 'rain' ? CloudRain : weather?.condition === 'clear' ? Sun : Cloud;

  return (
    <section className="space-y-5 -mx-1">
      <div className="px-1 flex items-start justify-between gap-3">
        <div>
          <p className="text-caption text-purple-300/70 mb-1.5">{feed.dateLabel}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white">{feed.title}</h2>
        </div>
        {weather && !loading && (
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/55">
            <WeatherIcon className="w-3.5 h-3.5 text-purple-300" />
            <span>{t(`weather.${weather.condition}`)}</span>
            {weather.temperatureC != null && <span>{weather.temperatureC}°</span>}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] gradient-border-ai p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <p className="text-sm text-white/75 leading-relaxed font-light">{feed.aiComment}</p>
        </div>
      </motion.div>

      {feed.events?.length > 0 && (
        <div className="px-1 flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {feed.events.map((event) => (
            <span
              key={event.id}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            >
              {locale === 'en' ? event.nameEn : event.nameJa}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide px-1">
        {feed.items.map((item, i) => (
          <TodayCard key={item.id} item={item} onSelect={onSelect} index={i} />
        ))}
      </div>

      <p className="px-1 text-[10px] text-white/25">{t('home.todayRefreshNote')}</p>
    </section>
  );
}
