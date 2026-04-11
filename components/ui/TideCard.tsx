import { Waves } from "lucide-react";

import type { TideEvent } from "@/lib/types";
import { formatClock } from "@/lib/utils";

export function TideCard({ tides }: { tides: TideEvent[] }) {
  if (!tides.length) {
    return (
      <div className="rounded-[1.75rem] border border-border bg-white p-4 shadow-sm">
        <p className="font-serif text-xl text-text-primary">Tide data is still being stitched in.</p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          DFO tide station data will land here next.
        </p>
      </div>
    );
  }

  const [next, following] = tides;

  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-2xl bg-forest-light p-2 text-forest">
          <Waves className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Tides</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[next, following].map((event) => (
          <div key={`${event.type}-${event.time}`} className="rounded-3xl bg-bg p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              {event.type} tide
            </p>
            <p className="mt-1 font-serif text-xl text-text-primary">
              {formatClock(event.time)} · {event.height.toFixed(1)}m
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
