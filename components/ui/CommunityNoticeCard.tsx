import { ArrowUpRight, MapPin, Snowflake, SunMedium } from "lucide-react";

import type { CommunityNotice } from "@/lib/types";

export function CommunityNoticeCard({ notice }: { notice: CommunityNotice }) {
  const cooling = notice.mode === "cooling";

  return (
    <section
      className={
        cooling
          ? "rounded-[1.75rem] border border-[#cce8f4] bg-[#eef7fc] p-5"
          : "rounded-[1.75rem] border border-[#f4d7b5] bg-[#fff4e8] p-5"
      }
    >
      <div className={cooling ? "mb-3 flex items-center gap-2 text-[#0a527a]" : "mb-3 flex items-center gap-2 text-[#8a4b08]"}>
        {cooling ? <SunMedium className="h-4 w-4" /> : <Snowflake className="h-4 w-4" />}
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">
          {cooling ? "Cooling relief" : "Warm-up options"}
        </p>
      </div>

      <h2 className="font-serif text-2xl text-text-primary">{notice.headline}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{notice.summary}</p>

      <div className="mt-4 rounded-3xl border border-white/70 bg-white/70 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Trigger</p>
        <p className="mt-1 text-sm text-text-primary">{notice.trigger}</p>
      </div>

      <div className="mt-4 space-y-3">
        {notice.centres.map((centre) => (
          <div key={centre.name} className="rounded-3xl border border-white/70 bg-white/75 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-text-primary">{centre.name}</p>
                <p className="mt-1 text-sm text-text-secondary">{centre.address}</p>
                {centre.note && <p className="mt-1 text-xs leading-5 text-text-muted">{centre.note}</p>}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-text-primary shadow-sm transition hover:bg-white/90"
              >
                <MapPin className="h-4 w-4" />
                Directions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-text-muted">{notice.disclaimer}</p>
    </section>
  );
}
