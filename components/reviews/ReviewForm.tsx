"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm({ locationId }: { locationId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !name.trim() || !body.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          authorName: name,
          rating,
          reviewBody: body,
        }),
      });

      const json = await res.json() as { success?: boolean; error?: string; id?: string };
      if (!res.ok) throw new Error(json.error ?? "Submission failed");

      // Upload photos if any
      if (files.length > 0 && json.id) {
        for (const file of files) {
          const form = new FormData();
          form.append("reviewId", json.id);
          form.append("locationId", locationId);
          form.append("file", file);
          await fetch("/api/photos", { method: "POST", body: form });
        }
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[1.75rem] border border-forest/20 bg-forest-light p-6 text-center">
        <p className="font-serif text-2xl text-forest">Thanks for your review!</p>
        <p className="mt-2 text-sm text-text-secondary">
          It will show up once we&apos;ve given it a quick check — usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Your rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition",
                  star <= (hovered || rating)
                    ? "fill-sun text-sun"
                    : "fill-transparent text-border"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sarah from Halifax"
          maxLength={60}
          required
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none"
        />
      </div>

      {/* Review body */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Your experience
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What was it like? What should other visitors know?"
          rows={4}
          maxLength={800}
          required
          className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-text-muted">{body.length}/800</p>
      </div>

      {/* Photo upload */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Add photos (optional · max 3 · 5MB each)
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []).slice(0, 3);
            setFiles(selected);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex min-h-11 items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-text-secondary transition hover:border-forest hover:text-forest"
        >
          <Camera className="h-4 w-4" />
          {files.length > 0 ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "Upload photos"}
        </button>
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((f) => (
              <span key={f.name} className="rounded-full bg-forest-light px-3 py-1 text-xs text-forest">
                {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={!rating || !name.trim() || body.trim().length < 10 || status === "submitting"}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-forest-deep disabled:opacity-40"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit review"
        )}
      </button>
    </form>
  );
}
