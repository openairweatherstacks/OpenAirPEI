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

export function SunWindowCard({ sunWindow }: { sunWindow: SunWindow }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#FDF0D5] to-[#F2F8EE] border border-[#E8EDE4] p-5 sm:p-6">
      <div className="text-[10px] uppercase tracking-widest text-[#6B7366] font-semibold mb-2">
        Daylight today
      </div>
      <p
        className="text-lg sm:text-xl text-[#1A1A1A] leading-snug mb-3"
        style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif", fontWeight: 600 }}
      >
        {buildInsight(sunWindow.daylightMinutes)}
      </p>
      <div className="flex items-baseline gap-4 text-sm text-[#4A4A4A]">
        <div>
          <span className="text-[#9BA696] mr-1">Sunrise</span>
          <span className="font-semibold text-[#2A2A2A]">{formatTime(sunWindow.sunrise)}</span>
        </div>
        <div>
          <span className="text-[#9BA696] mr-1">Sunset</span>
          <span className="font-semibold text-[#2A2A2A]">{formatTime(sunWindow.sunset)}</span>
        </div>
        <div className="ml-auto text-xs text-[#6B7366]">
          {formatDaylight(sunWindow.daylightMinutes)}
        </div>
      </div>
    </div>
  );
}
