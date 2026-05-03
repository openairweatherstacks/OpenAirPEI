import {
  CACHE_DURATIONS,
  PEI_OBSERVATION_STATION_BY_WEATHER_STATION,
  PEI_OBSERVATION_STATIONS,
} from "@/lib/data/locations";
import type { Location, WeatherSnapshot } from "@/lib/types";

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index: number;
    precipitation?: number;
    precipitation_probability?: number;
    weather_code: number;
    surface_pressure: number;
    visibility: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    precipitation: number[];
  };
}

interface EnvironmentCanadaObservationResponse {
  features?: Array<{
    properties?: Record<string, unknown>;
  }>;
}

type PartialWeatherSnapshot = Partial<WeatherSnapshot>;

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function wmoToConditionText(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Light drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

function presentWeatherToConditionText(code: number): string | null {
  if (code >= 95) return "Thunderstorm";
  if (code >= 80) return "Rain showers";
  if (code >= 71) return "Snow";
  if (code >= 60) return "Rain";
  if (code >= 51) return "Drizzle";
  if (code === 45 || code === 10) return "Mist";
  if (code === 11 || code === 12) return "Fog";
  return null;
}

function cloudCoverToConditionText(cloudCover: number | null): string | null {
  if (cloudCover === null) return null;
  if (cloudCover >= 95) return "Overcast";
  if (cloudCover >= 70) return "Mostly cloudy";
  if (cloudCover >= 35) return "Partly cloudy";
  return "Mostly clear";
}

function pickNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function calculatePrecipMinutes(
  hourly: { time: string[]; precipitation: number[]; precipitation_probability: number[] },
  currentTime: string,
): number | null {
  const currentHour = currentTime.slice(0, 13);
  const startIdx = hourly.time.findIndex((t) => t.startsWith(currentHour));
  if (startIdx === -1) return null;

  for (let i = startIdx; i < hourly.time.length; i++) {
    if ((hourly.precipitation[i] ?? 0) > 0.1 && (hourly.precipitation_probability[i] ?? 0) >= 50) {
      return (i - startIdx) * 60;
    }
  }
  return null;
}

function getCurrentPrecipProbability(
  current: OpenMeteoResponse["current"],
  hourly: OpenMeteoResponse["hourly"],
): number {
  if (typeof current.precipitation_probability === "number" && Number.isFinite(current.precipitation_probability)) {
    return Math.round(current.precipitation_probability);
  }

  const currentHour = current.time.slice(0, 13);
  const hourlyIndex = hourly.time.findIndex((time) => time.startsWith(currentHour));
  if (hourlyIndex === -1) return 0;

  return Math.round(hourly.precipitation_probability[hourlyIndex] ?? 0);
}

async function fetchOpenMeteoForecast(location: Location): Promise<PartialWeatherSnapshot | null> {
  try {
    const params = new URLSearchParams({
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
        "uv_index",
        "precipitation",
        "precipitation_probability",
        "weather_code",
        "surface_pressure",
        "visibility",
      ].join(","),
      hourly: "precipitation_probability,precipitation",
      wind_speed_unit: "kmh",
      timezone: "America/Halifax",
      forecast_hours: "6",
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      next: { revalidate: CACHE_DURATIONS.currentConditions },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as OpenMeteoResponse;
    const current = json.current;

    return {
      temperature: Math.round(current.temperature_2m * 10) / 10,
      feelsLike: Math.round(current.apparent_temperature * 10) / 10,
      windSpeed: Math.round(current.wind_speed_10m),
      gustSpeed: Math.round(current.wind_gusts_10m),
      windDirection: degreesToCardinal(current.wind_direction_10m),
      humidity: Math.round(current.relative_humidity_2m),
      uvIndex: Math.max(0, Math.round(current.uv_index * 10) / 10),
      precipProbability: getCurrentPrecipProbability(current, json.hourly),
      precipMinutes: calculatePrecipMinutes(json.hourly, current.time),
      visibility: Math.round(current.visibility / 100) / 10,
      pressure: Math.round(current.surface_pressure),
      conditionText: wmoToConditionText(current.weather_code),
      conditionCode: current.weather_code,
      currentPrecipitation:
        typeof current.precipitation === "number" && Number.isFinite(current.precipitation)
          ? Math.round(current.precipitation * 10) / 10
          : null,
      observationTime: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function getObservationStationQuery(location: Location): string | null {
  const nearestStation = location.nearestStation as keyof typeof PEI_OBSERVATION_STATION_BY_WEATHER_STATION;
  const observationStationKey = PEI_OBSERVATION_STATION_BY_WEATHER_STATION[nearestStation];
  return observationStationKey ? PEI_OBSERVATION_STATIONS[observationStationKey].queryName : null;
}

function buildEnvironmentCanadaConditionText(properties: Record<string, unknown>): { text: string | null; code: number | null } {
  const primaryCode = pickNumber(properties, ["prsnt_wx_1"]);
  const secondaryCode = pickNumber(properties, ["prsnt_wx_2"]);
  const presentWeather = [primaryCode, secondaryCode]
    .map((value) => (value === null ? null : presentWeatherToConditionText(value)))
    .filter((value): value is string => Boolean(value));

  if (presentWeather.length > 0) {
    return {
      text: Array.from(new Set(presentWeather)).join(" and "),
      code: primaryCode,
    };
  }

  return {
    text: cloudCoverToConditionText(pickNumber(properties, ["tot_cld_amt"])),
    code: primaryCode,
  };
}

async function fetchEnvironmentCanadaObservation(location: Location): Promise<PartialWeatherSnapshot | null> {
  const stationQuery = getObservationStationQuery(location);
  if (!stationQuery) return null;

  try {
    const params = new URLSearchParams({
      "stn_nam-value": stationQuery,
      sortby: "-obs_date_tm",
      limit: "1",
      f: "json",
    });

    const response = await fetch(`https://api.weather.gc.ca/collections/swob-realtime/items?${params.toString()}`, {
      next: { revalidate: CACHE_DURATIONS.currentConditions },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as EnvironmentCanadaObservationResponse;
    const properties = json.features?.[0]?.properties;
    if (!properties) return null;

    const condition = buildEnvironmentCanadaConditionText(properties);
    const windDirection = pickNumber(properties, [
      "avg_wnd_dir_10m_pst2mts",
      "avg_wnd_dir_10m_pst10mts",
      "avg_wnd_dir_10m_pst1hr",
      "avg_wnd_dir_10m_pst1mt",
    ]);
    const currentPrecipitation = pickNumber(properties, [
      "pcpn_amt_pst10mts",
      "rnfl_amt_pst1mt",
      "pcpn_amt_pst1hr",
      "rnfl_amt_pst1hr",
    ]);

    return {
      temperature: pickNumber(properties, ["air_temp"]) ?? undefined,
      windSpeed: pickNumber(properties, [
        "avg_wnd_spd_10m_pst2mts",
        "avg_wnd_spd_10m_pst10mts",
        "avg_wnd_spd_10m_pst1hr",
        "avg_wnd_spd_10m_pst1mt",
      ]) ?? undefined,
      gustSpeed: pickNumber(properties, [
        "max_wnd_gst_spd_10m_pst10mts",
        "max_wnd_spd_10m_pst10mts",
        "max_wnd_spd_10m_pst1hr",
      ]) ?? undefined,
      windDirection: windDirection !== null ? degreesToCardinal(windDirection) : undefined,
      humidity: pickNumber(properties, ["rel_hum"]) ?? undefined,
      visibility: pickNumber(properties, ["vis", "avg_vis_pst10mts"]) ?? undefined,
      pressure: pickNumber(properties, ["mslp", "stn_pres"]) ?? undefined,
      conditionText: condition.text ?? undefined,
      conditionCode: condition.code,
      currentPrecipitation,
      observationTime: pickString(properties, ["obs_date_tm", "date_tm-value"]) ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function fetchLiveWeather(location: Location): Promise<WeatherSnapshot | null> {
  const [forecast, observation] = await Promise.all([
    fetchOpenMeteoForecast(location),
    fetchEnvironmentCanadaObservation(location),
  ]);

  if (!forecast && !observation) return null;

  const merged: WeatherSnapshot = {
    temperature: observation?.temperature ?? forecast?.temperature ?? 0,
    feelsLike: forecast?.feelsLike ?? observation?.temperature ?? forecast?.temperature ?? 0,
    windSpeed: observation?.windSpeed ?? forecast?.windSpeed ?? 0,
    gustSpeed: observation?.gustSpeed ?? forecast?.gustSpeed,
    windDirection: observation?.windDirection ?? forecast?.windDirection ?? "N",
    humidity: observation?.humidity ?? forecast?.humidity ?? 0,
    uvIndex: forecast?.uvIndex ?? 0,
    precipProbability: forecast?.precipProbability ?? 0,
    precipMinutes: forecast?.precipMinutes ?? null,
    aqhi: 2,
    visibility: observation?.visibility ?? forecast?.visibility ?? 0,
    pressure: observation?.pressure ?? forecast?.pressure ?? 0,
    conditionText: observation?.conditionText ?? forecast?.conditionText ?? "Unknown",
    conditionCode: observation?.conditionCode ?? forecast?.conditionCode ?? null,
    currentPrecipitation:
      observation?.currentPrecipitation ?? forecast?.currentPrecipitation ?? null,
    observationTime: observation?.observationTime ?? forecast?.observationTime ?? new Date().toISOString(),
  };

  return merged;
}
