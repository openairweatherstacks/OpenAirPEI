import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/supabase";

async function getReviews(locationId: string): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*, photos(*)")
    .eq("location_id", locationId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data as Review[]) ?? [];
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
  const reviews = await getReviews(locationId);

  if (reviews.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-border p-6 text-center">
        <p className="font-serif text-xl text-text-primary">No reviews yet</p>
        <p className="mt-1 text-sm text-text-muted">Be the first to share your experience here.</p>
      </div>
    );
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        <span className="font-serif text-4xl text-text-primary">{avg.toFixed(1)}</span>
        <div>
          <StarRow rating={Math.round(avg)} />
          <p className="mt-0.5 text-xs text-text-muted">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Review cards */}
      {reviews.map((review) => (
        <div key={review.id} className="rounded-[1.75rem] border border-border bg-white p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-text-primary">{review.author_name}</p>
              <p className="text-xs text-text-muted">{formatDate(review.created_at)}</p>
            </div>
            <StarRow rating={review.rating} />
          </div>
          <p className="text-sm leading-6 text-text-secondary">{review.body}</p>

          {/* Photo thumbnails */}
          {review.photos && review.photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.photos.map((photo) => {
                const { data } = supabase.storage
                  .from("location-photos")
                  .getPublicUrl(photo.storage_path);
                return (
                  <a
                    key={photo.id}
                    href={data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-16 w-16 overflow-hidden rounded-2xl border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.publicUrl}
                      alt="Location photo"
                      className="h-full w-full object-cover"
                    />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
