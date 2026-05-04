import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Navigation, ParkingCircle } from "lucide-react";

import { ALL_CONFEDERATION_ROUTES } from "@/lib/data/routes";
import { getRouteConditions } from "@/lib/environment";
import { resolveRouteGeometry } from "@/lib/geometry";
import { SingleRouteMap } from "@/components/map/SingleRouteMap";

export const revalidate = 600;

export async function generateStaticParams() {
  return ALL_CONFEDERATION_ROUTES.map((route) => ({ id: route.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getRouteConditions(id);
  if (!entry) return { title: "Route not found" };
  return {
    title: `${entry.route.name} — Confederation Trail`,
    description: entry.route.description,
  };
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getRouteConditions(id);
  if (!entry) notFound();

  const geometry = await resolveRouteGeometry(entry.route);

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="page-shell mt-4 mb-4">
        <Link href="/routes" className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep">
          <ArrowLeft className="h-4 w-4" />
          View all routes
        </Link>
      </div>

      {/* Hero with Image */}
      {entry.route.image && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80">
          <Image
            src={entry.route.image}
            alt={entry.route.name}
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
          <div className="flex items-start gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-forest">
                {entry.route.type === "main" ? "Main Trail" : "Branch Trail"}
              </p>
            </div>
            {entry.route.letterCode && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                {entry.route.letterCode}
              </span>
            )}
          </div>
          <h1 className="font-serif text-4xl leading-tight text-text-primary sm:text-5xl">
            {entry.route.name.split("—")[0].trim()}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            {entry.route.description}
          </p>

          {/* Quick Info Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              <MapPin className="h-4 w-4" />
              {entry.route.distance} km
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              {entry.route.difficulty === "easy" ? "🟢" : entry.route.difficulty === "moderate" ? "🟡" : "🔴"}{" "}
              {entry.route.difficulty}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-forest-light px-4 py-2 text-sm font-medium text-text-primary">
              {entry.route.elevation}
            </div>
          </div>
        </section>

        {/* Live Conditions Banner */}
        <section className="rounded-2xl border border-forest-light bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Right now</p>
              <p className="mt-2 font-serif text-2xl text-text-primary">
                {entry.routeScore.status === "great"
                  ? "Great conditions"
                  : entry.routeScore.status === "good"
                    ? "Good window"
                    : entry.routeScore.status === "ok"
                      ? "Doable"
                      : "Not recommended"}
              </p>
              <p className="mt-1 text-sm leading-5 text-text-secondary">{entry.routeScore.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-forest">{entry.routeScore.score}/100</p>
              <p className="text-xs text-text-muted mt-1">Route suitability</p>
            </div>
          </div>
        </section>

        {/* Map */}
        <section>
          <div className="mb-4">
            <p className="eyebrow mb-2">Live map</p>
            <h2 className="section-title text-xl">Route overview</h2>
          </div>
          <SingleRouteMap route={entry.route} geometry={geometry} parking={entry.nearbyParking} />
        </section>

        {/* Get to the Trailhead */}
        <section>
          <p className="eyebrow mb-2">Get to the trailhead</p>
          <h2 className="section-title text-2xl">Starting at {entry.route.startPoint.name}</h2>

          <div className="mt-6 rounded-2xl border border-border bg-white p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Coordinates</p>
              <p className="mt-2 font-mono text-sm text-text-primary">
                {entry.route.startPoint.lat.toFixed(4)}°N, {Math.abs(entry.route.startPoint.lng).toFixed(4)}°W
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://maps.apple.com/?daddr=${entry.route.startPoint.lat},${entry.route.startPoint.lng}&dirflg=d`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-forest bg-white px-4 py-2.5 font-medium text-forest hover:bg-forest-light transition"
              >
                <Navigation className="h-4 w-4" />
                Open in Apple Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${entry.route.startPoint.lat},${entry.route.startPoint.lng}`}
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

        {/* Nearby Parking */}
        {entry.nearbyParking.length > 0 && (
          <section>
            <p className="eyebrow mb-2">Nearby parking</p>
            <h2 className="section-title text-2xl">{entry.nearbyParking.length} trailheads nearby</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {entry.nearbyParking.map((lot) => (
                <div key={lot.id} className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition">
                  <div className="flex items-start gap-3">
                    <ParkingCircle className="h-5 w-5 text-sun flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary">{lot.name}</p>
                      <p className="text-xs text-text-muted mt-1">{lot.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities */}
        {entry.route.activities.length > 0 && (
          <section>
            <p className="eyebrow mb-2">Perfect for</p>
            <h2 className="section-title text-2xl">Ideal activities</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {entry.route.activities.map((activity) => (
                <div
                  key={activity}
                  className="rounded-full border border-forest-light bg-forest-light px-4 py-2 text-sm font-medium text-forest capitalize"
                >
                  {activity}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Link */}
        <div className="text-center pt-4">
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep"
          >
            View all routes
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
