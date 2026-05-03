import type { BridgeStatusType, ConditionsScore, LocationType, PawIndex, PawScore, WeatherSnapshot } from "@/lib/types";

function normalizeConditionText(text: string) {
  return text.trim().toLowerCase();
}

export function isStormyWeather(data: WeatherSnapshot): boolean {
  if (typeof data.conditionCode === "number" && data.conditionCode >= 95) return true;
  return /thunderstorm/.test(normalizeConditionText(data.conditionText));
}

export function hasCurrentPrecipitation(data: WeatherSnapshot): boolean {
  if ((data.currentPrecipitation ?? 0) > 0) return true;

  if (typeof data.conditionCode === "number") {
    if ((data.conditionCode >= 51 && data.conditionCode <= 67) || (data.conditionCode >= 80 && data.conditionCode <= 86)) {
      return true;
    }
  }

  return /(rain|drizzle|shower|snow|sleet|hail|ice pellets|freezing)/.test(
    normalizeConditionText(data.conditionText),
  );
}

export function calculateRawScore(data: WeatherSnapshot): number {
  let score = 100;

  if (data.temperature < 5 || data.temperature > 35) score -= 30;
  else if (data.temperature < 10 || data.temperature > 30) score -= 15;

  if (data.windSpeed > 60) score -= 40;
  else if (data.windSpeed > 40) score -= 20;
  else if (data.windSpeed > 25) score -= 10;

  score -= data.precipProbability * 0.4;

  if (isStormyWeather(data)) score -= 45;
  else if (hasCurrentPrecipitation(data)) score -= 25;

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

export function calculatePawScore(data: WeatherSnapshot, locationType: LocationType): PawIndex {
  let score = 100;
  let mainConcern = "";

  // Temperature — dogs overheat and undercool faster than people
  if (data.temperature > 30) { score -= 35; mainConcern = mainConcern || "Too hot — dogs overheat quickly above 30°C"; }
  else if (data.temperature > 25) { score -= 15; mainConcern = mainConcern || "Warm — water and shade breaks essential"; }
  else if (data.temperature < -10) { score -= 35; mainConcern = mainConcern || "Too cold — paw pads at risk of cracking"; }
  else if (data.temperature < 0) { score -= 20; mainConcern = mainConcern || "Cold — consider paw protection"; }

  // UV + pavement heat (asphalt runs ~20°C hotter than air in sun)
  if (data.uvIndex >= 7 && data.temperature >= 20) { score -= 20; mainConcern = mainConcern || "Hot pavement risk — grass and shaded trails only"; }
  else if (data.uvIndex >= 5 && data.temperature >= 18) { score -= 8; }

  // Humidity — dogs can't sweat, only pant
  if (data.humidity >= 80 && data.temperature >= 22) { score -= 20; mainConcern = mainConcern || "Heat and humidity make it hard for dogs to cool down"; }
  else if (data.humidity >= 70 && data.temperature >= 20) { score -= 10; }

  // Air quality — dogs breathe harder during exercise
  if (data.aqhi >= 7) { score -= 30; mainConcern = mainConcern || "Poor air quality — quick bathroom trip only"; }
  else if (data.aqhi >= 4) { score -= 15; mainConcern = mainConcern || "Moderate air quality — keep walks short"; }

  // Active precipitation — not usually dangerous, but less comfortable and harder to read
  if (isStormyWeather(data)) { score -= 45; mainConcern = mainConcern || "Stormy weather — wait this one out"; }
  else if (hasCurrentPrecipitation(data)) { score -= 35; mainConcern = mainConcern || "Wet weather — better for a short break than a long outing"; }

  // Wind — stressful, especially for small dogs
  if (data.windSpeed > 60) { score -= 15; mainConcern = mainConcern || "Very gusty — stressful for most dogs"; }

  // Pavement penalty for hard-surface locations
  if ((["city", "bridge", "airport"] as LocationType[]).includes(locationType) && data.temperature > 20 && data.uvIndex >= 4) {
    score -= 10;
    mainConcern = mainConcern || "Hard pavement heats up fast — look for grass";
  }

  // Natural surface bonus
  if ((["beach", "trail", "park", "campground"] as LocationType[]).includes(locationType)) {
    score += 8;
  }

  score = Math.max(0, Math.min(100, score));

  let pawScore: PawScore;
  if (score >= 75) pawScore = "Great";
  else if (score >= 50) pawScore = "Good";
  else if (score >= 25) pawScore = "Caution";
  else pawScore = "Stay Home";

  const defaultStatement: Record<PawScore, string> = {
    Great: "Comfortable temp, clean air, easy on paws",
    Good: "Fine for most dogs — bring water",
    Caution: mainConcern || "Check conditions before a long walk",
    "Stay Home": mainConcern || "Not safe for dogs right now",
  };

  return {
    score: pawScore,
    statement: mainConcern || defaultStatement[pawScore],
    rawScore: score,
  };
}

export function getUvBurnMinutes(uvIndex: number) {
  if (uvIndex <= 2) return 120;
  return Math.max(12, Math.round(150 / uvIndex));
}
