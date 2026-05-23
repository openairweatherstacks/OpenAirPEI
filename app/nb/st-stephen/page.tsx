import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { SubscribeStrip } from "@/components/ui/SubscribeStrip";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { WindowAlert } from "@/components/conditions/WindowAlert";
import { BeachConditionsGrid } from "@/components/town/BeachConditionsGrid";
import { ConditionCards } from "@/components/town/ConditionCards";
import { ParkConditionsGrid } from "@/components/town/ParkConditionsGrid";
import { StormBanner } from "@/components/town/StormBanner";
import { SunWindowCard } from "@/components/town/SunWindowCard";
import { TonightTomorrowCards } from "@/components/town/TonightTomorrowCards";
import { TownIntelGrid } from "@/components/town/TownIntelGrid";
import { SevenDayForecast } from "@/components/weather/SevenDayForecast";

import { getTownProfile } from "@/lib/data/towns";
import { getLocationConditions } from "@/lib/environment";
import { getSiteUrl } from "@/lib/site";
import { getSunWindow } from "@/lib/sun";
import { getWaterTemp } from "@/lib/water";
import { fetchOpenMeteoDailyForecast } from "@/lib/weather";
import { formatClock } from "@/lib/utils";
import type { ConditionsScore } from "@/lib/types";

export const revalidate = 600;

const SCORE_PILL: Record<ConditionsScore, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good:      { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair:      { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  return {
    title: "St. Stephen, NB — Live Weather & Outdoor Conditions | OpenAir Atlantic",
    description:
      "Real-time weather, parks, and outdoor conditions for St. Stephen, New Brunswick — the chocolate capital of Canada on the St. Croix River. Updated every 10 minutes.",
    alternates: { canonical: `${siteUrl}/nb/st-stephen` },
    openGraph: {
      title: "St. Stephen, NB — Live Conditions | OpenAir Atlantic",
      description: "Live weather and outdoor conditions for St. Stephen, NB. Updated every 10 minutes.",
      url: `${siteUrl}/nb/st-stephen`,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "St. Stephen NB — OpenAir Atlantic" }],
    },
    twitter: { card: "summary_large_image", images: ["/og-default.png"] },
  };
}

export default async function StStephenPage() {
  const profile = getTownProfile("st-stephen");
  if (!profile) notFound();

  const data = await getLocationConditions(profile.locationId);
  if (!data) notFound();

  const [dailyForecast, charlottetownData] = await Promise.all([
    fetchOpenMeteoDailyForecast(data.location),
    getLocationConditions("charlottetown"),
  ]);

  const waterTemp = data.waterTemp ?? (await getWaterTemp("C44137"));
  const sunWindow = getSunWindow(data.location.lat, data.location.lng);
  const charlottetownWeather = charlottetownData?.weather ?? data.weather;

  const siteUrl = getSiteUrl();
  const heroPill = SCORE_PILL[data.conditions.score];
  const parksHost = (() => {
    try { return new URL(profile.parksAndTrailsUrl).hostname.replace(/^www\./, ""); }
    catch { return "official site"; }
  })();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "St. Stephen, NB", url: `${siteUrl}/nb/st-stephen` },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-[#F2F4EF] aspect-[21/9] sm:aspect-[16/7] lg:aspect-[21/8]">
        <Image
          src="/ststephen.jpg"
          alt="St. Stephen, New Brunswick waterfront along the St. Croix River"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:pb-12 lg:pb-16 space-y-3">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Live conditions · St. Stephen, New Brunswick
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              St. Stephen
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className={`${heroPill.bg} ${heroPill.text} inline-flex items-center gap-2 rounded-full px-4 py-1.5`}>
                <span className={`${heroPill.dot} h-2 w-2 rounded-full`} aria-hidden />
                <span className="text-sm font-bold tracking-wide">{data.conditions.score}</span>
              </div>
              <p className="text-white/90 text-base sm:text-lg font-medium leading-snug">
                {data.conditions.headline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-10">

        {/* ── STORM BANNER ─────────────────────────────────────────── */}
        {data.alerts.length > 0 && <StormBanner alerts={data.alerts} />}

        {/* ── LIVE CONDITIONS ──────────────────────────────────────── */}
        <section className="rounded-[1.75rem] border border-[#E8EDE4] bg-white p-5 sm:p-7 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">St. Stephen right now</p>
              <div className="font-serif text-6xl sm:text-7xl leading-none text-text-primary">
                {Math.round(data.weather.temperature)}°
              </div>
              <p className="mt-1.5 text-sm text-text-secondary">
                Feels like {Math.round(data.weather.feelsLike)}° · {data.weather.conditionText}
              </p>
            </div>
            <div className={`${heroPill.bg} ${heroPill.text} mt-1 inline-flex items-center gap-2 rounded-full px-4 py-2`}>
              <span className={`${heroPill.dot} h-2.5 w-2.5 rounded-full`} aria-hidden />
              <span className="text-sm font-bold tracking-wide">{data.conditions.score}</span>
            </div>
          </div>

          <p className="font-serif text-xl sm:text-2xl leading-snug text-text-primary">
            {data.conditions.summary}
          </p>

          <div className="grid grid-cols-3 gap-3 border-t border-[#F2F4EF] pt-4">
            <div>
              <p className="eyebrow mb-1.5">Wind</p>
              <p className="font-serif text-lg text-text-primary leading-none">
                {Math.round(data.weather.windSpeed)}
                <span className="text-sm font-sans text-text-secondary"> km/h {data.weather.windDirection}</span>
              </p>
            </div>
            <div>
              <p className="eyebrow mb-1.5">UV</p>
              <p className="font-serif text-lg text-text-primary leading-none">{data.weather.uvIndex}</p>
            </div>
            <div>
              <p className="eyebrow mb-1.5">Air</p>
              <p className="font-serif text-lg text-text-primary leading-none">
                {data.weather.aqhi}
                <span className="text-sm font-sans text-text-secondary"> AQHI</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-text-muted">
            Updated {formatClock(data.weather.observationTime)} · Environment Canada
          </p>
        </section>

        {/* ── 3-HOUR WINDOW ────────────────────────────────────────── */}
        <WindowAlert minutes={data.conditions.windowMinutes} statement={data.conditions.windowStatement} />

        {/* ── ACTIVITY MATCH ───────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Activity match</p>
            <h2 className="section-title text-2xl sm:text-3xl">What to do right now</h2>
          </div>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-3">
            {data.conditions.activities.map((activity) => {
              const bg = activity.status === "great" ? "bg-forest-light border-forest/20" : activity.status === "ok" ? "bg-sun-light border-sun/20" : "bg-rose-50 border-danger/20";
              const dot = activity.status === "great" ? "bg-forest" : activity.status === "ok" ? "bg-sun" : "bg-danger";
              const verdict = activity.status === "great" ? "Great" : activity.status === "ok" ? "Workable" : "Skip today";
              const verdictColor = activity.status === "great" ? "text-forest-deep" : activity.status === "ok" ? "text-sun-text" : "text-danger";
              return (
                <div key={activity.name} className={`flex flex-col rounded-[1.75rem] border p-5 ${bg}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`${dot} h-2 w-2 rounded-full`} aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">{activity.name}</span>
                  </div>
                  <p className={`font-serif text-3xl leading-none ${verdictColor}`}>{verdict}</p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">{activity.reason}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── TONIGHT + TOMORROW ───────────────────────────────────── */}
        <TonightTomorrowCards forecast={dailyForecast} />

        {/* ── BEACHES ──────────────────────────────────────────────── */}
        {profile.beaches.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="eyebrow mb-2">Per-beach live readings</p>
                <h2 className="section-title text-2xl sm:text-3xl">Beach conditions</h2>
              </div>
              <a href={profile.parksAndTrailsUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-forest hover:text-forest-deep underline">
                Park hours &amp; programs → {parksHost}
              </a>
            </div>
            <BeachConditionsGrid beaches={profile.beaches} parksAndTrailsUrl={profile.parksAndTrailsUrl} />
          </section>
        )}

        {/* ── PARKS & TRAILS ───────────────────────────────────────── */}
        {profile.parks.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="eyebrow mb-2">Walking verdict per park</p>
                <h2 className="section-title text-2xl sm:text-3xl">St. Stephen parks &amp; trails today</h2>
              </div>
              <a href={profile.parksAndTrailsUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-forest hover:text-forest-deep underline">
                Hours &amp; info → {parksHost}
              </a>
            </div>
            <ParkConditionsGrid parks={profile.parks} location={data.location} weather={data.weather} parksAndTrailsUrl={profile.parksAndTrailsUrl} />
          </section>
        )}

        {/* ── LOCAL INTEL ──────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Wind · tides · trails</p>
            <h2 className="section-title text-2xl sm:text-3xl">St. Stephen intel</h2>
          </div>
          <TownIntelGrid
            profile={profile}
            location={data.location}
            weather={data.weather}
            charlottetownWeather={charlottetownWeather}
            waterTemp={waterTemp}
            tides={data.tide}
          />
        </section>

        {/* ── SUNRISE / SUNSET ─────────────────────────────────────── */}
        <SunWindowCard sunWindow={sunWindow} />

        {/* ── CONDITION DETAIL CARDS ───────────────────────────────── */}
        <ConditionCards weather={data.weather} dailyForecast={dailyForecast} alerts={data.alerts} townName="St. Stephen" />

        {/* ── 7-DAY FORECAST ───────────────────────────────────────── */}
        <SevenDayForecast
          forecast={dailyForecast}
          title="St. Stephen through the week"
          subtitle="Daily outlook from Open-Meteo, with current conditions from Environment Canada."
        />

        {/* ── FAQS ─────────────────────────────────────────────────── */}
        <section id="faqs" className="space-y-4">
          <div>
            <p className="eyebrow mb-2">Common questions</p>
            <h2 className="section-title text-2xl sm:text-3xl">Frequently asked</h2>
          </div>
          <div className="space-y-2">
            {profile.faqs.map((faq, index) => (
              <details key={index} className="group rounded-[1.75rem] border border-[#E8EDE4] bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-text-primary">
                  {faq.q}
                  <span className="shrink-0 text-text-muted transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 border-t border-[#F2F4EF] pt-3 text-sm leading-7 text-text-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── SUBSCRIBE ────────────────────────────────────────────── */}
        <SubscribeStrip source="nb-st-stephen" />

        {/* ── EMBED CTA ────────────────────────────────────────────── */}
        <section className="rounded-[1.75rem] border border-forest/20 bg-forest-light p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">For businesses &amp; websites</p>
            <p className="font-serif text-xl text-text-primary">Embed live St. Stephen conditions on your site</p>
            <p className="mt-1 text-sm text-text-secondary">Replace your broken weather widget. One line of code. Auto-updates every 10 minutes.</p>
          </div>
          <Link
            href="/embed/st-stephen-nb"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-deep px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest"
          >
            Get the embed →
          </Link>
        </section>

        {/* ── ATTRIBUTION ──────────────────────────────────────────── */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EDE4] pt-5 text-xs text-text-muted">
          <span>Last observation: {formatClock(data.weather.observationTime)} · Environment Canada, ECCC, Open-Meteo</span>
        </footer>
      </div>
    </>
  );
}
