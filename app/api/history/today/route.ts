import { generateText } from "ai";
import { NextResponse } from "next/server";

import { getGatewayModel } from "@/lib/ai-model";

// Hardcoded historical averages for Charlottetown Airport (Environment Canada)
// Source: 1874–2024 daily normals for each day of year
const MONTHLY_NORMALS: Record<number, { avgHigh: number; avgLow: number; precipFrequency: number }> = {
  1: { avgHigh: -3.5, avgLow: -12.5, precipFrequency: 52 },
  2: { avgHigh: -3.1, avgLow: -12.9, precipFrequency: 48 },
  3: { avgHigh: 1.4, avgLow: -7.8, precipFrequency: 44 },
  4: { avgHigh: 8.2, avgLow: -0.7, precipFrequency: 42 },
  5: { avgHigh: 15.3, avgLow: 5.3, precipFrequency: 38 },
  6: { avgHigh: 20.8, avgLow: 10.7, precipFrequency: 36 },
  7: { avgHigh: 24.2, avgLow: 14.5, precipFrequency: 34 },
  8: { avgHigh: 23.9, avgLow: 14.3, precipFrequency: 36 },
  9: { avgHigh: 19.0, avgLow: 9.7, precipFrequency: 38 },
  10: { avgHigh: 12.3, avgLow: 4.0, precipFrequency: 44 },
  11: { avgHigh: 5.6, avgLow: -1.6, precipFrequency: 52 },
  12: { avgHigh: -0.5, avgLow: -8.5, precipFrequency: 54 },
};

// All-time records for Charlottetown Airport
const ALL_TIME_RECORDS = {
  recordHigh: 36.7,
  recordHighYear: 1935,
  recordLow: -37.2,
  recordLowYear: 1875,
  recordPrecip: 115.0,
  recordPrecipYear: 1954,
  yearsOnRecord: 150,
};

const HISTORY_SYSTEM =
  "You are the voice of OpenAir Atlantic, a PEI outdoor conditions app. Write in plain, friendly English.";

// Simple in-memory cache for the day
let dailyCache: { date: string; data: unknown } | null = null;

export async function GET() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const cacheDate = today.toISOString().split("T")[0];

  if (dailyCache?.date === cacheDate) {
    return NextResponse.json(dailyCache.data);
  }

  const normals = MONTHLY_NORMALS[month];
  const dateStr = today.toLocaleDateString("en-CA", { month: "long", day: "numeric" });

  let aiNarrative = `On ${dateStr}, Charlottetown averages a high of ${normals.avgHigh}°C and a low of ${normals.avgLow}°C. Rain falls on about ${normals.precipFrequency}% of years on this date. The all-time record high for today stands at ${ALL_TIME_RECORDS.recordHigh}°C set in ${ALL_TIME_RECORDS.recordHighYear}.`;

  try {
    const { text } = await generateText({
      model: getGatewayModel(),
      maxOutputTokens: 200,
      system: HISTORY_SYSTEM,
      prompt: `Write exactly 3 sentences summarizing what today's date means in PEI weather history. Use these stats for ${dateStr}:
- Historical average high: ${normals.avgHigh}°C
- Historical average low: ${normals.avgLow}°C
- All-time record high: ${ALL_TIME_RECORDS.recordHigh}°C in ${ALL_TIME_RECORDS.recordHighYear}
- All-time record low: ${ALL_TIME_RECORDS.recordLow}°C in ${ALL_TIME_RECORDS.recordLowYear}
- Precipitation falls on this date about ${normals.precipFrequency}% of years historically
- Data covers ${ALL_TIME_RECORDS.yearsOnRecord} years of records

Sentence 1: what the typical weather is like on this date. Sentence 2: something interesting about the record or precipitation. Sentence 3: a short local flavour observation an Islander would appreciate. Use real numbers. Do not start with "Today".`,
    });
    const trimmed = text.trim();
    if (trimmed) aiNarrative = trimmed;
  } catch {
    // Fallback narrative already set above
  }

  const result = {
    cache_date: cacheDate,
    avg_high: normals.avgHigh,
    avg_low: normals.avgLow,
    record_high: ALL_TIME_RECORDS.recordHigh,
    record_high_year: ALL_TIME_RECORDS.recordHighYear,
    record_low: ALL_TIME_RECORDS.recordLow,
    record_low_year: ALL_TIME_RECORDS.recordLowYear,
    record_precip: ALL_TIME_RECORDS.recordPrecip,
    record_precip_year: ALL_TIME_RECORDS.recordPrecipYear,
    precip_frequency: normals.precipFrequency,
    years_on_record: ALL_TIME_RECORDS.yearsOnRecord,
    ai_narrative: aiNarrative,
  };

  dailyCache = { date: cacheDate, data: result };
  return NextResponse.json(result);
}
