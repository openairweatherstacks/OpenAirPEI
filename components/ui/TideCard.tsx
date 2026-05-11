import { Waves } from "lucide-react";

import type { TideEvent } from "@/lib/types";
import { formatClock } from "@/lib/utils";

function relativeDayLabel(iso: string): string | null {
  const eventDate = new Date(iso);
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayKey = fmt.format(now);
  const tomorrowKey = fmt.format(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  const eventKey = fmt.format(eventDate);
  if (eventKey === todayKey) return null; // hide label for today (just show time)
  if (eventKey === tomorrowKey) return "Tomorrow";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    weekday: "short",
  }).format(eventDate);
}

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
        {[next, following].map((event) => {
          const dayLabel = relativeDayLabel(event.time);
          return (
            <div key={`${event.type}-${event.time}`} className="rounded-3xl bg-bg p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                {event.type} tide{dayLabel ? ` · ${dayLabel}` : ""}
              </p>
              <p className="mt-1 font-serif text-xl text-text-primary">
                {formatClock(event.time)} · {event.height.toFixed(1)}m
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
