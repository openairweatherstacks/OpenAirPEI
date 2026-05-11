import { Trash2, Leaf, Recycle } from "lucide-react";

import { getNextWastePickup, type WasteStream } from "@/lib/waste-pickup";

function streamIcon(stream: WasteStream) {
  if (stream === "compost") return Leaf;
  if (stream === "recycling") return Recycle;
  return Trash2;
}

function streamAccent(stream: WasteStream) {
  if (stream === "compost") return { bg: "bg-leaf-light", text: "text-forest", icon: "text-forest" };
  if (stream === "recycling") return { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" };
  return { bg: "bg-slate-100", text: "text-charcoal", icon: "text-charcoal" };
}

export function WastePickupCard() {
  const pickup = getNextWastePickup();
  const primary = pickup.streams[0];
  const accent = streamAccent(primary);
  const Icon = streamIcon(primary);

  const urgencyBorder = pickup.isToday
    ? "border-sun"
    : pickup.isTomorrow
      ? "border-sun/60"
      : "border-border";

  const urgencyLabel = pickup.isToday
    ? "Today"
    : pickup.isTomorrow
      ? "Tomorrow"
      : pickup.label;

  return (
    <div className={`rounded-[1.75rem] border-2 ${urgencyBorder} bg-white p-5 shadow-sm sm:p-6`}>
      <div className="mb-4 flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-forest" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">Garbage & recycling</p>
      </div>

      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent.bg}`}>
          <Icon className={`h-7 w-7 ${accent.icon}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">
            Next pickup
          </p>
          <p className="font-serif text-2xl leading-tight text-text-primary break-words sm:text-3xl">
            {urgencyLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pickup.streams.map((s) => {
              const a = streamAccent(s);
              const StreamIcon = streamIcon(s);
              const label = s === "compost" ? "Green Cart" : s === "recycling" ? "Blue Bag" : "Black Cart";
              return (
                <span
                  key={s}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.bg} ${a.text}`}
                >
                  <StreamIcon className="h-3 w-3" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-text-secondary break-words">
        {pickup.callToAction}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-[11px] text-text-muted">
        <div>
          <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Mon</p>
          <p>Compost / Waste alternates</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">4th Wed</p>
          <p>Blue Bag recycling</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Zone</p>
          <p>Capital Region</p>
        </div>
      </div>
    </div>
  );
}
