import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { VibeImage } from '@/components/ui/VibeImage';
import { getCategoryFlowLabel } from '@/features/vibes/vibeDetailHelpers';
import { useLocale } from '@/locales/LocaleContext';

export function VibeJourneyBar({ suggestions, onSelect }) {
  const { t, locale } = useLocale();
  if (!suggestions?.length) return null;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[90] px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none"
    >
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="rounded-2xl border border-white/10 bg-[#111116]/95 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-3.5 pb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            <p className="text-[11px] font-semibold tracking-wide text-white/80">
              {t('vibes.afterHere')}
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3.5 scrollbar-hide">
            {suggestions.map(({ vibe, toCategory }, index) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => onSelect?.(vibe)}
                className="shrink-0 flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition text-left"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <VibeImage vibe={vibe} className="w-full h-full object-cover" alt={vibe.shopName} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pink-300/80 font-medium">
                    {getCategoryFlowLabel(toCategory, locale)}
                  </p>
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">{vibe.shopName}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
