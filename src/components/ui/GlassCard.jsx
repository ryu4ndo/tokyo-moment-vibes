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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`rounded-[20px] border border-white/[0.06] bg-[#111111] ${className}`}
    >
      {children}
    </Component>
  );
}
