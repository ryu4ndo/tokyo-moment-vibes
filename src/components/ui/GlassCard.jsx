import { motion } from 'framer-motion';

export function GlassCard({
  children,
  className = '',
  as = 'div',
  onClick,
  delay = 0,
  hover = false,
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      type={as === 'button' ? 'button' : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`rounded-[28px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl shadow-premium ${className}`}
    >
      {children}
    </Component>
  );
}
