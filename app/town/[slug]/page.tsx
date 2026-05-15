import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LocationJsonLd } from "@/components/seo/LocationJsonLd";
import { ObservationJsonLd } from "@/components/seo/ObservationJsonLd";
import { WeatherFaqJsonLd } from "@/components/seo/WeatherFaqJsonLd";

import { PEIMap } from "@/components/map/PEIMap";

import { BeachConditionsGrid } from "@/components/town/BeachConditionsGrid";
import { ConditionCards } from "@/components/town/ConditionCards";
import { NearbyTownLinks } from "@/components/town/NearbyTownLinks";
import { ParkConditionsGrid } from "@/components/town/ParkConditionsGrid";
import { StormBanner } from "@/components/town/StormBanner";
import { SunWindowCard } from "@/components/town/SunWindowCard";
import { TonightTomorrowCards } from "@/components/town/TonightTomorrowCards";
import { TownIntelGrid } from "@/components/town/TownIntelGrid";
import { SevenDayForecast } from "@/components/weather/SevenDayForecast";

import { TOWN_PROFILES, getTownProfile } from "@/lib/data/towns";
import { getAllLocationMapStubs, getLocationConditions } from "@/lib/environment";
import { getSiteUrl } from "@/lib/site";
import { getSunWindow } from "@/lib/sun";
import { getWaterTemp } from "@/lib/water";
import { fetchOpenMeteoDailyForecast } from "@/lib/weather";
import { formatClock } from "@/lib/utils";
import type { ConditionsScore } from "@/lib/types";

export const revalidate = 600;
export const dynamicParams = false;

const SCORE_PILL: Record<ConditionsScore, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

export async function generateStaticParams() {
  return Object.keys(TOWN_PROFILES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = getTownProfile(slug);
  if (!profile) return { title: "Town not found" };

  const siteUrl = getSiteUrl();
  return {
    title: `${profile.displayName}, PEI weather, tides & live conditions`,
    description: profile.lede,
    alternates: { canonical: `${siteUrl}/town/${profile.slug}` },
    openGraph: {
      title: `${profile.displayName}, PEI — live conditions`,
      description: profile.lede,
      url: `${siteUrl}/town/${profile.slug}`,
      type: "website",
    },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getTownProfile(slug);
  if (!profile) notFound();

  const data = await getLocationConditions(profile.locationId);
  if (!data) notFound();

  const [charlottetownData, dailyForecast, nearbyData, mapStubs] = await Promise.all([
    getLocationConditions("charlottetown"),
    fetchOpenMeteoDailyForecast(data.location),
    Promise.all(profile.nearbyLocationIds.map((id) => getLocationConditions(id))),
    getAllLocationMapStubs(),
  ]);

  const waterTemp = data.waterTemp ?? (await getWaterTemp("C44137"));
  const sunWindow = getSunWindow(data.location.lat, data.location.lng);
  const nearby = nearbyData.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const charlottetownWeather = charlottetownData?.weather ?? data.weather;

  const siteUrl = getSiteUrl();
  const heroPill = SCORE_PILL[data.conditions.score];

  return (
    <>
      {/* FULL-BLEED HERO IMAGE WITH OVERLAID TITLE */}
      {profile.heroImagePath && (
        <div className="relative w-full overflow-hidden bg-[#F2F4EF] aspect-[21/9] sm:aspect-[16/7] lg:aspect-[21/8]">
          <Image
            src={profile.heroImagePath}
            alt={profile.heroImageAlt ?? `${profile.displayName}, PEI`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Bottom-up dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Overlaid title block, anchored bottom-left, max-width matches page container */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:pb-10 lg:pb-14 space-y-2">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/85 font-semibold">
                Live conditions · {profile.displayName}, Prince Edward Island
              </p>
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {profile.displayName}, <span className="text-[#7DC832]">right now</span>
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-10">
        <LocationJsonLd location={data.location} />
        <ObservationJsonLd location={data.location} weather={data.weather} />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: siteUrl },
            { name: profile.displayName, url: `${siteUrl}/town/${profile.slug}` },
          ]}
        />
        <WeatherFaqJsonLd
          faqs={profile.faqs.map(({ q, a }) => ({ question: q, answer: a }))}
          anchorId="faqs"
        />

        {/* HERO FALLBACK (when no image) — eyebrow + h1 inline */}
        {!profile.heroImagePath && (
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#6B7366] font-semibold">
              Live conditions · {profile.displayName}, Prince Edward Island
            </p>
            <h1
              className="text-3xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight"
              style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
            >
              {profile.displayName}, <span className="text-[#2D6E24]">right now</span>
            </h1>
          </header>
        )}

        {/* LIVE CONDITIONS CARD (the existing card) */}
        <div className="rounded-2xl bg-white border border-[#E8EDE4] p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div
              className={`${heroPill.bg} ${heroPill.text} inline-flex items-center gap-2 rounded-full px-3 py-1.5`}
            >
              <span className={`${heroPill.dot} h-2 w-2 rounded-full`} aria-hidden />
              <span
                className="text-sm font-bold tracking-wide"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {data.conditions.score}
              </span>
            </div>
            <div className="text-right">
              <div
                className="text-4xl sm:text-5xl font-bold leading-none tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {Math.round(data.weather.temperature)}°
              </div>
              <div className="text-xs text-[#6B7366] mt-0.5">
                feels {Math.round(data.weather.feelsLike)}°
              </div>
            </div>
          </div>

          <p
            className="text-xl sm:text-2xl text-[#1A1A1A] leading-snug"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 700 }}
          >
            {data.conditions.headline}
          </p>
          <p className="text-base text-[#4A4A4A] leading-relaxed">{data.conditions.summary}</p>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F2F4EF]">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-[#9BA696]">Wind</div>
              <div className="text-base font-semibold text-[#2A2A2A] mt-0.5">
                {Math.round(data.weather.windSpeed)}
                <span className="text-[10px] font-normal text-[#6B7366]"> km/h {data.weather.windDirection}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-[#9BA696]">UV</div>
              <div className="text-base font-semibold text-[#2A2A2A] mt-0.5">{data.weather.uvIndex}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-[#9BA696]">Air</div>
              <div className="text-base font-semibold text-[#2A2A2A] mt-0.5">AQHI {data.weather.aqhi}</div>
            </div>
          </div>
        </div>

      {/* STORM BANNER (only renders when alerts exist) */}
      {data.alerts.length > 0 && <StormBanner alerts={data.alerts} />}

      {/* 2. WHAT TO DO RIGHT NOW */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
        >
          What to do right now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.conditions.activities.map((activity) => {
            const dot =
              activity.status === "great"
                ? "bg-[#3A8C2F]"
                : activity.status === "ok"
                  ? "bg-[#F5A623]"
                  : "bg-[#C0392B]";
            const label =
              activity.status === "great" ? "Great" : activity.status === "ok" ? "Workable" : "Skip today";
            return (
              <div
                key={activity.name}
                className="rounded-2xl bg-white border border-[#E8EDE4] p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`${dot} h-2 w-2 rounded-full`} aria-hidden />
                  <span
                    className="text-xs uppercase tracking-widest text-[#6B7366] font-semibold"
                    style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
                  >
                    {activity.name}
                  </span>
                </div>
                <p
                  className="text-base font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
                >
                  {label}
                </p>
                <p className="text-[12px] text-[#4A4A4A] leading-snug">{activity.reason}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BEACH CONDITIONS */}
      {profile.beaches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2
              className="text-2xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
            >
              Beach conditions
            </h2>
            <p className="text-[12px] text-[#6B7366]">
              Per-beach live readings · Park info on{" "}
              <a
                href={profile.parksAndTrailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D6E24] underline hover:text-[#1F5018]"
              >
                townofstratford.ca
              </a>
            </p>
          </div>
          <BeachConditionsGrid
            beaches={profile.beaches}
            parksAndTrailsUrl={profile.parksAndTrailsUrl}
          />
        </section>
      )}

      {/* MAP — Stratford-centered with live precipitation radar */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
          >
            Live radar around {profile.displayName}
          </h2>
          <p className="text-[12px] text-[#6B7366]">
            Tap markers for nearby live conditions · Toggle radar to see incoming rain
          </p>
        </div>
        <PEIMap
          locations={mapStubs}
          focusId={profile.locationId}
          highlightRadiusMeters={5000}
        />
      </section>

      {/* 4. TODAY AT STRATFORD PARKS */}
      {profile.parks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2
              className="text-2xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
            >
              Today at {profile.displayName} parks &amp; trails
            </h2>
            <p className="text-[12px] text-[#6B7366]">
              Walking verdict per park · Hours and programs on{" "}
              <a
                href={profile.parksAndTrailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D6E24] underline hover:text-[#1F5018]"
              >
                townofstratford.ca
              </a>
            </p>
          </div>
          <ParkConditionsGrid
            parks={profile.parks}
            location={data.location}
            weather={data.weather}
            parksAndTrailsUrl={profile.parksAndTrailsUrl}
          />
        </section>
      )}

      {/* 5. STRATFORD INTEL BLOCK */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
        >
          {profile.displayName} intel
        </h2>
        <TownIntelGrid
          profile={profile}
          location={data.location}
          weather={data.weather}
          charlottetownWeather={charlottetownWeather}
          waterTemp={waterTemp}
          tides={data.tide}
        />
      </section>

      {/* 4. 3-HOUR WINDOW */}
      {data.conditions.windowStatement && (
        <section className="rounded-2xl bg-[#FDF0D5] border-l-4 border-[#F5A623] px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest text-[#E8960F] font-semibold mb-1">
            3-hour window
          </div>
          <p
            className="text-base sm:text-lg text-[#1A1A1A] leading-snug"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 600 }}
          >
            {data.conditions.windowStatement}
          </p>
        </section>
      )}

      {/* TONIGHT + TOMORROW MORNING (gradient cards) */}
      <TonightTomorrowCards forecast={dailyForecast} />

      {/* SUNRISE / SUNSET */}
      <section>
        <SunWindowCard sunWindow={sunWindow} />
      </section>

      {/* CONDITION CARDS (4-card grid: wind, rain today, severe watch, pressure) */}
      <ConditionCards
        weather={data.weather}
        dailyForecast={dailyForecast}
        alerts={data.alerts}
      />

      {/* 7-DAY FORECAST */}
      <SevenDayForecast
        forecast={dailyForecast}
        title={`${profile.displayName} through the week`}
        subtitle="Daily outlook from Open-Meteo, with current conditions blended from Environment Canada."
      />

      {/* 8. NEARBY ON PEI */}
      {nearby.length > 0 && (
        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
          >
            Live nearby
          </h2>
          <NearbyTownLinks items={nearby} />
        </section>
      )}

      {/* 9. FAQS */}
      <section id="faqs" className="space-y-4">
        <h2
          className="text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
        >
          Frequently asked
        </h2>
        <div className="space-y-2">
          {profile.faqs.map((faq, index) => (
            <details
              key={index}
              className="rounded-2xl bg-white border border-[#E8EDE4] px-5 py-3 group"
            >
              <summary
                className="cursor-pointer text-base font-semibold text-[#1A1A1A] list-none flex items-center justify-between"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {faq.q}
                <span className="text-[#9BA696] group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-sm text-[#4A4A4A] leading-relaxed mt-3 pt-3 border-t border-[#F2F4EF]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. FOOTER EMBED CTA */}
      <footer className="text-xs text-[#6B7366] pt-6 border-t border-[#E8EDE4] flex items-center justify-between gap-4 flex-wrap">
        <span>
          Last observation: {formatClock(data.weather.observationTime)} · Source: Environment Canada,
          ECCC, DFO, Open-Meteo
        </span>
        <Link
          href={`/embed/${profile.slug}`}
          className="text-[#2D6E24] underline font-semibold hover:text-[#1F5018]"
        >
          Embed this on your site →
        </Link>
      </footer>
      </div>
    </>
  );
}
