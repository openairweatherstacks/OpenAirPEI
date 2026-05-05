import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, AlertCircle, MapPin } from "lucide-react";

import { RoutesMap } from "@/components/map/RoutesMap";
import { RouteFilters } from "@/components/routes/RouteFilters";
import { ALL_CONFEDERATION_ROUTES } from "@/lib/data/routes";
import { getAllLocationConditions } from "@/lib/environment";
import { scoreRoute } from "@/lib/score";

export const revalidate = 600;

export const metadata = {
  title: "Cycling Routes — OpenAir PEI",
  description: "Perfect biking conditions on the Confederation Trail — real-time route scoring.",
};

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{
    difficulty?: string;
    distance?: string;
    activity?: string;
  }>;
}) {
  const { difficulty, distance, activity } = await searchParams;

  const locations = await getAllLocationConditions();
  const charlottetown = locations.find((e) => e.location.id === "charlottetown");
  const weather = charlottetown?.weather;

  if (!weather) {
    return <div className="page-shell mt-8">Unable to load conditions</div>;
  }

  const routeScore = scoreRoute(weather);

  // Filter routes
  const filteredRoutes = ALL_CONFEDERATION_ROUTES.filter((route) => {
    if (difficulty && route.difficulty !== difficulty) return false;
    if (distance) {
      if (distance === "short" && route.distance >= 20) return false;
      if (distance === "medium" && (route.distance < 20 || route.distance > 50)) return false;
      if (distance === "long" && route.distance <= 50) return false;
    }
    if (activity && !route.activities.includes(activity)) return false;
    return true;
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative py-16 px-4 sm:py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-forest-light to-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-forest">
            Confederation Trail Network
          </p>
          <h1 className="font-serif text-4xl leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Perfect biking conditions, right now
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
            Real-time route scoring for the Confederation Trail. 449 km of flat, car-free cycling across PEI.
          </p>

          {/* Conditions Banner */}
          <div className="mt-8 rounded-2xl border border-forest-light bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Right now</p>
                <p className="mt-2 font-serif text-2xl text-text-primary">
                  {routeScore.status === "great"
                    ? "Great conditions"
                    : routeScore.status === "good"
                      ? "Good window"
                      : routeScore.status === "ok"
                        ? "Doable"
                        : "Not recommended"}
                </p>
                <p className="mt-1 text-sm leading-5 text-text-secondary">{routeScore.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-forest">{routeScore.score}/100</p>
                <p className="text-xs text-text-muted mt-1">Route suitability</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-text-muted uppercase">Temperature</p>
                <p className="mt-1 font-semibold text-text-primary">{weather.temperature}°C</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-text-muted uppercase">Wind</p>
                <p className="mt-1 font-semibold text-text-primary">{weather.windSpeed} km/h</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-text-muted uppercase">Visibility</p>
                <p className="mt-1 font-semibold text-text-primary">{weather.visibility} km</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-text-muted uppercase">Rain window</p>
                <p className="mt-1 font-semibold text-text-primary">
                  {weather.precipMinutes === null ? "All day" : weather.precipMinutes === 0 ? "Now" : `${weather.precipMinutes} min`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <div className="page-shell mt-8">
        <div className="mb-8">
          <p className="eyebrow mb-2">Live map</p>
          <h2 className="section-title text-3xl">Trail network overview</h2>
        </div>
        <RoutesMap routes={ALL_CONFEDERATION_ROUTES} />
      </div>

      {/* GRID */}
      <div className="page-shell mt-8 space-y-8">
        <section>
          <div className="mb-6">
            <p className="eyebrow mb-2">Trail network</p>
            <h2 className="section-title text-3xl">Explore the Confederation Trail</h2>
            <p className="section-copy mt-2">
              {filteredRoutes.length} of {ALL_CONFEDERATION_ROUTES.length} routes
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={null}>
            <RouteFilters
              currentDifficulty={typeof difficulty === "string" ? difficulty : null}
              currentDistance={typeof distance === "string" ? distance : null}
              currentActivity={typeof activity === "string" ? activity : null}
              filteredCount={filteredRoutes.length}
              totalCount={ALL_CONFEDERATION_ROUTES.length}
            />
          </Suspense>

          <div className="grid gap-6 lg:grid-cols-2">
            {filteredRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/routes/${route.id}`}
                className={`rounded-2xl border overflow-hidden transition block ${
                  route.type === "main"
                    ? "border-forest-light bg-white shadow-sm hover:shadow-md lg:col-span-2"
                    : "border-border bg-white hover:border-forest-light hover:shadow-sm"
                }`}
              >
                {route.image && (
                  <div className={`relative overflow-hidden ${route.type === "main" ? "h-48" : "h-32"}`}>
                    <Image
                      src={route.image}
                      alt={route.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-forest">
                      {route.type === "main" ? "Main Trail" : "Branch"}
                    </p>
                    {route.letterCode && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                        {route.letterCode}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-text-primary">{route.name}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{route.description}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1.5 text-xs font-medium text-text-primary">
                      <MapPin className="h-3 w-3" />
                      {route.distance} km
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1.5 text-xs font-medium text-text-primary">
                      {route.difficulty}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-text-muted uppercase">Starts</p>
                      <p className="mt-1 text-sm font-medium text-text-primary">{route.startPoint.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase">Ends</p>
                      <p className="mt-1 text-sm font-medium text-text-primary">{route.endPoint.name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Planning your ride</p>
          <h2 className="section-title text-2xl">Everything you need to know</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-medium text-text-primary">Trail rules</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li>✓ Helmets are mandatory</li>
                <li>✓ Stay on the trail</li>
                <li>✓ Alert others when approaching</li>
                <li>✓ Keep pets on a leash</li>
                <li>✓ Take all litter with you</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-text-primary">Surface & conditions</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li>✓ Crushed stone dust</li>
                <li>✓ Flat throughout</li>
                <li>✓ Well-maintained</li>
                <li>✓ 1700+ geocaches</li>
                <li>✓ 911 signs at junctions</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-sun-light p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-sun" />
              <div className="text-sm">
                <p className="font-medium text-text-primary">Report fallen trees</p>
                <p className="mt-1 text-text-secondary">Text to county: Kings (902) 200-2122, Queens (902) 200-6649, Prince (902) 200-1014</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-sm text-text-secondary mb-4">Want more trail info?</p>
          <Link
            href="https://islandtrails.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white hover:bg-forest-deep transition"
          >
            Visit Island Trails <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
