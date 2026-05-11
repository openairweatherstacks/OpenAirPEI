// Maritime Electric outage status for Cameron Heights / Stratford.
//
// Maritime Electric does not publish a public outage API. Their outage map
// is an ArcGIS-backed widget with no clean JSON feed. Until a feed exists,
// outage status is manually entered here when an event occurs.
//
// To report an outage affecting Cameron Heights: edit CURRENT_OUTAGE below
// and redeploy (or set the OUTAGE_* env vars in Vercel — they override the
// hardcoded values without a code change).

export type OutageSeverity = "none" | "advisory" | "active" | "widespread";

export interface OutageStatus {
  severity: OutageSeverity;
  affectedCustomers: number | null;
  area: string;
  cause: string | null;
  estimatedRestoration: string | null; // ISO timestamp or human label
  reportedAt: string | null;            // ISO timestamp
  headline: string;
  detail: string;
}

// Manually maintained state. Set severity to "none" when the lights are on.
const CURRENT_OUTAGE: OutageStatus = {
  severity: "none",
  affectedCustomers: null,
  area: "Cameron Heights, Stratford",
  cause: null,
  estimatedRestoration: null,
  reportedAt: null,
  headline: "No outages reported",
  detail: "Maritime Electric reports normal service across Stratford. We'll flag anything affecting Cameron Heights here as soon as it's known.",
};

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function parseSeverity(value: string | null): OutageSeverity | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v === "none" || v === "advisory" || v === "active" || v === "widespread") {
    return v as OutageSeverity;
  }
  return null;
}

export function getCurrentOutage(): OutageStatus {
  const envSeverity = parseSeverity(readEnv("OUTAGE_SEVERITY"));
  if (!envSeverity) return CURRENT_OUTAGE;

  if (envSeverity === "none") {
    return {
      ...CURRENT_OUTAGE,
      severity: "none",
    };
  }

  const customers = readEnv("OUTAGE_CUSTOMERS");
  const customersNum = customers ? Number(customers) : null;

  return {
    severity: envSeverity,
    affectedCustomers: Number.isFinite(customersNum) ? customersNum : null,
    area: readEnv("OUTAGE_AREA") ?? "Stratford area",
    cause: readEnv("OUTAGE_CAUSE"),
    estimatedRestoration: readEnv("OUTAGE_ETR"),
    reportedAt: readEnv("OUTAGE_REPORTED_AT") ?? new Date().toISOString(),
    headline: readEnv("OUTAGE_HEADLINE") ?? "Power outage reported",
    detail:
      readEnv("OUTAGE_DETAIL") ??
      "Maritime Electric is responding to an outage in the area. Check back here for updates, or call 1-800-670-1012 to report a new outage.",
  };
}

export function describeReportedAt(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const minutesAgo = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutesAgo < 1) return "Just now";
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hr ago`;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function describeETR(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
