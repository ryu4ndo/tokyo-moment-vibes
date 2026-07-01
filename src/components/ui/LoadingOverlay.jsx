import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLocale } from '@/locales/LocaleContext';

export function LoadingOverlay({ message }) {
  const { t } = useLocale();
  const displayMessage = message ?? t('loading.ai');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-xl"
    >
      <div className="text-center px-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-6 w-16 h-16 rounded-full border border-pink-500/30 flex items-center justify-center bg-white/[0.04]"
        >
          <Sparkles className="w-7 h-7 text-pink-300" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80 font-medium"
        >
          {displayMessage}
        </motion.p>
        <p className="text-white/30 text-sm mt-2">{t('brand.name')}</p>
      </div>
    </motion.div>
  );
}
