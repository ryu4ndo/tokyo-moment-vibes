import { motion } from 'framer-motion';
import { getFoodCategoryLabel } from '@/data/foodCategories';

export function FoodCategoryScroll({ categories, selectedId, locale, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <motion.button
            key={cat.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(cat)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-colors ${
              active
                ? 'bg-white text-black border-white'
                : 'bg-[#111116] border-white/10 text-white/60 hover:text-white/85 hover:border-white/20'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{getFoodCategoryLabel(cat, locale)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
