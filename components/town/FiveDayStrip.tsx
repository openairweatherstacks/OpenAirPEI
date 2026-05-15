import type { ConditionsScore } from "@/lib/types";
import type { DailyVerdict } from "@/lib/forecast";

const SCORE_PILL: Record<ConditionsScore, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

export function FiveDayStrip({ verdicts }: { verdicts: DailyVerdict[] }) {
  if (verdicts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {verdicts.map((day, index) => {
        const pill = SCORE_PILL[day.score];
        const isToday = index === 0;
        return (
          <div
            key={day.date}
            className="rounded-2xl bg-white border border-[#E8EDE4] p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] uppercase tracking-widest text-[#6B7366] font-semibold"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {isToday ? "Today" : day.weekday}
              </span>
              <span className="text-[10px] text-[#9BA696]">
                {Math.round(day.high)}° / {Math.round(day.low)}°
              </span>
            </div>

            <div className={`${pill.bg} ${pill.text} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1`}>
              <span className={`${pill.dot} h-1.5 w-1.5 rounded-full`} aria-hidden />
              <span
                className="text-xs font-bold tracking-wide"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {day.score}
              </span>
            </div>

            <p className="text-[12px] text-[#2A2A2A] leading-snug">{day.summary}</p>

            <div className="flex items-center justify-between text-[10px] text-[#9BA696] pt-1 border-t border-[#F2F4EF]">
              <span>Wind {day.maxWindSpeed} km/h</span>
              <span>{day.precipProbability}% rain</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
