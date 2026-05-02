import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Droplets, Gauge, Mountain, Navigation, ParkingCircle, PawPrint, Thermometer, Waves, Wind } from "lucide-react";
import { notFound } from "next/navigation";

import { MeteorologistInsight } from "@/components/ai/MeteorologistInsight";
import { ActivityGrid } from "@/components/conditions/ActivityGrid";
import { PawBadge } from "@/components/conditions/PawBadge";
import { ConditionsCard } from "@/components/conditions/ConditionsCard";
import { WindowAlert } from "@/components/conditions/WindowAlert";
import { PEIMap } from "@/components/map/PEIMap";
import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { CommunityNoticeCard } from "@/components/ui/CommunityNoticeCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { TideCard } from "@/components/ui/TideCard";
import { UVTimer } from "@/components/ui/UVTimer";
import { WaterfrontRiskCard } from "@/components/ui/WaterfrontRiskCard";
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

      {(entry.communityNotice || entry.waterfrontRisk) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {entry.communityNotice && <CommunityNoticeCard notice={entry.communityNotice} />}
          {entry.waterfrontRisk && <WaterfrontRiskCard risk={entry.waterfrontRisk} />}
        </section>
      )}

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
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-semibold text-[#2a2a2a] shadow-sun transition hover:bg-sun-deep"
          >
            <Navigation className="h-4 w-4" />
            Get directions
          </a>
        </div>
        <PEIMap locations={allLocations} focusId={entry.location.id} />
      </section>

      {entry.location.id === "charlottetown" && (
        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Live camera</p>
            <h2 className="section-title text-3xl">Queen Street right now</h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(42,42,42,0.08)]">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://media.gpei.ca/web/islandcam.html"
                title="Live Queen Street webcam — Charlottetown"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="px-5 py-3">
              <p className="text-xs text-text-muted">Live feed courtesy of Government of Prince Edward Island · Updates every few seconds</p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Wind}
          insight={
            entry.weather.windSpeed >= 30
              ? "The wind is the real personality here right now. Expect exposed sections to feel sharper than the ambient air temperature."
              : "Wind is mild enough that the temperature will be the thing you notice first."
          }
          rawLabel={`${entry.weather.windSpeed} km/h ${entry.weather.windDirection} · Gusts ${entry.weather.gustSpeed ?? entry.weather.windSpeed} km/h`}
          accentClassName="text-sun-text"
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
              <div className="mb-2 flex items-center gap-2 text-[#0a527a]">
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
            accentClassName="text-sun-text"
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Parking */}
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                  entry.location.amenities.parking === "free" ? "bg-forest-light text-forest" :
                  entry.location.amenities.parking === "paid" ? "bg-sun-light text-sun-text" :
                  entry.location.amenities.parking === "limited" ? "bg-sun-light text-sun-text" :
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

            {/* Washrooms */}
            <div className="rounded-[1.75rem] border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${
                  entry.location.amenities.washrooms ? "bg-forest-light" : "bg-red-50"
                }`}>
                  🚻
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Washrooms</p>
              </div>
              <p className={`font-serif text-xl ${entry.location.amenities.washrooms ? "text-forest" : "text-red-500"}`}>
                {entry.location.amenities.washrooms ? "Available" : "None on site"}
              </p>
              {entry.location.amenities.washroomNote && (
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{entry.location.amenities.washroomNote}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── PAW INDEX ────────────────────────────────────────────── */}
      <section className="panel p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Paw index</p>
            <h2 className="section-title text-3xl">Is it safe for your dog?</h2>
          </div>
          <PawBadge score={entry.pawIndex.score} />
        </div>
        <p className="mb-6 text-sm leading-7 text-text-secondary">{entry.pawIndex.statement}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-forest-light/70 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-forest" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Air temp</p>
            </div>
            <p className="font-serif text-xl text-text-primary">{entry.weather.temperature}°C</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {entry.weather.temperature > 25
                ? "Bring water — dogs overheat faster than people"
                : entry.weather.temperature < 0
                  ? "Cold paws — keep walks short"
                  : "Comfortable range for most dogs"}
            </p>
          </div>
          <div className="rounded-3xl bg-sun-light/70 p-4">
            <div className="mb-2 flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-sun-text" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-text">Pavement</p>
            </div>
            <p className="font-serif text-xl text-text-primary">
              {entry.weather.uvIndex >= 7 && entry.weather.temperature >= 20
                ? "Hot — use grass"
                : entry.weather.uvIndex >= 4 && entry.weather.temperature >= 18
                  ? "Warm — check first"
                  : "Safe to walk"}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">UV {entry.weather.uvIndex} · {entry.weather.temperature}°C air</p>
          </div>
          <div className="rounded-3xl bg-leaf-light p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wind className="h-4 w-4 text-forest" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Wind & air</p>
            </div>
            <p className="font-serif text-xl text-text-primary">
              {entry.weather.aqhi <= 3 ? "Clean air" : entry.weather.aqhi <= 6 ? "Acceptable" : "Poor — limit time"}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">AQHI {entry.weather.aqhi} · {entry.weather.windSpeed} km/h wind</p>
          </div>
        </div>
      </section>

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
