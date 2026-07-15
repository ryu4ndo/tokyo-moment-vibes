import { motion } from 'framer-motion';
import { TRAVELER_EXPERIENCES, getTravelerExperienceLabel } from '@/data/travelerExperiences';
import { useLocale } from '@/locales/LocaleContext';

export function TravelerExperienceChoose({ onSelect }) {
  const { t, locale } = useLocale();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-[0.25em] text-pink-300/70 uppercase mb-2">
          {t('travelerFood.stepChoose')}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
          {t('travelerFood.experienceChooseTitle')}
        </h3>
        <p className="text-white/45 text-sm mt-2">{t('travelerFood.experienceChooseSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRAVELER_EXPERIENCES.map((exp, index) => (
          <motion.button
            key={exp.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.35 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(exp.id)}
            className="group text-left rounded-[18px] border border-white/10 bg-[#0c0c10] p-4 hover:border-pink-400/30 transition-colors"
          >
            <span className="text-2xl mb-2 block">{exp.icon}</span>
            <p className="font-semibold text-sm leading-snug text-white/90">
              {getTravelerExperienceLabel(exp, locale)}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
