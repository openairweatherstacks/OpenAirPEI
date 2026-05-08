"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";

interface TrailReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  difficulty: "easy" | "moderate" | "challenging";
  date: string;
  verified: boolean;
}

const SAMPLE_TRAIL_REVIEWS: TrailReview[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely stunning hike! The views of the red cliffs were even more spectacular than expected. Weather was perfect and the trail is well-maintained. Highly recommend!",
    difficulty: "moderate",
    date: "3 days ago",
    verified: true,
  },
  {
    id: "2",
    author: "James T.",
    rating: 5,
    text: "Best easy hike near Charlottetown. The forest is peaceful and the wildlife spotting was great. Saw several bird species I'd never seen before. Perfect for a morning walk.",
    difficulty: "easy",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "3",
    author: "Emma K.",
    rating: 4,
    text: "Beautiful trail with diverse ecosystems. The mud was a bit thick from recent rain, but nothing a good pair of hiking boots couldn't handle. Would visit again in drier season.",
    difficulty: "moderate",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: "4",
    author: "Michael P.",
    rating: 5,
    text: "Took my family on this trail. The kids loved finding tide pools at the beach section. Made for a memorable day out. Great parking and facilities nearby.",
    difficulty: "easy",
    date: "3 weeks ago",
    verified: true,
  },
];

export function TrailReviews() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredReviews = selectedRating
    ? SAMPLE_TRAIL_REVIEWS.filter((r) => r.rating === selectedRating)
    : SAMPLE_TRAIL_REVIEWS;

  const avgRating = (
    SAMPLE_TRAIL_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_TRAIL_REVIEWS.length
  ).toFixed(1);

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Visitor reviews</p>
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What hikers are saying</h2>
      </div>

      {/* Rating summary */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-4xl text-text-primary">{avgRating}</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(parseFloat(avgRating))
                      ? "fill-sun text-sun"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Based on {SAMPLE_TRAIL_REVIEWS.length} reviews
          </p>
        </div>

        {/* Filter buttons */}
        <div className="sm:col-span-1 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Filter by rating
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRating(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedRating === null
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-text-secondary hover:border-forest-light"
              }`}
            >
              All ({SAMPLE_TRAIL_REVIEWS.length})
            </button>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = SAMPLE_TRAIL_REVIEWS.filter((r) => r.rating === rating).length;
              return (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedRating === rating
                      ? "bg-forest text-white"
                      : "border border-border bg-white text-text-secondary hover:border-forest-light"
                  }`}
                >
                  {rating} ★ ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-forest-light flex items-center justify-center">
                  <User className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary">{review.author}</p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2 py-0.5 text-xs font-semibold text-forest">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-sun text-sun" : "text-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-text-secondary mb-3">{review.text}</p>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest capitalize">
                {review.difficulty === "easy" ? "🟢" : review.difficulty === "moderate" ? "🟡" : "🔴"} {review.difficulty} hike
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leave a review CTA */}
      <div className="rounded-2xl border-2 border-dashed border-forest-light bg-forest-light/50 p-8 text-center">
        <p className="font-serif text-xl text-forest mb-2 break-words">Share your experience</p>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Have you hiked this trail? Leave a review to help other adventurers find the best conditions.
        </p>
        <button className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-forest-deep transition">
          Leave a review
        </button>
      </div>
    </section>
  );
}
