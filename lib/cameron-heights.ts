import { cache } from "react";

import { buildLocationConditionsEntry, getLiveAqhiReading } from "@/lib/environment";
import { PEI_AQHI, PEI_STATIONS } from "@/lib/data/locations";
import { fetchOpenMeteoDailyForecast, fetchOpenMeteoForecast, type DailyForecastSnapshot } from "@/lib/weather";
import { getActiveEnvironmentCanadaAlerts, getEnvironmentCanadaAlertsForLocation } from "@/lib/safety";
import { getTempestLatestObservation, getTempestStation } from "@/lib/tempest";
import type { Location, LocationConditions, WeatherSnapshot } from "@/lib/types";

export interface CameronHeightsDashboardData {
  entry: LocationConditions;
  stationName: string;
  stationPublicName: string;
  stationDeviceId: number | null;
  pressureTrend: string | null;
  sevenDayForecast: DailyForecastSnapshot[];
  precipLastHour: number;
  precipToday: number;
  precipMinutesToday: number;
  solarRadiation: number | null;
  lightningNow: number;
  lightningLastHour: number;
  lightningLast3Hours: number;
}

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function metersPerSecondToKmh(value: number) {
  return Math.round(value * 3.6);
}

function buildCameronHeightsLocation(
  latitude: number,
  longitude: number,
): Location {
  return {
    id: "cameron-heights",
    name: "Cameron Heights",
    nameFr: "Cameron Heights",
    tagline: "Resident dashboard powered by your on-site Tempest station plus island-wide safety and radar context.",
    lat: latitude,
    lng: longitude,
    type: "community",
    nearestStation: PEI_STATIONS.charlottetown,
    activities: ["walking", "cycling", "driving", "running"],
    icon: "🏡",
  };
}

function mergeTempestAndForecast(
  observation: Awaited<ReturnType<typeof getTempestLatestObservation>>,
  forecast: Awaited<ReturnType<typeof fetchOpenMeteoForecast>>,
  aqhi: number,
): WeatherSnapshot {
  if (!observation) {
    throw new Error("Tempest observation is required to build the Cameron Heights dashboard.");
  }

  const currentPrecipitation = Math.round((observation.precip ?? 0) * 10) / 10;
  const forecastCondition = forecast?.conditionText ?? null;

  return {
    temperature: Math.round(observation.airTemperature * 10) / 10,
    feelsLike: Math.round(observation.feelsLike * 10) / 10,
    windSpeed: metersPerSecondToKmh(observation.windAvgMetersPerSecond),
    gustSpeed: metersPerSecondToKmh(observation.windGustMetersPerSecond),
    windDirection: degreesToCardinal(observation.windDirectionDegrees),
    humidity: Math.round(observation.relativeHumidity),
    uvIndex: Math.max(0, Math.round(observation.uv * 10) / 10),
    precipProbability: forecast?.precipProbability ?? (currentPrecipitation > 0 ? 100 : 0),
    precipMinutes: currentPrecipitation > 0 ? 0 : forecast?.precipMinutes ?? null,
    aqhi,
    visibility: forecast?.visibility ?? 10,
    pressure: Math.round(observation.barometricPressure),
    conditionText:
      currentPrecipitation > 0
        ? "Rain"
        : forecastCondition ?? "Local station report",
    conditionCode:
      currentPrecipitation > 0
        ? 61
        : forecast?.conditionCode ?? null,
    currentPrecipitation,
    observationTime: observation.timestampIso,
  };
}

export const getCameronHeightsDashboardData = cache(
  async (): Promise<CameronHeightsDashboardData | null> => {
    const station = await getTempestStation();
    const observation = await getTempestLatestObservation();

    if (!station || !observation) return null;

    const location = buildCameronHeightsLocation(station.latitude, station.longitude);
    const [forecast, sevenDayForecast, aqhi, activeAlerts] = await Promise.all([
      fetchOpenMeteoForecast(location),
      fetchOpenMeteoDailyForecast(location),
      getLiveAqhiReading(PEI_AQHI.charlottetown),
      getActiveEnvironmentCanadaAlerts(),
    ]);

    const weather = mergeTempestAndForecast(observation, forecast, aqhi ?? 2);
    const alerts = getEnvironmentCanadaAlertsForLocation(location, activeAlerts);
    const entry = await buildLocationConditionsEntry({
      location,
      weather,
      tide: [],
      alerts,
      waterTemp: null,
      source: "live",
    });

    return {
      entry,
      stationName: observation.stationName,
      stationPublicName: observation.publicName,
      stationDeviceId: station.deviceId,
      pressureTrend: observation.pressureTrend,
      sevenDayForecast,
      precipLastHour: Math.round(observation.precipAccumLastHour * 10) / 10,
      precipToday: Math.round(observation.precipAccumLocalDay * 10) / 10,
      precipMinutesToday: observation.precipMinutesLocalDay,
      solarRadiation:
        observation.solarRadiation === null
          ? null
          : Math.round(observation.solarRadiation),
      lightningNow: observation.lightningStrikeCount,
      lightningLastHour: observation.lightningStrikeCountLastHour,
      lightningLast3Hours: observation.lightningStrikeCountLast3Hours,
    };
  },
);
