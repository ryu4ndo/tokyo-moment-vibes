import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Clock, Footprints, MapPin, Star } from 'lucide-react';
import { getSpotImage, getWalkMinutes } from '@/utils/displayUtils';

function WalkConnector({ minutes }) {
  return (
    <div className="flex flex-col items-center py-1">
      <ChevronDown className="w-4 h-4 text-white/20" />
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/40 font-medium">
        <Footprints className="w-3 h-3" />
        徒歩{minutes}分
      </div>
      <ChevronDown className="w-4 h-4 text-white/20" />
    </div>
  );
}

function TimelineSpotCard({ spot, time }) {
  if (!spot) {
    return (
      <div className="ml-8 rounded-[24px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-5 py-4">
        <p className="text-pink-300 font-bold text-sm mb-1">{time}</p>
        <p className="font-semibold text-white/90">次の目的地へ</p>
      </div>
    );
  }

  return (
    <div className="ml-8 rounded-[24px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden">
      <div className="relative h-32">
        <img src={getSpotImage(spot)} alt={spot.name} loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-pink-300 font-bold text-sm">{time}</p>
          <p className="font-bold text-lg">{spot.name}</p>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {spot.area}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {spot.duration ?? 60}分
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-300" />
          おすすめ
        </span>
      </div>
    </div>
  );
}

export const PlanTimeline = memo(function PlanTimeline({ schedule = [], spots = [] }) {
  let spotIndex = 0;

  return (
    <div className="relative pl-2">
      {schedule.map((item, index) => {
        const isStart = index === 0;
        const isEnd = index === schedule.length - 1;
        const matchedSpot = !isStart && !isEnd ? spots[spotIndex++] : null;
        const prevSpot = spotIndex > 0 ? spots[spotIndex - 2] : null;
        const walkMin =
          matchedSpot && prevSpot ? getWalkMinutes(prevSpot, matchedSpot) : null;

        return (
          <motion.div
            key={`${item.time}-${item.activity}-${index}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            {index > 0 && walkMin && <WalkConnector minutes={walkMin} />}

            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.6)]" />
                {index < schedule.length - 1 && (
                  <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-pink-400/40 to-white/10 my-1" />
                )}
              </div>

              <div className="flex-1 pb-2">
                {isStart || isEnd ? (
                  <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-5 py-4">
                    <p className="text-pink-300 font-bold text-sm mb-1">{item.time}</p>
                    <p className="font-semibold">{item.activity}</p>
                  </div>
                ) : (
                  <TimelineSpotCard spot={matchedSpot} time={item.time} />
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
