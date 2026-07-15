export function PortalShell({ title, subtitle, nav, children, onLogout, locale = 'ja' }) {
  const isEn = locale === 'en';
  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white flex">
      <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-[#111] p-4 flex flex-col hidden md:flex">
        <div className="mb-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-purple-300/70 uppercase">Tokyo Moment</p>
          <h1 className="text-lg font-semibold mt-1">{title}</h1>
          {subtitle && <p className="text-xs text-white/35 mt-1">{subtitle}</p>}
        </div>
        <nav className="flex-1 space-y-1">{nav}</nav>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 text-xs text-white/40 hover:text-white/70 transition text-left px-3 py-2"
        >
          {isEn ? 'Log out' : 'ログアウト'}
        </button>
        <a href="/" className="text-[10px] text-purple-300/60 hover:text-purple-300 mt-2 px-3">
          {isEn ? '← Consumer app' : '← ユーザーアプリへ'}
        </a>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="md:hidden border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <h1 className="text-sm font-semibold">{title}</h1>
          <a href="/" className="text-xs text-purple-300">App</a>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-[16px] border border-white/[0.06] bg-[#111] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">{label}</p>
      <p className="text-2xl font-semibold mt-1 text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

export function PortalNavLink({ to, children, active, onClick }) {
  return (
    <a
      href={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-xl text-sm transition ${
        active ? 'bg-purple-500/15 text-purple-200' : 'text-white/55 hover:text-white/85 hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </a>
  );
}

export function PortalInput({ label, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs text-white/45">{label}</span>}
      <input
        {...props}
        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-purple-500/40"
      />
    </label>
  );
}

export function PortalTextarea({ label, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs text-white/45">{label}</span>}
      <textarea
        {...props}
        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-purple-500/40 resize-none"
      />
    </label>
  );
}

export function PortalButton({ children, variant = 'primary', ...props }) {
  const cls =
    variant === 'ghost'
      ? 'bg-white/[0.05] text-white/70 hover:bg-white/[0.08]'
      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white';
  return (
    <button
      type="button"
      {...props}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-40 ${cls}`}
    >
      {children}
    </button>
  );
}

export function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-[16px] border border-white/[0.06]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-white/40">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-white/75">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
