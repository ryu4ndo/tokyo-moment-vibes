import { motion } from 'framer-motion';
import { ArrowLeft, Footprints, Sparkles, Star } from 'lucide-react';
import {
  getTravelerExperience,
  getTravelerExperienceLabel,
} from '@/data/travelerExperiences';
import { getAreaLabel } from '@/data/areas';
import { useLocale } from '@/locales/LocaleContext';
import { getSpotImage } from '@/utils/displayUtils';

export function TravelerFoodSpotList({ experienceId, foodId, spots, onBack, onSelectSpot }) {
  const { t, locale } = useLocale();
  const experience = getTravelerExperience(experienceId);
  const label = experience
    ? getTravelerExperienceLabel(experience, locale)
    : foodId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-pink-300/80 hover:text-pink-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('travelerFood.backToIntro')}
      </button>

      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-pink-300/70 uppercase mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('travelerFood.aiPicks')}
        </p>
        <h3 className="text-xl font-bold">
          {experience
            ? t('travelerFood.recommendedExperience').replace('{experience}', label)
            : t('travelerFood.recommendedTitle').replace('{food}', label)}
        </h3>
        <p className="text-[11px] text-white/40 mt-1">{t('travelerFood.aiContextNote')}</p>
      </div>

      <div className="space-y-4">
        {spots.map((spot, index) => (
          <motion.article
            key={spot.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectSpot(spot)}
            className="group cursor-pointer rounded-[20px] overflow-hidden border border-white/10 bg-[#0c0c10] hover:border-pink-400/25 transition-all flex gap-0 sm:flex-row flex-col"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectSpot(spot)}
          >
            <div className="relative sm:w-36 shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[120px]">
              <img
                src={getSpotImage(spot)}
                alt={spot.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-[15px] leading-snug">{spot.name}</h4>
                <span className="shrink-0 flex items-center gap-0.5 text-amber-200/90 text-xs font-medium">
                  <Star className="w-3 h-3 fill-amber-200/90" />
                  {spot.rating}
                </span>
              </div>
              <p className="text-[10px] text-white/40 mb-2">
                {getAreaLabel(spot.area, locale)} · {spot.budget}
                <span className="inline-flex items-center gap-0.5 ml-2">
                  <Footprints className="w-3 h-3" />
                  {spot.walkMinutes}{t('common.minWalk')}
                </span>
              </p>
              <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">
                <span className="text-pink-200/50 font-semibold text-[9px] uppercase tracking-wider mr-1">
                  {t('vibes.whyAiPicked')}
                </span>
                {spot.aiReason}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
