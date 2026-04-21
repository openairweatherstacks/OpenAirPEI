import { Droplets, Wind } from "lucide-react";

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipSum: number;
  weatherCode: number;
}

interface WeatherWidgetProps {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipProbability: number;
  conditionText: string;
  forecast: ForecastDay[];
}

function wmoLabel(code: number): string {
  if (code === 0) return "Sunny";
  if (code <= 3) return code === 1 ? "Mostly clear" : code === 2 ? "Partly cloudy" : "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 55) return "Drizzle";
  if (code <= 65) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

function wmoEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

function shortDay(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-CA", { weekday: "short" });
}

export function WeatherWidget({
  currentTemp,
  feelsLike,
  humidity,
  windSpeed,
  windDirection,
  precipProbability,
  conditionText,
  forecast,
}: WeatherWidgetProps) {
  const today = forecast[0];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(42,42,42,0.08)] backdrop-blur">
      {/* ── CURRENT CONDITIONS ── */}
      <div className="flex items-start justify-between gap-4 p-6 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            Charlottetown · Right now
          </p>
          <div className="mt-2 flex items-end gap-3">
            <p className="font-serif text-6xl font-extrabold leading-none text-text-primary">
              {currentTemp}°
            </p>
            <div className="mb-1">
              <p className="text-sm text-text-secondary">Feels like {feelsLike}°C</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <Droplets className="h-3.5 w-3.5 text-[#0a527a]" />
              {humidity}% humidity
            </span>
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <Wind className="h-3.5 w-3.5 text-forest" />
              {windSpeed} km/h {windDirection}
            </span>
            <span className="text-sm text-text-secondary">
              {precipProbability}% precip
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl">{today ? wmoEmoji(today.weatherCode) : "🌤️"}</p>
          <p className="mt-2 font-serif text-lg text-text-primary">
            {new Date().toLocaleDateString("en-CA", { weekday: "long" })}
          </p>
          <p className="text-sm text-text-secondary">
            {today ? wmoLabel(today.weatherCode) : conditionText}
          </p>
        </div>
      </div>

      {/* ── 7-DAY FORECAST ── */}
      {forecast.length > 0 && (
        <div className="border-t border-border px-2 pb-2 pt-3">
          <div className="grid grid-cols-7 gap-1">
            {forecast.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 transition hover:bg-forest-light/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {shortDay(day.date)}
                </p>
                <p className="text-xl">{wmoEmoji(day.weatherCode)}</p>
                <p className="text-xs font-semibold text-text-primary">{Math.round(day.maxTemp)}°</p>
                <p className="text-xs text-text-muted">{Math.round(day.minTemp)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
