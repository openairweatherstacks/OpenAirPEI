"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";

import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import type { LocationConditions, LocationType } from "@/lib/types";

const TYPE_LABELS: Record<LocationType, string> = {
  beach: "Beach",
  park: "Park",
  trail: "Trail",
  city: "City",
  community: "Town",
  bridge: "Bridge",
  airport: "Airport",
  campground: "Campground",
  golf: "Golf",
  landmark: "Landmark",
};

const TOWN_PAGE_IDS = new Set(["cornwall", "stratford"]);
const CITY_PAGE_IDS = new Set(["charlottetown", "summerside"]);

const LOCATION_IMAGES: Record<string, string> = {
  cavendish: "/get-images/cavendish.jpg",
  charlottetown: "/charlottetown-waterfront-hero.jpg",
  "confederation-trail": "/get-images/confederation-trail.jpg",
  "victoria-park": "/victoria.png",
  greenwich: "/get-images/dunes.jpg",
  "confederation-bridge": "/get-images/confederationbridege.jpg",
  "north-cape": "/get-images/northcape.jpg",
  "basin-head": "/basinhead-hero.png",
  summerside: "/summerside-hero.webp",
  stratford: "/stratford-hero.png",
  cornwall: "/cornwall-hero.png",
  "pondside-park": "/pondside.jpeg",
  "fullertons-creek": "/fullerton.jpg",
  "tea-hill": "/tea-hill-hero.jpg",
  "brackley-beach": "/brackley.webp",
  "fox-meadow-golf": "/get-images/fooxmeadow.jpg",
  "belvedere-golf": "/get-images/Belvedere.webp",
  "cavendish-campground": "/get-images/cavendishcamp.jpg",
  "stanhope-campground": "/get-images/stanhope.jpg",
  "kinlock-beach": "/kinlock-beach.jpeg",
};

const TYPE_FILTERS: { label: string; types: LocationType[] }[] = [
  { label: "All", types: [] },
  { label: "Beaches", types: ["beach"] },
  { label: "Parks & Trails", types: ["park", "trail", "landmark", "campground"] },
  { label: "Cities & Towns", types: ["city", "community"] },
  { label: "Golf", types: ["golf"] },
  { label: "Travel", types: ["bridge", "airport"] },
];

export function ExploreSearch({ locations }: { locations: LocationConditions[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filterTypes = TYPE_FILTERS.find((f) => f.label === activeFilter)?.types ?? [];

    return locations.filter((entry) => {
      const matchesType =
        filterTypes.length === 0 || filterTypes.includes(entry.location.type);

      const matchesQuery =
        q === "" ||
        entry.location.name.toLowerCase().includes(q) ||
        entry.location.tagline?.toLowerCase().includes(q) ||
        TYPE_LABELS[entry.location.type]?.toLowerCase().includes(q);

      return matchesType && matchesQuery;
    });
  }, [locations, query, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search beaches, parks, towns…"
          className="w-full rounded-2xl border border-[#E8EDE4] bg-white py-3.5 pl-11 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:text-text-primary transition"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              activeFilter === f.label
                ? "border-forest bg-forest text-white"
                : "border-[#E8EDE4] bg-white text-text-secondary hover:border-forest/40 hover:text-forest"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted">
        {filtered.length} location{filtered.length !== 1 ? "s" : ""}
        {query && ` matching "${query}"`}
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E8EDE4] bg-white p-10 text-center">
          <p className="font-serif text-lg text-text-secondary">No locations found.</p>
          <p className="mt-1 text-sm text-text-muted">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => {
            const image = LOCATION_IMAGES[entry.location.id];
            const href = CITY_PAGE_IDS.has(entry.location.id)
              ? `/city/${entry.location.id}`
              : TOWN_PAGE_IDS.has(entry.location.id)
                ? `/town/${entry.location.id}`
                : `/location/${entry.location.id}`;

            return (
              <Link
                key={entry.location.id}
                href={href}
                className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_8px_40px_rgba(42,42,42,0.07)] transition hover:shadow-[0_16px_60px_rgba(42,42,42,0.12)]"
              >
                {image && (
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={entry.location.name}
                      fill
                      quality={90}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-2 right-2">
                      <ScoreBadge score={entry.conditions.score} />
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-serif text-lg leading-snug text-text-primary">
                        {entry.location.name}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-text-muted line-clamp-2">
                        {entry.location.tagline}
                      </p>
                    </div>
                    {!image && <ScoreBadge score={entry.conditions.score} />}
                  </div>
                  <p className="mt-2 text-sm leading-5 text-text-secondary line-clamp-2">
                    {entry.conditions.headline}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-text-muted">
                      {entry.weather.temperature}°C · Wind {entry.weather.windSpeed} km/h
                      {entry.waterTemp !== null ? ` · Water ${entry.waterTemp}°C` : ""}
                    </p>
                    <ArrowRight className="h-4 w-4 text-forest opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
