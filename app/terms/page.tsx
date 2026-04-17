import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "OpenAir Atlantic terms of use.",
};

const LAST_UPDATED = "April 16, 2026";

export default function TermsPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title text-4xl">Terms of Use</h1>
        <p className="mt-3 text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        <p className="section-copy mt-4">
          By using OpenAir Atlantic, you agree to these terms. Please read them — they are short and
          written in plain English.
        </p>
      </section>

      <div className="space-y-4">
        {[
          {
            title: "What OpenAir Atlantic is",
            body: [
              "OpenAir Atlantic is a free informational tool that aggregates publicly available environmental data and uses AI to provide plain-English interpretations of outdoor conditions in Atlantic Canada.",
              "It is not a professional meteorological service, emergency alert system, or safety tool. It is not a substitute for Environment Canada's official forecasts and warnings.",
            ],
          },
          {
            title: "No warranty on accuracy",
            body: [
              "Environmental data is inherently uncertain. Conditions at a location may differ from what this app shows, due to the distance between weather stations and actual locations, data transmission delays, or AI interpretation errors.",
              "OpenAir Atlantic is provided 'as is' with no warranty of accuracy, completeness, or fitness for any purpose. We make reasonable efforts to display accurate data but cannot guarantee it.",
            ],
          },
          {
            title: "Not for safety-critical decisions",
            body: [
              "Do not rely solely on OpenAir Atlantic for safety-critical decisions such as crossing the Confederation Bridge in severe weather, ocean swimming during storm warnings, or any activity where incorrect information could cause injury or death.",
              "Always verify conditions with official sources (Environment Canada, Confederation Bridge Operations, local authorities) before undertaking high-risk activities.",
            ],
          },
          {
            title: "Permitted use",
            body: [
              "You may use OpenAir Atlantic freely for personal, non-commercial use.",
              "You may not scrape, copy, or redistribute the app's AI-generated content at scale without permission.",
              "You may not use the app in any way that would violate Canadian law.",
            ],
          },
          {
            title: "Limitation of liability",
            body: [
              "To the maximum extent permitted by applicable Canadian law, OpenAir Atlantic and its operators are not liable for any damages arising from your use of or reliance on this app, including but not limited to missed weather events, outdoor injuries, or travel disruptions.",
            ],
          },
          {
            title: "Governing law",
            body: [
              "These terms are governed by the laws of Prince Edward Island and the federal laws of Canada applicable therein.",
            ],
          },
          {
            title: "Contact",
            body: [
              "Questions about these terms? Email legal@openairatlantica.ca.",
            ],
          },
        ].map(({ title, body }) => (
          <div key={title} className="panel p-6">
            <h2 className="mb-4 font-serif text-2xl text-text-primary">{title}</h2>
            <div className="space-y-3">
              {body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
