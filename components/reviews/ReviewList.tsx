import { and, desc, eq } from "drizzle-orm";
import { Star } from "lucide-react";

import { getDb } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import type { ReviewWithPhotos } from "@/lib/db/schema";

async function getReviews(locationId: string): Promise<ReviewWithPhotos[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const db = getDb();
  return db.query.reviews.findMany({
    where: and(eq(reviews.locationId, locationId), eq(reviews.approved, true)),
    orderBy: [desc(reviews.createdAt)],
    limit: 20,
    with: {
      photos: {
        where: (p, { eq: eqFn }) => eqFn(p.approved, true),
      },
    },
  });
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? "fill-sun text-sun" : "fill-transparent text-border"}`}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export async function ReviewList({ locationId }: { locationId: string }) {
  const reviewRows = await getReviews(locationId);

  if (reviewRows.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-border p-6 text-center">
        <p className="font-serif text-xl text-text-primary">No reviews yet</p>
        <p className="mt-1 text-sm text-text-muted">Be the first to share your experience here.</p>
      </div>
    );
  }

  const avg = reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewRows.length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        <span className="font-serif text-4xl text-text-primary">{avg.toFixed(1)}</span>
        <div>
          <StarRow rating={Math.round(avg)} />
          <p className="mt-0.5 text-xs text-text-muted">
            {reviewRows.length} review{reviewRows.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Review cards */}
      {reviewRows.map((review) => (
        <div key={review.id} className="rounded-[1.75rem] border border-border bg-white p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-text-primary">{review.authorName}</p>
              <p className="text-xs text-text-muted">{formatDate(review.createdAt)}</p>
            </div>
            <StarRow rating={review.rating} />
          </div>
          <p className="text-sm leading-6 text-text-secondary">{review.body}</p>

          {/* Photo thumbnails — storagePath is the public blob URL */}
          {review.photos && review.photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.storagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-16 w-16 overflow-hidden rounded-2xl border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.storagePath}
                    alt="Location photo"
                    className="h-full w-full object-cover"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
