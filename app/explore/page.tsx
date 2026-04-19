import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import { getAllLocationConditions } from "@/lib/environment";
import type { LocationConditions, LocationType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore PEI",
  description: "Browse beaches, parks, trails, and landmarks across Prince Edward Island by today's conditions.",
};

type Category = {
  id: string;
  label: string;
  description: string;
  types: LocationType[];
  image?: string;
  accent: string;
  textAccent: string;
};

const CATEGORIES: Category[] = [
  {
    id: "beaches",
    label: "Beaches",
    description: "Red sand, warm gulf water, and the best swimming in Atlantic Canada.",
    types: ["beach"],
    image: "/get-images/cavendish.jpg",
    accent: "from-blue-900/70 to-blue-600/40",
    textAccent: "text-blue-200",
  },
  {
    id: "parks-trails",
    label: "Parks & Trails",
    description: "Dunes, forest paths, and 450 km of flat cycling across the whole island.",
    types: ["park", "trail", "landmark", "campground"],
    image: "/get-images/confederation-trail.jpg",
    accent: "from-forest/80 to-leaf/40",
    textAccent: "text-green-200",
  },
  {
    id: "city",
    label: "City & Waterfront",
    description: "Charlottetown's harbour, restaurants, and walkable waterfront.",
    types: ["city"],
    image: "/get-images/charlottetown-waterfront.jpg",
    accent: "from-charcoal/80 to-charcoal/40",
    textAccent: "text-white/90",
  },
  {
    id: "campgrounds",
    label: "Campgrounds",
    description: "PEI's best camping — wind, rain, and overnight conditions before you pitch a tent.",
    types: ["campground"],
    image: "/get-images/cavendish.jpg",
    accent: "from-charcoal/70 to-forest/40",
    textAccent: "text-green-100",
  },
  {
    id: "golf",
    label: "Golf",
    description: "PEI's best courses — wind readings, UV index, and playing conditions before you tee off.",
    types: ["golf"],
    image: "/get-images/fooxmeadow.jpg",
    accent: "from-forest/80 to-leaf/50",
    textAccent: "text-green-100",
  },
  {
    id: "travel",
    label: "Travel & Transport",
    description: "Bridge conditions, airport wind, and everything you need before you leave.",
    types: ["bridge", "airport"],
    image: "/get-images/confederationbridege.jpg",
    accent: "from-sun-deep/80 to-sun/40",
    textAccent: "text-yellow-100",
  },
];

function scoreRank(score: string) {
  if (score === "Excellent") return 4;
  if (score === "Good") return 3;
  if (score === "Fair") return 2;
  return 1;
}

export default async function ExplorePage() {
  const allLocations = await getAllLocationConditions();

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    locations: allLocations
      .filter((entry) => cat.types.includes(entry.location.type))
      .sort((a, b) => scoreRank(b.conditions.score) - scoreRank(a.conditions.score)),
  }));

  const totalLocations = allLocations.length;
  const excellentCount = allLocations.filter((e) => e.conditions.score === "Excellent").length;

  return (
    <div>
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <div className="page-shell pb-0">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Explore Prince Edward Island</p>
          <h1 className="section-title text-4xl sm:text-5xl">
            Find your perfect spot today
          </h1>
          <p className="section-copy mt-3">
            {excellentCount} of {totalLocations} locations are in excellent condition right now.
            Browse by category to find the best match for what you want to do.
          </p>
        </section>
      </div>

      {/* ── CATEGORY CARDS ───────────────────────────────────────── */}
      <div className="page-shell py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {byCategory.map((cat) => {
            const best = cat.locations[0];
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="group relative overflow-hidden rounded-[1.75rem] bg-charcoal"
                style={{ minHeight: "180px" }}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sun-deep to-sun" />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent}`} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className={`mb-1 text-xs font-semibold uppercase tracking-[0.22em] ${cat.textAccent}`}>
                    {cat.locations.length} location{cat.locations.length !== 1 ? "s" : ""}
                    {best ? ` · Best: ${best.conditions.score}` : ""}
                  </p>
                  <p className="font-serif text-2xl text-white">{cat.label}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ────────────────────────────────────── */}
      <div className="page-shell space-y-14 pt-2">
        {byCategory.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">{cat.label}</p>
                <h2 className="section-title text-3xl">{cat.description}</h2>
              </div>
            </div>

            {cat.locations.length === 0 ? (
              <p className="text-sm text-text-muted">No locations in this category yet.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.locations.map((entry) => (
                  <ExploreCard key={entry.location.id} entry={entry} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function ExploreCard({ entry }: { entry: LocationConditions }) {
  const LOCATION_IMAGES: Record<string, string> = {
    cavendish: "/get-images/cavendish.jpg",
    charlottetown: "/get-images/charlottetown-waterfront.jpg",
    "confederation-trail": "/get-images/confederation-trail.jpg",
    "victoria-park": "/get-images/victoria-park.jpg",
    greenwich: "/get-images/dunes.jpg",
    "confederation-bridge": "/get-images/confederationbridege.jpg",
    "north-cape": "/get-images/northcape.jpg",
    "basin-head": "/get-images/singing sands.webp",
    summerside: "/get-images/summerside.webp",
  };

  const image = LOCATION_IMAGES[entry.location.id];

  return (
    <Link
      href={`/location/${entry.location.id}`}
      className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_8px_40px_rgba(42,42,42,0.07)] transition hover:shadow-[0_16px_60px_rgba(42,42,42,0.12)]"
    >
      {image && (
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={image}
            alt={entry.location.name}
            fill
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
}
