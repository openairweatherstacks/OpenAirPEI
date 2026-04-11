import { TriangleAlert, Waypoints } from "lucide-react";

import type { BridgeStatusType } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<BridgeStatusType, string> = {
  Open: "border-forest/20 bg-forest-light text-forest",
  "High-sided vehicle restriction": "border-sun/20 bg-sun-light text-sun-deep",
  Closed: "border-danger/20 bg-rose-50 text-danger",
};

export function BridgeStatus({
  status,
  windSpeed,
}: {
  status: BridgeStatusType;
  windSpeed: number;
}) {
  return (
    <div className={cn("rounded-[1.75rem] border p-4", STATUS_CLASSES[status])}>
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-2xl bg-white/80 p-2">
          {status === "Open" ? <Waypoints className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Confederation Bridge</p>
      </div>
      <p className="font-serif text-2xl">{status}</p>
      <p className="mt-2 text-sm leading-6">
        Sustained wind is {windSpeed} km/h. Motorcycles feel the bridge first, then taller vehicles,
        then everyone else.
      </p>
    </div>
  );
}
