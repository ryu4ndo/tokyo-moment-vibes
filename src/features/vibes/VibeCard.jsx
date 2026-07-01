import { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Images, Play, Sparkles, Star } from 'lucide-react';
import { BookmarkButton } from '@/features/spots/BookmarkButton';
import { getVibeComment } from '@/features/vibes/vibeFilters';
import { VibeImage } from '@/components/ui/VibeImage';
import { useLocale } from '@/locales/LocaleContext';

const SIZE_CLASS = {
  video: 'aspect-[3/4]',
  large: 'aspect-[4/5]',
  tall: 'aspect-[2/3]',
  normal: 'aspect-[3/4]',
  compact: 'aspect-[3/4]',
};

export const VibeCard = memo(function VibeCard({
  vibe,
  saved = false,
  onSelect,
  onToggleSave,
  delay = 0,
  experienceMode = 'local',
  companion = 'solo',
}) {
  const { t, locale } = useLocale();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const aspectClass = vibe.cardAspect ?? SIZE_CLASS[vibe.cardSize] ?? SIZE_CLASS.normal;
  const displayComment = getVibeComment(vibe, { experienceMode, companion, locale });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => {
        setHovering(true);
        if (vibe.isVideo) videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovering(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      onClick={() => onSelect?.(vibe)}
      className="group relative cursor-pointer rounded-[20px] overflow-hidden border border-white/[0.06] shadow-premium hover:border-white/[0.12] transition-all duration-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className={`relative w-full ${aspectClass}`}>
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
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        )}

        <div className="absolute inset-0 vibe-gradient-overlay" />

        {/* Top badges — minimal */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <div className="flex flex-wrap gap-1.5">
            {(vibe.aiPick || vibe.isPopular) && (
              <span className="px-2 py-0.5 rounded-full glass-panel text-[8px] font-bold tracking-wider text-pink-200/90 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI PICK
              </span>
            )}
          </div>
          <BookmarkButton saved={saved} onToggle={() => onToggleSave?.(vibe.spotId)} />
        </div>

        {/* Video / photo count — bottom right */}
        <div className="absolute bottom-[38%] right-3 z-10">
          {vibe.isVideo ? (
            <span className="px-2 py-1 rounded-lg glass-panel text-[9px] font-semibold flex items-center gap-1 text-white/80">
              <Play className="w-2.5 h-2.5 fill-white/80" />
              {vibe.videoDuration ?? 15} sec
            </span>
          ) : (
            <span className="px-2 py-1 rounded-lg glass-panel text-[9px] font-semibold flex items-center gap-1 text-white/60">
              <Images className="w-2.5 h-2.5" />
              {vibe.photoCount ?? 1}
            </span>
          )}
        </div>

        {/* Bottom text — gradient zone only */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-semibold text-[15px] leading-snug mb-2 line-clamp-2 tracking-tight">
            {vibe.shopName}
          </h3>

          <div className="flex items-center gap-3 text-[10px] text-white/65 mb-3">
            <span className="flex items-center gap-0.5 font-medium text-amber-200/90">
              <Star className="w-3 h-3 fill-amber-200/90 text-amber-200/90" />
              {vibe.rating}
            </span>
            <span className="flex items-center gap-0.5">
              <Footprints className="w-3 h-3" />
              {vibe.walkMinutes}{t('common.minWalk')}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-medium ${
                vibe.isOpen ? 'text-emerald-300/90' : 'text-white/35'
              }`}
            >
              {vibe.isOpen ? t('common.open') : t('common.closed')}
            </span>
          </div>

          <div className="pt-2.5 border-t border-white/[0.08]">
            <p className="text-[8px] font-bold tracking-[0.18em] text-pink-200/50 uppercase mb-1">
              {t('vibes.whyAiPicked')}
            </p>
            <p className="text-[11px] text-white/55 leading-relaxed line-clamp-2">
              {displayComment}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
});
