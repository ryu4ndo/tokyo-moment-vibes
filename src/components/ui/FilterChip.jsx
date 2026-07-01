export function FilterChip({ label, value, options, onChange, icon: Icon }) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl px-4 py-3 text-sm appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#101014]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
