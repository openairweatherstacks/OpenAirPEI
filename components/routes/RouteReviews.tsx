"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  activity: string;
  date: string;
  verified: boolean;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    text: "Perfect cycling conditions this morning. The app told me exactly when to go and I caught the best window before the wind picked up. Couldn't have timed it better.",
    activity: "cycling",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    author: "James T.",
    rating: 5,
    text: "Used the app to plan a 40km ride on the Murray Harbour branch. The real-time conditions were spot-on — wind forecast matched perfectly. Great experience.",
    activity: "cycling",
    date: "5 days ago",
    verified: true,
  },
  {
    id: "3",
    author: "Emma K.",
    rating: 4,
    text: "Love that I can see nearby parking with GPS coordinates. Made finding the trailhead so easy. Only minor complaint is the map could be a bit faster on mobile.",
    activity: "cycling",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "4",
    author: "Michael P.",
    rating: 5,
    text: "The route filtering is brilliant. I searched for 'easy, under 20km, good for walking' and found exactly what I needed. Took my family out and everyone had a great time.",
    activity: "walking",
    date: "1 week ago",
    verified: true,
  },
];

export function RouteReviews() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredReviews = selectedRating
    ? SAMPLE_REVIEWS.filter((r) => r.rating === selectedRating)
    : SAMPLE_REVIEWS;

  const avgRating = (
    SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_REVIEWS.length
  ).toFixed(1);

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Visitor reviews</p>
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What cyclists are saying</h2>
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
            Based on {SAMPLE_REVIEWS.length} reviews
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
              All ({SAMPLE_REVIEWS.length})
            </button>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = SAMPLE_REVIEWS.filter((r) => r.rating === rating).length;
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
                {review.activity === "cycling" ? "🚴" : "🚶"} {review.activity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leave a review CTA */}
      <div className="rounded-2xl border-2 border-dashed border-forest-light bg-forest-light/50 p-8 text-center">
        <p className="font-serif text-xl text-forest mb-2 break-words">Share your ride</p>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Have you ridden the Confederation Trail? Leave a review to help other cyclists find the best conditions.
        </p>
        <button className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-forest-deep transition">
          Leave a review
        </button>
      </div>
    </section>
  );
}
