import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useAiProfile } from '@/contexts/AiProfileContext';
import { useConcierge } from '@/contexts/ConciergeContext';
import { useLocale } from '@/locales/LocaleContext';

export function AiSuggestionBanner({ page }) {
  const { t } = useLocale();
  const { getSuggestion } = useAiProfile();
  const { openConcierge } = useConcierge();
  const message = getSuggestion(page);

  return (
    <motion.button
      type="button"
      onClick={() => openConcierge(message)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full text-left rounded-[20px] gradient-border-ai p-5 hover:opacity-95 transition group"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-caption mb-1.5">{t('aiProfile.suggestionLabel')}</p>
          <p className="text-sm text-white/70 leading-relaxed">{message}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-white/25 shrink-0 mt-1 group-hover:text-white/50 transition" />
      </div>
    </motion.button>
  );
}
