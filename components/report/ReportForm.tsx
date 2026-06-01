"use client";

import { useRef, useState } from "react";
import { Camera, CheckCircle, Loader2, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { PEI_LOCATIONS } from "@/lib/data/locations";

type Step = "form" | "submitting" | "done" | "error";

export function ReportForm() {
  const [step, setStep] = useState<Step>("form");
  const [locationId, setLocationId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhoto(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Only JPEG, PNG, or WebP photos allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Photo must be under 5MB.");
      return;
    }
    setErrorMsg("");
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!locationId || !authorName.trim() || rating === 0 || body.trim().length < 10) {
      setErrorMsg("Please fill in all fields and add a rating.");
      return;
    }
    setErrorMsg("");
    setStep("submitting");

    try {
      // 1. Submit review
      const reviewRes = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, authorName: authorName.trim(), rating, reviewBody: body.trim() }),
      });
      const reviewData = await reviewRes.json() as { success?: boolean; id?: string; error?: string };
      if (!reviewRes.ok || !reviewData.id) throw new Error(reviewData.error ?? "Failed to submit report.");

      // 2. Upload photo if attached
      if (photo) {
        const form = new FormData();
        form.append("reviewId", reviewData.id);
        form.append("locationId", locationId);
        form.append("file", photo);
        const photoRes = await fetch("/api/photos", { method: "POST", body: form });
        if (!photoRes.ok) {
          const photoData = await photoRes.json() as { error?: string };
          throw new Error(photoData.error ?? "Photo upload failed.");
        }
      }

      setStep("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("error");
    }
  }

  if (step === "done") {
    return (
      <div className="panel p-8 flex flex-col items-center text-center gap-4">
        <div className="rounded-full bg-forest-light p-4">
          <CheckCircle className="h-8 w-8 text-forest" />
        </div>
        <h2 className="font-serif text-2xl text-text-primary">Report received</h2>
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
          Thanks for helping the community. Your report will appear once it&apos;s reviewed — usually within a few hours.
        </p>
        <button
          onClick={() => { setStep("form"); setLocationId(""); setAuthorName(""); setRating(0); setBody(""); setPhoto(null); setPhotoPreview(null); }}
          className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-semibold text-text-primary hover:bg-bg transition"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 space-y-5">
      <div>
        <p className="eyebrow mb-3">Community report</p>
        <h2 className="font-serif text-2xl text-text-primary">What are you seeing on the ground?</h2>
        <p className="mt-1 text-sm text-text-secondary">Reports go through a quick review before appearing publicly.</p>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Location</label>
        <select
          value={locationId}
          onChange={e => setLocationId(e.target.value)}
          className="w-full min-h-11 rounded-2xl border border-border bg-white px-4 text-sm text-text-primary outline-none transition focus:border-forest"
          required
        >
          <option value="">Select a location…</option>
          {PEI_LOCATIONS.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Your name</label>
        <input
          type="text"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          placeholder="First name or nickname"
          className="w-full min-h-11 rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-forest"
          required
        />
      </div>

      {/* Star rating */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Conditions rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  n <= (hoverRating || rating) ? "fill-sun text-sun" : "text-border"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-xs text-text-muted">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">What&apos;s happening?</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="e.g. Trail is muddy past the second bridge. Beach is packed but water is warm. Fog rolled in around noon."
          className="w-full min-h-32 rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-forest resize-none"
          required
          minLength={10}
        />
        <p className="text-xs text-text-muted text-right">{body.length} chars</p>
      </div>

      {/* Photo upload */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Photo <span className="normal-case font-normal">(optional)</span></label>
        {photoPreview ? (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <Image src={photoPreview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => { setPhoto(null); setPhotoPreview(null); }}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-bg py-8 text-sm text-text-muted hover:border-forest hover:text-forest transition"
          >
            <Upload className="h-5 w-5" />
            Tap to add a photo
            <Camera className="h-5 w-5" />
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }}
        />
        <p className="text-xs text-text-muted">JPEG, PNG or WebP · max 5MB</p>
      </div>

      {/* Error */}
      {(step === "error" || errorMsg) && (
        <p className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={step === "submitting"}
        className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-deep transition disabled:opacity-60"
      >
        {step === "submitting" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
        ) : (
          "Submit report"
        )}
      </button>
    </form>
  );
}
