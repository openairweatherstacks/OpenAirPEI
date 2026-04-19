import { CheckCircle2, Dot, TriangleAlert, Waves } from "lucide-react";

import type { ActivityAssessment } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ActivityAssessment["status"], string> = {
  great: "border-forest/20 bg-forest-light text-forest",
  ok: "border-sun/20 bg-sun-light text-sun-text",
  "not recommended": "border-danger/20 bg-rose-50 text-danger",
};

const STATUS_ICONS = {
  great: CheckCircle2,
  ok: Dot,
  "not recommended": TriangleAlert,
};

export function ActivityGrid({ activities }: { activities: ActivityAssessment[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {activities.map((activity) => {
        const Icon = STATUS_ICONS[activity.status];
        return (
          <div
            key={activity.name}
            className={cn("rounded-3xl border p-4", STATUS_STYLES[activity.status])}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-full bg-white/80 p-1.5">
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-semibold capitalize">{activity.name}</p>
            </div>
            <p className="text-sm leading-6">{activity.reason}</p>
          </div>
        );
      })}
      {!activities.length && (
        <div className="rounded-3xl border border-border bg-white p-4 text-sm text-text-secondary">
          Activity guidance will populate once conditions are available.
        </div>
      )}
      {activities.length > 0 && (
        <div className="rounded-3xl border border-border bg-white p-4 text-sm text-text-secondary sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-text-primary">
            <Waves className="h-4 w-4 text-sun" />
            Activity matcher reads wind, temperature, air quality, and the next shift in conditions.
          </div>
          Use the green cards for your best bets and the amber ones when timing matters.
        </div>
      )}
    </div>
  );
}
