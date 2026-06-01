import type { Metadata } from "next";
import { Camera, Flag, MapPinned } from "lucide-react";
import { ReportForm } from "@/components/report/ReportForm";

export const metadata: Metadata = {
  title: "Report Conditions",
  description: "Submit a community conditions report for any PEI location. Help others know what's really happening on the ground.",
  openGraph: {
    title: "Report Conditions | OpenAir Atlantic",
    description: "Submit a community conditions report for any PEI location.",
    url: "https://openairatlantic.com/report",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Report Conditions — OpenAir Atlantic" }],
  },
  alternates: { canonical: "https://openairatlantic.com/report" },
};

export default function ReportPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Community reports</p>
        <h1 className="section-title text-2xl sm:text-3xl">Help OpenAir see what the sensors miss</h1>
        <p className="section-copy mt-4">
          Sensors track numbers. You track reality. Report what you are seeing — trail conditions,
          beach crowding, fog, surf — and help everyone plan better.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-5">
          <div className="panel p-5 space-y-4">
            <p className="eyebrow">How it works</p>
            <div className="space-y-4 text-sm leading-6 text-text-secondary">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-forest-light p-2 text-forest shrink-0">
                  <MapPinned className="h-4 w-4" />
                </div>
                Pick your location, rate the conditions 1–5, and describe what you see in a sentence or two.
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-sun-light p-2 text-sun-deep shrink-0">
                  <Camera className="h-4 w-4" />
                </div>
                Attach a photo if you have one — it helps the community verify conditions fast.
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-forest-light p-2 text-forest shrink-0">
                  <Flag className="h-4 w-4" />
                </div>
                Reports are reviewed before they go live — no noise, just useful ground truth.
              </div>
            </div>
          </div>
        </div>

        <ReportForm />
      </section>
    </div>
  );
}
