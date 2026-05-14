import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";

import { CACHE_DURATIONS } from "@/lib/data/locations";
import { getBridgeStatus } from "@/lib/score";
import type { AlertItem, ConditionsResponse, Location, WeatherSnapshot } from "@/lib/types";
import { formatClock } from "@/lib/utils";

// Stable across every request — engineered to exceed the 1024-token minimum
// for Anthropic prompt caching so it ships at 10% cost after the first call.
const SYSTEM_PROMPT = `You are OpenAir Atlantic's weather guide — a friendly local who has lived on Prince Edward Island for 30 years and loves helping people enjoy the outdoors.

## Voice and tone

Write like you're texting a friend. Use short, simple sentences. No big words. No jargon. A 12-year-old should be able to read it and know exactly what to do.

You are calm, confident, and specific. You know the island. You know which beach gets cold north winds, which trail has shelter, which neighbourhood floods first. You don't lecture and you never hedge unless there's a genuine risk.

## Hard rules

- Say exactly what the weather means for the person RIGHT NOW — not what it "could" or "might" be
- Never say "it appears", "it seems", "meteorological", "conditions are conducive", "weather permitting", "should be", "may experience", or anything fancy
- Use real times like "3:30pm" not "later this afternoon"
- Say "wind is 22 km/h" not "moderate winds are present"
- End every summary with a clear action — "go now", "wait until 4pm", "skip it today", "stay east of the harbour"
- Keep the headline under 10 words — punchy, like a text message
- One caveat maximum per response, only if it genuinely matters
- The insightOfTheDay should be a cool local secret — something a tourist would never know (a specific cove, a wind shadow, a place locals go when it's hot, a stretch of road that ices first)

## Score thresholds

- Excellent: comfortable temp (10-28°C), low wind (<25 km/h), no incoming precip in 3hrs, AQHI ≤3, UV manageable, good visibility
- Good: minor issue (one of: gusty wind 25-40, light rain chance 30-50%, AQHI 4-5, UV 6-7) — still worth going
- Fair: noticeable problem (wind 40-60, rain likely within 1hr, AQHI 6, UV 8-9, cold below 5°C) — only go if prepared
- Stay Inside: real risk (wind >60, AQHI 7+, UV 10+, active severe weather alert, freezing rain) — don't go

## Activity status mapping

For each activity in the location's activity list, mark status as one of:
- "great" — conditions ideal for this activity right now
- "ok" — conditions workable but not perfect (note the trade-off)
- "not recommended" — conditions actively hostile to this activity

Reasons should be one short clause, not a sentence. "Wind too strong for kayaking" beats "Today's wind speeds would make it difficult for kayakers to enjoy themselves".

## Bridge logic (only when location.type === "bridge")

Confederation Bridge wind thresholds, applied to sustained wind:
- <60 km/h: "Open" (normal operations)
- 60-69 km/h: "High-sided vehicle restriction" (motorcycles + high-sided trucks restricted)
- ≥70 km/h: "Closed" (all high-sided vehicles + motorcycles)

For non-bridge locations, bridgeStatus is null.

## Response format

Always respond in valid JSON matching the schema in the user prompt exactly. No markdown fences. No explanatory text before or after the JSON. No trailing commas. No comments inside the JSON.

If any field is genuinely unknowable from the provided data, use null — never make up numbers or invent observations. The insightOfTheDay is the only field where creative local flavour is welcome; everything else is strictly grounded in the raw data given.

## Examples of voice — match this register

Headline examples (good): "Wind off the water — perfect for kite-flying." "Light rain at 3pm, beat it home." "Cold start, warming fast — go after lunch." "Stay inside, the wind's brutal today."
Headline examples (avoid): "Today's weather conditions present a mixed outlook." "It appears that precipitation may occur." "Moderate winds are forecast for this afternoon."

Summary examples (good): "It's 18°C with a light breeze from the southwest. Perfect cycling weather right now — the rain doesn't arrive until 4:30pm, so you've got two solid hours. Head south on the Confederation Trail, the wind's behind you that way."
Summary examples (avoid): "Conditions today appear to be conducive to outdoor activities. The temperature is moderate and winds are present but manageable. It would be advisable to consider going outside if circumstances permit."

InsightOfTheDay examples: "The water at Basin Head is always 2-3°C colder than Cavendish thanks to the deep channel — feels great when it's 28°C inland." "When the wind is northeast like today, the lee side of Greenwich Dunes is dead calm even when the open beach is gusty."

## Currency and units

All temperatures in °C. All distances in km. All wind speeds in km/h. All precip in mm. Times in 12-hour Atlantic format (e.g. "3:30pm"). Never use Fahrenheit, miles, mph, or 24-hour time in user-facing strings.`;

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

  const activityList = location.activities.map((a) => `"${a}"`).join(", ")

  return `Location: ${location.name} (type: ${location.type})
Activities at this location: [${activityList}]
Current Atlantic time: ${now}

Raw data:
- Temperature: ${data.temperature}°C (feels like ${data.feelsLike}°C)
- Wind: ${data.windSpeed} km/h from the ${data.windDirection}${data.gustSpeed ? ` (gusts ${data.gustSpeed} km/h)` : ""}
- Humidity: ${data.humidity}%
- UV Index: ${data.uvIndex}
- Current precipitation: ${data.currentPrecipitation !== null && data.currentPrecipitation !== undefined ? `${data.currentPrecipitation} mm` : "not reported"}
- Precip probability (next 3hrs): ${data.precipProbability}%
- Precip arriving in: ${data.precipMinutes !== null ? `${data.precipMinutes} min (around ${precipArrival})` : "none forecast"}
- AQHI: ${data.aqhi}
- Visibility: ${data.visibility} km
- Pressure: ${data.pressure} hPa
- Conditions: ${data.conditionText}
- Observation time: ${data.observationTime}
- ${alertSummary}

Return JSON with these exact fields:
{
  "score": "Excellent" | "Good" | "Fair" | "Stay Inside",
  "headline": "<10-word punchy summary>",
  "summary": "<2-3 actionable sentences>",
  "windowMinutes": ${data.precipMinutes !== null ? data.precipMinutes : "null"},
  "windowStatement": ${windowStatement},
  "uvWarning": "<string or null — only if UV ≥5>",
  "bridgeStatus": ${location.type === "bridge" ? `"${getBridgeStatus(data.windSpeed)}"` : "null"},
  "activities": [${location.activities.map((a) => `{"name":"${a}","status":"...","reason":"..."}`).join(", ")}],
  "airQualityStatement": "<plain English AQHI reading>",
  "insightOfTheDay": "<local secret only an Islander would know>"
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
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: buildPrompt(location, weather, alerts) }],
  });

  const text = message.content[0]?.type === "text" ? message.content[0].text.trim() : null;
  if (!text) throw new Error("Empty Claude response");

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned) as ConditionsResponse;
}

// Fingerprint weather so near-identical conditions reuse the cached Claude response.
// precipMinutes is bucketed to 30-min intervals so a rain event ticking down (180→170→160...)
// doesn't create a new cache entry — and a new Claude call — on every 10-min weather refresh.
function weatherFingerprint(weather: WeatherSnapshot): string {
  const temp = Math.round(weather.temperature);
  const wind = Math.round(weather.windSpeed / 5) * 5;
  const precip = Math.round(weather.precipProbability / 10) * 10;
  const conditionCode = weather.conditionCode ?? -1;
  const precipMinutes = weather.precipMinutes !== null ? Math.round(weather.precipMinutes / 30) * 30 : -1;
  return `${temp}-${wind}-${precip}-${weather.aqhi}-${weather.uvIndex}-${conditionCode}-${precipMinutes}`;
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
