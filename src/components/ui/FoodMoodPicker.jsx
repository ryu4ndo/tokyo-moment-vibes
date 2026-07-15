import { motion } from 'framer-motion';
import { getCategoryLabel } from '@/data/modeThemes';

export function FoodMoodPicker({ moods, locale, title, subtitle, onSelect }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold tracking-[0.25em] text-pink-300/70 uppercase mb-2">
          Discover
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">{title}</h3>
        {subtitle && <p className="text-white/45 text-sm mt-2">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(mood)}
            className="group rounded-[18px] p-4 sm:p-5 text-left border border-white/10 bg-[#0c0c10] hover:border-pink-400/30 transition-colors"
          >
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform duration-300">
              {mood.icon}
            </span>
            <p className="font-semibold text-sm text-white/90">
              {getCategoryLabel(mood, locale)}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
