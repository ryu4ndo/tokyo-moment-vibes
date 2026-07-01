export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#0d0d0d] to-[#101014]" />
      <div className="absolute -top-24 left-[10%] w-[420px] h-[420px] rounded-full bg-purple-600/12 blur-[120px]" />
      <div className="absolute top-[20%] right-[-5%] w-[360px] h-[360px] rounded-full bg-pink-500/10 blur-[100px]" />
      <div className="absolute bottom-[10%] left-[-8%] w-[320px] h-[320px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute bottom-0 right-[20%] w-[280px] h-[280px] rounded-full bg-fuchsia-500/8 blur-[90px]" />
    </div>
  );
}
