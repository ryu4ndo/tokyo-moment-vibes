import { motion } from 'framer-motion';
import { TRAVELER_FOODS, getTravelerFoodLabel } from '@/data/travelerFoods';
import { useLocale } from '@/locales/LocaleContext';

export function TravelerFoodChoose({ onSelect }) {
  const { t, locale } = useLocale();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-[0.25em] text-cyan-300/70 uppercase mb-2">
          {t('travelerFood.stepChoose')}
        </p>
        <h3 className="text-2xl font-bold leading-tight">{t('travelerFood.chooseTitle')}</h3>
        <p className="text-white/45 text-sm mt-2">{t('travelerFood.chooseSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRAVELER_FOODS.map((food, index) => (
          <motion.button
            key={food.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(food.id)}
            className="group relative rounded-[20px] overflow-hidden border border-white/[0.08] bg-white/[0.03] text-left hover:border-white/[0.15] transition-all"
          >
            <div className="relative aspect-[4/5]">
              <img
                src={food.image}
                alt={getTravelerFoodLabel(food, locale)}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-2xl mb-1 block">{food.icon}</span>
                <p className="font-bold text-sm leading-tight">{getTravelerFoodLabel(food, locale)}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
