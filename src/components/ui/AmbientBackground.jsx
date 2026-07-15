export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-900/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-900/[0.03] blur-[100px]" />
    </div>
  );
}
