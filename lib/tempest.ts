import { cache } from "react";

import { CACHE_DURATIONS } from "@/lib/data/locations";

const TEMPEST_API_BASE = "https://swd.weatherflow.com/swd/rest";

interface TempestStationDevice {
  device_id: number;
  device_type: string;
}

interface TempestStationRecord {
  station_id: number;
  name: string;
  public_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  devices?: TempestStationDevice[];
}

interface TempestStationsResponse {
  stations?: TempestStationRecord[];
}

interface TempestObservationRecord {
  air_temperature: number;
  barometric_pressure: number;
  pressure_trend?: string;
  relative_humidity: number;
  precip?: number;
  precip_accum_last_1hr?: number;
  precip_accum_local_day?: number;
  precip_minutes_local_day?: number;
  wind_avg: number;
  wind_direction: number;
  wind_gust: number;
  wind_lull?: number;
  solar_radiation?: number;
  uv?: number;
  lightning_strike_count?: number;
  lightning_strike_count_last_1hr?: number;
  lightning_strike_count_last_3hr?: number;
  feels_like?: number;
  heat_index?: number;
  wind_chill?: number;
  timestamp: number;
}

interface TempestObservationResponse {
  obs?: TempestObservationRecord[];
  station_id: number;
  station_name: string;
  public_name: string;
}

export interface TempestStation {
  stationId: number;
  stationName: string;
  publicName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  deviceId: number | null;
}

export interface TempestObservation {
  stationId: number;
  stationName: string;
  publicName: string;
  airTemperature: number;
  feelsLike: number;
  barometricPressure: number;
  pressureTrend: string | null;
  relativeHumidity: number;
  precip: number;
  precipAccumLastHour: number;
  precipAccumLocalDay: number;
  precipMinutesLocalDay: number;
  windAvgMetersPerSecond: number;
  windDirectionDegrees: number;
  windGustMetersPerSecond: number;
  windLullMetersPerSecond: number;
  solarRadiation: number | null;
  uv: number;
  lightningStrikeCount: number;
  lightningStrikeCountLastHour: number;
  lightningStrikeCountLast3Hours: number;
  timestampIso: string;
}

export interface TempestDailySnapshot {
  date: string; // YYYY-MM-DD in station local time
  tempHigh: number;
  tempLow: number;
  tempAvg: number;
  precipTotal: number;
  windAvg: number;
  windGustMax: number;
  uvIndexMax: number;
}

// Raw field indices in the Tempest device observations array response
const OBS_FIELDS = {
  timestamp: 0,
  windLull: 1,
  windAvg: 2,
  windGust: 3,
  windDirection: 4,
  pressure: 6,
  airTemp: 7,
  humidity: 8,
  illuminance: 9,
  uv: 10,
  solarRadiation: 11,
  precipAccum: 12,
  precipType: 13,
} as const;

function getTempestApiToken() {
  return process.env.TEMPEST_API_TOKEN?.trim() ?? "";
}

function getConfiguredStationId() {
  const value = process.env.TEMPEST_STATION_ID?.trim();
  if (!value) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchTempestJson<T>(path: string): Promise<T | null> {
  const token = getTempestApiToken();
  if (!token) return null;

  const separator = path.includes("?") ? "&" : "?";

  try {
    const response = await fetch(`${TEMPEST_API_BASE}${path}${separator}token=${encodeURIComponent(token)}`, {
      next: { revalidate: CACHE_DURATIONS.tempest },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const getTempestStation = cache(async (): Promise<TempestStation | null> => {
  const configuredStationId = getConfiguredStationId();
  const response = await fetchTempestJson<TempestStationsResponse>("/stations");
  const stations = response?.stations ?? [];

  if (!stations.length) return null;

  const station =
    (configuredStationId
      ? stations.find((candidate) => candidate.station_id === configuredStationId)
      : null) ?? stations[0];

  const outdoorDevice = station.devices?.find((device) => device.device_type === "ST") ?? null;

  return {
    stationId: station.station_id,
    stationName: station.name,
    publicName: station.public_name,
    latitude: station.latitude,
    longitude: station.longitude,
    timezone: station.timezone,
    deviceId: outdoorDevice?.device_id ?? null,
  };
});

interface TempestDeviceObsResponse {
  obs?: number[][];
  timezone?: string;
}

export async function getTempestStationHistory(days = 90): Promise<TempestDailySnapshot[]> {
  const station = await getTempestStation();
  if (!station?.deviceId) return [];

  const now = Math.floor(Date.now() / 1000);
  const start = now - days * 24 * 60 * 60;

  const token = getTempestApiToken();
  if (!token) return [];

  try {
    const url = `${TEMPEST_API_BASE}/observations/device/${station.deviceId}?time_start=${start}&time_end=${now}&token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { next: { revalidate: CACHE_DURATIONS.tempest * 15 } });
    if (!res.ok) return [];

    const data = (await res.json()) as TempestDeviceObsResponse;
    const obs = data.obs ?? [];
    const tz = data.timezone ?? "America/Halifax";

    // Group observations by local date
    const byDate = new Map<string, { temps: number[]; precip: number[]; windAvgs: number[]; windGusts: number[]; uvs: number[] }>();

    for (const row of obs) {
      const ts = row[OBS_FIELDS.timestamp];
      if (!ts) continue;
      const date = new Date(ts * 1000).toLocaleDateString("sv-SE", { timeZone: tz }); // YYYY-MM-DD

      if (!byDate.has(date)) byDate.set(date, { temps: [], precip: [], windAvgs: [], windGusts: [], uvs: [] });
      const bucket = byDate.get(date)!;

      const temp = row[OBS_FIELDS.airTemp];
      const precip = row[OBS_FIELDS.precipAccum];
      const windAvg = row[OBS_FIELDS.windAvg];
      const windGust = row[OBS_FIELDS.windGust];
      const uv = row[OBS_FIELDS.uv];

      if (typeof temp === "number" && isFinite(temp)) bucket.temps.push(temp);
      if (typeof precip === "number" && isFinite(precip)) bucket.precip.push(precip);
      if (typeof windAvg === "number" && isFinite(windAvg)) bucket.windAvgs.push(windAvg * 3.6);
      if (typeof windGust === "number" && isFinite(windGust)) bucket.windGusts.push(windGust * 3.6);
      if (typeof uv === "number" && isFinite(uv)) bucket.uvs.push(uv);
    }

    const snapshots: TempestDailySnapshot[] = [];
    for (const [date, b] of Array.from(byDate.entries()).sort(([a], [c]) => a.localeCompare(c))) {
      if (!b.temps.length) continue;
      snapshots.push({
        date,
        tempHigh: Math.round(Math.max(...b.temps) * 10) / 10,
        tempLow: Math.round(Math.min(...b.temps) * 10) / 10,
        tempAvg: Math.round((b.temps.reduce((s, v) => s + v, 0) / b.temps.length) * 10) / 10,
        precipTotal: Math.round(b.precip.reduce((s, v) => s + v, 0) * 10) / 10,
        windAvg: Math.round((b.windAvgs.length ? b.windAvgs.reduce((s, v) => s + v, 0) / b.windAvgs.length : 0) * 10) / 10,
        windGustMax: Math.round((b.windGusts.length ? Math.max(...b.windGusts) : 0) * 10) / 10,
        uvIndexMax: Math.round((b.uvs.length ? Math.max(...b.uvs) : 0) * 10) / 10,
      });
    }

    return snapshots;
  } catch {
    return [];
  }
}

export async function getTempestLatestObservation(): Promise<TempestObservation | null> {
  const station = await getTempestStation();
  if (!station) return null;

  const response = await fetchTempestJson<TempestObservationResponse>(
    `/observations/station/${station.stationId}`,
  );
  const latest = response?.obs?.[0];

  if (!latest) return null;

  return {
    stationId: response.station_id,
    stationName: response.station_name,
    publicName: response.public_name,
    airTemperature: latest.air_temperature,
    feelsLike:
      latest.feels_like ??
      latest.heat_index ??
      latest.wind_chill ??
      latest.air_temperature,
    barometricPressure: latest.barometric_pressure,
    pressureTrend: latest.pressure_trend ?? null,
    relativeHumidity: latest.relative_humidity,
    precip: latest.precip ?? 0,
    precipAccumLastHour: latest.precip_accum_last_1hr ?? 0,
    precipAccumLocalDay: latest.precip_accum_local_day ?? 0,
    precipMinutesLocalDay: latest.precip_minutes_local_day ?? 0,
    windAvgMetersPerSecond: latest.wind_avg,
    windDirectionDegrees: latest.wind_direction,
    windGustMetersPerSecond: latest.wind_gust,
    windLullMetersPerSecond: latest.wind_lull ?? latest.wind_avg,
    solarRadiation: latest.solar_radiation ?? null,
    uv: latest.uv ?? 0,
    lightningStrikeCount: latest.lightning_strike_count ?? 0,
    lightningStrikeCountLastHour: latest.lightning_strike_count_last_1hr ?? 0,
    lightningStrikeCountLast3Hours: latest.lightning_strike_count_last_3hr ?? 0,
    timestampIso: new Date(latest.timestamp * 1000).toISOString(),
  };
}
