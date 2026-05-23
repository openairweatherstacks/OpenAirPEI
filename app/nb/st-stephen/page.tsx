import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wind, Droplets, Thermometer, ExternalLink } from "lucide-react";

import { getLocationConditions } from "@/lib/environment";
import { getSiteUrl } from "@/lib/site";
import { MetricCard } from "@/components/ui/MetricCard";
import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { UVTimer } from "@/components/ui/UVTimer";
import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import { WindowAlert } from "@/components/conditions/WindowAlert";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "St. Stephen, NB — Live Weather Conditions | OpenAir Atlantic",
  description:
    "Real-time weather conditions for St. Stephen, New Brunswick. Live temperature, wind, air quality, and outdoor verdict — updated every 10 minutes.",
  openGraph: {
    title: "St. Stephen, NB — Live Conditions | OpenAir Atlantic",
    description: "Live weather and outdoor conditions for St. Stephen, NB. Updated every 10 minutes.",
    url: "https://openairatlantic.com/nb/st-stephen",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "St. Stephen NB conditions — OpenAir Atlantic" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
  alternates: { canonical: "https://openairatlantic.com/nb/st-stephen" },
};

const SCORE_PILL = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
} as const;

type SizeSpec = { key: "compact" | "standard" | "hero"; label: string; pitch: string; height: number };

const SIZES: SizeSpec[] = [
  { key: "compact",  label: "Compact",  pitch: "Sidebar or footer — score, headline, key metrics.",           height: 240 },
  { key: "standard", label: "Standard", pitch: "Homepage strip — adds AI summary, activities, 3-hour window.", height: 460 },
  { key: "hero",     label: "Hero",     pitch: "Full tourism hero — meteorologist read with local insight.",   height: 640 },
];

export default async function StStephenPage() {
  const entry = await getLocationConditions("st-stephen-nb");
  if (!entry) notFound();

  const { weather, conditions } = entry;
  const pill = SCORE_PILL[conditions.score];
  const siteUrl = getSiteUrl();

  return (
    <div className="page-shell space-y-8">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="panel p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow mb-2">New Brunswick · Charlotte County</p>
            <h1 className="section-title text-2xl sm:text-3xl">St. Stephen live conditions</h1>
            <p className="section-copy mt-3 max-w-xl">
              Real-time weather for St. Stephen, NB — the chocolate capital of Canada on the St. Croix
              River. Updated every 10 minutes from Environment Canada.
            </p>
          </div>
          <div className={`${pill.bg} ${pill.text} inline-flex items-center gap-2 rounded-full px-4 py-2 shrink-0`}>
            <span className={`${pill.dot} h-2.5 w-2.5 rounded-full`} aria-hidden />
            <span className="text-sm font-bold tracking-wide">{conditions.score}</span>
          </div>
        </div>
      </section>

      {/* ── CONDITIONS SNAPSHOT ────────────────────────────────── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-forest-light p-2 text-forest">
              <Thermometer className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Temperature</p>
          </div>
          <p className="font-serif text-3xl text-text-primary">{weather.temperature}°C</p>
          <p className="text-xs text-text-muted">Feels like {weather.feelsLike}°C</p>
        </div>

        <div className="panel p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-sun-light p-2 text-sun-text">
              <Wind className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Wind</p>
          </div>
          <p className="font-serif text-3xl text-text-primary">{weather.windSpeed} <span className="text-lg">km/h</span></p>
          <p className="text-xs text-text-muted">{weather.windDirection} · Gusts {weather.gustSpeed ?? weather.windSpeed} km/h</p>
        </div>

        <div className="panel p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-forest-light p-2 text-forest">
              <Droplets className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Humidity</p>
          </div>
          <p className="font-serif text-3xl text-text-primary">{weather.humidity}%</p>
          <p className="text-xs text-text-muted">Precipitation {weather.precipProbability}% likely</p>
        </div>

        <div className="panel p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <ScoreBadge score={conditions.score} />
          </div>
          <p className="font-serif text-lg leading-snug text-text-primary mt-1">{conditions.headline}</p>
        </div>
      </section>

      {/* ── AI SUMMARY + WINDOW ────────────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="panel p-6">
          <p className="eyebrow mb-3">Conditions read</p>
          <p className="font-serif text-xl leading-relaxed text-text-primary">{conditions.headline}</p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{conditions.summary}</p>
          {conditions.insightOfTheDay && (
            <p className="mt-4 text-xs italic leading-6 text-text-muted border-t border-border pt-4">
              {conditions.insightOfTheDay}
            </p>
          )}
        </div>
        <div className="space-y-5">
          <WindowAlert minutes={conditions.windowMinutes} statement={conditions.windowStatement} />
          <div className="panel p-5">
            <p className="eyebrow mb-3">Air quality</p>
            <AirQualityBar value={weather.aqhi} />
            <p className="mt-3 text-sm leading-6 text-text-secondary">{conditions.airQualityStatement}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Wind}
          insight={weather.windSpeed >= 30
            ? "Wind is a factor in St. Stephen today — St. Croix River crossings will feel it."
            : "Light wind through the St. Croix valley — comfortable conditions for the downtown area."}
          rawLabel={`${weather.windSpeed} km/h ${weather.windDirection} · Gusts ${weather.gustSpeed ?? weather.windSpeed} km/h`}
          accentClassName="text-sun-text"
        />
        <MetricCard
          icon={Droplets}
          insight={conditions.airQualityStatement}
          rawLabel={`AQHI ${weather.aqhi} · Visibility ${weather.visibility} km`}
          accentClassName="text-forest"
        />
        <UVTimer uvIndex={weather.uvIndex} />
      </section>

      {/* ── EMBED WIDGET SECTION ───────────────────────────────── */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-2">Free embeddable widget</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">
            Put live St. Stephen weather on your site
          </h2>
          <p className="section-copy mt-3 max-w-2xl">
            A free, AI-powered weather widget for St. Stephen — built on Environment Canada data and
            translated into plain-English verdicts. Three sizes for any layout. Copy one line of HTML.
          </p>
        </div>

        {SIZES.map((size, index) => {
          const widgetUrl = `${siteUrl}/widget/st-stephen-nb${size.key === "compact" ? "" : `?size=${size.key}`}`;
          const iframeSnippet = `<iframe src="${widgetUrl}" width="100%" height="${size.height}" style="border:0;max-width:420px" loading="lazy" title="Live St. Stephen, NB weather by OpenAir Atlantic"></iframe>`;

          return (
            <div key={size.key} className="panel p-5 sm:p-6 space-y-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Option {index + 1}</p>
                  <h3 className="text-xl font-bold text-text-primary">{size.label}</h3>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{size.pitch}</p>

              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 items-start">
                <div className="rounded-xl bg-bg border border-border overflow-hidden mx-auto lg:mx-0">
                  <iframe
                    src={`/widget/st-stephen-nb${size.key === "compact" ? "" : `?size=${size.key}`}`}
                    width={420}
                    height={size.height}
                    style={{ border: 0, display: "block", maxWidth: "100%" }}
                    loading="lazy"
                    title={`Live St. Stephen, NB weather — ${size.label.toLowerCase()} preview`}
                  />
                </div>
                <pre className="rounded-xl bg-[#1A1A1A] text-[#F2F8EE] text-[11px] sm:text-xs p-4 overflow-x-auto leading-relaxed self-start whitespace-pre-wrap break-all">
                  <code>{iframeSnippet}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── WHY EMBED ─────────────────────────────────────────── */}
      <section className="rounded-[2rem] bg-forest-light border border-forest/20 p-6 sm:p-8 space-y-4">
        <h2 className="section-title text-xl">Why embed OpenAir Atlantic?</h2>
        <ul className="space-y-3 text-sm leading-7 text-text-secondary">
          <li><strong className="text-text-primary">Free, forever.</strong> No API key, no signup, no subscription. We cover the data costs.</li>
          <li><strong className="text-text-primary">Real local data.</strong> Live readings from Environment Canada — not generic regional forecasts.</li>
          <li><strong className="text-text-primary">AI-powered verdicts.</strong> Visitors get plain-English advice, not just numbers.</li>
          <li><strong className="text-text-primary">Replaces broken widgets instantly.</strong> One line of HTML, works in any CMS.</li>
        </ul>
        <a
          href="mailto:hello@openairatlantic.com"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-deep"
        >
          <ExternalLink className="h-4 w-4" />
          Get in touch for a custom version
        </a>
      </section>

    </div>
  );
}
