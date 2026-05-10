import { CheckCircle2, Dot, TriangleAlert, Waves } from "lucide-react";

import type { ActivityAssessment } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ActivityAssessment["status"], string> = {
  great: "border-[#bfdab6] bg-[#eef8ea] text-[#317c2c]",
  ok: "border-[#f3d89f] bg-[#fff6e1] text-sun-text",
  "not recommended": "border-[#efc0ba] bg-[#fff1ef] text-danger",
};

const STATUS_ICONS = {
  great: CheckCircle2,
  ok: Dot,
  "not recommended": TriangleAlert,
};

export function ActivityGrid({ activities }: { activities: ActivityAssessment[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {activities.map((activity) => {
        const Icon = STATUS_ICONS[activity.status];
        return (
          <div
            key={activity.name}
            className={cn(
              "rounded-[1.6rem] border px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
              STATUS_STYLES[activity.status],
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full border border-white/80 bg-white/88 p-2 shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[1.05rem] font-semibold capitalize">{activity.name}</p>
            </div>
            <p className="text-sm leading-7">{activity.reason}</p>
          </div>
        );
      })}
      {!activities.length && (
        <div className="surface-card-soft p-5 text-sm leading-7 text-text-secondary">
          Activity guidance will populate once conditions are available.
        </div>
      )}
      {activities.length > 0 && (
        <div className="surface-card-soft p-5 text-sm leading-7 text-text-secondary sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-text-primary">
            <Waves className="h-4 w-4 text-sun" />
            <span className="font-medium">
              Activity matcher reads wind, temperature, air quality, and the next shift in conditions.
            </span>
          </div>
          Use the green cards for your best bets and the amber ones when timing matters.
        </div>
      )}
    </div>
  );
}
