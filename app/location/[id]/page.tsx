import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Droplets, Gauge, Navigation, ParkingCircle, PawPrint, Thermometer, Waves, Wind } from "lucide-react";
import { notFound } from "next/navigation";

import { MeteorologistInsight } from "@/components/ai/MeteorologistInsight";
import { ActivityGrid } from "@/components/conditions/ActivityGrid";
import { NearbyRoutes } from "@/components/routes/NearbyRoutes";
import { PawBadge } from "@/components/conditions/PawBadge";
import { ConditionsCard } from "@/components/conditions/ConditionsCard";
import { WindowAlert } from "@/components/conditions/WindowAlert";
import { PEIMap } from "@/components/map/PEIMap";
import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { CommunityNoticeCard } from "@/components/ui/CommunityNoticeCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { DynamicFAQSection } from "@/components/faq/DynamicFAQSection";
import { TideCard } from "@/components/ui/TideCard";
import { UVTimer } from "@/components/ui/UVTimer";
import { WaterfrontRiskCard } from "@/components/ui/WaterfrontRiskCard";
import { getAllLocationMapStubs, getLocationConditions } from "@/lib/environment";
import { PEI_LOCATIONS } from "@/lib/data/locations";
import { waterTempLabel } from "@/lib/water";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import HistoryContext from "@/components/weather/HistoryContext";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LocationJsonLd } from "@/components/seo/LocationJsonLd";
import { ObservationJsonLd } from "@/components/seo/ObservationJsonLd";
import { WeatherFaqJsonLd } from "@/components/seo/WeatherFaqJsonLd";

export const revalidate = 600;

const LOCATION_HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  cavendish: { src: "/get-images/cavendish.jpg", alt: "Cavendish Beach red sand and blue water, PEI" },
  charlottetown: { src: "/get-images/charlottetown-waterfront.jpg", alt: "Charlottetown waterfront at golden hour" },
  greenwich: { src: "/get-images/dunes.jpg", alt: "Greenwich Dunes boardwalk through coastal dunes" },
  "confederation-trail": { src: "/get-images/confederation-trail.jpg", alt: "Confederation Trail flat path through PEI countryside" },
  "confederation-bridge": { src: "/get-images/confederationbridege.jpg", alt: "Confederation Bridge spanning the Northumberland Strait" },
  "victoria-park": { src: "/get-images/victoria-park.jpg", alt: "Victoria Park trees and waterfront, Charlottetown" },
  "basin-head": { src: "/basinhead-hero.png", alt: "Basin Head singing sands beach, PEI" },
  "north-cape": { src: "/get-images/northcape.jpg", alt: "North Cape lighthouse and wind turbines, PEI" },
  "brackley-beach": { src: "/brackley.webp", alt: "Brackley Beach dunes and shoreline, PEI" },
  "fox-meadow-golf": { src: "/get-images/fooxmeadow.jpg", alt: "Fox Meadow Golf Course fairway, Stratford PEI" },
  "belvedere-golf": { src: "/get-images/Belvedere.webp", alt: "Belvedere Golf Club course, Charlottetown PEI" },
  "cavendish-campground": { src: "/get-images/cavendishcamp.jpg", alt: "Cavendish Campground among the trees, PEI" },
  "stanhope-campground": { src: "/get-images/stanhope.jpg", alt: "Stanhope Campground near the beach, PEI" },
  summerside: { src: "/get-images/summerside.webp", alt: "Summerside waterfront along Bedeque Bay" },
  stratford: { src: "/stratford-hero.png", alt: "Town of Stratford welcome sign at golden hour" },
  cornwall: { src: "/cornwall-hero.png", alt: "Cornwall PEI boardwalk along the West River" },
  "tea-hill": { src: "/tea-hill-hero.jpg", alt: "Tea Hill Provincial Park beach and Hillsborough Bay, Stratford PEI" },
};

const SCORE_PILL: Record<string, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

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

  const name = entry.location.name;
  const score = entry.conditions.score;
  const desc = `${score} conditions at ${name} right now. ${entry.conditions.summary.slice(0, 120)}`;

  return {
    title: name,
    description: desc,
    openGraph: {
      title: `${name} — ${score} conditions | OpenAir Atlantic`,
      description: desc,
      url: `https://openairatlantic.com/location/${id}`,
      images: [
        {
          url: `/api/og?location=${encodeURIComponent(name)}&score=${encodeURIComponent(score)}`,
          width: 1200,
          height: 630,
          alt: `${name} outdoor conditions — OpenAir Atlantic`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${score} | OpenAir Atlantic`,
      description: desc,
      images: [`/api/og?location=${encodeURIComponent(name)}&score=${encodeURIComponent(score)}`],
    },
    alternates: {
      canonical: `https://openairatlantic.com/location/${id}`,
    },
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

  const allLocations = await getAllLocationMapStubs();

  const hero = LOCATION_HERO_IMAGES[id];
  const heroPill = SCORE_PILL[entry.conditions.score];

  return (
    <>
      <LocationJsonLd location={entry.location} />
      <ObservationJsonLd location={entry.location} weather={entry.weather} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Explore PEI", url: "/explore" },
          { name: entry.location.name, url: `/location/${id}` },
        ]}
      />
      {entry.location.faqs && entry.location.faqs.length > 0 && (
        <WeatherFaqJsonLd
          anchorId={`https://openairatlantic.com/location/${id}#faq`}
          faqs={entry.location.faqs.map(({ q, a }) => ({ question: q, answer: a }))}
        />
      )}

      {/* FULL-BLEED HERO */}
      {hero ? (
        <div className="relative w-full overflow-hidden bg-[#F2F4EF] aspect-[21/9] sm:aspect-[16/7] lg:aspect-[21/8]">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:pb-10 lg:pb-14 space-y-2">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/85 font-semibold">
                Live conditions · {entry.location.name}, Prince Edward Island
              </p>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {entry.location.name}, <span className="text-[#7DC832]">right now</span>
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="page-shell pt-6 pb-0">
          <section className="panel p-5 sm:p-6">
            <p className="eyebrow mb-2">{entry.location.type}</p>
            <h1 className="section-title text-2xl sm:text-4xl">{entry.location.name}</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-text-secondary">
              {entry.location.tagline}
            </p>
          </section>
        </div>
      )}

    <div className="page-shell space-y-6">
      {/* Back nav + score pill row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/explore" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm text-sm font-semibold text-text-secondary">
          <ArrowLeft className="h-4 w-4" />
          Explore
        </Link>
        {heroPill && (
          <div className={`${heroPill.bg} ${heroPill.text} inline-flex items-center gap-2 rounded-full px-3 py-1.5`}>
            <span className={`${heroPill.dot} h-2 w-2 rounded-full`} aria-hidden />
            <span className="text-sm font-bold tracking-wide">{entry.conditions.score}</span>
          </div>
        )}
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <ConditionsCard entry={entry} compact />
        </div>
        <div className="space-y-5">
          <WindowAlert
            minutes={entry.conditions.windowMinutes}
            statement={entry.conditions.windowStatement}
          />
          <MeteorologistInsight text={entry.conditions.insightOfTheDay} />
          <HistoryContext locationName={entry.location.name} forecastHigh={entry.weather.temperature} />
        </div>
      </section>

      {(entry.communityNotice || entry.waterfrontRisk) && (
        <section className="grid gap-4 lg:grid-cols-2">
          {entry.communityNotice && <CommunityNoticeCard notice={entry.communityNotice} />}
          {entry.waterfrontRisk && <WaterfrontRiskCard risk={entry.waterfrontRisk} />}
        </section>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow mb-2">Map context</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">{entry.location.name} on the island</h2>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${entry.location.lat},${entry.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 min-h-11 items-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-semibold text-[#2a2a2a] shadow-sun transition hover:bg-sun-deep"
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
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Queen Street right now</h2>
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

      <section className="grid gap-4 lg:grid-cols-3">
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
          <DynamicFAQSection locationId={entry.location.id} />
          {entry.conditions.bridgeStatus && (
            <BridgeStatus
              status={entry.conditions.bridgeStatus}
              windSpeed={entry.weather.windSpeed}
            />
          )}
        </div>

        <div className="space-y-5">
          <NearbyRoutes
            lat={entry.location.lat}
            lng={entry.location.lng}
            weather={entry.weather}
          />
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
              <p className="font-serif text-2xl text-text-primary">{entry.waterTemp}°C</p>
              <p className="mt-1 text-sm text-text-secondary">{waterTempLabel(entry.waterTemp)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── VISITOR INFO ──────────────────────────────────────────── */}
      {entry.location.amenities && (
        <section className="space-y-3">
          <div>
            <p className="eyebrow mb-2">Visitor information</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Before you go</h2>
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
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Is it safe for your dog?</h2>
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
        <section className="space-y-3">
          <div>
            <p className="eyebrow mb-2">Frequently asked questions</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What visitors want to know</h2>
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
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow mb-3">Visitor reviews</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl mb-6">What people are saying</h2>
          <ReviewList locationId={entry.location.id} />
        </div>
        <div>
          <p className="eyebrow mb-3">Share your experience</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl mb-6">Leave a review</h2>
          <ReviewForm locationId={entry.location.id} />
        </div>
      </section>
    </div>
    </>
  );
}
