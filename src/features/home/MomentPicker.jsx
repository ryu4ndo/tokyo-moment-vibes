import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MOMENTS, getMomentLabel } from '@/data/moments';
import { useLocale } from '@/locales/LocaleContext';

export function MomentPicker({ selectedMomentId, onSelect, surpriseReveal }) {
  const { t, locale } = useLocale();

  return (
    <section className="space-y-3">
      <div>
        <p className="text-[10px] font-bold tracking-[0.25em] text-pink-300/70 uppercase mb-1">
          {t('home.momentEyebrow')}
        </p>
        <h3 className="text-lg font-semibold leading-snug">{t('home.momentTitle')}</h3>
      </div>

      {surpriseReveal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-400/30"
        >
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span className="text-sm text-white/80">
            {t('home.surpriseReveal')}: <strong className="text-pink-200">{surpriseReveal}</strong>
          </span>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {MOMENTS.map((moment, index) => {
          const active = selectedMomentId === moment.id;
          const label = locale === 'en' ? moment.labelEn : moment.labelJa;
          return (
            <motion.button
              key={moment.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(moment.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-pink-500/35 to-purple-500/35 border-pink-400/45 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/55 hover:text-white/85 hover:border-white/15'
              }`}
            >
              {moment.icon} {label}
            </motion.button>
          );
        })}
      </div>

      {selectedMomentId && (
        <p className="text-[11px] text-white/40 px-1">
          {t('home.selectedMoment')}: {getMomentLabel(selectedMomentId, locale)}
        </p>
      )}
    </section>
  );
}
