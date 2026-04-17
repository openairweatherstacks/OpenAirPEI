export type ConditionsScore = "Excellent" | "Good" | "Fair" | "Stay Inside";

export type ActivityStatus = "great" | "ok" | "not recommended";

export type BridgeStatusType =
  | "Open"
  | "High-sided vehicle restriction"
  | "Closed";

export type LocationType =
  | "beach"
  | "city"
  | "park"
  | "trail"
  | "bridge"
  | "landmark"
  | "airport";

export interface Location {
  id: string;
  name: string;
  nameFr: string;
  lat: number;
  lng: number;
  type: LocationType;
  nearestStation: string;
  activities: string[];
  icon: string;
}

export interface WeatherSnapshot {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  gustSpeed?: number;
  windDirection: string;
  humidity: number;
  uvIndex: number;
  precipProbability: number;
  precipMinutes: number | null;
  aqhi: number;
  visibility: number;
  pressure: number;
  conditionText: string;
  observationTime: string;
}

export interface TideEvent {
  type: "High" | "Low";
  time: string;
  height: number;
}

export interface AlertItem {
  title: string;
  severity: "info" | "watch" | "warning";
  summary: string;
}

export interface ActivityAssessment {
  name: string;
  status: ActivityStatus;
  reason: string;
}

export interface ConditionsResponse {
  score: ConditionsScore;
  headline: string;
  summary: string;
  windowMinutes: number | null;
  windowStatement: string | null;
  uvWarning: string | null;
  bridgeStatus: BridgeStatusType | null;
  activities: ActivityAssessment[];
  airQualityStatement: string;
  insightOfTheDay: string;
}

export interface LocationConditions {
  location: Location;
  weather: WeatherSnapshot;
  rawScore: number;
  tide: TideEvent[];
  alerts: AlertItem[];
  conditions: ConditionsResponse;
  waterTemp: number | null;
  source: "sample" | "hybrid";
}
