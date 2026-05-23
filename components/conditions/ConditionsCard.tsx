"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wind } from "lucide-react";

import { PawBadge } from "@/components/conditions/PawBadge";
import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import type { LocationConditions } from "@/lib/types";
import { formatObservationTime } from "@/lib/utils";
import { waterTempLabel } from "@/lib/water";

const TOWN_PAGE_IDS = new Set(["cornwall", "stratford", "summerside"]);

const LOCATION_IMAGES: Record<string, string> = {
  cavendish: "/get-images/cavendish.jpg",
  charlottetown: "/get-images/charlottetown-waterfront.jpg",
  "confederation-trail": "/get-images/confederation-trail.jpg",
  greenwich: "/get-images/dunes.jpg",
  "confederation-bridge": "/get-images/confederationbridege.jpg",
  "north-cape": "/get-images/northcape.jpg",
  "basin-head": "/basinhead-hero.png",
  "victoria-park": "/get-images/victoria-park.jpg",
  "cavendish-campground": "/get-images/cavendishcamp.jpg",
  "stanhope-campground": "/get-images/stanhope.jpg",
  summerside: "/get-images/summerside.webp",
  stratford: "/stratford-hero.png",
  cornwall: "/cornwall-hero.png",
  "tea-hill": "/tea-hill-hero.jpg",
  "brackley-beach": "/brackley.webp",
  "pondside-park": "/pondside.jpeg",
  "kinlock-beach": "/kinlock-beach.jpeg",
  "fox-meadow-golf": "/get-images/fooxmeadow.jpg",
  "belvedere-golf": "/get-images/Belvedere.webp",
  "fullertons-creek": "/fullerton.jpg",
};

export function ConditionsCard({
  entry,
  compact = false,
}: {
  entry: LocationConditions;
  compact?: boolean;
}) {
  const image = LOCATION_IMAGES[entry.location.id];
  const safetyHighlights = [
    entry.communityNotice
      ? entry.communityNotice.mode === "cooling"
        ? "Cooling spaces nearby"
        : "Warm-up spaces nearby"
      : null,
    entry.waterfrontRisk
      ? entry.waterfrontRisk.level === "dangerous"
        ? "Waterfront flood risk"
        : "Waterfront surge watch"
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="surface-card flex h-full flex-col overflow-hidden rounded-[2rem]"
    >
      {image && (
        <div className="relative h-44 w-full">
          <Image
            src={image}
            alt={entry.location.name}
            fill
            quality={90}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <ScoreBadge score={entry.conditions.score} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
              {entry.location.type}
            </p>
            <h3 className="font-serif text-xl text-text-primary break-words">{entry.location.name}</h3>
            <p className="mt-1 text-xs leading-5 text-text-muted">{entry.location.tagline}</p>
          </div>
          {!image && <ScoreBadge score={entry.conditions.score} />}
        </div>

        <p className="mb-2 font-serif text-lg leading-snug text-text-primary break-words">
          {entry.conditions.headline}
        </p>
        <p className={safetyHighlights.length > 0 ? "mb-3 text-sm leading-6 text-text-secondary" : "mb-5 text-sm leading-6 text-text-secondary"}>
          {entry.conditions.summary}
        </p>

        {safetyHighlights.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {safetyHighlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center rounded-full bg-[#eef7fc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0a527a]"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-forest-light/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Right now</p>
            <p className="mt-1 font-serif text-lg text-text-primary">
              {entry.weather.temperature}°C, feels like {entry.weather.feelsLike}°C
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-sun-light/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-text">Wind</p>
            <p className="mt-1 flex items-center gap-2 font-serif text-lg text-text-primary">
              <Wind className="h-4 w-4 text-sun-deep" />
              {entry.weather.windSpeed} km/h {entry.weather.windDirection}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-[1.5rem] border border-border bg-bg px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Paw index</p>
            <p className="mt-0.5 text-xs leading-5 text-text-secondary">{entry.pawIndex.statement}</p>
          </div>
          <PawBadge score={entry.pawIndex.score} />
        </div>

        {entry.waterTemp !== null && (
          <div className="mt-3 flex items-center justify-between rounded-[1.5rem] border border-[#cce8f4] bg-[#eef7fc] px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a527a]">
                Water temp
              </p>
              <p className="mt-0.5 font-serif text-lg text-text-primary">
                {entry.waterTemp}°C — {waterTempLabel(entry.waterTemp)}
              </p>
            </div>
            <span className="text-2xl">🌊</span>
          </div>
        )}

        {!compact && (
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-bg px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                Updated {formatObservationTime(entry.weather.observationTime)}
              </p>
              <Link
                href={TOWN_PAGE_IDS.has(entry.location.id) ? `/town/${entry.location.id}` : `/location/${entry.location.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-deep"
              >
                Full outlook <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
