import { unstable_cache } from "next/cache";

import { CACHE_DURATIONS } from "@/lib/data/locations";
import type { AlertItem, CommunityNotice, Location, ReliefCentre, WaterfrontRisk } from "@/lib/types";
import { titleCase } from "@/lib/utils";

const ATLANTIC_ALERT_OFFICES = ["CWHX"] as const;
const DIRECTORY_LOOKBACK_HOURS = 6;

const LOCATION_ALERT_KEYWORDS: Record<string, string[]> = {
  cavendish: ["Queens County P.E.I.", "Prince Edward Island", "Cavendish"],
  charlottetown: [
    "Queens County P.E.I.",
    "Prince Edward Island",
    "Charlottetown",
    "Hillsborough",
    "Northumberland Strait",
  ],
  greenwich: ["Kings County P.E.I.", "Prince Edward Island", "Greenwich"],
  "confederation-trail": ["Prince County P.E.I.", "Prince Edward Island", "Kensington"],
  "confederation-bridge": ["Prince County P.E.I.", "Prince Edward Island", "Borden-Carleton"],
  "victoria-park": [
    "Queens County P.E.I.",
    "Prince Edward Island",
    "Charlottetown",
    "Hillsborough",
    "Northumberland Strait",
  ],
  "basin-head": ["Kings County P.E.I.", "Prince Edward Island", "Basin Head"],
  "north-cape": ["Prince County P.E.I.", "Prince Edward Island", "North Cape"],
  "brackley-beach": ["Queens County P.E.I.", "Prince Edward Island", "Brackley"],
  "fox-meadow-golf": ["Queens County P.E.I.", "Prince Edward Island", "Stratford", "Charlottetown"],
  "belvedere-golf": ["Queens County P.E.I.", "Prince Edward Island", "Charlottetown"],
  "cavendish-campground": ["Queens County P.E.I.", "Prince Edward Island", "Cavendish"],
  "stanhope-campground": ["Queens County P.E.I.", "Prince Edward Island", "Stanhope"],
  summerside: ["Prince County P.E.I.", "Prince Edward Island", "Summerside"],
  "charlottetown-airport": ["Queens County P.E.I.", "Prince Edward Island", "Charlottetown"],
};

const COMMUNITY_NOTICE_LOCATION_IDS = new Set(["charlottetown", "victoria-park"]);

const CHARLOTTETOWN_RELIEF_CENTRES: ReliefCentre[] = [
  {
    name: "Eastlink Centre",
    address: "46 Kensington Rd, Charlottetown, PE",
    note: "Large indoor public facility with washrooms and seating areas.",
  },
  {
    name: "Bell Aliant Centre",
    address: "560 University Ave, Charlottetown, PE",
    note: "Indoor aquatics and recreation complex with public lobby space.",
  },
  {
    name: "Simmons Sports Centre",
    address: "170 North River Rd, Charlottetown, PE",
    note: "Indoor walking track and community facility space.",
  },
];

function normalizeWhitespace(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#xA;|&#10;/gi, " ");
}

function extractFirstTag(content: string, tagName: string) {
  const match = content.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? normalizeWhitespace(match[1]) : null;
}

function extractBlocks(content: string, tagName: string) {
  return Array.from(
    content.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi")),
    (match) => match[1],
  );
}

function summarizeDescription(description: string) {
  if (!description) return "";

  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const summary = sentences.slice(0, 2).join(" ");
  return summary.length <= 320 ? summary : `${summary.slice(0, 317).trimEnd()}...`;
}

function inferAlertKind(event: string, headline: string, description: string): AlertItem["kind"] {
  const text = `${event} ${headline} ${description}`.toLowerCase();

  if (text.includes("storm surge")) return "storm-surge";
  if (text.includes("coastal flood") || text.includes("coastal flooding")) return "coastal-flood";
  if (text.includes("heat warning") || text.includes("extreme heat")) return "extreme-heat";
  if (text.includes("cold warning") || text.includes("extreme cold") || text.includes("wind chill")) {
    return "extreme-cold";
  }

  return "weather";
}

function mapSeverity(event: string, rawSeverity: string | null): AlertItem["severity"] {
  const text = `${event} ${rawSeverity ?? ""}`.toLowerCase();

  if (text.includes("warning") || text.includes("severe") || text.includes("extreme")) return "warning";
  if (text.includes("watch")) return "watch";
  return "info";
}

function parseCapAlert(xml: string): AlertItem | null {
  const infoBlocks = extractBlocks(xml, "info");
  const info =
    infoBlocks.find((block) => {
      const language = extractFirstTag(block, "language");
      return language ? language.toLowerCase().startsWith("en") : false;
    }) ?? infoBlocks[0];

  if (!info) return null;

  const event = extractFirstTag(info, "event") ?? "Weather alert";
  const headline = extractFirstTag(info, "headline") ?? titleCase(event.toLowerCase());
  const description = extractFirstTag(info, "description") ?? headline;
  const severityRaw = extractFirstTag(info, "severity");
  const issuedAt = extractFirstTag(xml, "sent") ?? undefined;
  const expiresAt = extractFirstTag(info, "expires") ?? undefined;
  const areaDescriptions = extractBlocks(info, "area")
    .map((areaBlock) => extractFirstTag(areaBlock, "areaDesc"))
    .filter((value): value is string => Boolean(value));

  const kind = inferAlertKind(event, headline, description);
  const severity = mapSeverity(event, severityRaw);

  return {
    title: headline,
    severity,
    summary: summarizeDescription(description) || headline,
    source: "environment-canada",
    kind,
    areas: areaDescriptions,
    issuedAt,
    expiresAt,
  };
}

function buildRecentUtcDirectoryKeys() {
  const now = new Date();
  const directories: Array<{ dateKey: string; hourKey: string }> = [];

  for (let offset = 0; offset < DIRECTORY_LOOKBACK_HOURS; offset += 1) {
    const candidate = new Date(now.getTime() - offset * 60 * 60 * 1000);
    const dateKey = [
      candidate.getUTCFullYear(),
      String(candidate.getUTCMonth() + 1).padStart(2, "0"),
      String(candidate.getUTCDate()).padStart(2, "0"),
    ].join("");
    const hourKey = String(candidate.getUTCHours()).padStart(2, "0");
    directories.push({ dateKey, hourKey });
  }

  return directories;
}

async function fetchDirectoryFileUrls(dateKey: string, office: string, hourKey: string) {
  const url = `https://dd.weather.gc.ca/today/alerts/cap/${dateKey}/${office}/${hourKey}/`;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATIONS.alerts },
    });

    if (!response.ok) return [];

    const html = await response.text();
    const filenames = Array.from(
      html.matchAll(/href="([^"]+\.cap)"/gi),
      (match) => match[1],
    );

    return filenames.map((filename) => `${url}${filename}`);
  } catch {
    return [];
  }
}

function compareIssuedAt(left: AlertItem, right: AlertItem) {
  return new Date(right.issuedAt ?? 0).getTime() - new Date(left.issuedAt ?? 0).getTime();
}

function dedupeAlerts(alerts: AlertItem[]) {
  const latestByKey = new Map<string, AlertItem>();

  for (const alert of alerts) {
    const key = `${alert.kind ?? alert.title}|${(alert.areas ?? []).join("|")}`;
    const existing = latestByKey.get(key);

    if (!existing || compareIssuedAt(alert, existing) < 0) {
      latestByKey.set(key, alert);
    }
  }

  return [...latestByKey.values()].sort((left, right) => {
    const severityRank = { warning: 0, watch: 1, info: 2 } as const;
    const severityDelta = severityRank[left.severity] - severityRank[right.severity];
    return severityDelta !== 0 ? severityDelta : compareIssuedAt(left, right);
  });
}

async function fetchActiveEnvironmentCanadaAlertsInternal() {
  const directoryKeys = buildRecentUtcDirectoryKeys();
  const fileUrlSets = await Promise.all(
    directoryKeys.flatMap(({ dateKey, hourKey }) =>
      ATLANTIC_ALERT_OFFICES.map((office) => fetchDirectoryFileUrls(dateKey, office, hourKey)),
    ),
  );

  const fileUrls = [...new Set(fileUrlSets.flat())].slice(0, 48);
  if (!fileUrls.length) return [];

  const alerts = await Promise.all(
    fileUrls.map(async (fileUrl) => {
      try {
        const response = await fetch(fileUrl, {
          next: { revalidate: CACHE_DURATIONS.alerts },
        });

        if (!response.ok) return null;
        return parseCapAlert(await response.text());
      } catch {
        return null;
      }
    }),
  );

  return dedupeAlerts(alerts.filter((alert): alert is AlertItem => Boolean(alert)));
}

export const getActiveEnvironmentCanadaAlerts = unstable_cache(
  fetchActiveEnvironmentCanadaAlertsInternal,
  ["openair-environment-canada-alerts-v1"],
  { revalidate: CACHE_DURATIONS.alerts },
);

function alertMatchesKeywords(alert: AlertItem, keywords: string[]) {
  const haystacks = [...(alert.areas ?? []), alert.title, alert.summary].map((value) => value.toLowerCase());
  return keywords.some((keyword) => haystacks.some((haystack) => haystack.includes(keyword.toLowerCase())));
}

export function getEnvironmentCanadaAlertsForLocation(location: Location, alerts: AlertItem[]) {
  const keywords = LOCATION_ALERT_KEYWORDS[location.id] ?? [location.name, "Prince Edward Island"];
  return alerts.filter((alert) => alertMatchesKeywords(alert, keywords));
}

export function buildCommunityNotice(location: Location, alerts: AlertItem[]): CommunityNotice | null {
  if (!COMMUNITY_NOTICE_LOCATION_IDS.has(location.id)) return null;

  const triggerAlert =
    alerts.find((alert) => alert.kind === "extreme-heat") ??
    alerts.find((alert) => alert.kind === "extreme-cold");

  if (!triggerAlert) return null;

  const cooling = triggerAlert.kind === "extreme-heat";

  return {
    mode: cooling ? "cooling" : "warming",
    headline: cooling ? "Cooling spaces worth knowing today" : "Warming spaces worth knowing today",
    summary: cooling
      ? `${triggerAlert.summary} If the heat starts to feel like the real risk, these indoor Charlottetown facilities are the quickest relief options nearby.`
      : `${triggerAlert.summary} If the cold is the main problem today, these indoor Charlottetown facilities are the best warm-up options nearby.`,
    trigger: triggerAlert.title,
    centres: CHARLOTTETOWN_RELIEF_CENTRES,
    disclaimer: "Facility availability can shift with programming. Check the latest municipal hours before heading over.",
  };
}

export function buildWaterfrontRisk(location: Location, alerts: AlertItem[]): WaterfrontRisk | null {
  if (location.id !== "charlottetown") return null;

  const triggerAlert =
    alerts.find((alert) => alert.kind === "storm-surge") ??
    alerts.find((alert) => alert.kind === "coastal-flood");

  if (!triggerAlert) return null;

  const level =
    triggerAlert.severity === "warning"
      ? "dangerous"
      : triggerAlert.severity === "watch"
        ? "elevated"
        : "monitor";

  return {
    level,
    headline:
      level === "dangerous"
        ? "Waterfront flooding risk is active"
        : level === "elevated"
          ? "Waterfront flooding risk is elevated"
          : "Keep an eye on the waterfront",
    summary:
      level === "dangerous"
        ? `${triggerAlert.summary} Low boardwalk sections, harbour-edge parking, and exposed lookouts are the first places to feel it.`
        : `${triggerAlert.summary} Harbour-edge sections can turn sloppy faster than inland Charlottetown when the tide and wind line up.`,
    trigger: triggerAlert.title,
    guidance:
      level === "dangerous"
        ? "Skip low-lying waterfront stops, keep vehicles out of flood-prone parking, and treat the harbour edge like an active hazard."
        : "Treat the harbour edge cautiously and keep an eye on low-lying walkways if you are planning a waterfront stop.",
    issuedAt: triggerAlert.issuedAt,
  };
}
