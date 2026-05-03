import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources",
  description: "All environmental data sources used by OpenAir Atlantic.",
};

const SOURCES = [
  {
    org: "Environment and Climate Change Canada",
    shortName: "ECCC / MSC GeoMet",
    url: "https://api.weather.gc.ca/",
    what: "Real-time weather observations, precipitation radar, air quality (AQHI), and the official Environment Canada alert stack used for heat, cold, and coastal flood / storm surge messaging.",
    cost: "Free — no API key required",
    updateFrequency: "Weather: every 10 min · Radar: every 6 min · AQHI: every 10 min · Alerts: every 5 min",
    license: "Open Government Licence — Canada",
  },
  {
    org: "Open-Meteo",
    shortName: "Open-Meteo forecast",
    url: "https://open-meteo.com/",
    what: "Short-range forecast support used for OpenAir's near-term rain-window timing, including precipitation probability and estimated minutes until the next band arrives.",
    cost: "Free — no API key required",
    updateFrequency: "Forecast support: refreshed every 10 min",
    license: "Open data terms published by Open-Meteo",
  },
  {
    org: "City of Charlottetown",
    shortName: "Charlottetown facilities",
    url: "https://www.charlottetown.ca/leisure___recreation/facilities/indoor_facilities",
    what: "Facility names and public-facing location details used to surface nearby indoor relief options when OpenAir flags extreme heat or cold in Charlottetown.",
    cost: "Public website",
    updateFrequency: "Reviewed manually as facilities or public details change",
    license: "City of Charlottetown public information",
  },
  {
    org: "Fisheries and Oceans Canada",
    shortName: "DFO — Integrated Water Level System",
    url: "https://api.iwls-sine.azure.cloud-nuage.canada.ca/api/v1/",
    what: "Tide predictions and water level observations for PEI coastal stations — Charlottetown, Summerside, and Georgetown Harbour.",
    cost: "Free — no API key required",
    updateFrequency: "Tides: updated hourly",
    license: "Open Government Licence — Canada",
  },
  {
    org: "DFO / Marine Environmental Data Section (MEDS)",
    shortName: "MEDS Ocean Buoys via CIOOS Atlantic",
    url: "https://cioosatlantic.ca/erddap/",
    what: "Sea surface temperature and wave data from ocean buoys in the Northumberland Strait (C44137) and Gulf of St. Lawrence (C44150) — used for beach water temperature.",
    cost: "Free — no API key required",
    updateFrequency: "Buoy data: hourly",
    license: "Open Government Licence — Canada",
  },
  {
    org: "Anthropic",
    shortName: "Claude AI (claude-sonnet-4-6)",
    url: "https://www.anthropic.com",
    what: "AI interpretation layer — converts raw environmental numbers into plain-English conditions assessments, activity guidance, and local insights for each location.",
    cost: "API usage — not publicly billed to users",
    updateFrequency: "AI summaries cached for 15 minutes per location",
    license: "Anthropic usage policies",
  },
  {
    org: "OpenStreetMap contributors",
    shortName: "OpenStreetMap / Leaflet",
    url: "https://www.openstreetmap.org/",
    what: "Base map tiles used for the interactive PEI location map.",
    cost: "Free",
    updateFrequency: "Map tiles: static (community updated)",
    license: "ODbL — OpenStreetMap contributors",
  },
];

export default function DataSourcesPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Transparency</p>
        <h1 className="section-title text-4xl">Data sources</h1>
        <p className="section-copy mt-4">
          Every number shown in OpenAir Atlantic comes from a Canadian government or open-data
          source. We do not fabricate, estimate, or pay for proprietary data feeds. All sources
          below are publicly accessible, and most are official Canadian public feeds.
        </p>
      </section>

      <section className="space-y-4">
        {SOURCES.map((source) => (
          <div key={source.shortName} className="panel p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">{source.org}</p>
                <h2 className="font-serif text-2xl text-text-primary">{source.shortName}</h2>
              </div>
              <span className="rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-forest">
                {source.cost}
              </span>
            </div>

            <p className="mb-4 text-sm leading-6 text-text-secondary">{source.what}</p>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-bg p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Update frequency
                </p>
                <p className="text-text-secondary">{source.updateFrequency}</p>
              </div>
              <div className="rounded-2xl bg-bg p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Licence
                </p>
                <p className="text-text-secondary">{source.license}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-text-muted">
              Endpoint:{" "}
              <span className="font-mono">{source.url}</span>
            </p>
          </div>
        ))}
      </section>

      <section className="panel p-6">
        <h2 className="font-serif text-xl text-text-primary">A note on accuracy</h2>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Environmental data is inherently uncertain. Weather station readings represent a single
          point in space and time — conditions at a beach may differ from the nearest station a few
          kilometres away. AI interpretations are generated automatically and may not account for
          every local nuance.
        </p>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          OpenAir Atlantic is an informational tool only. Always use your own judgment before making
          outdoor decisions, especially in severe weather or for high-risk activities. See our{" "}
          <a href="/terms" className="font-semibold text-forest underline">
            Terms of Use
          </a>{" "}
          for full limitations.
        </p>
      </section>
    </div>
  );
}
