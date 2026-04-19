import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, CloudSun, ShieldCheck, Wind } from "lucide-react";

import { MeteorologistInsight } from "@/components/ai/MeteorologistInsight";
import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { LocationGrid } from "@/components/ui/LocationGrid";
import { MetricCard } from "@/components/ui/MetricCard";
import { PEIMap } from "@/components/map/PEIMap";
import { average } from "@/lib/utils";
import { getAllLocationConditions } from "@/lib/environment";
import { Droplets, Thermometer } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locations = await getAllLocationConditions();
  const outdoorLocations = locations.filter((entry) => entry.location.type !== "airport");
  const ranked = [...outdoorLocations].sort((left, right) => right.rawScore - left.rawScore);
  const bestNow = ranked.slice(0, 3);
  const charlottetown = locations.find((e) => e.location.id === "charlottetown");
  const summerside = locations.find((e) => e.location.id === "summerside");
  const bridge = locations.find((entry) => entry.location.id === "confederation-bridge");
  const bridgeStatus = bridge?.conditions.bridgeStatus ?? null;
  const nextShiftEntry = locations
    .filter((entry) => entry.weather.precipMinutes !== null)
    .sort((a, b) => (a.weather.precipMinutes ?? 0) - (b.weather.precipMinutes ?? 0))[0] ?? null;
  const nextShift = nextShiftEntry?.weather.precipMinutes ?? null;
  const islandAqhi = average(locations.map((entry) => entry.weather.aqhi));

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-[82vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/pei.jpg"
          alt="Prince Edward Island coastline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* gradient — dark at bottom for text legibility, subtle at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

        {/* hero content — bottom-left */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Prince Edward Island · Live outdoor conditions
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Should you go outside right now?
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Live weather, radar, air quality, and AI interpretation — for every key spot on the island.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-[#2a2a2a] shadow-sun transition hover:bg-sun-deep"
              >
                Explore best things to do <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/bridge"
                className="inline-flex min-h-11 items-center rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
              >
                Check the bridge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLOATING STAT CARDS ──────────────────────────────────── */}
      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-forest-deep p-4 text-white shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90">Best now</p>
            <p className="mt-1.5 font-serif text-xl">{bestNow[0]?.location.name ?? "Scanning"}</p>
            <p className="mt-1 text-sm leading-5 text-white/85">
              {bestNow[0]?.conditions.headline ?? "Looking across the island."}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/95 p-4 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sun-text">Next shift</p>
            <p className="mt-1.5 font-serif text-xl text-text-primary">
              {nextShift ? `${nextShift} min` : "Holding steady"}
            </p>
            <p className="mt-1 text-sm leading-5 text-text-secondary">
              {nextShiftEntry
                ? `Rain arriving at ${nextShiftEntry.location.name} — heads up if that's your stop.`
                : "No major changes expected across the island right now."}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/95 p-4 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Island air</p>
            <p className="mt-1.5 font-serif text-xl text-text-primary">AQHI {islandAqhi.toFixed(1)}</p>
            <p className="mt-1 text-sm leading-5 text-text-secondary">
              {islandAqhi <= 3
                ? "Air is clean across the island. Fine for everyone including kids and asthma."
                : islandAqhi <= 6
                  ? "Acceptable air quality. Sensitive groups should ease off hard effort outside."
                  : "Air quality is poor. Limit outdoor time, especially for kids and anyone with asthma."}
            </p>
          </div>
        </div>
      </div>

      {/* ── REST OF PAGE ─────────────────────────────────────────── */}
      <div className="page-shell mt-8 space-y-10">

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4">
              <p className="eyebrow mb-2">Live island map</p>
              <h2 className="section-title text-3xl">Key PEI locations at a glance</h2>
            </div>
            <PEIMap locations={locations} />

            {/* ── CITY CONDITIONS STRIP ── */}
            {(charlottetown || summerside) && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[charlottetown, summerside].filter(Boolean).map((entry) => entry && (
                  <div key={entry.location.id} className="rounded-[1.5rem] border border-border bg-white/90 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                      {entry.location.name}
                    </p>
                    <p className="mt-2 font-serif text-2xl text-text-primary">
                      {entry.weather.temperature}°C
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Feels like {entry.weather.feelsLike}°C
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 text-xs font-medium text-forest">
                        <Wind className="h-3 w-3" />
                        {entry.weather.windSpeed} km/h {entry.weather.windDirection}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sun-light px-2.5 py-1 text-xs font-medium text-sun-text">
                        <Droplets className="h-3 w-3" />
                        {entry.weather.humidity}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-text-secondary line-clamp-2">
                      {entry.conditions.headline}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <MeteorologistInsight text={bestNow[0]?.conditions.insightOfTheDay ?? "Island insight is loading."} />
            {bridge && bridgeStatus ? (
              <BridgeStatus status={bridgeStatus} windSpeed={bridge.weather.windSpeed} />
            ) : null}
            <MetricCard
              icon={CloudSun}
              insight="The north shore stays comfortable longest today. Cavendish and the Confederation Trail both have the cleanest mix of sun, air, and manageable wind."
              rawLabel={`Top window · ${bestNow.map((entry) => entry.location.name).join(" · ")}`}
              accentClassName="text-sun-text"
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <MetricCard
            icon={Bike}
            insight="Cycling is strongest through the island interior this afternoon, where westbound routes stay more sheltered than the exposed coasts."
            rawLabel="Activity match · Trail and waterfront rides"
            accentClassName="text-forest"
          />
          <MetricCard
            icon={Wind}
            insight="Bridge wind is the island's sharpest decision point today. The shoreline can feel reasonable while the deck still runs gusty."
            rawLabel={`Bridge wind · ${bridge?.weather.windSpeed ?? "--"} km/h`}
            accentClassName="text-sun-text"
          />
          <MetricCard
            icon={ShieldCheck}
            insight="AQHI is calm enough for kids, visitors, and most asthma-sensitive users to spend time outside without special precautions."
            rawLabel={`Island AQHI · ${islandAqhi.toFixed(1)}`}
            accentClassName="text-forest"
          />
        </section>

        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Location cards</p>
            <h2 className="section-title text-3xl">Where to go, and how long you have</h2>
          </div>
          <LocationGrid locations={ranked} />
        </section>

        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Why OpenAir Atlantic</p>
          <h2 className="section-title text-3xl">Every other option leaves you guessing</h2>
          <p className="section-copy mt-3">Other tools show you numbers. OpenAir tells you what to do.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Weather Network / Dark Sky",
                features: ["Icons and numbers", "No live spatial view", "No activity intelligence"],
                isUs: false,
              },
              {
                name: "Google Weather",
                features: ["Forecast only", "No PEI-specific locations", "No radar"],
                isUs: false,
              },
              {
                name: "Environment Canada",
                features: ["Has radar", "Terrible UX", "No AI interpretation"],
                isUs: false,
              },
              {
                name: "OpenAir Atlantic",
                features: [
                  "Live radar + location dots",
                  "AI interpretation in plain English",
                  "Activity matching — all in one mobile-first view",
                ],
                isUs: true,
              },
            ].map(({ name, features, isUs }) => (
              <div
                key={name}
                className={
                  isUs
                    ? "rounded-[1.75rem] bg-forest-deep p-5 text-white shadow-glow"
                    : "rounded-[1.75rem] border border-border bg-bg p-5"
                }
              >
                <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${isUs ? "text-white/90" : "text-text-muted"}`}>
                  {isUs ? "✦ This app" : "Competitor"}
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

      </div>
    </div>
  );
}
