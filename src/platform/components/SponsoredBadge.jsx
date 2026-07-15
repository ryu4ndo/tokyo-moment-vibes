/** Sponsored / ad label — always visible distinction from organic content */
export function SponsoredBadge({ locale = 'ja', className = '' }) {
  const label = locale === 'en' ? 'Sponsored' : 'スポンサー';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-200/90 border border-amber-500/25 ${className}`}
    >
      {label}
    </span>
  );
}
