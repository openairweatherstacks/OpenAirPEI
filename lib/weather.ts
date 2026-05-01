import { CACHE_DURATIONS } from "@/lib/data/locations";
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
    precipitation_probability: number;
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

function calculatePrecipMinutes(
  hourly: { time: string[]; precipitation: number[]; precipitation_probability: number[] },
  currentTime: string,
): number | null {
  const currentHour = currentTime.slice(0, 13);
  const startIdx = hourly.time.findIndex((t) => t.startsWith(currentHour));
  if (startIdx === -1) return null;

  for (let i = startIdx; i < hourly.time.length; i++) {
    if ((hourly.precipitation[i] ?? 0) > 0.1 && (hourly.precipitation_probability[i] ?? 0) >= 50) {
      const minutes = (i - startIdx) * 60;
      return minutes > 0 ? minutes : null;
    }
  }
  return null;
}

export async function fetchLiveWeather(location: Location): Promise<WeatherSnapshot | null> {
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
    const c = json.current;

    return {
      temperature: Math.round(c.temperature_2m * 10) / 10,
      feelsLike: Math.round(c.apparent_temperature * 10) / 10,
      windSpeed: Math.round(c.wind_speed_10m),
      gustSpeed: Math.round(c.wind_gusts_10m),
      windDirection: degreesToCardinal(c.wind_direction_10m),
      humidity: Math.round(c.relative_humidity_2m),
      uvIndex: Math.max(0, Math.round(c.uv_index * 10) / 10),
      precipProbability: Math.round(c.precipitation_probability),
      precipMinutes: calculatePrecipMinutes(json.hourly, c.time),
      aqhi: 2,
      visibility: Math.round(c.visibility / 100) / 10,
      pressure: Math.round(c.surface_pressure),
      conditionText: wmoToConditionText(c.weather_code),
      observationTime: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
