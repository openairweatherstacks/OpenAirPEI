import { ArrowUpRight } from "lucide-react";

import type { TownBeach } from "@/lib/data/towns";
import { fetchOpenMeteoForecast } from "@/lib/weather";

type BeachVerdict = "Go" | "Caution" | "Skip";

interface BeachReading {
  beach: TownBeach;
  verdict: BeachVerdict;
  reason: string;
  temperature: number | null;
  windSpeed: number | null;
  uvIndex: number | null;
  precipitation: number | null;
}

const VERDICT_PILL: Record<BeachVerdict, { bg: string; text: string; dot: string }> = {
  Go: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Caution: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  Skip: { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

function rateBeach(reading: {
  temperature: number | null;
  windSpeed: number | null;
  uvIndex: number | null;
  precipitation: number | null;
}): { verdict: BeachVerdict; reason: string } {
  const temp = reading.temperature ?? 0;
  const wind = reading.windSpeed ?? 0;
  const uv = reading.uvIndex ?? 0;
  const precip = reading.precipitation ?? 0;

  if (precip > 0.5) return { verdict: "Skip", reason: "Active rain — wait for the cell to pass." };
  if (wind > 40) return { verdict: "Skip", reason: "Wind too strong for a comfortable beach day." };
  if (temp < 12) return { verdict: "Caution", reason: "Cool air — a beach walk works, but swimming will bite." };
  if (wind > 25) return { verdict: "Caution", reason: "Breezy enough that the beach umbrella will fight you." };
  if (uv > 7) return { verdict: "Caution", reason: "High UV — bring sunscreen and limit midday exposure." };
  return { verdict: "Go", reason: "Comfortable conditions for the beach right now." };
}

async function readBeach(beach: TownBeach): Promise<BeachReading> {
  const snapshot = await fetchOpenMeteoForecast({ lat: beach.lat, lng: beach.lng });
  const reading = {
    temperature: snapshot?.temperature ?? null,
    windSpeed: snapshot?.windSpeed ?? null,
    uvIndex: snapshot?.uvIndex ?? null,
    precipitation: snapshot?.currentPrecipitation ?? null,
  };
  const rating = rateBeach(reading);
  return { beach, ...reading, ...rating };
}

export async function BeachConditionsGrid({
  beaches,
  parksAndTrailsUrl,
}: {
  beaches: TownBeach[];
  parksAndTrailsUrl: string;
}) {
  if (beaches.length === 0) return null;

  const readings = await Promise.all(beaches.map(readBeach));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {readings.map(({ beach, verdict, reason, temperature, windSpeed, uvIndex }) => {
        const pill = VERDICT_PILL[verdict];
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lng}`;
        return (
          <div
            key={beach.id}
            className="rounded-2xl bg-white border border-[#E8EDE4] p-5 space-y-3 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                className="text-base font-bold text-[#1A1A1A] leading-tight"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {beach.name}
              </h3>
              <div className={`${pill.bg} ${pill.text} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 flex-shrink-0`}>
                <span className={`${pill.dot} h-1.5 w-1.5 rounded-full`} aria-hidden />
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
                >
                  {verdict}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#2A2A2A] leading-snug">{reason}</p>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#F2F4EF]">
              <div>
                <div className="text-[9px] uppercase tracking-wide text-[#9BA696]">Temp</div>
                <div className="text-sm font-semibold text-[#2A2A2A]">
                  {temperature !== null ? `${Math.round(temperature)}°` : "—"}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-[#9BA696]">Wind</div>
                <div className="text-sm font-semibold text-[#2A2A2A]">
                  {windSpeed !== null ? `${Math.round(windSpeed)} km/h` : "—"}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-[#9BA696]">UV</div>
                <div className="text-sm font-semibold text-[#2A2A2A]">{uvIndex ?? "—"}</div>
              </div>
            </div>

            <p className="text-[11px] text-[#6B7366] leading-snug pt-2 border-t border-[#F2F4EF] mt-auto">
              {beach.description}
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
                href={parksAndTrailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7366] hover:text-[#2D6E24] inline-flex items-center gap-1"
              >
                Park info → townofstratford.ca
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
