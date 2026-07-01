import { motion } from 'framer-motion';

export function NeonButton({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'pink',
  fullWidth = true,
  type = 'button',
}) {
  const variants = {
    pink: 'from-pink-500/90 to-fuchsia-500/85 shadow-[0_8px_32px_rgba(236,72,153,0.2)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.28)]',
    green: 'from-emerald-400/90 to-green-500/85 shadow-[0_8px_32px_rgba(52,211,153,0.2)]',
    ghost: 'from-white/[0.06] to-white/[0.03] text-white shadow-none border border-white/[0.08] hover:border-white/[0.14]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={`${fullWidth ? 'w-full' : ''} rounded-full py-4 px-6 font-semibold text-sm tracking-wide bg-gradient-to-r ${variants[variant]} ${
        variant === 'ghost' ? 'text-white' : 'text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}
