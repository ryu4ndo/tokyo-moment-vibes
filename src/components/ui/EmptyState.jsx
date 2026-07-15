import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-white/30" />
        </div>
      )}
      <p className="text-base font-semibold text-white/70">{title}</p>
      {description && <p className="text-sm text-white/35 mt-2 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
