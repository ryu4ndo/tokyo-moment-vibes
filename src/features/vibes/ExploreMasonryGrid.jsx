import { AnimatePresence, motion } from 'framer-motion';
import { ExploreVibeCard } from '@/features/vibes/ExploreVibeCard';

export function ExploreMasonryGrid({ vibes, savedSpotIds, onSelect, onToggleSave }) {
  if (!vibes?.length) return null;

  return (
    <motion.div layout className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 w-full">
      <AnimatePresence mode="popLayout">
        {vibes.map((vibe, index) => (
          <motion.div
            key={vibe.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.15) }}
            className="break-inside-avoid mb-3 sm:mb-4"
          >
            <ExploreVibeCard
              vibe={vibe}
              variant="minimal"
              saved={savedSpotIds.includes(vibe.spotId)}
              onSelect={onSelect}
              onToggleSave={onToggleSave}
              delay={Math.min(index * 0.02, 0.12)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
