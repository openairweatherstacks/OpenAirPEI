import { ShieldAlert, Waves } from "lucide-react";

import type { WaterfrontRisk } from "@/lib/types";
import { formatObservationTime } from "@/lib/utils";

export function WaterfrontRiskCard({ risk }: { risk: WaterfrontRisk }) {
  const palette =
    risk.level === "dangerous"
      ? {
          wrapper: "rounded-[1.75rem] border border-[#f2c5c5] bg-[#fff0f0] p-5",
          accent: "mb-3 flex items-center gap-2 text-[#b42318]",
          level: "Dangerous",
        }
      : risk.level === "elevated"
        ? {
            wrapper: "rounded-[1.75rem] border border-[#f5d7a8] bg-[#fff6e8] p-5",
            accent: "mb-3 flex items-center gap-2 text-[#9a6700]",
            level: "Elevated",
          }
        : {
            wrapper: "rounded-[1.75rem] border border-[#cce8f4] bg-[#eef7fc] p-5",
            accent: "mb-3 flex items-center gap-2 text-[#0a527a]",
            level: "Monitor",
          };

  return (
    <section className={palette.wrapper}>
      <div className={palette.accent}>
        <Waves className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">Waterfront risk</p>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-text-primary">{risk.headline}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{risk.summary}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary">
          {palette.level}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/70 bg-white/75 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-text-primary">
            <ShieldAlert className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Official trigger</p>
          </div>
          <p className="text-sm text-text-primary">{risk.trigger}</p>
          {risk.issuedAt && (
            <p className="mt-1 text-xs text-text-muted">Issued {formatObservationTime(risk.issuedAt)}</p>
          )}
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/75 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">What to do</p>
          <p className="mt-2 text-sm leading-6 text-text-primary">{risk.guidance}</p>
        </div>
      </div>
    </section>
  );
}
