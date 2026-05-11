import { cache } from "react";

import { CACHE_DURATIONS, PEI_TIDE_STATIONS, TIDE_STATION_BY_LOCATION } from "@/lib/data/locations";
import type { TideEvent } from "@/lib/types";

const IWLS_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

interface IwlsDataPoint {
  eventDate: string;
  value: number;
  qcFlagCode?: string;
  timeSeriesId?: string;
}

function stationIdForLocation(locationId: string): string | null {
  const key = TIDE_STATION_BY_LOCATION[locationId];
  if (!key) return null;
  return PEI_TIDE_STATIONS[key];
}

function isoHoursFromNow(hours: number): string {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  return date.toISOString().split(".")[0] + "Z";
}

/**
 * Given an alternating sequence of high/low water level predictions, label
 * each one by comparing it to its neighbours. The DFO wlp-hilo series
 * returns predictions in chronological order without explicit type labels.
 */
function classifyTides(points: IwlsDataPoint[]): TideEvent[] {
  if (points.length === 0) return [];

  return points.map((point, index) => {
    const prev = points[index - 1];
    const next = points[index + 1];

    let type: "High" | "Low";
    if (prev && next) {
      type = point.value > prev.value && point.value > next.value ? "High" : "Low";
    } else if (prev) {
      type = point.value > prev.value ? "High" : "Low";
    } else if (next) {
      type = point.value > next.value ? "High" : "Low";
    } else {
      // Single point — best guess: 1.5m is roughly mid-tide for PEI stations.
      type = point.value > 1.5 ? "High" : "Low";
    }

    return {
      type,
      time: point.eventDate,
      height: Math.round(point.value * 10) / 10,
    };
  });
}

async function fetchTidePredictions(stationId: string): Promise<TideEvent[]> {
  const from = isoHoursFromNow(-6); // include the most recent past tide for context
  const to = isoHoursFromNow(48); // next two days
  const params = new URLSearchParams({
    "time-series-code": "wlp-hilo",
    from,
    to,
  });

  const response = await fetch(`${IWLS_BASE}/stations/${stationId}/data?${params.toString()}`, {
    next: { revalidate: CACHE_DURATIONS.tides },
  });

  if (!response.ok) return [];

  const json = (await response.json()) as IwlsDataPoint[];
  if (!Array.isArray(json) || json.length === 0) return [];

  return classifyTides(json);
}

/**
 * Returns the next 4 tide events (high and low) for a given location.
 * Filters out events that have already passed; returns [] if no live
 * station mapping exists or the API call fails.
 */
export const getLiveTides = cache(async (locationId: string): Promise<TideEvent[]> => {
  const stationId = stationIdForLocation(locationId);
  if (!stationId) return [];

  try {
    const all = await fetchTidePredictions(stationId);
    const now = Date.now();
    // Keep events from the last 30 minutes onwards so users see "current tide"
    // context, then pad up to 4 events ahead.
    const cutoff = now - 30 * 60 * 1000;
    return all.filter((event) => new Date(event.time).getTime() >= cutoff).slice(0, 4);
  } catch {
    return [];
  }
});
