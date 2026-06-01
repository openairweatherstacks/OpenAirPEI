import { SunMedium } from "lucide-react";

import { getUvBurnMinutes } from "@/lib/score";

export function UVTimer({ uvIndex }: { uvIndex: number }) {
  const burnMinutes = getUvBurnMinutes(uvIndex);

  return (
    <div className="surface-card-soft border-sun/25 bg-[linear-gradient(180deg,rgba(253,240,213,0.78)_0%,rgba(255,249,236,0.96)_100%)] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-white p-2.5 text-sun-deep shadow-[0_4px_12px_rgba(245,166,35,0.14)]">
          <SunMedium className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun-text">UV timer</p>
      </div>
      <p className="font-serif text-[2rem] leading-tight text-text-primary">
        Burn window: about {burnMinutes} min
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
        This is how long fair skin can be in direct sun at UV {uvIndex} before it starts to burn —
        calculated using the standard Health Canada formula (150 ÷ UV index). Apply SPF 30+ before
        heading out and reapply every 90 minutes if you stay longer.
      </p>
    </div>
  );
}
