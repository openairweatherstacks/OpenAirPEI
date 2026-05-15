import { Wind, Waves, Footprints, Anchor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { buildActivityStatus } from "@/lib/environment";
import type { Location, TideEvent, WeatherSnapshot } from "@/lib/types";
import type { IntelSpot, TownProfile } from "@/lib/data/towns";
import { formatClock } from "@/lib/utils";

const KIND_ICON: Record<IntelSpot["kind"], LucideIcon> = {
  "wind-commute": Wind,
  "water-temp": Waves,
  "trail-status": Footprints,
  tide: Anchor,
};

interface TownIntelGridProps {
  profile: TownProfile;
  location: Location;
  weather: WeatherSnapshot;
  charlottetownWeather: WeatherSnapshot;
  waterTemp: number | null;
  tides: TideEvent[];
}

function buildWindCommuteCard(weather: WeatherSnapshot) {
  const speed = Math.round(weather.windSpeed);
  let insight: string;
  if (speed >= 70) insight = "Hillsborough Bridge crosswinds will be aggressive — expect a tough crossing.";
  else if (speed >= 55) insight = "Strong crosswinds on the bridge deck — high-sided vehicles and bikes should plan around it.";
  else if (speed >= 35) insight = "Bridge winds are noticeable but manageable for cars; cyclists will feel the push.";
  else if (speed >= 20) insight = "Light to moderate breeze across the bridge — comfortable for any commute.";
  else insight = "Calm conditions on the bridge deck right now.";

  return {
    insight,
    raw: `${speed} km/h ${weather.windDirection}`,
  };
}

function buildWaterTempCard(temp: number | null) {
  if (temp === null) {
    return {
      insight: "Live buoy reading not available — check back during peak summer for real-time water temps.",
      raw: "Seasonal estimate",
    };
  }

  let insight: string;
  if (temp >= 20) insight = "Warm enough for a comfortable swim at Tea Hill — Northumberland Strait is at its summer peak.";
  else if (temp >= 17) insight = "Swimmable for most people, especially after a few minutes of getting in.";
  else if (temp >= 14) insight = "Cool but doable for kids and short dips — adults may find it bracing.";
  else if (temp >= 10) insight = "Too cool for casual swimming — wading and short paddles only.";
  else insight = "Water is too cold for swimming today — better suited to beach walking.";

  return {
    insight,
    raw: `${temp.toFixed(1)}°C · Northumberland Strait`,
  };
}

function buildTrailStatusCard(location: Location, weather: WeatherSnapshot) {
  const assessment = buildActivityStatus("walking", location, weather);
  const statusLabel = assessment.status === "great" ? "Great walking weather" : assessment.status === "ok" ? "Walkable with caveats" : "Wait for better conditions";

  return {
    insight: assessment.reason,
    raw: statusLabel,
  };
}

function buildTideCard(tides: TideEvent[]) {
  const next = tides.find((t) => new Date(t.time).getTime() > Date.now()) ?? tides[0];
  if (!next) {
    return {
      insight: "Tide data is briefly unavailable — try refreshing in a moment.",
      raw: "—",
    };
  }
  const time = formatClock(next.time);
  const insight =
    next.type === "High"
      ? `Next high tide at ${time} — best swimming window before the sandbars fill in.`
      : `Next low tide at ${time} — exposed sandbars and easy beach access.`;
  return {
    insight,
    raw: `${next.type} · ${next.height.toFixed(1)} m`,
  };
}

export function TownIntelGrid({
  profile,
  location,
  weather,
  charlottetownWeather,
  waterTemp,
  tides,
}: TownIntelGridProps) {
  const cards = profile.intelSpots.map((spot) => {
    let content;
    if (spot.kind === "wind-commute") content = buildWindCommuteCard(charlottetownWeather);
    else if (spot.kind === "water-temp") content = buildWaterTempCard(waterTemp);
    else if (spot.kind === "trail-status") content = buildTrailStatusCard(location, weather);
    else content = buildTideCard(tides);

    const Icon = KIND_ICON[spot.kind];
    return { spot, content, Icon };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {cards.map(({ spot, content, Icon }) => (
        <div
          key={spot.key}
          className="rounded-2xl bg-white border border-[#E8EDE4] p-5 space-y-2"
        >
          <div className="flex items-center gap-2 text-[#2D6E24]">
            <Icon size={16} />
            <span
              className="text-[11px] uppercase tracking-widest text-[#6B7366] font-semibold"
              style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
            >
              {spot.label}
            </span>
          </div>
          <p
            className="text-base text-[#1A1A1A] leading-snug"
            style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 600 }}
          >
            {content.insight}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-[#9BA696] font-medium">
            {content.raw}
          </p>
          <p className="text-[11px] text-[#6B7366] leading-relaxed pt-1 border-t border-[#F2F4EF]">
            {spot.note}
          </p>
        </div>
      ))}
    </div>
  );
}
