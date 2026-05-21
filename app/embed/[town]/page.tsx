import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getSiteUrl } from "@/lib/site";

import { CopyButton } from "./CopyButton";

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
    pitch: "Sidebar widget — score, headline, key metrics. Best for footers and sidebars.",
    height: 240,
    maxWidth: 360,
  },
  {
    key: "standard",
    label: "Standard",
    pitch: "Homepage strip — adds AI summary, activity grid, and 3-hour window countdown.",
    height: 460,
    maxWidth: 420,
  },
  {
    key: "hero",
    label: "Hero",
    pitch: "Tourism page hero — full meteorologist read with tides, UV alerts, and local insight.",
    height: 640,
    maxWidth: 480,
  },
];

export async function generateStaticParams() {
  return PEI_LOCATIONS.map((location) => ({ town: location.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const location = PEI_LOCATIONS.find((l) => l.id === town);
  if (!location) return { title: "Embed not found" };

  return {
    title: `Embed live ${location.name} weather on your site`,
    description: `Free embeddable weather widget for ${location.name}, PEI. Three sizes, real-time data from Environment Canada, AI-powered conditions verdicts. Copy one line of code.`,
    robots: { index: true, follow: true },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const location = PEI_LOCATIONS.find((l) => l.id === town);

  if (!location) notFound();

  const siteUrl = getSiteUrl();
  const linkSnippet = `<a href="${siteUrl}/location/${location.id}?utm_source=partner&utm_medium=link&utm_campaign=${location.id}">Live ${location.name} conditions</a>`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#6B7366] font-semibold">
          Free embeddable widget
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight"
          style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
        >
          Live {location.name} weather, <span className="text-[#2D6E24]">on your site</span>
        </h1>
        <p className="text-[#4A4A4A] leading-relaxed max-w-2xl">
          A free, AI-powered weather widget for {location.name} — built on Environment Canada data and
          translated into plain-English verdicts. Three sizes for any layout. Copy one line of HTML
          and drop it in.
        </p>
      </header>

      {SIZES.map((size, index) => {
        const widgetUrl = `${siteUrl}/widget/${location.id}${
          size.key === "compact" ? "" : `?size=${size.key}`
        }`;
        const iframeSnippet = `<iframe src="${widgetUrl}" width="100%" height="${size.height}" style="border:0;max-width:${size.maxWidth}px" loading="lazy" title="Live ${location.name} weather by OpenAir"></iframe>`;

        return (
          <section
            key={size.key}
            className="rounded-2xl border border-[#E8EDE4] bg-[#FAFAF7] p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#6B7366] font-semibold">
                  Option {index + 1}
                </p>
                <h2
                  className="text-xl sm:text-2xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
                >
                  {size.label}
                </h2>
              </div>
              <CopyButton value={iframeSnippet} label={`Copy ${size.label.toLowerCase()} code`} />
            </div>

            <p className="text-sm text-[#4A4A4A]">{size.pitch}</p>

            <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-5 items-start">
              <div className="rounded-xl bg-white border border-[#E8EDE4] overflow-hidden mx-auto lg:mx-0">
                <iframe
                  src={`/widget/${location.id}${size.key === "compact" ? "" : `?size=${size.key}`}`}
                  width={size.maxWidth}
                  height={size.height}
                  style={{ border: 0, display: "block", maxWidth: "100%" }}
                  loading="lazy"
                  title={`Live ${location.name} weather — ${size.label.toLowerCase()} preview`}
                />
              </div>

              <pre className="rounded-xl bg-[#1A1A1A] text-[#F2F8EE] text-[11px] sm:text-xs p-4 overflow-x-auto leading-relaxed self-start">
                <code className="break-all">{iframeSnippet}</code>
              </pre>
            </div>
          </section>
        );
      })}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2
            className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
          >
            Just want a text link?
          </h2>
          <CopyButton value={linkSnippet} label="Copy link code" />
        </div>
        <pre className="rounded-xl bg-[#1A1A1A] text-[#F2F8EE] text-xs p-4 overflow-x-auto leading-relaxed">
          <code>{linkSnippet}</code>
        </pre>
      </section>

      <section className="rounded-2xl bg-[#F2F8EE] border border-[#E8F5E4] p-6 space-y-3">
        <h2
          className="text-lg font-bold text-[#2D6E24]"
          style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
        >
          Why embed this?
        </h2>
        <ul className="space-y-2 text-sm text-[#4A4A4A] leading-relaxed">
          <li>
            <strong className="text-[#1A1A1A]">Free, forever.</strong> No API key, no signup, no
            subscription. We cover the data costs.
          </li>
          <li>
            <strong className="text-[#1A1A1A]">Real local data.</strong> Live readings from
            Environment Canada, ECCC air quality, and DFO tide stations — not generic forecasts.
          </li>
          <li>
            <strong className="text-[#1A1A1A]">AI-powered verdicts.</strong> Visitors don&apos;t just
            see numbers — they get plain-English advice on what to do today.
          </li>
          <li>
            <strong className="text-[#1A1A1A]">Branded for {location.name}.</strong> Your town name is
            front-and-centre. Visitors see the conditions {location.name} cares about.
          </li>
        </ul>
      </section>

      <footer className="text-xs text-[#6B7366] pt-6 border-t border-[#E8EDE4]">
        Questions? Want a custom version with your town logo? Email{" "}
        <a href="mailto:hello@openairatlantic.com" className="text-[#2D6E24] underline">
          hello@openairatlantic.com
        </a>
        .
      </footer>
    </div>
  );
}
