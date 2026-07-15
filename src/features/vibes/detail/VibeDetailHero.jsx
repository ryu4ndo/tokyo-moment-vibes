import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function VibeDetailHero({ media, slideIndex, onSlideChange, loadingPlace, loadingLabel }) {
  const videoRef = useRef(null);
  const current = media[slideIndex];

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] max-h-[78vh] bg-[#0a0a0a] overflow-hidden">
      <AnimatePresence mode="wait">
        {current?.type === 'video' ? (
          <motion.video
            key="video"
            ref={videoRef}
            src={current.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.img
            key={current?.src ?? 'fallback'}
            src={current?.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none" />

      {current?.type === 'video' && (
        <span className="absolute bottom-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-md">
          <Play className="w-4 h-4 fill-white text-white" />
        </span>
      )}

      {loadingPlace && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] text-white/60">
          {loadingLabel}
        </div>
      )}

      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {media.map((item, i) => (
            <button
              key={item.src ?? `slide-${i}`}
              type="button"
              onClick={() => onSlideChange(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === slideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
