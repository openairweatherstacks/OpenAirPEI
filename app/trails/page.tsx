import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

import { ALL_HIKING_TRAILS } from "@/lib/data/trails";
import { getAllLocationConditions } from "@/lib/environment";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Hiking & Walking Trails — OpenAir PEI",
  description: "Discover PEI's best hiking and walking trails with live conditions, difficulty ratings, and real-time weather assessments.",
};

export default async function TrailsPage() {
  const locations = await getAllLocationConditions();
  const charlottetown = locations.find((e) => e.location.id === "charlottetown");
  const weather = charlottetown?.weather;

  if (!weather) {
    return <div className="page-shell mt-8">Unable to load conditions</div>;
  }

  const trails = ALL_HIKING_TRAILS.sort((a, b) => {
    // Sort by difficulty (easy first), then by distance
    const difficultyOrder: Record<string, number> = { easy: 1, moderate: 2, challenging: 3 };
    const aDiff = difficultyOrder[a.difficulty] || 0;
    const bDiff = difficultyOrder[b.difficulty] || 0;
    if (aDiff !== bDiff) return aDiff - bDiff;
    return a.distance - b.distance;
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative py-16 px-4 sm:py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-forest-light to-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-forest">
            Hiking & Walking
          </p>
          <h1 className="font-serif text-4xl leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            PEI&rsquo;s best trails, real-time conditions
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
            Discover 13 hand-curated hiking and walking trails. Live weather assessment, mud forecasting, and accessibility guidance for every trail.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-6">
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Trails</p>
              <p className="mt-1 font-semibold text-text-primary">{trails.length}</p>
            </div>
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Easy</p>
              <p className="mt-1 font-semibold text-text-primary">{trails.filter((t) => t.difficulty === "easy").length}</p>
            </div>
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Moderate</p>
              <p className="mt-1 font-semibold text-text-primary">{trails.filter((t) => t.difficulty === "moderate").length}</p>
            </div>
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Challenging</p>
              <p className="mt-1 font-semibold text-text-primary">{trails.filter((t) => t.difficulty === "challenging").length}</p>
            </div>
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Distance</p>
              <p className="mt-1 font-semibold text-text-primary">{trails.reduce((sum, t) => sum + t.distance, 0).toFixed(0)} km</p>
            </div>
            <div className="rounded-lg bg-white/80 p-3">
              <p className="text-xs text-text-muted uppercase">Regions</p>
              <p className="mt-1 font-semibold text-text-primary">{new Set(trails.map((t) => t.region)).size}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRAILS GRID */}
      <div className="page-shell mt-6 space-y-6">
        <section>
          <div className="mb-4">
            <p className="eyebrow mb-1">Browse trails</p>
            <h2 className="section-title text-3xl">All trails on PEI</h2>
            <p className="section-copy mt-1 text-sm">Sorted by difficulty — easy to challenging</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trails.map((trail) => (
              <Link
                key={trail.id}
                href={`/trails/${trail.id}`}
                className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_8px_40px_rgba(42,42,42,0.07)] transition hover:shadow-[0_16px_60px_rgba(42,42,42,0.12)]"
              >
                <div className="p-4">
                  <div className="mb-2">
                    <p className="font-serif text-lg leading-snug text-text-primary">
                      {trail.name.split("—")[0].trim()}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">{trail.region} Region</p>
                  </div>

                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">{trail.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      <span>{trail.distance} km</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{trail.duration} min</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {trail.features.slice(0, 3).map((feature) => {
                        const icons: Record<string, string> = {
                          "wheelchair-accessible": "♿",
                          "dog-friendly": "🐕",
                          "scenic-views": "🌄",
                          waterfront: "💧",
                          swimming: "🏊",
                          birdwatching: "🦅",
                          forest: "🌲",
                          coastal: "🌊",
                        };
                        return (
                          <span key={feature} title={feature} className="text-lg">
                            {icons[feature] || "✓"}
                          </span>
                        );
                      })}
                      {trail.features.length > 3 && (
                        <span className="text-xs text-text-muted">+{trail.features.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase text-text-muted">
                      {trail.difficulty}
                    </span>
                    <ArrowRight className="h-4 w-4 text-forest opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Why OpenAir trails</p>
          <h2 className="section-title text-3xl">How we beat Island Trails</h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Island Trails (Reference)",
                features: [
                  "Static trail listings (no updates)",
                  "PDFs for trail info",
                  "Manual condition reports",
                ],
                isUs: false,
              },
              {
                name: "OpenAir Trails",
                features: [
                  "Live mud & weather risk (updated hourly)",
                  "Hiking suitability scores (0-100)",
                  "Real-time 'when to go' windows",
                ],
                isUs: true,
              },
            ].map(({ name, features, isUs }) => (
              <div
                key={name}
                className={
                  isUs
                    ? "rounded-[1.75rem] bg-forest-deep p-5 text-white shadow-glow sm:col-span-2 lg:col-span-1"
                    : "rounded-[1.75rem] border border-border bg-bg p-5"
                }
              >
                <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${isUs ? "text-white/90" : "text-text-muted"}`}>
                  {isUs ? "✦ This app" : "Static reference"}
                </p>
                <p className={`mb-4 font-serif text-lg leading-snug ${isUs ? "text-white" : "text-text-primary"}`}>
                  {name}
                </p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm leading-5 ${isUs ? "text-white/85" : "text-text-secondary"}`}>
                      <span className={`mt-0.5 text-xs ${isUs ? "text-white/80" : "text-danger"}`}>
                        {isUs ? "→" : "✕"}
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-sm text-text-secondary mb-4">Ready to hit the trails&quest;</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white hover:bg-forest-deep transition"
          >
            See all outdoor activities <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
