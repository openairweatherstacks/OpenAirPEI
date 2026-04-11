"use client";

import dynamic from "next/dynamic";

import type { LocationConditions } from "@/lib/types";

const PEIMapClient = dynamic(() => import("@/components/map/PEIMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 text-sm font-medium text-text-secondary shadow-[0_28px_90px_rgba(58,140,47,0.12)]">
      Loading island map...
    </div>
  ),
});

export function PEIMap({
  locations,
  focusId,
}: {
  locations: LocationConditions[];
  focusId?: string;
}) {
  return <PEIMapClient locations={locations} focusId={focusId} />;
}
