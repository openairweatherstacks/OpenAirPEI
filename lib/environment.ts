import { cache } from "react";

import { BEACH_BUOYS, CACHE_DURATIONS, PEI_AQHI, PEI_LOCATIONS } from "@/lib/data/locations";
import { SAMPLE_ALERTS, SAMPLE_TIDES, SAMPLE_WEATHER } from "@/lib/data/sample";
import { getClaudeConditions } from "@/lib/claude";
import {
  buildCommunityNotice,
  buildWaterfrontRisk,
  getActiveEnvironmentCanadaAlerts,
  getEnvironmentCanadaAlertsForLocation,
} from "@/lib/safety";
import { getWaterTemp } from "@/lib/water";
import { fetchLiveWeather } from "@/lib/weather";
import { calculatePawScore, calculateRawScore, getBridgeStatus, getUvBurnMinutes, scoreToLabel } from "@/lib/score";
import type {
  ActivityAssessment,
  AlertItem,
  ConditionsScore,
  ConditionsResponse,
  Location,
  LocationConditions,
  TideEvent,
  WeatherSnapshot,
} from "@/lib/types";
import { formatClock } from "@/lib/utils";

const LIVE_DATA_ENABLED = process.env.OPENAIR_DISABLE_LIVE_DATA !== "true";

function classifyAqhi(aqhi: number) {
  if (aqhi <= 3) return "Air is clean and easy on lungs today.";
  if (aqhi <= 6) return "Air quality is acceptable, but sensitive groups should ease off hard effort.";
  return "Air quality is poor enough to scale back outdoor time, especially for kids and asthma-prone visitors.";
}

function buildHeadline(location: Location, weather: WeatherSnapshot, score: ConditionsScore) {
  if (location.type === "bridge") {
    return weather.windSpeed >= 70
      ? "Bridge travel needs a wind check first"
      : "Bridge is passable, but winds stay noticeable";
  }
  if (score === "Excellent") return `Best window right now at ${location.name}`;
  if (score === "Good") return `${location.name} is in a solid outdoor window`;
  if (score === "Fair") return `${location.name} needs better timing today`;
  return `${location.name} is a poor outdoor bet right now`;
}

function buildSummary(location: Location, weather: WeatherSnapshot, score: ConditionsScore) {
  const intro =
    score === "Excellent"
      ? `${location.name} is in a sweet spot right now with ${weather.conditionText.toLowerCase()}.`
      : score === "Good"
        ? `${location.name} is workable right now, with ${weather.conditionText.toLowerCase()}.`
        : score === "Fair"
          ? `${location.name} is usable, but it takes a bit more planning right now.`
          : `${location.name} is the kind of stop to postpone until conditions improve.`;

  const action =
    weather.precipMinutes && weather.precipMinutes < 120
      ? `Go sooner than later because showers are lining up for around ${formatClock(
          new Date(Date.now() + weather.precipMinutes * 60_000).toISOString(),
        )}.`
      : weather.windSpeed >= 35
        ? `Stick to sheltered routes and keep loose gear packed down.`
        : `If this is your stop, head out now and take advantage of the next couple of hours.`;

  return `${intro} Wind is ${weather.windSpeed} km/h from the ${weather.windDirection}, and the air quality is favorable. ${action}`;
}

function buildInsight(location: Location) {
  if (location.id === "greenwich") {
    return "The boardwalk at Greenwich feels cooler than inland PEI because the gulf breeze reaches the dunes first.";
  }
  if (location.id === "basin-head") {
    return "At Basin Head, east winds can rough up the Singing Sands even when inland spots still feel calm.";
  }
  if (location.id === "confederation-bridge") {
    return "Bridge winds usually feel sharper on the deck than they do on either shore, so roadside calm can be misleading.";
  }
  if (location.id === "north-cape") {
    return "North Cape often holds the island's longest clear views after a frontal passage because the wind scrubs haze out fast.";
  }
  if (location.id === "charlottetown-airport") {
    return "The airport sits in a wind shadow most of the time, so gusts feel lighter on the tarmac than they do on the Charlottetown waterfront just 5 km south.";
  }
  return `${location.name} is getting the kind of Atlantic light that makes short outdoor stops feel longer and better than the numbers suggest.`;
}

function buildActivityStatus(
  activity: string,
  location: Location,
  weather: WeatherSnapshot,
): ActivityAssessment {
  const windy = weather.windSpeed >= 35;
  const wetSoon = Boolean(weather.precipMinutes && weather.precipMinutes <= 120);
  const coldSwim = weather.temperature < 13;

  let status: ActivityAssessment["status"] = "great";
  let reason = "Conditions line up nicely right now.";

  if (activity === "swimming" && (coldSwim || windy)) {
    status = "not recommended";
    reason = coldSwim
      ? "Water-side temperatures still feel too chilly for a comfortable swim."
      : "Surf and wind will make the beach feel rougher than it looks.";
  } else if ((activity === "cycling" || activity === "running") && windy) {
    status = "ok";
    reason = "Still doable, but headwinds will cost you energy on exposed stretches.";
  } else if (activity === "motorcycling" && weather.windSpeed >= 60) {
    status = "not recommended";
    reason = "Crosswinds are strong enough to make the bridge an uncomfortable ride.";
  } else if (activity === "driving" && location.type === "bridge" && weather.windSpeed >= 70) {
    status = "ok";
    reason = "Travel is possible, but higher-profile vehicles should expect restrictions.";
  } else if (wetSoon) {
    status = "ok";
    reason = "You have a decent window, but showers are close enough to keep plans short.";
  }

  return { name: activity, status, reason };
}

function buildWindowStatement(location: Location, weather: WeatherSnapshot) {
  if (!weather.precipMinutes) return null;
  const arrival = new Date(Date.now() + weather.precipMinutes * 60_000).toISOString();
  return `You have about ${weather.precipMinutes} minutes before conditions soften near ${location.name} around ${formatClock(arrival)}.`;
}

function buildUvWarning(uvIndex: number) {
  if (uvIndex < 5) return null;
  return `Fair skin can burn in about ${getUvBurnMinutes(uvIndex)} minutes at UV ${uvIndex}.`;
}

async function buildConditions(
  location: Location,
  weather: WeatherSnapshot,
  alerts: AlertItem[],
): Promise<ConditionsResponse> {
  // Try Claude first — returns null if no API key or call fails
  const aiConditions = await getClaudeConditions(location, weather, alerts);
  if (aiConditions) return aiConditions;

  // Fallback: deterministic template-based conditions
  const rawScore = calculateRawScore(weather);
  const score = scoreToLabel(rawScore);
  const bridgeStatus = location.type === "bridge" ? getBridgeStatus(weather.windSpeed) : null;

  const activities = location.activities.map((activity) =>
    buildActivityStatus(activity, location, weather),
  );

  return {
    score,
    headline: buildHeadline(location, weather, score),
    summary: buildSummary(location, weather, score),
    windowMinutes: weather.precipMinutes,
    windowStatement: buildWindowStatement(location, weather),
    uvWarning: buildUvWarning(weather.uvIndex),
    bridgeStatus,
    activities,
    airQualityStatement:
      alerts.length > 0
        ? `${classifyAqhi(weather.aqhi)} ${alerts[0].title} remains the main travel watch item.`
        : classifyAqhi(weather.aqhi),
    insightOfTheDay: buildInsight(location),
  };
}


async function tryLiveAqhi(locationId: string): Promise<number | null> {
  if (!LIVE_DATA_ENABLED) return null;

  const aqhiLocation =
    locationId === "charlottetown" || locationId === "victoria-park"
      ? PEI_AQHI.charlottetown
      : locationId === "confederation-bridge" || locationId === "confederation-trail"
        ? PEI_AQHI.summerside
        : PEI_AQHI.wellington;

  try {
    const params = new URLSearchParams({
      location_id: aqhiLocation,
      limit: "1",
      f: "json",
    });
    const response = await fetch(
      `https://api.weather.gc.ca/collections/aqhi-observations-realtime/items?${params.toString()}`,
      {
        next: { revalidate: CACHE_DURATIONS.aqhi },
      },
    );

    if (!response.ok) return null;

    const json = (await response.json()) as {
      features?: Array<{ properties?: Record<string, unknown> }>;
    };
    const properties = json.features?.[0]?.properties;
    if (!properties) return null;
    const raw = properties["aqhi"] ?? properties["aqhi_value"] ?? properties["aqhi_forecast"];
    return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  } catch {
    return null;
  }
}


// cache() deduplicates calls within a single server render
// (e.g. generateMetadata + page body both calling for the same id)
export const getLocationConditions = cache(async (locationId: string): Promise<LocationConditions | null> => {
  const location = PEI_LOCATIONS.find((item) => item.id === locationId);
  if (!location) return null;

  const sampleWeather = SAMPLE_WEATHER[locationId];
  const buoyId = BEACH_BUOYS[locationId];
  const [liveWeather, liveAqhi, activeEnvironmentCanadaAlerts, waterTemp] = await Promise.all([
    fetchLiveWeather(location),
    tryLiveAqhi(locationId),
    getActiveEnvironmentCanadaAlerts(),
    buoyId ? getWaterTemp(buoyId) : Promise.resolve(null),
  ]);

  const weather: WeatherSnapshot = liveWeather
    ? { ...liveWeather, aqhi: liveAqhi ?? liveWeather.aqhi }
    : { ...sampleWeather, aqhi: liveAqhi ?? sampleWeather.aqhi };

  const tide = SAMPLE_TIDES[locationId] ?? [];
  const alerts = [
    ...getEnvironmentCanadaAlertsForLocation(location, activeEnvironmentCanadaAlerts),
    ...(SAMPLE_ALERTS[locationId] ?? []),
  ];
  const communityNotice = buildCommunityNotice(location, alerts);
  const waterfrontRisk = buildWaterfrontRisk(location, alerts);
  const conditions = await buildConditions(location, weather, alerts);

  return {
    location,
    weather,
    rawScore: calculateRawScore(weather),
    tide,
    alerts,
    communityNotice,
    waterfrontRisk,
    conditions,
    waterTemp,
    pawIndex: calculatePawScore(weather, location.type),
    source: liveWeather ? "live" : "sample",
  };
});

export async function getAllLocationConditions() {
  const results = await Promise.all(PEI_LOCATIONS.map((location) => getLocationConditions(location.id)));
  return results.filter((item): item is LocationConditions => Boolean(item));
}

// Lightweight version for map markers — fetches live weather but skips Claude, AQHI, and alerts.
// Use this on location detail pages where you only need the pin colours and popups.
async function buildMapStub(location: Location): Promise<LocationConditions> {
  const sampleWeather = SAMPLE_WEATHER[location.id];
  const liveWeather = await fetchLiveWeather(location);
  const weather = liveWeather ?? sampleWeather;
  const rawScore = calculateRawScore(weather);
  const score = scoreToLabel(rawScore);

  return {
    location,
    weather,
    rawScore,
    tide: [],
    alerts: [],
    communityNotice: null,
    waterfrontRisk: null,
    conditions: {
      score,
      headline: buildHeadline(location, weather, score),
      summary: "",
      windowMinutes: weather.precipMinutes,
      windowStatement: buildWindowStatement(location, weather),
      uvWarning: buildUvWarning(weather.uvIndex),
      bridgeStatus: location.type === "bridge" ? getBridgeStatus(weather.windSpeed) : null,
      activities: location.activities.map((a) => buildActivityStatus(a, location, weather)),
      airQualityStatement: classifyAqhi(weather.aqhi),
      insightOfTheDay: "",
    },
    waterTemp: null,
    pawIndex: calculatePawScore(weather, location.type),
    source: liveWeather ? "hybrid" : "sample",
  };
}

export async function getAllLocationMapStubs(): Promise<LocationConditions[]> {
  return Promise.all(PEI_LOCATIONS.map(buildMapStub));
}

export async function getIslandAqhiSummary() {
  const locations = await getAllLocationConditions();
  return locations.map((item) => ({
    id: item.location.id,
    name: item.location.name,
    aqhi: item.weather.aqhi,
    statement: item.conditions.airQualityStatement,
    score: item.conditions.score,
  }));
}

export function getNextTide(tideEvents: TideEvent[]) {
  const now = Date.now();
  return tideEvents.find((event) => new Date(event.time).getTime() >= now) ?? tideEvents[0] ?? null;
}
