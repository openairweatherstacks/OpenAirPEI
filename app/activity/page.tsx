export const dynamic = "force-dynamic";

import { Bike, Camera, Footprints, Waves } from "lucide-react";

import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import { MetricCard } from "@/components/ui/MetricCard";
import { getAllLocationConditions } from "@/lib/environment";
import type { ActivityAssessment, LocationConditions } from "@/lib/types";

function pickIcon(activity: string) {
  if (activity.includes("swim")) return Waves;
  if (activity.includes("photo")) return Camera;
  if (activity.includes("walk") || activity.includes("hiking") || activity.includes("running")) {
    return Footprints;
  }
  return Bike;
}

function compareAssessment(
  left: { entry: LocationConditions; activity: ActivityAssessment },
  right: { entry: LocationConditions; activity: ActivityAssessment },
) {
  const statusRank = { great: 3, ok: 2, "not recommended": 1 };
  const leftScore = statusRank[left.activity.status] * 100 + left.entry.rawScore;
  const rightScore = statusRank[right.activity.status] * 100 + right.entry.rawScore;
  return rightScore - leftScore;
}

export default async function ActivityPage() {
  const locations = await getAllLocationConditions();
  const activityMap = new Map<string, Array<{ entry: LocationConditions; activity: ActivityAssessment }>>();

  for (const entry of locations) {
    for (const activity of entry.conditions.activities) {
      const current = activityMap.get(activity.name) ?? [];
      current.push({ entry, activity });
      activityMap.set(activity.name, current);
    }
  }

  const highlights = Array.from(activityMap.entries())
    .map(([name, options]) => ({
      name,
      options: options.sort(compareAssessment),
    }))
    .filter((item) => item.options.length > 0)
    .sort((left, right) => compareAssessment(left.options[0]!, right.options[0]!));

  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Activity matcher</p>
        <h1 className="section-title">What should you do on PEI right now?</h1>
        <p className="section-copy mt-4">
          This page ranks the island by activity rather than by weather. The best idea is not always
          the warmest one. Sometimes it is the most sheltered, driest, or easiest on lungs.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {highlights.map(({ name, options }) => {
          const best = options[0];
          const next = options[1];
          const Icon = pickIcon(name);

          return (
            <div key={name} className="panel p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-forest-light p-3 text-forest">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                      Best right now
                    </p>
                    <h2 className="font-serif text-3xl capitalize text-text-primary">{name}</h2>
                  </div>
                </div>
                <ScoreBadge score={best.entry.conditions.score} />
              </div>

              <div className="rounded-[1.6rem] bg-bg p-4">
                <p className="font-serif text-2xl text-text-primary">{best.entry.location.name}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{best.activity.reason}</p>
              </div>

              {next && (
                <p className="mt-4 text-sm leading-6 text-text-secondary">
                  Backup option: <span className="font-semibold text-text-primary">{next.entry.location.name}</span>{" "}
                  if you want a second choice.
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Bike}
          insight="Cycling and running stay strongest when the route stays inland. Exposed coastal sections are the first to feel tiring headwinds."
          rawLabel="Pattern · Interior trails outperform beaches in wind"
        />
        <MetricCard
          icon={Waves}
          insight="Beach weather can still be fair while swim comfort stays poor. Water access and water comfort are not the same score."
          rawLabel="Pattern · Temperature and surf both matter"
          accentClassName="text-sun-text"
        />
        <MetricCard
          icon={Footprints}
          insight="Walking is the island's most resilient activity because sheltered parks and waterfront loops hold up well even when one coast turns rough."
          rawLabel="Pattern · Short outdoor windows are still useful"
        />
      </section>
    </div>
  );
}
