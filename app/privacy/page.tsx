import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "OpenAir Atlantic privacy policy — how we handle your data.",
};

const LAST_UPDATED = "April 16, 2026";

export default function PrivacyPage() {
  return (
    <div className="page-shell space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="section-title text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        <p className="section-copy mt-4">
          OpenAir Atlantic is committed to protecting your privacy. This policy explains what
          information we collect, how we use it, and your rights under Canadian privacy law
          (PIPEDA).
        </p>
      </section>

      <div className="space-y-4">
        {[
          {
            title: "What we collect",
            body: [
              "OpenAir Atlantic does not require you to create an account. You can use the app entirely without providing any personal information.",
              "If you grant location permission in your browser, we use your approximate location to show you the nearest PEI locations. This data is processed locally in your browser and is not transmitted to our servers.",
              "We may collect anonymous usage analytics (page views, feature usage) to understand how people use the app. This data does not identify you personally.",
              "If you submit a community conditions report (when that feature is available), we collect the information you voluntarily provide in the form.",
            ],
          },
          {
            title: "Cookies and local storage",
            body: [
              "We use browser local storage to remember your preferences (e.g. cookie consent, last-viewed location). This data stays on your device.",
              "We may use analytics cookies (e.g. from a privacy-respecting analytics provider) to understand aggregate usage. You can decline these through our cookie consent banner.",
              "We do not use advertising cookies or sell your data to advertisers.",
            ],
          },
          {
            title: "Environmental data",
            body: [
              "All weather, radar, air quality, and tide data shown in the app comes from Canadian government open-data APIs (Environment Canada, Fisheries & Oceans Canada). This data is public and not tied to any individual user.",
              "AI-generated condition summaries are processed via the Anthropic Claude API. Queries to this API contain only environmental data — never personal information about you.",
            ],
          },
          {
            title: "Third parties",
            body: [
              "Map tiles are served by OpenStreetMap. See openstreetmap.org/privacy for their policy.",
              "AI summaries are generated via the Anthropic API. See anthropic.com/privacy for their policy.",
              "We do not share your data with any other third parties.",
            ],
          },
          {
            title: "Data retention",
            body: [
              "We do not store personal data on our servers. Any preferences stored in your browser remain there until you clear them.",
              "Anonymous analytics data may be retained for up to 12 months to identify usage trends.",
            ],
          },
          {
            title: "Your rights (PIPEDA)",
            body: [
              "Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to access, correct, or request deletion of any personal information we hold about you.",
              "To exercise these rights or ask questions about this policy, contact us at privacy@openairatlantica.ca.",
            ],
          },
          {
            title: "Changes to this policy",
            body: [
              "We may update this policy as the app grows. We will update the 'Last updated' date at the top of this page. Continued use of the app after changes constitutes acceptance of the updated policy.",
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
