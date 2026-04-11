import type { BridgeStatusType, ConditionsScore, WeatherSnapshot } from "@/lib/types";

export function calculateRawScore(data: WeatherSnapshot): number {
  let score = 100;

  if (data.temperature < 5 || data.temperature > 35) score -= 30;
  else if (data.temperature < 10 || data.temperature > 30) score -= 15;

  if (data.windSpeed > 60) score -= 40;
  else if (data.windSpeed > 40) score -= 20;
  else if (data.windSpeed > 25) score -= 10;

  score -= data.precipProbability * 0.4;

  if (data.uvIndex >= 8) score -= 15;
  else if (data.uvIndex >= 6) score -= 5;

  if (data.aqhi >= 7) score -= 30;
  else if (data.aqhi >= 4) score -= 15;

  if (data.visibility < 5) score -= 20;

  return Math.max(0, Math.min(100, score));
}

export function scoreToLabel(score: number): ConditionsScore {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Fair";
  return "Stay Inside";
}

export function getBridgeStatus(windSpeed: number): BridgeStatusType {
  if (windSpeed >= 80) return "Closed";
  if (windSpeed >= 70) return "High-sided vehicle restriction";
  return "Open";
}

export function getUvBurnMinutes(uvIndex: number) {
  if (uvIndex <= 2) return 120;
  return Math.max(12, Math.round(150 / uvIndex));
}
