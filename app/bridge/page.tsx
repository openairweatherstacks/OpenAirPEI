import { ChevronDown, ShieldAlert, Truck } from "lucide-react";
import { notFound } from "next/navigation";

import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { getLocationConditions } from "@/lib/environment";

export const metadata = {
  title: "Confederation Bridge",
  description: "Live wind conditions, vehicle restrictions, and crossing guidance for Confederation Bridge.",
};

const FAQS = [
  {
    q: "When does the bridge close to high-sided vehicles?",
    a: "The bridge restricts high-sided vehicles — including RVs, cube trucks, transport trailers, and cargo vans — when sustained winds reach 70 km/h or higher on the bridge deck. This can happen even when conditions onshore feel moderate, because the 12.9 km crossing is fully exposed.",
  },
  {
    q: "Can motorcycles cross in windy conditions?",
    a: "Motorcycles face restrictions earlier than cars. The bridge operations team applies caution advisories starting at 60 km/h sustained wind. At those speeds, crosswinds on the elevated deck can be significantly stronger than what you experienced leaving Borden or Aulac. Always check conditions before departure.",
  },
  {
    q: "Is there a live camera feed of the bridge?",
    a: "Yes — the video embed on this page shows a real-time YouTube stream maintained by Confederation Bridge operations. It gives you a direct visual of current visibility, weather, and traffic flow on the crossing.",
  },
  {
    q: "How do I get the most current status?",
    a: "OpenAir pulls wind data from the Environment Canada station closest to the bridge and updates every 10 minutes. For official closure confirmation, call the Confederation Bridge traffic line at 1-888-437-6565. The live video feed above is also a reliable real-time indicator.",
  },
  {
    q: "Why does the bridge feel windier than the shore?",
    a: "The bridge deck sits roughly 40–60 metres above sea level at its highest point, with no tree cover, buildings, or terrain to break the wind. Northwest and southwest winds are the most impactful, funnelling across the strait with nothing to interrupt them. A 35 km/h day onshore can easily feel like 55+ km/h mid-span.",
  },
];

export default async function BridgePage() {
  const bridge = await getLocationConditions("confederation-bridge");

  if (!bridge || !bridge.conditions.bridgeStatus) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Confederation Bridge</p>
        <h1 className="section-title">Bridge conditions before you leave home</h1>
        <p className="section-copy mt-4">
          Shoreline weather is not enough. The bridge deck runs its own reality when crosswinds pick
          up, especially for motorcycles and taller vehicles.
        </p>
      </section>

      <BridgeStatus status={bridge.conditions.bridgeStatus} windSpeed={bridge.weather.windSpeed} />

      {/* ── LIVE CAMERA FEED ──────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <p className="eyebrow mb-2">Live camera</p>
          <h2 className="section-title text-3xl">Watch the crossing right now</h2>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-black shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/WeYzw-Cs1uQ?autoplay=0&rel=0&modestbranding=1"
              title="Confederation Bridge live camera"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Live stream via YouTube · Confederation Bridge operations feed · Refresh if stream is offline
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          icon={Truck}
          insight="High-sided vehicles are the first group to watch once sustained wind climbs toward 70 km/h."
          rawLabel="Restriction threshold · 70 km/h sustained"
        />
        <MetricCard
          icon={ShieldAlert}
          insight="Motorcycles feel the bridge earlier than cars do. A ride that seems fine in Borden can feel exposed once you hit the deck."
          rawLabel="Motorcycle caution · 60 km/h sustained"
          accentClassName="text-sun-deep"
        />
        <MetricCard
          icon={ShieldAlert}
          insight={bridge.conditions.summary}
          rawLabel={`${bridge.weather.windSpeed} km/h ${bridge.weather.windDirection} · Gusts ${bridge.weather.gustSpeed ?? bridge.weather.windSpeed} km/h`}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="eyebrow mb-3">Travel guidance</p>
          <ul className="space-y-3 text-sm leading-6 text-text-secondary">
            <li>Leave extra buffer if you drive a van, cube truck, RV, trailer, or tall delivery rig.</li>
            <li>Check the official bridge operations feed if you are close to the restriction thresholds.</li>
            <li>Expect the deck to feel stronger than nearby surface streets when west or northwest winds are active.</li>
          </ul>
        </div>
        <div className="panel p-5">
          <p className="eyebrow mb-3">Current read</p>
          <p className="font-serif text-3xl text-text-primary">{bridge.conditions.headline}</p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{bridge.conditions.airQualityStatement}</p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <p className="eyebrow mb-2">Frequently asked questions</p>
          <h2 className="section-title text-3xl">Bridge crossing — what you need to know</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-[1.75rem] border border-border bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-text-secondary">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
