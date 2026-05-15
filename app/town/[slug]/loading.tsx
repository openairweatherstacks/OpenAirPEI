export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-10 animate-pulse">
      <div className="space-y-4">
        <div className="h-3 w-64 bg-[#E8EDE4] rounded" />
        <div className="h-12 w-2/3 bg-[#E8EDE4] rounded" />
        <div className="rounded-2xl bg-white border border-[#E8EDE4] p-6 space-y-4">
          <div className="h-6 w-24 bg-[#F2F4EF] rounded-full" />
          <div className="h-8 w-3/4 bg-[#F2F4EF] rounded" />
          <div className="h-4 w-full bg-[#F2F4EF] rounded" />
          <div className="h-4 w-5/6 bg-[#F2F4EF] rounded" />
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F2F4EF]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 bg-[#F2F4EF] rounded" />
            ))}
          </div>
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-48 bg-[#E8EDE4] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-32 bg-white border border-[#E8EDE4] rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
