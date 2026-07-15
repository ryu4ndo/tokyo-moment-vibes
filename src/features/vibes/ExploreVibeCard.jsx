import { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Play } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getAreaLabel } from '@/data/areas';
import { getCategoryAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';
import { isSponsoredSpot } from '@/platform/services/businessService';
import { SponsoredBadge } from '@/platform/components/SponsoredBadge';

const SIZE_CLASS = {
  large: 'aspect-[2/3]',
  medium: 'aspect-[3/4]',
  small: 'aspect-square',
  wide: 'aspect-[5/4]',
  video: 'aspect-[3/5]',
};

export const ExploreVibeCard = memo(function ExploreVibeCard({
  vibe,
  saved = false,
  onSelect,
  onToggleSave,
  delay = 0,
  variant = 'minimal',
}) {
  const { t, locale } = useLocale();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const aspectClass = vibe.cardAspect ?? SIZE_CLASS[vibe.cardSize] ?? SIZE_CLASS.medium;
  const mediaType =
    vibe.mediaType ?? (vibe.isVideo ? 'video' : vibe.photoCount > 3 ? 'carousel' : 'photo');
  const accent = getCategoryAccent(vibe.category);
  const isMinimal = variant === 'minimal';
  const sponsored = isSponsoredSpot(vibe.spotId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => {
        setHovering(true);
        if (mediaType === 'video') videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovering(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      onClick={() => onSelect?.(vibe)}
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(vibe)}
    >
      <div className={`relative w-full ${aspectClass} rounded-[16px] overflow-hidden bg-[#111]`}>
        {mediaType === 'video' && hovering && vibe.videoUrl ? (
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
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        <div className="absolute inset-0 card-photo-overlay" />

        {mediaType === 'video' && (
          <span className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="w-3 h-3 fill-white text-white" />
          </span>
        )}

        {sponsored && (
          <span className="absolute bottom-12 left-3 z-10">
            <SponsoredBadge locale={locale} />
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(vibe.spotId);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition ${
            saved
              ? `bg-gradient-to-r ${accent.gradient} text-white`
              : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100'
          }`}
          aria-label={t('vibes.save')}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 tracking-tight">
            {vibe.shopName}
          </h3>
        </div>
      </div>

      {isMinimal && (
        <p className="mt-2 px-0.5 text-[11px] text-white/40 tracking-wide">
          {getAreaLabel(vibe.area, locale)}
          <span className="mx-1.5 text-white/20">·</span>
          <span className={accent.text}>{t(`categories.${vibe.category}`)}</span>
        </p>
      )}

      {!isMinimal && (
        <div className="mt-2 px-0.5">
          <h3 className="font-semibold text-[14px] text-white leading-snug line-clamp-2">
            {vibe.shopName}
          </h3>
          <p className="text-[11px] text-white/40 mt-1">
            {getAreaLabel(vibe.area, locale)} · {t(`categories.${vibe.category}`)}
          </p>
        </div>
      )}
    </motion.article>
  );
});
