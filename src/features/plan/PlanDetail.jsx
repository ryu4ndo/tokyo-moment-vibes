import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Wallet } from 'lucide-react';
import { estimatePlanBudget } from '@/utils/spotUtils';
import { formatFreeTime } from '@/utils/formatters';
import { useLocale } from '@/locales/LocaleContext';
import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { NeonButton } from '@/components/ui/NeonButton';

const Map = lazy(() => import('@/features/plan/Map').then((m) => ({ default: m.Map })));

export function PlanDetail({ plan, startPoint, onClose, onGoToPlan }) {
  const { t, locale } = useLocale();
  if (!plan) return null;

  const budget = estimatePlanBudget(plan.spots);
  const duration = plan.duration ?? formatFreeTime(plan.freeTime ?? '2時間', locale);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-full p-5 pb-10 max-w-lg mx-auto">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('planDetail.back')}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[32px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          <p className="text-pink-300/70 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
            {t('planDetail.eyebrow')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{plan.title}</h2>
          <p className="text-white/45 text-sm mb-4">{plan.summary}</p>

          {plan.aiReason && (
            <div className="mb-6 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-sm text-white/75">
              {plan.aiReason}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <MapPin className="w-4 h-4 mx-auto mb-1 text-white/35" />
              <p className="text-[10px] text-white/35 mb-0.5">{t('planDetail.location')}</p>
              <p className="font-bold text-xs">{plan.location ?? plan.summary?.split(' + ')[0]}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-white/35" />
              <p className="text-[10px] text-white/35 mb-0.5">{t('planDetail.duration')}</p>
              <p className="font-bold text-xs">{duration}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Wallet className="w-4 h-4 mx-auto mb-1 text-white/35" />
              <p className="text-[10px] text-white/35 mb-0.5">{t('planDetail.budget')}</p>
              <p className="font-bold text-xs text-pink-300">{budget}</p>
            </div>
          </div>

          <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-4">
            {t('planDetail.journey')}
          </p>
          <PlanTimeline schedule={plan.schedule} spots={plan.spots} />

          {plan.spots?.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mb-3">
                {t('planDetail.routeMap')}
              </p>
              <Suspense
                fallback={
                  <div className="h-[300px] rounded-3xl bg-white/[0.03] animate-pulse" />
                }
              >
                <Map spots={plan.spots} startPoint={startPoint} />
              </Suspense>
            </div>
          )}

          <div className="mt-6">
            <NeonButton onClick={onGoToPlan}>{t('planDetail.cta')}</NeonButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
