import { motion } from 'framer-motion';
import { EXPLORE_CATEGORIES, getExploreCategoryLabel } from '@/data/exploreCategories';
import { getInsightAccent } from '@/data/accentColors';
import { useLocale } from '@/locales/LocaleContext';

const CAT_ACCENT_MAP = {
  food: 'food',
  cafe: 'cafe',
  travel: 'nightview',
  date: 'date',
  nightlife: 'bar',
  events: 'bar',
  hidden: 'culture',
};

export function ExploreCategoryBar({ value, onChange }) {
  const { locale } = useLocale();

  return (
    <div className="sticky top-0 z-20 -mx-1 px-1 py-3 bg-black/90 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex flex-wrap gap-2">
        {EXPLORE_CATEGORIES.map((cat) => {
          const active = value === cat.id;
          const accent = getInsightAccent(CAT_ACCENT_MAP[cat.id] ?? 'default');
          return (
            <motion.button
              key={cat.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all ${
                active
                  ? `bg-gradient-to-r ${accent.gradient} text-white`
                  : 'bg-white/[0.04] text-white/50 hover:text-white/75 hover:bg-white/[0.07]'
              }`}
            >
              {getExploreCategoryLabel(cat, locale)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
