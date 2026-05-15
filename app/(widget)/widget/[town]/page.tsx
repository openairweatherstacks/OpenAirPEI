import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getLocationConditions } from "@/lib/environment";
import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getSiteUrl } from "@/lib/site";
import type { ConditionsScore, LocationConditions } from "@/lib/types";

export const revalidate = 600;

type WidgetSize = "compact" | "standard" | "hero";

const SCORE_PILL: Record<ConditionsScore, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

const ACTIVITY_DOT: Record<"great" | "ok" | "not recommended", string> = {
  great: "bg-[#3A8C2F]",
  ok: "bg-[#F5A623]",
  "not recommended": "bg-[#C0392B]",
};

function parseSize(value: string | string[] | undefined): WidgetSize {
  if (value === "standard") return "standard";
  if (value === "hero") return "hero";
  return "compact";
}

export async function generateStaticParams() {
  return PEI_LOCATIONS.map((location) => ({ town: location.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const location = PEI_LOCATIONS.find((l) => l.id === town);
  return {
    title: location ? `${location.name} conditions widget` : "OpenAir widget",
    robots: { index: false, follow: false },
  };
}

export default async function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ town: string }>;
  searchParams: Promise<{ size?: string | string[] }>;
}) {
  const { town } = await params;
  const { size: rawSize } = await searchParams;
  const size = parseSize(rawSize);

  const data = await getLocationConditions(town);
  if (!data) notFound();

  const siteUrl = getSiteUrl();
  const utmSuffix = `?utm_source=widget&utm_medium=embed&utm_campaign=${data.location.id}&utm_content=${size}`;
  const ctaHref = `${siteUrl}/location/${data.location.id}${utmSuffix}`;

  return (
    <>
      <style>{`
        /* Hide the main site chrome when this page renders (so the widget
           stands alone inside an iframe and doesn't ship the header/footer/nav). */
        body > div > header,
        body > div > footer,
        body > div > nav,
        body > div > [data-widget-hide],
        body > script + div > header,
        body > script + div > footer,
        body > script + div > nav { display: none !important; }
        body > div { padding: 0 !important; margin: 0 !important; }
        body > div > main { padding: 0 !important; margin: 0 !important; }
      `}</style>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-transparent overflow-auto">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener"
          className="block w-full max-w-[600px] rounded-2xl bg-white border border-[#E8EDE4] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          style={{ fontFamily: "var(--font-roboto), system-ui, sans-serif" }}
        >
          <Banner data={data} />
          {size === "compact" ? (
            <CompactBody data={data} />
          ) : size === "standard" ? (
            <StandardBody data={data} />
          ) : (
            <HeroBody data={data} />
          )}
          <Footer />
        </a>
      </div>
    </>
  );
}

function Banner({ data }: { data: LocationConditions }) {
  const { location, weather, conditions } = data;
  const pill = SCORE_PILL[conditions.score];
  return (
    <div className="bg-white">
      <div className="px-4 sm:px-5 pt-3 pb-2 flex items-center justify-between gap-3 border-b border-[#F2F4EF]">
        <Image
          src="/openair-logo.png"
          alt="OpenAir Atlantic"
          width={800}
          height={200}
          className="h-5 sm:h-6 w-auto"
          priority
        />
        <div
          className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6B7366] truncate"
          style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
        >
          {location.name}, PEI
        </div>
      </div>
      <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl sm:text-3xl leading-none flex-shrink-0" aria-hidden>
            {location.icon}
          </span>
          <div
            className={`${pill.bg} ${pill.text} inline-flex items-center gap-2 rounded-full px-3 py-1.5`}
          >
            <span className={`${pill.dot} h-2 w-2 rounded-full`} aria-hidden />
            <span
              className="text-xs sm:text-sm font-bold tracking-wide"
              style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
            >
              {conditions.score}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className="text-3xl sm:text-4xl font-bold leading-none tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
          >
            {Math.round(weather.temperature)}°
          </div>
          <div className="text-[10px] text-[#6B7366] mt-0.5">
            feels {Math.round(weather.feelsLike)}°
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricGrid({ data }: { data: LocationConditions }) {
  const { weather } = data;
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-wide text-[#9BA696]">Wind</div>
        <div className="text-sm sm:text-base font-semibold text-[#2A2A2A] mt-0.5">
          {Math.round(weather.windSpeed)}
          <span className="text-[10px] font-normal text-[#6B7366]"> km/h</span>
        </div>
      </div>
      <div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-wide text-[#9BA696]">UV</div>
        <div className="text-sm sm:text-base font-semibold text-[#2A2A2A] mt-0.5">{weather.uvIndex}</div>
      </div>
      <div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-wide text-[#9BA696]">Air</div>
        <div className="text-sm sm:text-base font-semibold text-[#2A2A2A] mt-0.5">AQHI {weather.aqhi}</div>
      </div>
    </div>
  );
}

function CompactBody({ data }: { data: LocationConditions }) {
  return (
    <div className="px-4 sm:px-5 py-3 space-y-2">
      <p className="text-sm leading-snug text-[#2A2A2A]">{data.conditions.headline}</p>
      <MetricGrid data={data} />
    </div>
  );
}

function StandardBody({ data }: { data: LocationConditions }) {
  const { conditions } = data;
  const visibleActivities = conditions.activities.slice(0, 3);
  return (
    <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3">
      <p
        className="text-base leading-snug text-[#1A1A1A]"
        style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 600 }}
      >
        {conditions.headline}
      </p>
      <p className="text-[13px] leading-relaxed text-[#4A4A4A]">{conditions.summary}</p>

      <MetricGrid data={data} />

      {visibleActivities.length > 0 && (
        <div className="border-t border-[#E8EDE4] pt-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-[#9BA696] font-semibold">
            Activities right now
          </div>
          <div className="grid grid-cols-3 gap-2">
            {visibleActivities.map((activity) => (
              <div key={activity.name} className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`${ACTIVITY_DOT[activity.status]} h-2 w-2 rounded-full flex-shrink-0`}
                  aria-hidden
                />
                <span className="text-[11px] text-[#2A2A2A] capitalize truncate">{activity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {conditions.windowStatement && (
        <div className="bg-[#FDF0D5] border border-[#F5A623]/30 rounded-lg px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-[#E8960F] font-semibold mb-0.5">
            3-hour window
          </div>
          <p className="text-[12px] text-[#1A1A1A] leading-snug">{conditions.windowStatement}</p>
        </div>
      )}
    </div>
  );
}

function HeroBody({ data }: { data: LocationConditions }) {
  const { conditions, tide } = data;
  const nextTide = tide.find((t) => new Date(t.time).getTime() > Date.now()) ?? tide[0];
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
      <p
        className="text-lg sm:text-xl leading-snug text-[#1A1A1A]"
        style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 700 }}
      >
        {conditions.headline}
      </p>
      <p className="text-sm leading-relaxed text-[#4A4A4A]">{conditions.summary}</p>

      <MetricGrid data={data} />

      {conditions.activities.length > 0 && (
        <div className="border-t border-[#E8EDE4] pt-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-[#9BA696] font-semibold">
            Activities right now
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5">
            {conditions.activities.map((activity) => (
              <div key={activity.name} className="flex items-center gap-2 min-w-0">
                <span
                  className={`${ACTIVITY_DOT[activity.status]} h-2 w-2 rounded-full flex-shrink-0`}
                  aria-hidden
                />
                <span className="text-[12px] text-[#2A2A2A] capitalize truncate">{activity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {conditions.windowStatement && (
        <div className="bg-[#FDF0D5] border border-[#F5A623]/30 rounded-lg px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-[#E8960F] font-semibold mb-0.5">
            3-hour window
          </div>
          <p className="text-[12px] text-[#1A1A1A] leading-snug">{conditions.windowStatement}</p>
        </div>
      )}

      {conditions.uvWarning && (
        <div className="text-[12px] text-[#6B7366] leading-snug">
          <span className="font-semibold text-[#E8960F]">UV alert: </span>
          {conditions.uvWarning}
        </div>
      )}

      {nextTide && (
        <div className="border-t border-[#E8EDE4] pt-3 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#9BA696] font-semibold">
              Next tide
            </div>
            <div className="text-sm text-[#1A1A1A]">
              {nextTide.type} · {formatTideTime(nextTide.time)}
            </div>
          </div>
          <div className="text-sm text-[#6B7366]">{nextTide.height.toFixed(1)} m</div>
        </div>
      )}

      {conditions.insightOfTheDay && (
        <div className="border-t border-[#E8EDE4] pt-3">
          <div className="text-[10px] uppercase tracking-wide text-[#9BA696] font-semibold mb-1">
            Local insight
          </div>
          <p
            className="text-[13px] text-[#2A2A2A] leading-relaxed italic"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 400 }}
          >
            {conditions.insightOfTheDay}
          </p>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <div className="px-4 sm:px-5 py-2 border-t border-[#E8EDE4] flex items-center justify-between text-[10px] text-[#6B7366]">
      <span>Live · Environment Canada</span>
      <span className="font-semibold text-[#2D6E24]">View full forecast →</span>
    </div>
  );
}

function formatTideTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CA", {
    timeZone: "America/Halifax",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
