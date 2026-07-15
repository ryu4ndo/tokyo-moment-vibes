import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, MapPin, Share2, Star } from 'lucide-react';
import { getCategoryAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';

export function ConciergeSpotCard({
  recommendation,
  saved,
  onOpen,
  onToggleSave,
  onOpenMaps,
  onShare,
  index = 0,
}) {
  const { t } = useLocale();
  const accent = getCategoryAccent(recommendation.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#111]"
    >
      <button type="button" onClick={() => onOpen?.(recommendation)} className="w-full text-left">
        <div className="relative aspect-[5/4]">
          <img
            src={recommendation.image}
            alt={recommendation.shopName}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 card-photo-overlay" />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}>
              {t(`categories.${recommendation.category}`)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">
              {recommendation.shopName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-white/55">
              <MapPin className="w-3 h-3" />
              <span>{recommendation.area}</span>
              <span className="text-white/25">·</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{recommendation.rating}</span>
              {recommendation.priceRange && (
                <>
                  <span className="text-white/25">·</span>
                  <span>{recommendation.priceRange}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </button>

      {recommendation.reason && (
        <p className="px-4 pt-3 text-sm text-white/55 leading-relaxed">{recommendation.reason}</p>
      )}

      <div className="flex gap-2 p-4 pt-3">
        <button
          type="button"
          onClick={() => onToggleSave?.(recommendation.spotId)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold transition ${
            saved
              ? `bg-gradient-to-r ${accent.gradient} text-white`
              : 'bg-white/[0.05] text-white/60 hover:text-white/85'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
          {saved ? t('concierge.saved') : t('concierge.save')}
        </button>
        <button
          type="button"
          onClick={() => onOpenMaps?.(recommendation)}
          className="flex items-center justify-center p-2.5 rounded-full bg-white/[0.05] text-white/60 hover:text-white/85 transition"
          aria-label={t('concierge.openMaps')}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onShare?.(recommendation)}
          className="flex items-center justify-center p-2.5 rounded-full bg-white/[0.05] text-white/60 hover:text-white/85 transition"
          aria-label={t('concierge.share')}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}
