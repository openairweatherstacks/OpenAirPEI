import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getLocationImage } from "@/lib/data/locationImages";
import type { ConditionsScore, LocationConditions } from "@/lib/types";

const SCORE_PILL: Record<ConditionsScore, { bg: string; text: string; dot: string }> = {
  Excellent: { bg: "bg-[#E8F5E4]", text: "text-[#2D6E24]", dot: "bg-[#3A8C2F]" },
  Good: { bg: "bg-[#F2F8EE]", text: "text-[#5FA025]", dot: "bg-[#7DC832]" },
  Fair: { bg: "bg-[#FDF0D5]", text: "text-[#E8960F]", dot: "bg-[#F5A623]" },
  "Stay Inside": { bg: "bg-[#FCE9E6]", text: "text-[#9C2D22]", dot: "bg-[#C0392B]" },
};

export function NearbyTownLinks({ items }: { items: LocationConditions[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const pill = SCORE_PILL[item.conditions.score];
        const image = getLocationImage(item.location.id);
        return (
          <Link
            key={item.location.id}
            href={`/location/${item.location.id}`}
            className="group rounded-2xl bg-white border border-[#E8EDE4] overflow-hidden hover:border-[#2D6E24] hover:shadow-sm transition-all flex flex-col"
          >
            {image ? (
              <div className="relative aspect-[16/10] w-full bg-[#F2F4EF]">
                <Image
                  src={image}
                  alt={`${item.location.name}, PEI`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className={`${pill.bg} ${pill.text} inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 backdrop-blur-sm bg-opacity-95`}>
                    <span className={`${pill.dot} h-1.5 w-1.5 rounded-full`} aria-hidden />
                    <span className="text-[10px] font-bold tracking-wide">{item.conditions.score}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                  <ArrowUpRight
                    size={14}
                    className="text-[#9BA696] group-hover:text-[#2D6E24] transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4">
                <span className="text-2xl" aria-hidden>{item.location.icon}</span>
                <ArrowUpRight
                  size={16}
                  className="text-[#9BA696] group-hover:text-[#2D6E24] transition-colors"
                />
              </div>
            )}
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <h3
                className="text-base font-bold text-[#1A1A1A] leading-tight"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {item.location.name}
              </h3>
              {!image && (
                <div className={`${pill.bg} ${pill.text} self-start inline-flex items-center gap-1.5 rounded-full px-2 py-0.5`}>
                  <span className={`${pill.dot} h-1.5 w-1.5 rounded-full`} aria-hidden />
                  <span className="text-[10px] font-bold tracking-wide">{item.conditions.score}</span>
                </div>
              )}
              <p className="text-[11px] text-[#6B7366] leading-snug mt-auto">{item.conditions.headline}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
