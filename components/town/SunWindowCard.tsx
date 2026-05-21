import type { SunWindow } from "@/lib/sun";

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDaylight(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function buildInsight(daylightMinutes: number): string {
  const hours = daylightMinutes / 60;
  if (hours >= 15) return "A long stretch of daylight to work with today.";
  if (hours >= 13) return "Plenty of daylight for outdoor plans.";
  if (hours >= 11) return "Solid daylight window — pace your day.";
  if (hours >= 9) return "Shorter daylight window — front-load outdoor time.";
  return "Limited daylight today — head out earlier than usual.";
}

function getSunProgress(sunrise: Date, sunset: Date): number {
  const now = Date.now();
  const rise = sunrise.getTime();
  const set = sunset.getTime();
  if (now <= rise) return 0;
  if (now >= set) return 100;
  return Math.round(((now - rise) / (set - rise)) * 100);
}

export function SunWindowCard({ sunWindow }: { sunWindow: SunWindow }) {
  const progress = getSunProgress(sunWindow.sunrise, sunWindow.sunset);
  const isDaytime = progress > 0 && progress < 100;

  return (
    <div className="rounded-[1.75rem] border border-[#E8EDE4] bg-gradient-to-br from-[#FDF0D5] via-[#FFF8EC] to-[#F2F8EE] p-5 sm:p-7">
      <p className="eyebrow mb-3">Daylight today</p>

      <p className="font-serif text-xl sm:text-2xl leading-snug text-text-primary">
        {buildInsight(sunWindow.daylightMinutes)}
      </p>

      {/* Visual daylight arc bar */}
      <div className="relative mt-5 mb-4">
        {/* Track */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8EDE4]">
          {/* Filled portion */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFD166] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Sun position dot */}
        {isDaytime && (
          <div
            className="absolute -top-1 flex h-4.5 w-4.5 items-center justify-center"
            style={{ left: `calc(${progress}% - 9px)` }}
          >
            <div className="h-4 w-4 rounded-full border-2 border-white bg-[#F5A623] shadow-md" />
          </div>
        )}
      </div>

      {/* Sunrise / Sunset / Duration row */}
      <div className="flex items-center justify-between text-sm">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9BA696]">Sunrise</p>
          <p className="font-semibold text-text-primary">{formatTime(sunWindow.sunrise)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">{formatDaylight(sunWindow.daylightMinutes)} of daylight</p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9BA696]">Sunset</p>
          <p className="font-semibold text-text-primary">{formatTime(sunWindow.sunset)}</p>
        </div>
      </div>
    </div>
  );
}
