import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getAreaLabel } from '@/data/areas';
import { useLocale } from '@/locales/LocaleContext';

function ForYouCard({ vibe, onSelect, index }) {
  const { t, locale } = useLocale();

  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(vibe)}
      className="shrink-0 w-[200px] sm:w-[220px] cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className="relative rounded-[18px] overflow-hidden border border-white/10 bg-[#0c0c10]">
        <div className="relative aspect-[4/5]">
          <VibeImage
            vibe={vibe}
            alt={vibe.shopName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-pink-500/25 border border-pink-400/30 text-[8px] font-bold text-pink-100">
            AI
          </span>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{vibe.shopName}</p>
          <p className="text-[10px] text-white/45">
            {getAreaLabel(vibe.area, locale)} · {t(`categories.${vibe.category}`)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function VibesForYou({ picks, onSelect }) {
  const { t } = useLocale();
  if (!picks?.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-pink-300" />
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t('vibes.forYou')}</h2>
          <p className="text-[11px] text-white/40">{t('vibes.forYouSub')}</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {picks.map((vibe, i) => (
          <ForYouCard key={vibe.id} vibe={vibe} onSelect={onSelect} index={i} />
        ))}
      </div>
    </section>
  );
}
