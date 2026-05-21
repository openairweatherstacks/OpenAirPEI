import { ArrowUpRight } from "lucide-react";

import type { TownPark } from "@/lib/data/towns";
import { buildActivityStatus } from "@/lib/environment";
import type { Location, WeatherSnapshot } from "@/lib/types";

const STATUS_PILL: Record<"great" | "ok" | "not recommended", { bg: string; text: string; dot: string; label: string }> = {
  great: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]", label: "Great" },
  ok: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]", label: "OK" },
  "not recommended": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]", label: "Skip" },
};

export function ParkConditionsGrid({
  parks,
  location,
  weather,
  parksAndTrailsUrl,
}: {
  parks: TownPark[];
  location: Location;
  weather: WeatherSnapshot;
  parksAndTrailsUrl: string;
}) {
  if (parks.length === 0) return null;

  const recreationUrl = parksAndTrailsUrl;
  const parksHost = (() => {
    try {
      return new URL(parksAndTrailsUrl).hostname.replace(/^www\./, "");
    } catch {
      return "official site";
    }
  })();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {parks.map((park) => {
        const assessment = buildActivityStatus("walking", location, weather);
        const pill = STATUS_PILL[assessment.status];
        const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${park.name}, ${park.address}`,
        )}`;
        return (
          <div
            key={park.id}
            className="flex flex-col gap-3 rounded-[1.75rem] border border-[#E8EDE4] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                className="text-base font-bold text-[#1A1A1A] leading-tight"
                style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
              >
                {park.name}
              </h3>
              <div className={`${pill.bg} ${pill.text} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 flex-shrink-0`}>
                <span className={`${pill.dot} h-1.5 w-1.5 rounded-full`} aria-hidden />
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
                >
                  {pill.label}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#2A2A2A] leading-snug">{assessment.reason}</p>

            <p className="text-[11px] text-[#6B7366] leading-snug pt-2 border-t border-[#F2F4EF] mt-auto">
              {park.highlights}
            </p>

            <div className="flex items-center justify-between gap-3 text-[11px] pt-1">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D6E24] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Directions
                <ArrowUpRight size={12} />
              </a>
              <a
                href={recreationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7366] hover:text-[#2D6E24] inline-flex items-center gap-1"
              >
                Hours & info → {parksHost}
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
