import { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Play, Sparkles, Star } from 'lucide-react';
import { BookmarkButton } from '@/features/spots/BookmarkButton';
import { getVibeComment } from '@/features/vibes/vibeFilters';
import { VibeImage } from '@/components/ui/VibeImage';
import { useLocale } from '@/locales/LocaleContext';

export const VibeFeaturedCard = memo(function VibeFeaturedCard({
  vibe,
  saved,
  onSelect,
  onToggleSave,
  experienceMode = 'local',
  companion = 'solo',
}) {
  const { t, locale } = useLocale();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const displayComment = getVibeComment(vibe, { experienceMode, companion, locale });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => {
        setHovering(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovering(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      onClick={() => onSelect?.(vibe)}
      className="group relative cursor-pointer rounded-[24px] overflow-hidden border border-white/[0.08] shadow-premium hover:border-pink-400/20 transition-all duration-500"
    >
      <div className="relative aspect-[21/9] sm:aspect-[2.2/1] min-h-[220px] sm:min-h-[260px]">
        {vibe.isVideo && hovering ? (
          <video
            ref={videoRef}
            src={vibe.videoUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <VibeImage
            vibe={vibe}
            alt={vibe.shopName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 vibe-gradient-overlay" />

        <div className="absolute top-5 left-5 flex gap-2">
          <span className="px-3 py-1.5 rounded-full glass-panel text-[10px] font-bold tracking-wider text-pink-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {t('vibes.todayPick')}
          </span>
          {vibe.isVideo && (
            <span className="px-2.5 py-1.5 rounded-full glass-panel text-[10px] font-semibold flex items-center gap-1 text-white/75">
              <Play className="w-3 h-3 fill-white/75" />
              {vibe.videoDuration ?? 15}{locale === 'ja' ? '秒' : ' sec'}
            </span>
          )}
        </div>

        <div className="absolute top-5 right-5">
          <BookmarkButton saved={saved} onToggle={() => onToggleSave?.(vibe.spotId)} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p className="text-white/40 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">
            {vibe.vibeName} · {vibe.area}
          </p>
          <h3 className="text-2xl sm:text-[2rem] font-semibold tracking-tight mb-3 leading-tight">
            {vibe.shopName}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 mb-4">
            <span className="flex items-center gap-1 text-amber-200/90 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-200/90" />
              {vibe.rating}
            </span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" />
              {vibe.walkMinutes} {t('common.minWalk')}
            </span>
            <span className={vibe.isOpen ? 'text-emerald-300/90' : 'text-white/35'}>
              {vibe.isOpen ? t('common.open') : t('common.closed')}
            </span>
          </div>

          <div className="max-w-xl">
            <p className="text-[9px] font-bold tracking-[0.18em] text-pink-200/45 uppercase mb-1.5">
              {t('vibes.whyAiPicked')}
            </p>
            <p className="text-sm text-white/55 leading-relaxed">&ldquo;{displayComment}&rdquo;</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
});
