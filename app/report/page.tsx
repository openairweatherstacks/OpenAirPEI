import { Camera, Flag, MapPinned, MessageSquareMore } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Community reports</p>
        <h1 className="section-title">Help OpenAir see what the sensors miss</h1>
        <p className="section-copy mt-4">
          Beta reporting is designed to capture surf conditions, local fog, trail washouts, and beach
          crowding without turning the app into a social feed.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="panel p-5">
          <p className="eyebrow mb-3">Coming in phase 2</p>
          <div className="space-y-4 text-sm leading-6 text-text-secondary">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-forest-light p-2 text-forest">
                <MapPinned className="h-4 w-4" />
              </div>
              Geotagged reports for beach wind, trail mud, surf, and visibility.
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-sun-light p-2 text-sun-deep">
                <Camera className="h-4 w-4" />
              </div>
              Photo-backed reports to help locals verify edge cases fast.
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-forest-light p-2 text-forest">
                <Flag className="h-4 w-4" />
              </div>
              Moderate-first workflow so reports stay useful instead of noisy.
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-3xl bg-bg p-3 text-text-primary">
              <MessageSquareMore className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                Submission preview
              </p>
              <p className="font-serif text-2xl text-text-primary">Reporter flow</p>
            </div>
          </div>

          <form className="grid gap-4">
            <input
              className="min-h-11 rounded-2xl border border-border bg-white px-4 text-sm outline-none ring-0 transition focus:border-forest"
              placeholder="Location"
              disabled
            />
            <input
              className="min-h-11 rounded-2xl border border-border bg-white px-4 text-sm outline-none ring-0 transition focus:border-forest"
              placeholder="What changed?"
              disabled
            />
            <textarea
              className="min-h-32 rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-forest"
              placeholder="Quick local note"
              disabled
            />
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-white opacity-70"
            >
              Beta form coming soon
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
