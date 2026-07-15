import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getCategoryAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';

export function HomeSpotCard({ vibe, onSelect, index = 0, size = 'default' }) {
  const { t } = useLocale();
  const accent = getCategoryAccent(vibe.category);
  const widthClass = size === 'large' ? 'w-[200px] sm:w-[220px]' : 'w-[148px] sm:w-[160px]';
  const aspectClass = size === 'large' ? 'aspect-[4/5]' : 'aspect-[3/4]';

  return (
    <motion.article
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => onSelect?.(vibe)}
      className={`shrink-0 ${widthClass} cursor-pointer group`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className={`relative ${aspectClass} rounded-[16px] overflow-hidden bg-[#111] border border-white/[0.06]`}>
        <VibeImage
          vibe={vibe}
          alt={vibe.shopName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 card-photo-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className={`text-[9px] font-semibold mb-1 ${accent.text}`}>
            {t(`categories.${vibe.category}`)}
          </p>
          <h3 className="text-[13px] font-semibold text-white leading-tight line-clamp-2 tracking-tight">
            {vibe.shopName}
          </h3>
          <p className="text-[10px] text-white/40 mt-1">{vibe.area}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function HomeSectionRow({
  title,
  subtitle,
  items = [],
  onSelect,
  onSeeMore,
  seeMoreLabel,
  cardSize = 'default',
  limit = 12,
}) {
  if (!items?.length) return null;

  return (
    <section className="space-y-3.5">
      <div className="flex items-end justify-between gap-3 px-1">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-white/40 mt-1 leading-relaxed line-clamp-2">{subtitle}</p>
          )}
        </div>
        {onSeeMore && (
          <button
            type="button"
            onClick={onSeeMore}
            className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-white/45 hover:text-white/75 transition"
          >
            {seeMoreLabel}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {items.slice(0, limit).map((vibe, i) => (
          <HomeSpotCard
            key={vibe.id}
            vibe={vibe}
            onSelect={onSelect}
            index={i}
            size={cardSize}
          />
        ))}
      </div>
    </section>
  );
}
