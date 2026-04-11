import { ShieldAlert, Truck } from "lucide-react";
import { notFound } from "next/navigation";

import { BridgeStatus } from "@/components/ui/BridgeStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { getLocationConditions } from "@/lib/environment";

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
    </div>
  );
}
