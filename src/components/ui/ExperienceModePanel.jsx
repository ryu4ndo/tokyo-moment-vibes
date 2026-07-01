import { motion } from 'framer-motion';
import { LOCAL_PRIORITIES, TRAVELER_EXPERIENCES, TRAVELER_MOODS } from '@/data/experienceModes';
import { useLocale } from '@/locales/LocaleContext';
import { useAppState } from '@/contexts/AppStateContext';

export function TravelerExperiencePanel() {
  const { t, locale } = useLocale();
  const { travelerExperience, setTravelerExperience, travelerMood, setTravelerMood, setMood } =
    useAppState();

  return (
    <div className="space-y-5">
      <section>
        <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300/70 uppercase mb-3">
          {t('vibes.travelerExperienceTitle')}
        </p>
        <div className="flex flex-wrap gap-2">
          {TRAVELER_EXPERIENCES.map((exp) => {
            const active = travelerExperience === exp.id;
            const label = locale === 'en' ? exp.labelEn : exp.labelJa;
            return (
              <motion.button
                key={exp.id}
                type="button"
                onClick={() => setTravelerExperience(active ? null : exp.id)}
                whileTap={{ scale: 0.96 }}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border-cyan-400/40 text-white'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/55 hover:text-white/80'
                }`}
              >
                {exp.icon} {label}
              </motion.button>
            );
          })}
        </div>
      </section>

      {travelerExperience && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/70 uppercase mb-3">
            {t('vibes.travelerMoodTitle')}
          </p>
          <div className="flex flex-wrap gap-2">
            {TRAVELER_MOODS.map((m) => {
              const active = travelerMood === m.id;
              const label = locale === 'en' ? m.labelEn : m.labelJa;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setTravelerMood(active ? null : m.id);
                    if (!active && m.moodKey) setMood(m.moodKey);
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition ${
                    active
                      ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400/40 text-white'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/55'
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}

export function LocalPriorityPanel() {
  const { t, locale } = useLocale();
  const { localPriority, setLocalPriority } = useAppState();

  return (
    <section>
      <p className="text-[10px] font-bold tracking-[0.2em] text-purple-300/70 uppercase mb-3">
        {t('vibes.localPriorityTitle')}
      </p>
      <div className="flex flex-wrap gap-2">
        {LOCAL_PRIORITIES.map((pri) => {
          const active = localPriority === pri.id;
          const label = locale === 'en' ? pri.labelEn : pri.labelJa;
          return (
            <motion.button
              key={pri.id}
              type="button"
              onClick={() => setLocalPriority(active ? null : pri.id)}
              whileTap={{ scale: 0.96 }}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-xl transition ${
                active
                  ? 'bg-white/15 border-white/25 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/70'
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
