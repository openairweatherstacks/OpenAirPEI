import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "OpenAir Atlantic — real-time environmental intelligence for Atlantic Canada.",
};

export default function AboutPage() {
  return (
    <div className="page-shell space-y-10">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">About OpenAir Atlantic</p>
        <h1 className="section-title text-4xl sm:text-5xl">
          Built for people who live outside
        </h1>
        <p className="section-copy mt-4">
          OpenAir Atlantic is a free, mobile-first environmental intelligence app for Prince Edward
          Island — and the first step toward a tool that covers all four Atlantic provinces.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <p className="eyebrow mb-3">The problem we solve</p>
          <h2 className="font-serif text-2xl text-text-primary">
            Weather apps show numbers. We tell you what to do.
          </h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">
            The Weather Network gives you icons. Google gives you a forecast. Environment Canada has
            real data but buries it in a 1998-era interface. None of them answer the actual question:
            should I go to Cavendish Beach right now, and how long do I have before the rain hits?
          </p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            OpenAir pulls live observations and alerts from Environment Canada, tides and buoy data
            from Fisheries & Oceans Canada and CIOOS, and short-range rain timing from Open-Meteo
            — then runs it through an AI meteorologist trained to speak like a local, not a
            textbook. The result is one clear answer per location, in plain English.
          </p>
        </div>

        <div className="panel p-6">
          <p className="eyebrow mb-3">The vision</p>
          <h2 className="font-serif text-2xl text-text-primary">
            PEI is the launch. Atlantic Canada is the goal.
          </h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">
            The same codebase that powers OpenAir PEI is built to scale to New Brunswick, Nova
            Scotia, and Newfoundland & Labrador. Each province gets its own location layer, data
            sources, and local knowledge — but the same AI interpretation engine underneath.
          </p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Our goal is to make outdoor intelligence free and accessible for every person in Atlantic
            Canada — residents, tourists, farmers, fishers, and anyone who needs to make a decision
            based on what the sky is doing right now.
          </p>
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">How it works</p>
        <h2 className="section-title text-3xl">Three layers, one answer</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Live data",
              body: "We pull real-time weather observations, air quality, radar, tides, and water temperature from open public feeds — mainly Environment Canada, Fisheries & Oceans, and ocean buoy networks, with Open-Meteo filling in short-range rain timing. No paywalls. No third-party data brokers.",
            },
            {
              step: "02",
              title: "AI interpretation",
              body: "A Claude AI model reads the raw numbers and writes a plain-English assessment for each location — what conditions mean for swimmers, cyclists, hikers, drivers, and anyone with asthma or young kids.",
            },
            {
              step: "03",
              title: "One clear answer",
              body: "Every location gets a score (Excellent / Good / Fair / Stay Inside), a headline, a time window, and specific activity guidance. You know what to do in under 10 seconds.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="rounded-[1.5rem] bg-bg p-5">
              <p className="mb-3 font-serif text-4xl text-forest/30">{step}</p>
              <h3 className="mb-2 font-serif text-xl text-text-primary">{title}</h3>
              <p className="text-sm leading-6 text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Data & transparency</p>
        <h2 className="section-title text-3xl">Open data, open about how we use it</h2>
        <p className="section-copy mt-3">
          OpenAir uses public environmental data sources — primarily Canadian federal government
          feeds, plus Open-Meteo for short-range precipitation timing. We do not sell data, we do
          not profile users, and we do not require an account to use the app.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/data-sources"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-forest-deep"
          >
            View all data sources <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-forest hover:text-forest"
          >
            Privacy policy
          </Link>
        </div>
      </section>
    </div>
  );
}
