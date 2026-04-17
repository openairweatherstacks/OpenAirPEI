import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Droplets, Gauge, Mountain, Navigation, Waves, Wind } from "lucide-react";
import { notFound } from "next/navigation";

import { MeteorologistInsight } from "@/components/ai/MeteorologistInsight";
import { ActivityGrid } from "@/components/conditions/ActivityGrid";
import { ConditionsCard } from "@/components/conditions/ConditionsCard";
import { WindowAlert } from "@/components/conditions/WindowAlert";
import { PEIMap } from "@/components/map/PEIMap";
import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { TideCard } from "@/components/ui/TideCard";
import { UVTimer } from "@/components/ui/UVTimer";
import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getAllLocationConditions, getLocationConditions } from "@/lib/environment";
import { waterTempLabel } from "@/lib/water";

export async function generateStaticParams() {
  return PEI_LOCATIONS.map((location) => ({ id: location.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getLocationConditions(id);

  if (!entry) {
    return {
      title: "Location not found",
    };
  }

  return {
    title: entry.location.name,
    description: entry.conditions.summary,
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getLocationConditions(id);

  if (!entry) notFound();

  const allLocations = await getAllLocationConditions();

  return (
    <div className="page-shell space-y-8">
      <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <span>Location outlook</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ConditionsCard entry={entry} compact />
        <div className="space-y-5">
          <WindowAlert
            minutes={entry.conditions.windowMinutes}
            statement={entry.conditions.windowStatement}
          />
          <MeteorologistInsight text={entry.conditions.insightOfTheDay} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Map context</p>
            <h2 className="section-title text-3xl">{entry.location.name} on the island</h2>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${entry.location.lat},${entry.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-semibold text-white shadow-sun transition hover:bg-sun-deep"
          >
            <Navigation className="h-4 w-4" />
            Get directions
          </a>
        </div>
        <PEIMap locations={allLocations} focusId={entry.location.id} />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Wind}
          insight={
            entry.weather.windSpeed >= 30
              ? "The wind is the real personality here right now. Expect exposed sections to feel sharper than the ambient air temperature."
              : "Wind is mild enough that the temperature will be the thing you notice first."
          }
          rawLabel={`${entry.weather.windSpeed} km/h ${entry.weather.windDirection} · Gusts ${entry.weather.gustSpeed ?? entry.weather.windSpeed} km/h`}
          accentClassName="text-sun-deep"
        />
        <MetricCard
          icon={Droplets}
          insight={entry.conditions.airQualityStatement}
          rawLabel={`AQHI ${entry.weather.aqhi} · Visibility ${entry.weather.visibility} km`}
          accentClassName="text-forest"
        />
        <MetricCard
          icon={Gauge}
          insight={
            entry.weather.pressure >= 1017
              ? "Pressure is healthy enough that this window should stay composed rather than jumpy."
              : "Pressure is softening, which usually means the next island change is already organizing offshore."
          }
          rawLabel={`${entry.weather.pressure} hPa · ${entry.weather.conditionText}`}
          accentClassName="text-forest"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="panel p-5">
            <p className="eyebrow mb-3">Air quality</p>
            <AirQualityBar value={entry.weather.aqhi} />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              {entry.conditions.airQualityStatement}
            </p>
          </div>
          <UVTimer uvIndex={entry.weather.uvIndex} />
          {entry.conditions.bridgeStatus && (
            <BridgeStatus
              status={entry.conditions.bridgeStatus}
              windSpeed={entry.weather.windSpeed}
            />
          )}
        </div>

        <div className="space-y-5">
          <div className="panel p-5">
            <p className="eyebrow mb-3">Activity matcher</p>
            <ActivityGrid activities={entry.conditions.activities} />
          </div>
          <TideCard tides={entry.tide} />
          {entry.waterTemp !== null && (
            <div className="rounded-[1.75rem] border border-[#cce8f4] bg-[#eef7fc] p-5">
              <div className="mb-2 flex items-center gap-2 text-[#1a7aad]">
                <Waves className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Water temperature</p>
              </div>
              <p className="font-serif text-3xl text-text-primary">{entry.waterTemp}°C</p>
              <p className="mt-1 text-sm text-text-secondary">{waterTempLabel(entry.waterTemp)}</p>
            </div>
          )}
          <MetricCard
            icon={Mountain}
            insight="OpenAir always shows the call and the proof together: the action-oriented read first, then the raw number under it so locals and visitors can trust the same screen."
            rawLabel={`Source · ${entry.source === "hybrid" ? "live data blended with local defaults" : "sample seed data"}`}
            accentClassName="text-sun-deep"
          />
        </div>
      </section>
    </div>
  );
}
