import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility — OpenAir Atlantic",
  description: "Our commitment to making smart weather accessible to everyone on Prince Edward Island.",
};

export default function AccessibilityPage() {
  return (
    <div className="page-shell space-y-10 py-10">
      <section className="panel p-6 sm:p-10">
        <p className="eyebrow mb-3">Accessibility</p>
        <h1 className="section-title text-4xl sm:text-5xl">Smart weather for everyone</h1>
        <p className="section-copy mt-4">
          OpenAir Atlantic is built on a simple belief: knowing what the outdoors is doing should
          not depend on your ability, device, or background. The island belongs to everyone. So
          does the information that helps you enjoy it safely.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="mb-3 font-serif text-2xl text-text-primary">Our standard</h2>
          <p className="text-sm leading-7 text-text-secondary">
            OpenAir Atlantic targets <strong className="text-text-primary">WCAG 2.1 Level AA</strong> across
            every page. That means sufficient colour contrast, keyboard navigation, screen reader
            compatibility, resizable text, and no content that relies on colour alone to convey
            meaning. We test regularly and treat accessibility issues with the same urgency as any
            other bug.
          </p>
        </div>
        <div className="panel p-6">
          <h2 className="mb-3 font-serif text-2xl text-text-primary">Why it matters here</h2>
          <p className="text-sm leading-7 text-text-secondary">
            Our users include people with asthma checking air quality before a walk, parents of
            children with heat sensitivity, older adults planning a beach day, and visitors who
            rely on assistive technology. Smart weather is only smart if it reaches everyone who
            needs it.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title text-3xl">What we have built in</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Colour contrast",
              body: "All text meets WCAG AA contrast ratios. Conditions scores use both colour and text labels — never colour alone.",
            },
            {
              title: "Keyboard navigation",
              body: "Every interactive element is reachable and operable by keyboard. Focus states are visible throughout.",
            },
            {
              title: "Screen reader support",
              body: "Images carry descriptive alt text. Icon buttons have ARIA labels. Dynamic content updates are announced.",
            },
            {
              title: "Readable text",
              body: "Minimum 12px across all body text. Content reflows correctly up to 400% zoom without horizontal scrolling.",
            },
            {
              title: "Plain language",
              body: "Conditions are written in plain, direct English — not meteorological jargon. One sentence should tell you what to do.",
            },
            {
              title: "Touch targets",
              body: "All tappable elements are at least 44×44px — accessible to users with limited motor control or larger fingers.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-[1.75rem] border border-border bg-white p-5">
              <p className="mb-2 font-semibold text-text-primary">{title}</p>
              <p className="text-sm leading-6 text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="mb-3 font-serif text-2xl text-text-primary">Known limitations</h2>
        <p className="text-sm leading-7 text-text-secondary">
          The interactive map (Leaflet) has limited screen reader support — we are actively working
          on an accessible text-based alternative for all mapped location data. Live webcam embeds
          are third-party content and may not fully meet our accessibility standard. If any part of
          this site creates a barrier for you, please let us know.
        </p>
      </section>

      <section className="panel p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-forest-light">
            <Mail className="h-5 w-5 text-forest" />
          </div>
          <div>
            <h2 className="mb-2 font-serif text-2xl text-text-primary">Report an issue</h2>
            <p className="mb-4 text-sm leading-7 text-text-secondary">
              If you encounter an accessibility barrier — anything that makes it harder to get the
              information you need — please tell us. We respond to all accessibility reports within
              two business days.
            </p>
            <a
              href="mailto:accessibility@openairatlantic.ca"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-deep"
            >
              <Mail className="h-4 w-4" />
              accessibility@openairatlantic.ca
            </a>
          </div>
        </div>
      </section>

      <p className="text-xs text-text-muted">
        This statement was last reviewed April 2026.{" "}
        <Link href="/contact" className="underline hover:text-forest">
          Contact us
        </Link>{" "}
        for any questions.
      </p>
    </div>
  );
}
