import { CloudRain, Gauge, ShieldAlert, Wind } from "lucide-react";

import { MetricCard } from "@/components/ui/MetricCard";
import type { AlertItem, WeatherSnapshot } from "@/lib/types";
import type { DailyForecastSnapshot } from "@/lib/weather";

function describeWind(weather: WeatherSnapshot): string {
  const speed = Math.round(weather.windSpeed);
  const gust = weather.gustSpeed ? Math.round(weather.gustSpeed) : speed;
  if (speed >= 50) {
    return `Wind is ${speed} km/h from the ${weather.windDirection}, with gusts near ${gust} km/h — strong enough to disrupt outdoor plans.`;
  }
  if (speed >= 30) {
    return `Wind is ${speed} km/h from the ${weather.windDirection}, with gusts near ${gust} km/h — noticeable on exposed routes.`;
  }
  if (speed >= 15) {
    return `Wind is ${speed} km/h from the ${weather.windDirection}, with gusts near ${gust} km/h — comfortable for most outdoor activity.`;
  }
  return `Wind is ${speed} km/h from the ${weather.windDirection}, with gusts near ${gust} km/h — calm conditions across the area.`;
}

function describeRainToday(today: DailyForecastSnapshot | undefined): string {
  if (!today) return "Daily rain total is briefly unavailable from Open-Meteo.";
  const mm = today.precipAmount;
  if (mm <= 0.1) return "No measurable rain has fallen in Stratford today — the day is staying dry.";
  if (mm < 2) return `Light rain so far in Stratford today (${mm.toFixed(1)} mm) — enough to see, not enough to disrupt plans.`;
  if (mm < 10) return `Moderate rain has fallen in Stratford today (${mm.toFixed(1)} mm) — wet ground for the rest of the day.`;
  return `Heavy rain has fallen in Stratford today (${mm.toFixed(1)} mm) — flooding and runoff worth watching.`;
}

function describeWatch(alerts: AlertItem[]): { insight: string; raw: string } {
  if (alerts.length === 0) {
    return {
      insight:
        "No active severe weather warnings or watches from Environment Canada for the Charlottetown area right now.",
      raw: "0 active EC alerts",
    };
  }
  const titles = alerts.map((alert) => alert.title).slice(0, 2);
  const more = alerts.length > 2 ? ` (+${alerts.length - 2} more)` : "";
  return {
    insight: `Environment Canada is currently flagging: ${titles.join(", ")}${more}. Check the storm watch banner above for details.`,
    raw: `${alerts.length} active EC alert${alerts.length === 1 ? "" : "s"}`,
  };
}

function describePressure(weather: WeatherSnapshot): { insight: string; raw: string } {
  const pressure = Math.round(weather.pressure);
  if (pressure === 0) {
    return {
      insight: "Pressure reading is briefly unavailable from Environment Canada.",
      raw: "— hPa",
    };
  }
  let trend: string;
  let insight: string;
  if (pressure >= 1020) {
    trend = "high";
    insight = `Pressure is ${pressure} hPa, in the high range — fits a stable, settled weather window.`;
  } else if (pressure >= 1010) {
    trend = "steady";
    insight = `Pressure is ${pressure} hPa, sitting in a steady mid-range — no sharp change in the local pattern right now.`;
  } else if (pressure >= 1000) {
    trend = "low";
    insight = `Pressure is ${pressure} hPa, in the low range — unsettled weather is more likely while it stays here.`;
  } else {
    trend = "very low";
    insight = `Pressure is ${pressure} hPa, very low for the region — strong storm or front nearby. Watch alerts.`;
  }
  return {
    insight,
    raw: `${pressure} hPa · ${trend}`,
  };
}

export function ConditionCards({
  weather,
  dailyForecast,
  alerts,
}: {
  weather: WeatherSnapshot;
  dailyForecast: DailyForecastSnapshot[];
  alerts: AlertItem[];
}) {
  const watch = describeWatch(alerts);
  const pressure = describePressure(weather);

  return (
    <section className="grid gap-5 lg:grid-cols-4">
      <MetricCard
        icon={Wind}
        title="Charlottetown wind"
        insight={describeWind(weather)}
        rawLabel="Environment Canada · Charlottetown Airport"
        accentClassName="text-[#E8960F]"
      />
      <MetricCard
        icon={CloudRain}
        title="Rain today"
        insight={describeRainToday(dailyForecast[0])}
        rawLabel={`${(dailyForecast[0]?.precipAmount ?? 0).toFixed(1)} mm today · Open-Meteo`}
      />
      <MetricCard
        icon={ShieldAlert}
        title="Severe weather watch"
        insight={watch.insight}
        rawLabel={watch.raw}
        accentClassName="text-[#E8960F]"
      />
      <MetricCard
        icon={Gauge}
        title="Pressure trend"
        insight={pressure.insight}
        rawLabel={pressure.raw}
      />
    </section>
  );
}
