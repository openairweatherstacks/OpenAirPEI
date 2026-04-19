import { SunMedium } from "lucide-react";

import { getUvBurnMinutes } from "@/lib/score";

export function UVTimer({ uvIndex }: { uvIndex: number }) {
  const burnMinutes = getUvBurnMinutes(uvIndex);

  return (
    <div className="rounded-[1.75rem] border border-sun/20 bg-sun-light/75 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-2xl bg-white p-2 text-sun-deep">
          <SunMedium className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-text">UV timer</p>
      </div>
      <p className="font-serif text-2xl text-text-primary">Burn window: about {burnMinutes} min</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        UV {uvIndex} is high enough that sunscreen and shade timing matter, even when the air still
        feels cool.
      </p>
    </div>
  );
}
