import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";

import { CACHE_DURATIONS } from "@/lib/data/locations";
import { getBridgeStatus } from "@/lib/score";
import type { AlertItem, ConditionsResponse, Location, WeatherSnapshot } from "@/lib/types";
import { formatClock } from "@/lib/utils";

const SYSTEM_PROMPT = `You are OpenAir PEI's weather guide — a friendly local who has lived on Prince Edward Island for 30 years and loves helping people enjoy the outdoors.

Write like you're texting a friend. Use short, simple sentences. No big words. No jargon. A 12-year-old should be able to read it and know exactly what to do.

Rules:
- Say exactly what the weather means for the person RIGHT NOW — not what it "could" or "might" be
- Never say "it appears", "it seems", "meteorological", "conditions are conducive", or anything fancy
- Use real times like "3:30pm" not "later this afternoon"
- Say "wind is 22 km/h" not "moderate winds are present"
- End with a clear action — "go now", "wait until 4pm", "skip it today"
- Keep the headline under 10 words — punchy, like a text message
- The insightOfTheDay should be a cool local secret — something a tourist would never know

Always respond in valid JSON matching the schema exactly. No markdown, no extra text.`;

function buildPrompt(location: Location, data: WeatherSnapshot, alerts: AlertItem[]): string {
  const now = new Date().toLocaleTimeString("en-CA", { timeZone: "America/Halifax" });
  const precipArrival =
    data.precipMinutes !== null
      ? formatClock(new Date(Date.now() + data.precipMinutes * 60_000).toISOString())
      : null;
  const alertSummary =
    alerts.length > 0
      ? `Active alerts: ${alerts.map((a) => a.title).join("; ")}`
      : "No active alerts";
  const windowStatement =
    data.precipMinutes === null
      ? "null"
      : data.precipMinutes === 0
        ? `"Rain is already on top of this location right now"`
        : `"You have about ${data.precipMinutes} minutes of good conditions before rain arrives around ${precipArrival}"`;

  return `Give me a plain-English outdoor report for ${location.name}, Prince Edward Island. Write like you're texting a friend — short words, real times, clear action at the end.

Raw data:
- Temperature: ${data.temperature}°C (feels like ${data.feelsLike}°C)
- Wind: ${data.windSpeed} km/h from the ${data.windDirection}${data.gustSpeed ? ` (gusts ${data.gustSpeed} km/h)` : ""}
- Humidity: ${data.humidity}%
- UV Index: ${data.uvIndex}
- Current precipitation: ${data.currentPrecipitation !== null && data.currentPrecipitation !== undefined ? `${data.currentPrecipitation} mm` : "not reported"}
- Precipitation probability (next 3hrs): ${data.precipProbability}%
- Precipitation arriving in: ${data.precipMinutes !== null ? `${data.precipMinutes} minutes (around ${precipArrival})` : "none forecast"}
- Air Quality Health Index: ${data.aqhi} (scale 1-10, 1=best)
- Visibility: ${data.visibility} km
- Pressure: ${data.pressure} hPa
- Conditions: ${data.conditionText}
- Observation time: ${data.observationTime}
- Location type: ${location.type}
- Typical activities here: ${location.activities.join(", ")}
- Current time (Atlantic): ${now}
- ${alertSummary}

Return ONLY this JSON, no other text:
{
  "score": "Excellent" | "Good" | "Fair" | "Stay Inside",
  "headline": "One punchy sentence (max 12 words) that captures the situation",
  "summary": "2-3 sentences. Specific, actionable, local. What should they know and do right now?",
  "windowMinutes": ${data.precipMinutes !== null ? data.precipMinutes : "null"},
  "windowStatement": ${windowStatement},
  "uvWarning": "string or null — only if UV 5+, e.g. Fair skin burns in ~X min at UV ${data.uvIndex}. Reapply SPF.",
  "bridgeStatus": ${location.type === "bridge" ? `"${getBridgeStatus(data.windSpeed)}"` : "null"},
  "activities": [
    ${location.activities.map((a) => `{ "name": "${a}", "status": "great" | "ok" | "not recommended", "reason": "brief reason" }`).join(",\n    ")}
  ],
  "airQualityStatement": "plain English AQHI interpretation for this location",
  "insightOfTheDay": "one interesting, specific local observation — a detail only a 30-year PEI local would notice"
}`;
}

async function callClaude(
  location: Location,
  weather: WeatherSnapshot,
  alerts: AlertItem[],
): Promise<ConditionsResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(location, weather, alerts) }],
  });

  const text = message.content[0]?.type === "text" ? message.content[0].text.trim() : null;
  if (!text) throw new Error("Empty Claude response");

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned) as ConditionsResponse;
}

// Fingerprint weather so near-identical conditions reuse the cached Claude response
function weatherFingerprint(weather: WeatherSnapshot): string {
  const temp = Math.round(weather.temperature);
  const wind = Math.round(weather.windSpeed / 5) * 5;
  const precip = Math.round(weather.precipProbability / 10) * 10;
  const currentPrecipitation = Math.round((weather.currentPrecipitation ?? 0) * 10) / 10;
  const conditionCode = weather.conditionCode ?? -1;
  const precipMinutes = weather.precipMinutes ?? -1;
  return `${temp}-${wind}-${precip}-${weather.aqhi}-${weather.uvIndex}-${conditionCode}-${currentPrecipitation}-${precipMinutes}`;
}

export async function getClaudeConditions(
  location: Location,
  weather: WeatherSnapshot,
  alerts: AlertItem[],
): Promise<ConditionsResponse | null> {
  const fingerprint = weatherFingerprint(weather);

  const cached = unstable_cache(
    () => callClaude(location, weather, alerts),
    [`openair-claude-v2-${location.id}`, fingerprint],
    { revalidate: CACHE_DURATIONS.aiSummary },
  );

  try {
    return await cached();
  } catch {
    // Errors are NOT cached by unstable_cache, so next request retries Claude
    return null;
  }
}
