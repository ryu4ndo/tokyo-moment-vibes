import { motion } from 'framer-motion';
import { EXPERIENCE_MODES } from '@/data/vibeKeywords';
import { useLocale } from '@/locales/LocaleContext';

export function ExperienceSelector({ value, onChange, compact = false }) {
  const { t } = useLocale();

  const modes = EXPERIENCE_MODES.map((mode) => ({
    ...mode,
    title: mode.id === 'local' ? t('vibes.localMode') : t('vibes.travelerMode'),
    shortTitle: mode.id === 'local' ? t('vibes.localModeShort') : t('vibes.travelerModeShort'),
    description: mode.id === 'local' ? t('vibes.localDesc') : t('vibes.travelerDesc'),
  }));

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-[9px] font-bold tracking-[0.2em] text-pink-300/70 uppercase">
          {t('vibes.experienceTitle')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((mode) => {
            const active = value === mode.id;
            return (
              <motion.button
                key={mode.id}
                type="button"
                onClick={() => onChange(mode.id)}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl border px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-pink-400/40 bg-pink-500/10'
                    : 'border-white/10 bg-[#111116] hover:border-white/20'
                }`}
              >
                <span className="text-sm font-bold block">{mode.icon} {mode.shortTitle}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <p className="text-[10px] font-bold tracking-[0.25em] text-pink-300/80 uppercase mb-3">
        {t('vibes.experienceTitle')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {modes.map((mode) => {
          const active = value === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left rounded-[24px] border p-5 transition-all duration-300 ${
                active
                  ? 'border-pink-400/40 bg-pink-500/10'
                  : 'border-white/10 bg-[#111116] hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? 'border-pink-400' : 'border-white/25'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="experience-dot"
                          className="w-1.5 h-1.5 rounded-full bg-pink-400"
                        />
                      )}
                    </span>
                    <p className="font-bold text-sm sm:text-base">{mode.title}</p>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">{mode.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/** @deprecated Use ExperienceSelector */
export { ExperienceSelector as ExperienceModeSelector };
