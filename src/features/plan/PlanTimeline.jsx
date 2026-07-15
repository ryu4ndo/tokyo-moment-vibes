import { memo } from 'react';
import { motion } from 'framer-motion';
import { Footprints } from 'lucide-react';
import { getSpotImage, getWalkMinutes } from '@/utils/displayUtils';
import { getCategoryAccent } from '@/data/accentColors';

function WalkConnector({ minutes, index }) {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-px h-6 bg-gradient-to-b from-white/10 to-white/5" />
      <div className="flex items-center gap-2 my-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
        <Footprints className="w-3.5 h-3.5 text-white/35" />
        <span className="text-xs font-medium text-white/50">徒歩 {minutes} 分</span>
      </div>
      <div className="w-px h-6 bg-gradient-to-b from-white/5 to-white/10" />
    </div>
  );
}

function TimelineSpotCard({ spot, time, index }) {
  if (!spot) {
    return (
      <div className="rounded-[20px] border border-white/[0.06] bg-[#111] px-5 py-5">
        <p className="text-xs font-medium text-white/40 mb-1">{time}</p>
        <p className="font-semibold text-white">次の目的地へ</p>
      </div>
    );
  }

  const accent = getCategoryAccent(spot.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#111]"
    >
      <div className="relative h-44">
        <img
          src={getSpotImage(spot)}
          alt={spot.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 card-photo-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[11px] font-medium text-white/50 mb-1">{time}</p>
          <p className="text-lg font-semibold text-white tracking-tight">{spot.name}</p>
          <p className={`text-[11px] mt-1 ${accent.text}`}>{spot.area}</p>
        </div>
      </div>
    </motion.div>
  );
}

export const PlanTimeline = memo(function PlanTimeline({ schedule = [], spots = [] }) {
  let spotIndex = 0;

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      {schedule.map((item, index) => {
        const isStart = index === 0;
        const isEnd = index === schedule.length - 1;
        const matchedSpot = !isStart && !isEnd ? spots[spotIndex++] : null;
        const prevSpot = spotIndex > 0 ? spots[spotIndex - 2] : null;
        const walkMin =
          matchedSpot && prevSpot ? getWalkMinutes(prevSpot, matchedSpot) : null;

        return (
          <div key={`${item.time}-${item.activity}-${index}`} className="w-full">
            {index > 0 && walkMin && <WalkConnector minutes={walkMin} index={index} />}

            {isStart || isEnd ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[20px] border border-white/[0.06] bg-[#111] px-5 py-5 text-center"
              >
                <p className="text-xs font-medium text-white/40 mb-1">{item.time}</p>
                <p className="font-semibold text-white text-sm">{item.activity}</p>
              </motion.div>
            ) : (
              <TimelineSpotCard spot={matchedSpot} time={item.time} index={index} />
            )}
          </div>
        );
      })}
    </div>
  );
});
