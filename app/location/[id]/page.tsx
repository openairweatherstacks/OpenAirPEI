import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Droplets, Gauge, Mountain, Navigation, ParkingCircle, Waves, Wind } from "lucide-react";
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
import { getAllLocationConditions, getLocationConditions } from "@/lib/environment";
import { waterTempLabel } from "@/lib/water";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";

export const dynamic = "force-dynamic";

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

      <section className="panel p-5 sm:p-6">
        <p className="eyebrow mb-2">{entry.location.type}</p>
        <h1 className="section-title text-4xl">{entry.location.name}</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-text-secondary">
          {entry.location.tagline}
        </p>
      </section>

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

      {/* ── VISITOR INFO ──────────────────────────────────────────── */}
      {entry.location.amenities && (
        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Visitor information</p>
            <h2 className="section-title text-3xl">Before you go</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Parking */}
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                  entry.location.amenities.parking === "free" ? "bg-forest-light text-forest" :
                  entry.location.amenities.parking === "paid" ? "bg-sun-light text-sun-deep" :
                  entry.location.amenities.parking === "limited" ? "bg-sun-light text-sun-deep" :
                  "bg-red-50 text-red-500"
                }`}>
                  <ParkingCircle className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Parking</p>
              </div>
              <p className="font-serif text-xl capitalize text-text-primary">
                {entry.location.amenities.parking === "free" ? "Free" :
                 entry.location.amenities.parking === "paid" ? "Paid" :
                 entry.location.amenities.parking === "limited" ? "Limited" : "No parking"}
              </p>
              {entry.location.amenities.parkingNote && (
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{entry.location.amenities.parkingNote}</p>
              )}
            </div>

            {/* Pet friendly */}
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${
                  entry.location.amenities.petFriendly ? "bg-forest-light" : "bg-red-50"
                }`}>
                  🐾
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Pets</p>
              </div>
              <p className={`font-serif text-xl ${entry.location.amenities.petFriendly ? "text-forest" : "text-red-500"}`}>
                {entry.location.amenities.petFriendly ? "Pet friendly" : "No pets"}
              </p>
              {entry.location.amenities.petNote && (
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{entry.location.amenities.petNote}</p>
              )}
            </div>

            {/* Wheelchair */}
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${
                  entry.location.amenities.wheelchairAccessible ? "bg-forest-light" : "bg-red-50"
                }`}>
                  ♿
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Accessibility</p>
              </div>
              <p className={`font-serif text-xl ${entry.location.amenities.wheelchairAccessible ? "text-forest" : "text-red-500"}`}>
                {entry.location.amenities.wheelchairAccessible ? "Accessible" : "Limited access"}
              </p>
              {entry.location.amenities.wheelchairNote && (
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{entry.location.amenities.wheelchairNote}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      {entry.location.faqs && entry.location.faqs.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Frequently asked questions</p>
            <h2 className="section-title text-3xl">What visitors want to know</h2>
          </div>
          <div className="space-y-3">
            {entry.location.faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-[1.75rem] border border-border bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary">
                  {q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-text-secondary">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── REVIEWS ───────────────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow mb-3">Visitor reviews</p>
          <h2 className="section-title text-3xl mb-6">What people are saying</h2>
          <ReviewList locationId={entry.location.id} />
        </div>
        <div>
          <p className="eyebrow mb-3">Share your experience</p>
          <h2 className="section-title text-3xl mb-6">Leave a review</h2>
          <ReviewForm locationId={entry.location.id} />
        </div>
      </section>
    </div>
  );
}
