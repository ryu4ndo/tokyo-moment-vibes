import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Footprints, MapPin, Sparkles, Star, Wallet } from 'lucide-react';
import { getPlanHeroImage, getTotalWalkMinutes } from '@/utils/displayUtils';
import { useLocale } from '@/locales/LocaleContext';

export const RecommendedPlanCard = memo(function RecommendedPlanCard({
  plan,
  location,
  freeTime,
  mood,
  onSelect,
  delay = 0,
  variant = 'local',
}) {
  const { t, locale } = useLocale();
  const heroImage = getPlanHeroImage(plan);
  const walkTotal = getTotalWalkMinutes(plan.spots);
  const reason = plan.reason ?? '';

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(plan)}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="shrink-0 w-[300px] sm:w-[340px] text-left rounded-[28px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-pink-500/30 hover:shadow-[0_12px_48px_rgba(236,72,153,0.15)] transition-shadow"
    >
      <div className="relative h-44">
        <img src={heroImage} alt={plan.title} loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {variant === 'ai' && (
            <span className="px-2.5 py-1 rounded-full bg-pink-500/30 backdrop-blur border border-pink-500/30 text-[10px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10px] font-bold">
            {plan.budget ?? '¥¥'}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-pink-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{plan.title}</p>
          <h3 className="text-lg font-bold leading-tight line-clamp-2">{plan.summary}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{reason}</p>

        <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          4.{((plan.id?.length ?? 5) % 9) + 1}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-2.5 py-2">
            <p className="text-[9px] text-white/35 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {t('home.location')}
            </p>
            <p className="text-xs font-bold mt-0.5 truncate">{location}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-2.5 py-2">
            <p className="text-[9px] text-white/35 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {t('home.duration')}
            </p>
            <p className="text-xs font-bold mt-0.5">{freeTime}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] px-2.5 py-2">
            <p className="text-[9px] text-white/35 uppercase tracking-wider flex items-center gap-1">
              <Footprints className="w-2.5 h-2.5" />
              {t('home.walk')}
            </p>
            <p className="text-xs font-bold mt-0.5">
              {walkTotal || 15}{locale === 'en' ? ' min' : '分'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-white/30 font-medium">
          <span className="flex items-center gap-1">
            <Wallet className="w-3 h-3" />
            {plan.budget ?? '¥¥'}
          </span>
          <span>{t('home.tapDetail')}</span>
        </div>
      </div>
    </motion.button>
  );
});
