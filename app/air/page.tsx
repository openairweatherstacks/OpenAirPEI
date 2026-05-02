export const revalidate = 600;

import { Wind } from "lucide-react";

import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { MetricCard } from "@/components/ui/MetricCard";
import { getIslandAqhiSummary } from "@/lib/environment";
import { average } from "@/lib/utils";

export default async function AirPage() {
  const air = await getIslandAqhiSummary();
  const islandAverage = average(air.map((item) => item.aqhi));

  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Island-wide air quality</p>
        <h1 className="section-title">Can kids, runners, and asthma-prone visitors breathe easy?</h1>
        <p className="section-copy mt-4">
          OpenAir translates AQHI into plain language because a low-risk number matters most when it
          changes what you choose to do next.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            Island average
          </p>
          <p className="mt-2 font-serif text-5xl text-text-primary">AQHI {islandAverage.toFixed(1)}</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            PEI is sitting in a low-risk air band today. Outdoor plans are broadly safe unless a local
            smoke event develops.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {air.map((entry) => (
            <div key={entry.id} className="panel p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-3xl bg-forest-light p-3 text-forest">
                  <Wind className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                    {entry.name}
                  </p>
                  <p className="font-serif text-2xl text-text-primary">AQHI {entry.aqhi}</p>
                </div>
              </div>
              <AirQualityBar value={entry.aqhi} />
              <p className="mt-4 text-sm leading-6 text-text-secondary">{entry.statement}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Wind}
          insight="AQHI matters most when weather looks inviting. Clear skies can still hide risky air, which is why OpenAir keeps it visible beside every destination."
          rawLabel="Hybrid rule · insight first, number second"
        />
        <MetricCard
          icon={Wind}
          insight="The island's coastal wind often helps keep AQHI low, especially after a frontal passage when haze gets flushed quickly."
          rawLabel="Local pattern · Wind can clean the air fast"
          accentClassName="text-sun-text"
        />
        <MetricCard
          icon={Wind}
          insight="Sensitive users still benefit from checking location by location because calm inland pockets can feel different from breezy shorelines."
          rawLabel="Risk lens · Best read is still local"
        />
      </section>
    </div>
  );
}
