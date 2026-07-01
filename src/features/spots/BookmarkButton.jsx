import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

export function BookmarkButton({ saved, onToggle }) {
  const { t } = useLocale();
  const [showSaved, setShowSaved] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!saved) {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1200);
    }
    onToggle?.();
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
        className={`shrink-0 p-2 rounded-full backdrop-blur-md border transition ${
          saved
            ? 'bg-pink-500/50 border-pink-400/50 text-pink-100 shadow-[0_0_16px_rgba(236,72,153,0.5)]'
            : 'bg-black/50 border-white/10 text-white/80 hover:text-white'
        }`}
        aria-label={t('vibes.save')}
      >
        <motion.div
          key={saved ? 'saved' : 'unsaved'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-pink-400 text-pink-400' : ''}`} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showSaved && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute -bottom-7 right-0 px-2 py-0.5 rounded-full bg-pink-500 text-[10px] font-bold text-white whitespace-nowrap shadow-[0_0_12px_rgba(236,72,153,0.6)]"
          >
            {t('common.saved')} ❤️
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** @deprecated Use BookmarkButton */
export { BookmarkButton as VibeSaveButton };
