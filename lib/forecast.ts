import type { ConditionsScore, WeatherSnapshot } from "@/lib/types";
import type { DailyForecastSnapshot } from "@/lib/weather";
import { calculateRawScore, scoreToLabel } from "@/lib/score";

export interface DailyVerdict {
  date: string;
  weekday: string;
  score: ConditionsScore;
  rawScore: number;
  high: number;
  low: number;
  precipProbability: number;
  maxWindSpeed: number;
  conditionText: string;
  summary: string;
}

function dailyToSnapshot(day: DailyForecastSnapshot): WeatherSnapshot {
  return {
    temperature: day.high,
    feelsLike: day.high,
    windSpeed: day.maxWindSpeed,
    windDirection: "—",
    humidity: 0,
    uvIndex: day.uvIndexMax,
    precipProbability: day.precipProbability,
    precipMinutes: day.precipProbability >= 60 ? 0 : null,
    aqhi: 2,
    visibility: 20,
    pressure: 1013,
    conditionText: day.conditionText,
    conditionCode: day.conditionCode,
    currentPrecipitation: null,
    observationTime: day.date,
  };
}

function summarizeDay(day: DailyForecastSnapshot, score: ConditionsScore): string {
  if (day.precipProbability >= 70) return "Showers likely through the day";
  if (day.precipProbability >= 40) return "Chance of showers — keep an eye on the sky";
  if (day.maxWindSpeed >= 50) return "Windy stretches will dominate";
  if (score === "Excellent") return "Open skies and easy outdoor day";
  if (score === "Good") return "Workable day with one or two trade-offs";
  if (score === "Fair") return "Plan around a tougher window";
  return "Better suited to indoor plans";
}

function formatWeekday(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00-03:00`);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    weekday: "short",
  }).format(date);
}

export function aggregateDailyVerdicts(daily: DailyForecastSnapshot[]): DailyVerdict[] {
  return daily.slice(0, 5).map((day) => {
    const snapshot = dailyToSnapshot(day);
    const rawScore = calculateRawScore(snapshot);
    const score = scoreToLabel(rawScore);

    return {
      date: day.date,
      weekday: formatWeekday(day.date),
      score,
      rawScore,
      high: day.high,
      low: day.low,
      precipProbability: day.precipProbability,
      maxWindSpeed: day.maxWindSpeed,
      conditionText: day.conditionText,
      summary: summarizeDay(day, score),
    };
  });
}
