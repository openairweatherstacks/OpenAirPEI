import { ArrowRight, Clock3 } from "lucide-react";

import { formatMinutes } from "@/lib/utils";

export function WindowAlert({
  minutes,
  statement,
}: {
  minutes: number | null;
  statement: string | null;
}) {
  return (
    <div className="rounded-3xl border border-sun/20 bg-sun-light/80 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-sun-deep shadow-sm">
          <Clock3 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sun-text">
            3-hour window
          </p>
          <p className="font-serif text-xl text-text-primary">
            {minutes === null ? "Conditions hold steady" : `You have ${formatMinutes(minutes)}`}
          </p>
          <p className="text-sm leading-6 text-text-secondary">
            {statement ?? "No near-term weather shift is showing up in the current forecast window."}
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sun-text">
            Keep one eye on the horizon <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
