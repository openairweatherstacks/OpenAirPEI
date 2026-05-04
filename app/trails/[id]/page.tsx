import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Navigation, Clock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

import { ALL_HIKING_TRAILS } from "@/lib/data/trails";
import { getTrailConditions } from "@/lib/environment";

export const revalidate = 600;

export async function generateStaticParams() {
  return ALL_HIKING_TRAILS.map((trail) => ({ id: trail.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getTrailConditions(id);
  if (!entry) return { title: "Trail not found" };
  return {
    title: `${entry.trail.name} — PEI Hiking Trails`,
    description: entry.trail.description,
  };
}

export default async function TrailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getTrailConditions(id);
  if (!entry) notFound();

  const difficultyColor: Record<string, string> = {
    easy: "text-green-600 bg-green-50",
    moderate: "text-amber-600 bg-amber-50",
    challenging: "text-red-600 bg-red-50",
  };

  const statusColor: Record<string, string> = {
    great: "bg-forest text-white",
    good: "bg-leaf text-black",
    ok: "bg-sun text-black",
    "not recommended": "bg-danger text-white",
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="page-shell mt-4 mb-4">
        <Link href="/trails" className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep">
          <ArrowLeft className="h-4 w-4" />
          All trails
        </Link>
      </div>

      {/* Hero with Image */}
      {entry.trail.image && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80">
          <Image
            src={entry.trail.image}
            alt={entry.trail.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="page-shell mt-8 space-y-8">
        {/* Title and Meta */}
        <section>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest">
                {entry.trail.region} Region
              </p>
              <h1 className="font-serif text-4xl leading-tight text-text-primary sm:text-5xl mt-2">
                {entry.trail.name.split("—")[0].trim()}
              </h1>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${difficultyColor[entry.trail.difficulty]}`}>
              {entry.trail.difficulty}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            {entry.trail.description}
          </p>

          {/* Quick Info Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              <MapPin className="h-4 w-4" />
              {entry.trail.distance} km
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              <Clock className="h-4 w-4" />
              {entry.trail.duration} min
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              <TrendingUp className="h-4 w-4" />
              {entry.trail.elevationGain} m elevation
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              {entry.trail.loopOrLinear === "loop" ? "⭕ Loop" : "↔️ Linear"}
            </div>
          </div>
        </section>

        {/* Live Conditions Banner */}
        <section className={`rounded-2xl border-2 p-6 ${statusColor[entry.trailScore.status]}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Right now</p>
              <p className="mt-2 font-serif text-2xl font-bold">
                {entry.trailScore.status === "great"
                  ? "Perfect conditions"
                  : entry.trailScore.status === "good"
                    ? "Good window"
                    : entry.trailScore.status === "ok"
                      ? "Doable"
                      : "Not recommended"}
              </p>
              <p className="mt-1 text-sm leading-5 opacity-90">{entry.trailScore.reason}</p>
            </div>
            <div className="text-right whitespace-nowrap">
              <p className="text-3xl font-bold">{entry.trailScore.score}/100</p>
              <p className="text-xs opacity-75 mt-1">Trail suitability</p>
            </div>
          </div>

          {/* Mud & Condition Alerts */}
          {(entry.mudRisk === "high" || entry.conditions.length > 0) && (
            <div className="mt-4 pt-4 border-t border-current opacity-80 space-y-2">
              {entry.mudRisk !== "low" && (
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Mud risk: <strong>{entry.mudRisk}</strong>
                    {entry.mudRisk === "high" && " — expect slippery sections"}
                  </span>
                </div>
              )}
              {entry.conditions.map((cond) => (
                <div key={cond} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trailhead Info */}
        <section>
          <p className="eyebrow mb-2">Get to the trailhead</p>
          <h2 className="section-title text-2xl">Starting at {entry.trail.trailhead.name}</h2>

          <div className="mt-6 rounded-2xl border border-border bg-white p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Coordinates</p>
              <p className="mt-2 font-mono text-sm text-text-primary">
                {entry.trail.trailhead.lat.toFixed(4)}°N, {Math.abs(entry.trail.trailhead.lng).toFixed(4)}°W
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://maps.apple.com/?daddr=${entry.trail.trailhead.lat},${entry.trail.trailhead.lng}&dirflg=d`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-forest bg-white px-4 py-2.5 font-medium text-forest hover:bg-forest-light transition"
              >
                <Navigation className="h-4 w-4" />
                Open in Apple Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${entry.trail.trailhead.lat},${entry.trail.trailhead.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-forest bg-white px-4 py-2.5 font-medium text-forest hover:bg-forest-light transition"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* Trail Features */}
        {entry.trail.features.length > 0 && (
          <section>
            <p className="eyebrow mb-2">What&rsquo;s here</p>
            <h2 className="section-title text-2xl">Trail features</h2>

            <div className="mt-6 flex flex-wrap gap-2">
              {entry.trail.features.map((feature) => {
                const icons: Record<string, string> = {
                  "wheelchair-accessible": "♿",
                  "stroller-friendly": "🧑‍🍼",
                  "dog-friendly": "🐕",
                  "scenic-views": "🌄",
                  waterfront: "💧",
                  birdwatching: "🦅",
                  "wildlife-spotting": "🦌",
                  "historic-site": "📜",
                  wildflowers: "🌸",
                  forest: "🌲",
                  coastal: "🌊",
                  "mountain-views": "⛰️",
                };
                return (
                  <div key={feature} className="rounded-full border border-forest-light bg-forest-light px-3 py-1.5 text-sm font-medium text-forest flex items-center gap-2">
                    {icons[feature] || "✓"}
                    {feature.replace(/-/g, " ")}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Hazards */}
        {entry.trail.hazards && entry.trail.hazards.length > 0 && (
          <section>
            <p className="eyebrow mb-2">Know before you go</p>
            <h2 className="section-title text-2xl">Trail hazards & considerations</h2>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ul className="space-y-2">
                {entry.trail.hazards.map((hazard) => (
                  <li key={hazard} className="flex items-start gap-2 text-sm text-text-secondary">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>{hazard.replace(/-/g, " ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Amenities */}
        {entry.trail.amenities && entry.trail.amenities.length > 0 && (
          <section>
            <p className="eyebrow mb-2">What&rsquo;s available</p>
            <h2 className="section-title text-2xl">Trail amenities</h2>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {entry.trail.amenities.map((amenity) => (
                <div key={amenity} className="flex items-start gap-2 rounded-lg bg-green-50 p-3 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                  <span className="text-sm font-medium text-text-primary capitalize">{amenity.replace(/-/g, " ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Time */}
        {entry.trail.bestTime && (
          <section className="rounded-2xl bg-sun-light border border-sun-light/50 p-6">
            <p className="text-sm font-semibold text-sun-text uppercase">Best time to visit</p>
            <p className="mt-2 text-text-primary">{entry.trail.bestTime}</p>
          </section>
        )}

        {/* Weather Conditions */}
        <section>
          <p className="eyebrow mb-2">Current conditions</p>
          <h2 className="section-title text-2xl">Today&rsquo;s weather snapshot</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-text-muted uppercase">Temperature</p>
              <p className="mt-1 font-semibold text-text-primary">{entry.weather.temperature}°C</p>
              <p className="text-xs text-text-muted mt-1">Feels like {entry.weather.feelsLike}°C</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-text-muted uppercase">Wind</p>
              <p className="mt-1 font-semibold text-text-primary">{entry.weather.windSpeed} km/h</p>
              <p className="text-xs text-text-muted mt-1">from the {entry.weather.windDirection}</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-text-muted uppercase">Visibility</p>
              <p className="mt-1 font-semibold text-text-primary">{entry.weather.visibility} km</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-text-muted uppercase">Humidity</p>
              <p className="mt-1 font-semibold text-text-primary">{entry.weather.humidity}%</p>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <div className="text-center pt-4">
          <Link
            href="/trails"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep"
          >
            Back to all trails
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
