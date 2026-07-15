import { motion } from 'framer-motion';
import { Footprints, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';
import { getAreaLabel } from '@/data/areas';

export function FoodRankingCard({ spot, rank, onSelect, delay = 0 }) {
  const { t, locale } = useLocale();

  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      onClick={() => onSelect?.(spot)}
      className="shrink-0 w-[260px] sm:w-[280px] cursor-pointer rounded-[20px] overflow-hidden border border-white/10 bg-[#0c0c10] hover:border-pink-400/25 transition-all group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(spot)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.image ?? `https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80&auto=format&fit=crop`}
          alt={spot.dish ?? spot.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {rank != null && (
          <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-pink-500/90 flex items-center justify-center text-sm font-bold shadow-lg">
            {rank}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-semibold text-[15px] leading-tight line-clamp-1">{spot.dish ?? spot.name}</p>
          <p className="text-[10px] text-white/50 mt-0.5">{getAreaLabel(spot.area, locale)}</p>
        </div>
      </div>

      <div className="p-3.5 space-y-2">
        <div className="flex items-center gap-3 text-[10px] text-white/55">
          <span className="flex items-center gap-0.5 text-amber-200/90 font-medium">
            <Star className="w-3 h-3 fill-amber-200/90" />
            {spot.rating}
          </span>
          <span className="flex items-center gap-0.5">
            <Footprints className="w-3 h-3" />
            {spot.walkMinutes}{t('common.minWalk')}
          </span>
          <span>{spot.budget}</span>
          <span className="flex items-center gap-0.5 ml-auto">
            <TrendingUp className="w-3 h-3 text-pink-300/70" />
            {spot.popularity}%
          </span>
        </div>

        <div className="pt-2 border-t border-white/[0.06]">
          <p className="text-[8px] font-bold tracking-[0.15em] text-pink-200/45 uppercase mb-1 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {t('vibes.whyAiPicked')}
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">{spot.aiReason}</p>
        </div>
      </div>
    </motion.article>
  );
}
