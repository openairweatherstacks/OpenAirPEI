import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getSiteUrl } from "@/lib/site";

import { CopyButton } from "./CopyButton";

// Locations not in PEI_LOCATIONS that have standalone pages
const STANDALONE_LOCATIONS: Record<string, { name: string; path: string }> = {
  "st-stephen-nb": { name: "St. Stephen, NB", path: "/nb/st-stephen" },
};

type SizeSpec = {
  key: "compact" | "standard" | "hero";
  label: string;
  pitch: string;
  height: number;
  maxWidth: number;
};

const SIZES: SizeSpec[] = [
  {
    key: "compact",
    label: "Compact",
    pitch: "Sidebar widget — score, headline, and key metrics. Best for footers and sidebars.",
    height: 220,
    maxWidth: 360,
  },
  {
    key: "standard",
    label: "Standard",
    pitch: "Homepage strip — adds AI summary, activity grid, and 3-hour window countdown.",
    height: 430,
    maxWidth: 420,
  },
  {
    key: "hero",
    label: "Hero",
    pitch: "Tourism page hero — full meteorologist read with tides, UV alerts, and local insight.",
    height: 610,
    maxWidth: 480,
  },
];

function resolveLocation(town: string): { id: string; name: string; pagePath: string } | null {
  const pei = PEI_LOCATIONS.find((l) => l.id === town);
  if (pei) return { id: pei.id, name: pei.name, pagePath: `/location/${pei.id}` };
  const standalone = STANDALONE_LOCATIONS[town];
  if (standalone) return { id: town, name: standalone.name, pagePath: standalone.path };
  return null;
}

export async function generateStaticParams() {
  const peiParams = PEI_LOCATIONS.map((l) => ({ town: l.id }));
  const standaloneParams = Object.keys(STANDALONE_LOCATIONS).map((id) => ({ town: id }));
  return [...peiParams, ...standaloneParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const loc = resolveLocation(town);
  if (!loc) return { title: "Embed not found" };
  return {
    title: `Embed live ${loc.name} weather on your site`,
    description: `Free embeddable weather widget for ${loc.name}. Three sizes, real-time data from Environment Canada, AI-powered conditions verdicts. Copy one line of code.`,
    robots: { index: true, follow: true },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const loc = resolveLocation(town);
  if (!loc) notFound();

  const siteUrl = getSiteUrl();
  const linkSnippet = `<a href="${siteUrl}${loc.pagePath}?utm_source=partner&utm_medium=link&utm_campaign=${loc.id}">Live ${loc.name} conditions — OpenAir Atlantic</a>`;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">

        {/* Header */}
        <header className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8B9286]">
            Free embeddable widget
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
            Live {loc.name} weather,{" "}
            <span style={{ color: "#2D6E24" }}>on your site</span>
          </h1>
          <p className="text-[#4A4A4A] leading-relaxed max-w-2xl text-[15px]">
            A free, AI-powered weather widget for {loc.name} — built on Environment Canada data
            and translated into plain-English verdicts. Three sizes for any layout. Copy one line
            of HTML and drop it in.
          </p>
        </header>

        {/* Size previews */}
        {SIZES.map((size, index) => {
          const widgetUrl = `${siteUrl}/widget/${loc.id}${size.key === "compact" ? "" : `?size=${size.key}`}`;
          const iframeSnippet = `<iframe src="${widgetUrl}" width="100%" height="${size.height}" style="border:0;border-radius:16px;max-width:${size.maxWidth}px;display:block" loading="lazy" title="Live ${loc.name} weather by OpenAir Atlantic"></iframe>`;

          return (
            <section
              key={size.key}
              className="rounded-2xl border border-[#E8EDE4] bg-white p-5 sm:p-7 space-y-5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Section header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8B9286] mb-0.5">
                    Option {index + 1}
                  </p>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">{size.label}</h2>
                  <p className="text-sm text-[#6B7366] mt-1 max-w-md">{size.pitch}</p>
                </div>
                <CopyButton value={iframeSnippet} label={`Copy ${size.label.toLowerCase()} code`} />
              </div>

              {/* Preview + code */}
              <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 items-start">
                {/* Widget preview in a clean neutral frame */}
                <div
                  className="rounded-2xl overflow-hidden mx-auto lg:mx-0"
                  style={{
                    background: "#F4F4F2",
                    padding: 20,
                    display: "inline-block",
                  }}
                >
                  <iframe
                    src={`/widget/${loc.id}${size.key === "compact" ? "" : `?size=${size.key}`}`}
                    width={size.maxWidth}
                    height={size.height}
                    style={{ border: 0, display: "block", maxWidth: "100%", borderRadius: 16 }}
                    loading="lazy"
                    title={`Live ${loc.name} weather — ${size.label.toLowerCase()} preview`}
                  />
                </div>

                {/* Code snippet */}
                <div className="self-start">
                  <p className="text-xs font-semibold text-[#6B7366] uppercase tracking-wider mb-2">
                    Paste this into your site
                  </p>
                  <pre
                    className="rounded-xl text-[11px] sm:text-xs p-4 overflow-x-auto leading-relaxed"
                    style={{ background: "#1A1A1A", color: "#E8F5E4" }}
                  >
                    <code className="break-all">{iframeSnippet}</code>
                  </pre>
                  <p className="text-xs text-[#9BA696] mt-2">
                    Auto-updates every 10 minutes. No API key needed.
                  </p>
                </div>
              </div>
            </section>
          );
        })}

        {/* Text link option */}
        <section className="rounded-2xl border border-[#E8EDE4] bg-white p-5 sm:p-7 space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">Just want a text link?</h2>
              <p className="text-sm text-[#6B7366] mt-0.5">
                A simple hyperlink you can drop into any page or email.
              </p>
            </div>
            <CopyButton value={linkSnippet} label="Copy link" />
          </div>
          <pre
            className="rounded-xl text-xs p-4 overflow-x-auto leading-relaxed"
            style={{ background: "#1A1A1A", color: "#E8F5E4" }}
          >
            <code>{linkSnippet}</code>
          </pre>
        </section>

        {/* Why embed */}
        <section className="rounded-2xl border border-[#BDE3B5] bg-[#F2F8EE] p-6 sm:p-7 space-y-4">
          <h2 className="text-lg font-bold text-[#2D6E24]">Why embed this?</h2>
          <ul className="space-y-3 text-sm text-[#2A2A2A] leading-relaxed">
            {[
              ["Free, forever.", "No API key, no signup, no subscription."],
              ["Real local data.", `Live readings from Environment Canada — not generic forecasts.`],
              ["AI-powered verdicts.", "Visitors don't just see numbers — they get plain-English advice."],
              [`Branded for ${loc.name}.`, "Your location is front-and-centre with every update."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-2">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3A8C2F",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <span>
                  <strong className="font-semibold">{title}</strong> {body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-xs text-[#9BA696] pt-2 border-t border-[#E8EDE4]">
          Questions or want a custom version?{" "}
          <a href="mailto:hello@openairatlantic.com" style={{ color: "#2D6E24", textDecoration: "underline" }}>
            hello@openairatlantic.com
          </a>
        </footer>
      </div>
    </div>
  );
}
