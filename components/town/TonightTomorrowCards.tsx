import { Moon, Sunrise } from "lucide-react";

import type { DailyForecastSnapshot } from "@/lib/weather";

export function TonightTomorrowCards({ forecast }: { forecast: DailyForecastSnapshot[] }) {
  const today = forecast[0];
  const tomorrow = forecast[1];
  if (!today && !tomorrow) return null;

  return (
    <section className="grid auto-rows-fr gap-4 lg:grid-cols-2">
      {today && (
        <div className="flex flex-col rounded-[1.75rem] border border-[#E8EDE4] bg-gradient-to-br from-[#1a2238]/95 to-[#3a4a6b]/90 p-6 text-white shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Moon className="h-4 w-4 text-white/80" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">Tonight</p>
          </div>
          <p className="mb-3 break-words font-serif text-2xl leading-snug">
            Low of {Math.round(today.low)}°C · {today.conditionText}
          </p>
          <div className="mt-auto grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Rain chance
              </p>
              <p className="font-medium">{today.precipProbability}%</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Wind peak
              </p>
              <p className="font-medium">{today.maxWindSpeed} km/h</p>
            </div>
          </div>
        </div>
      )}
      {tomorrow && (
        <div className="flex flex-col rounded-[1.75rem] border border-[#E8EDE4] bg-gradient-to-br from-[#FDF0D5] to-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-[#E8960F]" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E8960F]">
              Tomorrow morning
            </p>
          </div>
          <p className="mb-3 break-words font-serif text-2xl leading-snug text-[#1A1A1A]">
            {Math.round(tomorrow.low)}° → {Math.round(tomorrow.high)}°C · {tomorrow.conditionText}
          </p>
          <div className="mt-auto grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9BA696]">
                Rain chance
              </p>
              <p className="font-medium text-[#1A1A1A]">{tomorrow.precipProbability}%</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9BA696]">
                UV peak
              </p>
              <p className="font-medium text-[#1A1A1A]">{tomorrow.uvIndexMax}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#6B7366]">
            Plan the school run and morning commute around this.
          </p>
        </div>
      )}
    </section>
  );
}
