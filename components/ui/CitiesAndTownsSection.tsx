"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

interface TownCard {
  slug: string;
  name: string;
  heroImage: string;
  heroAlt: string;
  lede: string;
}

interface TownListItem {
  name: string;
  slug: string;
  live: boolean;
}

const ALL_TOWNS: TownListItem[] = [
  { name: "Alberton", slug: "alberton", live: false },
  { name: "Charlottetown", slug: "charlottetown", live: false },
  { name: "Cornwall", slug: "cornwall", live: true },
  { name: "Kensington", slug: "kensington", live: false },
  { name: "Montague", slug: "montague", live: false },
  { name: "O'Leary", slug: "oleary", live: false },
  { name: "Souris", slug: "souris", live: false },
  { name: "Stratford", slug: "stratford", live: true },
  { name: "Summerside", slug: "summerside", live: true },
  { name: "Tignish", slug: "tignish", live: false },
];

const FEATURED_TOWNS: TownCard[] = [
  {
    slug: "stratford",
    name: "Stratford",
    heroImage: "/stratford-hero.png",
    heroAlt: "Town of Stratford welcome sign at golden hour",
    lede: "Charlottetown's east-shore neighbour. Live conditions for Tea Hill Beach, Fullerton's Creek trails, and the Hillsborough Bridge commute.",
  },
  {
    slug: "cornwall",
    name: "Cornwall",
    heroImage: "/cornwall-hero.png",
    heroAlt: "Cornwall, PEI boardwalk along the West River",
    lede: "West River estuary town nine minutes from downtown. Live conditions for the boardwalk, Argyle Shore beach, and Route 1 wind.",
  },
  {
    slug: "summerside",
    name: "Summerside",
    heroImage: "/summerside-hero.webp",
    heroAlt: "Summerside waterfront along Bedeque Bay",
    lede: "The Island's second city on Bedeque Bay. Live conditions for Rotary Friendship Park, Linkletter Beach, and the Confederation Trail.",
  },
];

export function CitiesAndTownsSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section className="space-y-5">
      {/* Header row with tab label + dropdown */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Cities &amp; towns</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">
            Your town, your conditions
          </h2>
        </div>

        {/* Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition hover:bg-bg"
          >
            <MapPin className="h-3.5 w-3.5 text-forest" />
            All towns
            <ChevronDown
              className={`h-3.5 w-3.5 text-text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-border bg-white shadow-glow">
                <div className="p-2">
                  {ALL_TOWNS.map((town) =>
                    town.live ? (
                      <Link
                        key={town.slug}
                        href={`/town/${town.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-primary transition hover:bg-forest-light"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                        {town.name}
                      </Link>
                    ) : (
                      <div
                        key={town.slug}
                        className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-text-muted"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          {town.name}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wide">Soon</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Town cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_TOWNS.map((town) => (
          <Link
            key={town.slug}
            href={`/town/${town.slug}`}
            className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-border transition hover:shadow-glow hover:ring-forest/30"
          >
            {/* Hero image */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={town.heroImage}
                alt={town.heroAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-4 font-serif text-xl text-white">
                {town.name}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm leading-5 text-text-secondary">{town.lede}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-forest">
                Live conditions →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
