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
  | "airport"
  | "golf";

export interface LocationFAQ {
  q: string;
  a: string;
}

export interface LocationAmenities {
  parking: "free" | "paid" | "limited" | "none";
  parkingNote?: string;
  petFriendly: boolean;
  petNote?: string;
  wheelchairAccessible: boolean;
  wheelchairNote?: string;
  washrooms: boolean;
  washroomNote?: string;
}

export interface Location {
  id: string;
  name: string;
  nameFr: string;
  tagline: string;
  lat: number;
  lng: number;
  type: LocationType;
  nearestStation: string;
  activities: string[];
  icon: string;
  faqs?: LocationFAQ[];
  amenities?: LocationAmenities;
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
