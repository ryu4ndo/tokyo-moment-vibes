import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Wallet } from 'lucide-react';
import {
  getTravelerFood,
  getTravelerFoodField,
  getTravelerFoodLabel,
} from '@/data/travelerFoods';
import { useLocale } from '@/locales/LocaleContext';
import { NeonButton } from '@/components/ui/NeonButton';

function InfoBlock({ label, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-[9px] font-bold tracking-[0.2em] text-pink-300/60 uppercase mb-2">{label}</p>
      <p className="text-sm text-white/65 leading-relaxed">{children}</p>
    </div>
  );
}

export function TravelerFoodIntro({ foodId, onBack, onFindSpots }) {
  const { t, locale } = useLocale();
  const food = getTravelerFood(foodId);
  if (!food) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-white/45 hover:text-white/75 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('travelerFood.backToChoose')}
      </button>

      <div className="relative rounded-[24px] overflow-hidden border border-white/[0.08]">
        <div className="relative aspect-[16/10] sm:aspect-[2/1]">
          <img
            src={food.image}
            alt={getTravelerFoodLabel(food, locale)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="text-3xl mb-2 block">{food.icon}</span>
            <h2 className="text-3xl font-bold">{getTravelerFoodLabel(food, locale)}</h2>
            <p className="flex items-center gap-1.5 text-sm text-white/55 mt-2">
              <Wallet className="w-4 h-4" />
              {getTravelerFoodField(food, 'avgPrice', locale)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-base text-white/70 leading-relaxed">
        {getTravelerFoodField(food, 'description', locale)}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock label={t('travelerFood.scene')}>
          {getTravelerFoodField(food, 'scene', locale)}
        </InfoBlock>
        <InfoBlock label={t('travelerFood.howToEat')}>
          {getTravelerFoodField(food, 'howToEat', locale)}
        </InfoBlock>
      </div>

      <InfoBlock label={t('travelerFood.foreignerTips')}>
        <span className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300/70 shrink-0 mt-0.5" />
          {getTravelerFoodField(food, 'tips', locale)}
        </span>
      </InfoBlock>

      <NeonButton onClick={onFindSpots} className="w-full">
        {t('travelerFood.findSpots')}
      </NeonButton>
    </motion.div>
  );
}
