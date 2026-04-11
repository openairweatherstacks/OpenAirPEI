export default function Loading() {
  return (
    <div className="page-shell space-y-6">
      <div className="panel h-48 animate-pulse bg-white/70" />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel h-[420px] animate-pulse bg-white/70" />
        <div className="space-y-5">
          <div className="panel h-48 animate-pulse bg-white/70" />
          <div className="panel h-48 animate-pulse bg-white/70" />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="panel h-72 animate-pulse bg-white/70" />
        ))}
      </div>
    </div>
  );
}
