import { motion } from 'framer-motion';
import { COMPANIONS } from '@/data/companions';
import { useLocale } from '@/locales/LocaleContext';

export function CompanionSelector({ value, onChange, compact = false }) {
  const { t } = useLocale();

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-[9px] font-bold tracking-[0.2em] text-white/35 uppercase">
          {t('vibes.companionTitle')}
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {COMPANIONS.map((item) => {
            const active = value === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                whileTap={{ scale: 0.96 }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold border backdrop-blur-xl ${
                  active
                    ? 'bg-cyan-600/20 border-cyan-400/40 text-white'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{t(`companions.${item.id}`)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-3">
        {t('vibes.companionTitle')}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {COMPANIONS.map((item) => {
          const active = value === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border backdrop-blur-xl transition ${
                active
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 border-cyan-400/40 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/55 hover:text-white/80'
              }`}
            >
              <span>{item.icon}</span>
              <span>{t(`companions.${item.id}`)}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
