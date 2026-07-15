import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_8px_32px_rgba(99,102,241,0.2)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.28)]',
  accent: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_8px_32px_rgba(249,115,22,0.2)]',
  pink: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_8px_32px_rgba(236,72,153,0.15)]',
  ghost: 'bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] shadow-none',
  white: 'bg-white text-black hover:bg-white/90 shadow-none',
};

export function NeonButton({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  fullWidth = true,
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`${fullWidth ? 'w-full' : ''} rounded-full py-3.5 px-6 font-semibold text-sm tracking-tight disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
    >
      {children}
    </motion.button>
  );
}
