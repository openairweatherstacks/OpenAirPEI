"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wind } from "lucide-react";

import { ScoreBadge } from "@/components/conditions/ScoreBadge";
import type { LocationConditions } from "@/lib/types";
import { formatObservationTime } from "@/lib/utils";
import { waterTempLabel } from "@/lib/water";

const LOCATION_IMAGES: Record<string, string> = {
  cavendish: "/get-images/cavendish.jpg",
  charlottetown: "/get-images/charlottetown-waterfront.jpg",
  "confederation-trail": "/get-images/confederation-trail.jpg",
  "victoria-park": "/get-images/victoria-park.jpg",
};

export function ConditionsCard({
  entry,
  compact = false,
}: {
  entry: LocationConditions;
  compact?: boolean;
}) {
  const image = LOCATION_IMAGES[entry.location.id];

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(42,42,42,0.08)] backdrop-blur"
    >
      {image && (
        <div className="relative h-44 w-full">
          <Image
            src={image}
            alt={entry.location.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <ScoreBadge score={entry.conditions.score} />
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
              {entry.location.type}
            </p>
            <h3 className="font-serif text-2xl text-text-primary">{entry.location.name}</h3>
            <p className="mt-1 text-xs leading-5 text-text-muted">{entry.location.tagline}</p>
          </div>
          {!image && <ScoreBadge score={entry.conditions.score} />}
        </div>

        <p className="mb-2 font-serif text-xl leading-tight text-text-primary">
          {entry.conditions.headline}
        </p>
        <p className="mb-5 text-sm leading-6 text-text-secondary">{entry.conditions.summary}</p>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-3xl bg-forest-light/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Right now</p>
            <p className="mt-1 font-serif text-lg text-text-primary">
              {entry.weather.temperature}°C, feels like {entry.weather.feelsLike}°C
            </p>
          </div>
          <div className="rounded-3xl bg-sun-light/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-deep">Wind</p>
            <p className="mt-1 flex items-center gap-2 font-serif text-lg text-text-primary">
              <Wind className="h-4 w-4 text-sun-deep" />
              {entry.weather.windSpeed} km/h {entry.weather.windDirection}
            </p>
          </div>
        </div>

        {entry.waterTemp !== null && (
          <div className="mt-3 flex items-center justify-between rounded-3xl border border-[#cce8f4] bg-[#eef7fc] px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a7aad]">
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
          <div className="mt-5 flex items-center justify-between gap-3 rounded-3xl border border-border bg-bg px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
              Updated {formatObservationTime(entry.weather.observationTime)}
            </p>
            <Link
              href={`/location/${entry.location.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-deep"
            >
              Full outlook <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}
