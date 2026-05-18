import { RESPONSE_TEMPLATES, type TemplateResponse } from "@/lib/data/responses";
import type { ConditionsScore, WeatherSnapshot } from "@/lib/types";
import { hasCurrentPrecipitation } from "@/lib/score";

type RainState = "none" | "incoming_120min" | "incoming_60min" | "incoming_30min" | "raining_now";
type WindFeel = "calm" | "light" | "breezy" | "gusty" | "dangerous";

function getRainState(weather: WeatherSnapshot): RainState {
  if (hasCurrentPrecipitation(weather) || weather.precipMinutes === 0) return "raining_now";
  if (weather.precipMinutes === null) return "none";
  if (weather.precipMinutes <= 30) return "incoming_30min";
  if (weather.precipMinutes <= 60) return "incoming_60min";
  if (weather.precipMinutes <= 120) return "incoming_120min";
  return "none";
}

function getWindFeel(windSpeed: number): WindFeel {
  if (windSpeed < 15) return "calm";
  if (windSpeed < 25) return "light";
  if (windSpeed < 40) return "breezy";
  if (windSpeed < 60) return "gusty";
  return "dangerous";
}

function scoreKey(score: ConditionsScore): string {
  return score === "Stay Inside" ? "stay_inside" : score.toLowerCase();
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a pre-written template response for the given location + conditions,
// or null if no template covers this combination (Claude handles it instead).
export function getTemplateResponse(
  locationId: string,
  score: ConditionsScore,
  weather: WeatherSnapshot,
): TemplateResponse | null {
  const locationTemplates = RESPONSE_TEMPLATES[locationId];
  if (!locationTemplates) return null;

  const rainState = getRainState(weather);
  const windFeel = getWindFeel(weather.windSpeed);
  const sk = scoreKey(score);

  // Try exact match first, then progressively loosen wind specificity
  const keys = [
    `${sk}_${rainState}_${windFeel}`,
    `${sk}_${rainState}`,
    `${sk}_none_${windFeel}`,
    sk,
  ];

  for (const key of keys) {
    const variants = locationTemplates[key];
    if (variants?.length) return pickRandom(variants);
  }

  return null;
}
