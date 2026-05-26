export const dynamic = "force-dynamic";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getLocationConditions } from "@/lib/environment";
import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getSiteUrl } from "@/lib/site";
import type { ConditionsScore, LocationConditions } from "@/lib/types";

export const revalidate = 600;

type WidgetSize = "compact" | "standard" | "hero";

// Locations not in PEI_LOCATIONS that have standalone pages
const STANDALONE_PAGES: Record<string, string> = {
  "st-stephen-nb": "/nb/st-stephen",
};

const SCORE_STYLE: Record<ConditionsScore, { bg: string; text: string; dot: string; border: string }> = {
  Excellent:      { bg: "#E8F5E4", text: "#2D6E24", dot: "#3A8C2F", border: "#BDE3B5" },
  Good:           { bg: "#F2F8EE", text: "#5FA025", dot: "#7DC832", border: "#CDE9A8" },
  Fair:           { bg: "#FDF0D5", text: "#9A6200", dot: "#F5A623", border: "#F5D58A" },
  "Stay Inside":  { bg: "#FCEAE8", text: "#9C2D22", dot: "#C0392B", border: "#F2B0AA" },
};

const ACTIVITY_DOT: Record<"great" | "ok" | "not recommended", string> = {
  great: "#3A8C2F",
  ok: "#F5A623",
  "not recommended": "#C0392B",
};

const ACTIVITY_LABEL: Record<"great" | "ok" | "not recommended", string> = {
  great: "Great",
  ok: "OK",
  "not recommended": "Skip",
};

function parseSize(value: string | string[] | undefined): WidgetSize {
  if (value === "standard") return "standard";
  if (value === "hero") return "hero";
  return "compact";
}

function resolveLocationId(town: string) {
  const pei = PEI_LOCATIONS.find((l) => l.id === town);
  if (pei) return town;
  if (STANDALONE_PAGES[town]) return town;
  return null;
}

function resolveLocationLink(locationId: string, siteUrl: string, size: WidgetSize): string {
  const path = STANDALONE_PAGES[locationId] ?? `/location/${locationId}`;
  return `${siteUrl}${path}?utm_source=widget&utm_medium=embed&utm_campaign=${locationId}&utm_content=${size}`;
}

export async function generateStaticParams() {
  const peiParams = PEI_LOCATIONS.map((location) => ({ town: location.id }));
  const standaloneParams = Object.keys(STANDALONE_PAGES).map((id) => ({ town: id }));
  return [...peiParams, ...standaloneParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const location = PEI_LOCATIONS.find((l) => l.id === town);
  const name = location?.name ?? (STANDALONE_PAGES[town] ? town.replace(/-nb$/, "").replace(/-/g, " ") : "location");
  return {
    title: `${name} conditions widget`,
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

  if (!resolveLocationId(town)) notFound();

  const data = await getLocationConditions(town);
  if (!data) notFound();

  const siteUrl = getSiteUrl();
  const ctaHref = resolveLocationLink(town, siteUrl, size);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "transparent",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        minHeight: 0,
        width: "100%",
      }}
    >
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener"
        style={{
          display: "block",
          width: "100%",
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #E8EDE4",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
          textDecoration: "none",
          fontFamily: "system-ui, -apple-system, sans-serif",
          transition: "box-shadow 0.15s",
        }}
      >
        <WidgetHeader data={data} />
        {size === "compact" && <CompactBody data={data} />}
        {size === "standard" && <StandardBody data={data} />}
        {size === "hero" && <HeroBody data={data} />}
        <WidgetFooter />
      </a>
    </div>
  );
}

function WidgetHeader({ data }: { data: LocationConditions }) {
  const { location, weather, conditions } = data;
  const s = SCORE_STYLE[conditions.score];

  return (
    <div style={{ background: "#fff" }}>
      {/* Top bar: logo + location */}
      <div
        style={{
          padding: "10px 16px 8px",
          borderBottom: "1px solid #F0F4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Image
          src="/openair-logo.png"
          alt="OpenAir Atlantic"
          width={800}
          height={200}
          style={{ height: 20, width: "auto", display: "block" }}
          priority
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8B9286",
          }}
        >
          {location.name}
        </span>
      </div>

      {/* Score + temp row */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Score pill */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: s.bg,
              color: s.text,
              border: `1px solid ${s.border}`,
              borderRadius: 999,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: s.dot,
                flexShrink: 0,
              }}
            />
            {conditions.score}
          </span>
        </div>

        {/* Temperature */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: "#1A1A1A" }}>
            {Math.round(weather.temperature)}°
          </div>
          <div style={{ fontSize: 11, color: "#8B9286", marginTop: 2 }}>
            feels {Math.round(weather.feelsLike)}°
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ data }: { data: LocationConditions }) {
  const { weather } = data;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 1,
        background: "#F0F4EE",
        borderTop: "1px solid #F0F4EE",
        borderBottom: "1px solid #F0F4EE",
      }}
    >
      {[
        { label: "Wind", value: `${Math.round(weather.windSpeed)}`, unit: "km/h" },
        { label: "UV",   value: `${weather.uvIndex}`, unit: "" },
        { label: "Air",  value: `AQHI ${weather.aqhi}`, unit: "" },
      ].map((m) => (
        <div
          key={m.label}
          style={{
            background: "#fff",
            padding: "8px 0",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9BA696" }}>
            {m.label}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 2 }}>
            {m.value}
            {m.unit && <span style={{ fontSize: 10, fontWeight: 400, color: "#6B7366" }}> {m.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CompactBody({ data }: { data: LocationConditions }) {
  return (
    <>
      <div style={{ padding: "0 16px 12px" }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#2A2A2A", fontWeight: 500 }}>
          {data.conditions.headline}
        </p>
      </div>
      <MetricRow data={data} />
    </>
  );
}

function StandardBody({ data }: { data: LocationConditions }) {
  const { conditions } = data;
  const activities = conditions.activities.slice(0, 3);
  return (
    <>
      <div style={{ padding: "0 16px 14px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, lineHeight: 1.45, color: "#1A1A1A" }}>
          {conditions.headline}
        </p>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#4A4A4A" }}>
          {conditions.summary}
        </p>
      </div>

      <MetricRow data={data} />

      {activities.length > 0 && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9BA696", marginBottom: 8 }}>
            Activities right now
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {activities.map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACTIVITY_DOT[a.status], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#2A2A2A", textTransform: "capitalize" }}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {conditions.windowStatement && (
        <div style={{ margin: "12px 16px 0", background: "#FDF0D5", border: "1px solid #F5D08A", borderRadius: 10, padding: "8px 12px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A6200", marginBottom: 3 }}>
            3-hour window
          </div>
          <p style={{ margin: 0, fontSize: 11, color: "#1A1A1A", lineHeight: 1.5 }}>{conditions.windowStatement}</p>
        </div>
      )}

      <div style={{ height: 14 }} />
    </>
  );
}

function HeroBody({ data }: { data: LocationConditions }) {
  const { conditions, tide } = data;
  const nextTide = tide.find((t) => new Date(t.time).getTime() > Date.now()) ?? tide[0];

  return (
    <>
      <div style={{ padding: "0 16px 14px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: "#1A1A1A" }}>
          {conditions.headline}
        </p>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#4A4A4A" }}>
          {conditions.summary}
        </p>
      </div>

      <MetricRow data={data} />

      {conditions.activities.length > 0 && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9BA696", marginBottom: 8 }}>
            Activities right now
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
            {conditions.activities.map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACTIVITY_DOT[a.status], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#2A2A2A", textTransform: "capitalize" }}>
                  {a.name}
                  <span style={{ marginLeft: 4, fontSize: 10, color: ACTIVITY_DOT[a.status], fontWeight: 600 }}>
                    {ACTIVITY_LABEL[a.status]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {conditions.windowStatement && (
        <div style={{ margin: "12px 16px 0", background: "#FDF0D5", border: "1px solid #F5D08A", borderRadius: 10, padding: "9px 12px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A6200", marginBottom: 3 }}>
            3-hour window
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#1A1A1A", lineHeight: 1.5 }}>{conditions.windowStatement}</p>
        </div>
      )}

      {conditions.uvWarning && (
        <div style={{ padding: "10px 16px 0", fontSize: 12, color: "#4A4A4A", lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: "#9A6200" }}>UV: </span>
          {conditions.uvWarning}
        </div>
      )}

      {nextTide && (
        <div
          style={{
            margin: "12px 16px 0",
            borderTop: "1px solid #F0F4EE",
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9BA696" }}>
              Next tide
            </div>
            <div style={{ fontSize: 13, color: "#1A1A1A", marginTop: 2 }}>
              {nextTide.type} · {formatTideTime(nextTide.time)}
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#6B7366" }}>{nextTide.height.toFixed(1)} m</div>
        </div>
      )}

      {conditions.insightOfTheDay && (
        <div
          style={{
            margin: "12px 16px 0",
            borderTop: "1px solid #F0F4EE",
            paddingTop: 10,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9BA696", marginBottom: 4 }}>
            Local insight
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#2A2A2A", lineHeight: 1.6, fontStyle: "italic" }}>
            {conditions.insightOfTheDay}
          </p>
        </div>
      )}

      <div style={{ height: 14 }} />
    </>
  );
}

function WidgetFooter() {
  return (
    <div
      style={{
        padding: "8px 16px",
        borderTop: "1px solid #F0F4EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FAFBF9",
      }}
    >
      <span style={{ fontSize: 10, color: "#9BA696" }}>Live · Environment Canada</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#2D6E24" }}>View full forecast →</span>
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
