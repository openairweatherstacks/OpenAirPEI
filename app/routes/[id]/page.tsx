import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Cycling Routes — Coming Soon",
  description: "Cycling routes feature coming soon to OpenAir Atlantic.",
};

export default async function RouteDetailPage() {
  return (
    <div className="page-shell mt-8 text-center py-16">
      <p className="text-sm text-text-muted mb-3 uppercase tracking-wide font-semibold">Coming Soon</p>
      <h1 className="font-serif text-4xl text-text-primary mb-4">Cycling Routes</h1>
      <p className="text-text-secondary max-w-lg mx-auto mb-8">
        Real-time route scoring for the Confederation Trail is coming soon. Check back for live conditions, GPS guidance, and AI-powered recommendations.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white hover:bg-forest-deep transition">
        Back to home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
