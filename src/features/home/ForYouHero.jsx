import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HomeSpotCard } from '@/features/home/HomeSectionRow';
import { useLocale } from '@/locales/LocaleContext';

export function ForYouHero({ message, picks, onSelect }) {
  const { t } = useLocale();

  if (!picks?.length) return null;

  return (
    <section className="space-y-5 -mx-1">
      <div className="px-1">
        <p className="text-caption text-purple-300/70 mb-1.5">{t('home.forYouEyebrow')}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-white">{t('home.forYouTitle')}</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] gradient-border-ai p-5 mx-1"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <p className="text-sm text-white/75 leading-relaxed font-light">{message}</p>
        </div>
      </motion.div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide px-1">
        {picks.map((vibe, i) => (
          <HomeSpotCard key={vibe.id} vibe={vibe} onSelect={onSelect} index={i} size="large" />
        ))}
      </div>
    </section>
  );
}
