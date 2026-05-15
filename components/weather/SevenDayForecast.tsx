import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  SunMedium,
  Wind,
} from "lucide-react";

import type { DailyForecastSnapshot } from "@/lib/weather";
import { cn } from "@/lib/utils";

function getForecastIcon(code: number | null) {
  if (code === 0) return SunMedium;
  if (code === 1 || code === 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code !== null && code <= 48) return CloudFog;
  if (code !== null && code <= 67) return CloudRain;
  if (code !== null && code <= 86) return CloudSnow;
  if (code !== null && code >= 95) return CloudLightning;
  return Cloud;
}

function formatForecastDay(date: string, index: number) {
  if (index === 0) return "Today";

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    timeZone: "America/Halifax",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatForecastDate(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    timeZone: "America/Halifax",
  }).format(new Date(`${date}T12:00:00Z`));
}

function getPrecipTone(probability: number) {
  if (probability >= 70) return "text-[#0a527a]";
  if (probability >= 40) return "text-sun-text";
  return "text-text-muted";
}

export function SevenDayForecast({
  forecast,
  title = "Cameron Heights through the week",
  subtitle = "Daily outlook from Open-Meteo, paired with your live Tempest station for the current read.",
}: {
  forecast: DailyForecastSnapshot[];
  title?: string;
  subtitle?: string;
}) {
  if (!forecast.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">7-day forecast</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">
            {title}
          </h2>
        </div>
        <p className="text-sm text-text-muted">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {forecast.map((day, index) => {
          const Icon = getForecastIcon(day.conditionCode);

          return (
            <article
              key={day.date}
              className={cn(
                "rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur",
                index === 0 ? "ring-1 ring-forest/15" : "",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                    {formatForecastDay(day.date, index)}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{formatForecastDate(day.date)}</p>
                </div>
                <div className="rounded-2xl bg-forest-light/70 p-2 text-forest">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 font-serif text-lg leading-6 text-text-primary">
                {day.conditionText}
              </p>

              <div className="mt-4 flex items-end gap-3">
                <p className="font-serif text-3xl text-text-primary">{Math.round(day.high)}°</p>
                <p className="pb-1 text-sm text-text-secondary">Low {Math.round(day.low)}°</p>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Rain chance</span>
                  <span className={cn("font-semibold", getPrecipTone(day.precipProbability))}>
                    {day.precipProbability}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Rain total</span>
                  <span className="font-semibold text-text-primary">{day.precipAmount.toFixed(1)} mm</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-text-secondary">
                    <Wind className="h-3.5 w-3.5" />
                    Max wind
                  </span>
                  <span className="font-semibold text-text-primary">{day.maxWindSpeed} km/h</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
