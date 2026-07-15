import { Footprints, RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { VibeImage } from '@/components/ui/VibeImage';
import { getCategoryFlowLabel } from '@/features/vibes/vibeDetailHelpers';
import { useLocale } from '@/locales/LocaleContext';

function WalkLeg({ minutes, locale }) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 self-center">
      <div className="w-px h-3 bg-gradient-to-b from-white/20 to-white/5" />
      <div className="flex flex-col items-center gap-0.5 py-1">
        <Footprints className="w-3 h-3 text-white/30" />
        <span className="text-[10px] font-semibold text-white/50 whitespace-nowrap">
          {locale === 'en' ? `${minutes} min` : `徒歩${minutes}分`}
        </span>
      </div>
      <div className="w-px h-3 bg-gradient-to-b from-white/5 to-white/20" />
    </div>
  );
}

function JourneyStopCard({
  stop,
  index,
  locale,
  onSelect,
  onRemove,
  onMove,
  onSwap,
  canEdit,
}) {
  const { vibe, aiReason, isStart } = stop;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="shrink-0 w-[148px] sm:w-[160px]"
    >
      <button
        type="button"
        onClick={() => onSelect?.(vibe)}
        className="w-full text-left group"
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111116] mb-2.5 ring-1 ring-white/[0.08] group-hover:ring-white/20 transition">
          <VibeImage
            vibe={vibe}
            alt={vibe.shopName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {isStart && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[9px] font-bold text-black uppercase tracking-wide">
              START
            </span>
          )}
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[9px] font-semibold text-pink-200/80 uppercase tracking-wider mb-0.5">
              {getCategoryFlowLabel(vibe.category, locale)}
            </p>
            <p className="text-sm font-semibold text-white leading-tight line-clamp-2">
              {vibe.shopName}
            </p>
          </div>
        </div>
      </button>

      <p className="text-[11px] text-white/45 leading-snug line-clamp-2 min-h-[2rem] mb-2 px-0.5">
        {aiReason}
      </p>

      {canEdit && !isStart && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove?.(index, 'left')}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 transition"
            aria-label="Move earlier"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove?.(index, 'right')}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 transition"
            aria-label="Move later"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSwap?.(index)}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 transition"
            aria-label="Swap spot"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove?.(index)}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-rose-300 transition ml-auto"
            aria-label="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function AiJourneyTimeline({
  journey,
  onSelectVibe,
  onRemoveStop,
  onMoveStop,
  onSwapStop,
}) {
  const { locale } = useLocale();
  if (!journey?.stops?.length) return null;

  return (
    <div className="relative -mx-1">
      <div className="absolute top-[74px] left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none hidden sm:block" />
      <div className="flex items-start gap-0 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {journey.stops.map((stop, index) => (
          <div key={`${stop.vibe.id}-${index}`} className="flex items-start">
            <JourneyStopCard
              stop={stop}
              index={index}
              locale={locale}
              onSelect={onSelectVibe}
              onRemove={onRemoveStop}
              onMove={onMoveStop}
              onSwap={onSwapStop}
              canEdit
            />
            {index < journey.legs.length && (
              <WalkLeg minutes={journey.legs[index].walkMinutes} locale={locale} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
