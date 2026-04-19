import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the OpenAir Atlantic team.",
};

export default function ContactPage() {
  return (
    <div className="page-shell space-y-10">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Contact Us</p>
        <h1 className="section-title text-4xl sm:text-5xl">Get in touch</h1>
        <p className="section-copy mt-4">
          We&apos;re a small team building something we genuinely love. Whether you have a question,
          a bug report, a location suggestion, or just want to say hello — we read every message.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Contact details */}
        <div className="space-y-5">
          <div className="panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-light">
                <Mail className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="eyebrow">Email</p>
                <p className="font-serif text-xl text-text-primary">General inquiries</p>
              </div>
            </div>
            <a
              href="mailto:info@openairatlantic.com"
              className="text-base font-semibold text-forest transition hover:text-forest-deep"
            >
              info@openairatlantic.com
            </a>
            <p className="mt-2 text-sm text-text-secondary">
              We aim to respond within 1–2 business days. For urgent bridge or safety questions,
              contact Confederation Bridge operations directly at 1-888-437-6565.
            </p>
          </div>

          <div className="panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sun-light">
                <MapPin className="h-5 w-5 text-sun-deep" />
              </div>
              <div>
                <p className="eyebrow">Based in</p>
                <p className="font-serif text-xl text-text-primary">Prince Edward Island</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-text-secondary">
              OpenAir Atlantic is built on PEI, for Atlantic Canada. We live here, we use this app,
              and we care about getting the conditions right for the people who depend on them.
            </p>
          </div>

          <div className="panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-light">
                <MessageSquare className="h-5 w-5 text-leaf" />
              </div>
              <div>
                <p className="eyebrow">Feedback</p>
                <p className="font-serif text-xl text-text-primary">Help us improve</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-text-secondary">
              Spotted a wrong condition? Know a location we&apos;re missing? Have an idea for a feature?
              Send it to{" "}
              <a href="mailto:info@openairatlantic.com" className="font-semibold text-forest hover:text-forest-deep">
                info@openairatlantic.com
              </a>{" "}
              — local knowledge makes this app better for everyone.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Send a message</p>
          <h2 className="font-serif text-2xl text-text-primary mb-6">Write to us directly</h2>
          <form
            action={`mailto:info@openairatlantic.com`}
            method="GET"
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Your name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Sarah from Charlottetown"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Your email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Subject
              </label>
              <select
                name="subject"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary focus:border-forest focus:outline-none"
              >
                <option value="">Select a topic</option>
                <option>General feedback</option>
                <option>Bug report</option>
                <option>Location suggestion</option>
                <option>Media or press inquiry</option>
                <option>Partnership or grant inquiry</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Message
              </label>
              <textarea
                name="body"
                placeholder="What's on your mind?"
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-forest focus:outline-none"
              />
            </div>

            <a
              href="mailto:info@openairatlantic.com"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest-deep px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-forest-deep"
            >
              Send message
            </a>
            <p className="text-center text-xs text-text-muted">
              Or email us directly at{" "}
              <a href="mailto:info@openairatlantic.com" className="underline">
                info@openairatlantic.com
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
