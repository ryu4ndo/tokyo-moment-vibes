import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import {
  getTravelerExperience,
  getTravelerExperienceDescription,
  getTravelerExperienceLabel,
} from '@/data/travelerExperiences';
import { useLocale } from '@/locales/LocaleContext';
import { NeonButton } from '@/components/ui/NeonButton';

export function TravelerExperienceIntro({ experienceId, onBack, onFindSpots }) {
  const { t, locale } = useLocale();
  const experience = getTravelerExperience(experienceId);
  if (!experience) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="space-y-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-pink-300/80 hover:text-pink-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('travelerFood.backToChoose')}
      </button>

      <div className="rounded-[20px] border border-white/10 bg-[#0c0c10] p-6">
        <span className="text-4xl mb-4 block">{experience.icon}</span>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">
          {getTravelerExperienceLabel(experience, locale)}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed">
          {getTravelerExperienceDescription(experience, locale)}
        </p>
      </div>

      <div className="rounded-[18px] border border-pink-400/20 bg-pink-500/10 p-4 flex gap-3">
        <Sparkles className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
        <p className="text-sm text-white/70 leading-relaxed">{t('travelerFood.experienceAiNote')}</p>
      </div>

      <NeonButton onClick={onFindSpots}>{t('travelerFood.findSpots')}</NeonButton>
    </motion.div>
  );
}
