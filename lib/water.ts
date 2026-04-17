import { CACHE_DURATIONS } from "@/lib/data/locations";

// Seasonal water temperature baseline for PEI (°C) — used as fallback
// Gulf of St. Lawrence warms faster than Northumberland Strait
const PEI_SEASONAL_WATER_TEMPS: Record<number, number> = {
  1: 1,   // January
  2: 0,   // February
  3: 1,   // March
  4: 4,   // April
  5: 8,   // May
  6: 14,  // June
  7: 19,  // July
  8: 21,  // August
  9: 19,  // September
  10: 14, // October
  11: 8,  // November
  12: 3,  // December
};

function getSeasonalFallback(): number {
  const month = new Date().getMonth() + 1;
  return PEI_SEASONAL_WATER_TEMPS[month] ?? 10;
}

// CIOOS Atlantic ERDDAP — DFO/MEDS buoy sea surface temperature
async function fetchBuoyTemp(buoyId: string): Promise<number | null> {
  try {
    const query = new URLSearchParams({
      ".jsonlKVP": "",
    });

    // ERDDAP tabledap query: get latest SSTP reading from the buoy
    const url =
      `https://cioosatlantic.ca/erddap/tabledap/meds_buoys.json` +
      `?station_id,time,SSTP` +
      `&station_id=%22${buoyId}%22` +
      `&time%3E=now-2days` +
      `&orderByMax(%22time%22)`;

    const res = await fetch(url, {
      next: { revalidate: CACHE_DURATIONS.currentConditions },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      table?: { rows?: Array<[string, string, number | null]> };
    };

    const rows = json.table?.rows;
    if (!rows || rows.length === 0) return null;

    const temp = rows[0]?.[2];
    if (typeof temp !== "number" || !Number.isFinite(temp)) return null;

    return Math.round(temp * 10) / 10;
  } catch {
    return null;
  }
}

export async function getWaterTemp(buoyId: string): Promise<number> {
  const live = await fetchBuoyTemp(buoyId);
  return live ?? getSeasonalFallback();
}

export function waterTempLabel(temp: number): string {
  if (temp <= 10) return "Too cold to swim";
  if (temp <= 15) return "Cold — brave swimmers only";
  if (temp <= 18) return "Cool but doable";
  if (temp <= 21) return "Comfortable for most";
  return "Warm — best of the summer";
}
