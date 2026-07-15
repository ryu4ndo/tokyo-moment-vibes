import { motion } from 'framer-motion';
import { Clock, MapPin, Sparkles, Star } from 'lucide-react';
import { getCategoryAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';
import { isSponsoredSpot } from '@/platform/services/businessService';
import { SponsoredBadge } from '@/platform/components/SponsoredBadge';

export function AiSearchResultCard({ result, onSelect, index = 0 }) {
  const { t, locale } = useLocale();
  const accent = getCategoryAccent(result.category);
  const sponsored = isSponsoredSpot(result.spotId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[24px] overflow-hidden border border-white/[0.06] bg-[#111] hover:border-white/[0.12] transition"
    >
      <button type="button" onClick={() => onSelect?.(result.vibe)} className="w-full text-left">
        <div className="relative aspect-[16/10]">
          <img
            src={result.image}
            alt={result.shopName}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 card-photo-overlay" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}
            >
              {t(`categories.${result.category}`)}
            </span>
            {sponsored && <SponsoredBadge locale={locale} />}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">
              {result.shopName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs text-white/60">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {result.area}
              </span>
              {result.walkMinutes != null && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.walkMinutes}
                  {t('common.minWalk')}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {result.rating}
              </span>
              {result.priceRange && <span>{result.priceRange}</span>}
            </div>
          </div>
        </div>
      </button>

      <div className="px-4 py-3.5 border-t border-white/[0.04]">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-300 shrink-0 mt-0.5" />
          <p className="text-sm text-white/55 leading-relaxed">{result.reason}</p>
        </div>
      </div>
    </motion.article>
  );
}
