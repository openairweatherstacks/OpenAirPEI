import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "OpenAir Atlantic Launches Free Outdoor Conditions Tool for PEI",
  description: "A new free web tool built by a Bahamian-born Islander gives PEI residents and visitors real-time weather, beach conditions, tide times, and trail reports — all in one place, at no cost.",
  alternates: { canonical: "https://openairatlantic.com/blog/openair-atlantic-launches-pei" },
  openGraph: {
    title: "OpenAir Atlantic Launches Free Outdoor Conditions Tool for PEI",
    description: "A new free web tool built by a Bahamian-born Islander gives PEI residents and visitors real-time weather, beach conditions, tide times, and trail reports — all in one place, at no cost.",
    url: "https://openairatlantic.com/blog/openair-atlantic-launches-pei",
    images: [{ url: "/pei.jpg", width: 1200, height: 630, alt: "Prince Edward Island coastline" }],
  },
  twitter: { card: "summary_large_image", images: ["/pei.jpg"] },
};

export default function PressReleasePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">

      {/* Back */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-forest transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Category tag */}
      <div className="mb-6">
        <span className="inline-block rounded-full bg-forest-light px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep border border-forest/20">
          For Immediate Release
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight mb-5">
        OpenAir Atlantic Launches Free Outdoor Conditions Tool for Prince Edward Island
      </h1>

      {/* Deck */}
      <p className="font-serif text-xl sm:text-2xl text-text-secondary leading-relaxed italic mb-8 pb-8 border-b border-[#E8EDE4]">
        A new free web tool built by a Bahamian-born Islander gives PEI residents and visitors real-time weather, beach conditions, tide times, and trail reports — all in one place, at no cost.
      </p>

      {/* Author + date */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-forest/20">
          <Image
            src="/jaredwhyms.jpg"
            alt="Jared Whyms"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Jared Whyms</p>
          <p className="text-xs text-text-muted">Founder, OpenAir Atlantic · <time dateTime="2026-05-23">May 23, 2026</time> · Charlottetown, Prince Edward Island</p>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full aspect-[16/9] rounded-[1.75rem] overflow-hidden mb-10">
        <Image
          src="/pei.jpg"
          alt="Prince Edward Island coastline at golden hour"
          fill
          quality={90}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      {/* Body */}
      <div className="prose-block space-y-6 text-[17px] leading-[1.8] text-text-secondary">

        <p>
          <span className="font-serif text-5xl font-normal leading-none float-left mr-2 mt-1 text-text-primary">G</span>rowing up in the Bahamas, Jared Whyms had a lifelong familiarity with warm water, open skies, and weather that was easy to read. When he moved to Prince Edward Island in 2021, he discovered something unexpected: a place just as tied to its outdoor landscape, but with conditions that were far harder to track. Tides, beach water quality, trail walkability, radar — the information existed, scattered across a half-dozen government websites. Nobody had put it together in one place. So he did.
        </p>

        <p>
          The result is OpenAir Atlantic, a free web tool now available at{" "}
          <a href="https://openairatlantic.com" className="text-forest font-semibold underline underline-offset-2 hover:text-forest-deep transition">
            openairatlantic.com
          </a>
          , built specifically for PEI residents and visitors who want a real-time read on what is happening outside. No account required, no app to download, no cost. Just open the page and go.
        </p>

        {/* Feature block */}
        <div className="rounded-2xl border border-[#E8EDE4] border-l-4 border-l-forest bg-forest-light p-6 space-y-2 not-prose">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep mb-3">What OpenAir Atlantic provides for PEI</p>
          {[
            "Live weather conditions updated directly from Environment Canada",
            "A 7-day forecast with precipitation probability and temperature range",
            "Beach condition summaries for Island beaches",
            "Daily tide times and current tide stage from Fisheries and Oceans Canada",
            "Walking and trail verdicts for local parks and paths",
            "Sunrise and sunset times, updated daily",
            "A live precipitation radar map centred on your community",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <p>
          The tool draws data exclusively from open government sources — Environment Canada, Fisheries and Oceans Canada, and the open-source Open-Meteo platform — the same authoritative data Islanders already rely on, presented in one convenient, community-focused page. The service carries no advertising and collects no personal user data.
        </p>

        {/* Blockquote */}
        <blockquote className="border-l-2 border-[#E8EDE4] pl-7 my-8">
          <p className="font-serif text-xl sm:text-2xl text-text-primary italic leading-relaxed mb-3">
            &ldquo;Coming from the Bahamas, I understood immediately what it means to live your life around the water and the weather. PEI has that same relationship with the outdoors &mdash; it&apos;s just that the conditions change a lot faster here. I wanted to build something that made it easier for anyone on the Island, whether they&apos;ve been here their whole life or just arrived, to step outside with confidence.&rdquo;
          </p>
          <cite className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted not-italic">
            — Jared Whyms, Founder, OpenAir Atlantic
          </cite>
        </blockquote>

        <p>
          Prince Edward Island draws roughly 1.5 million visitors each year, many of them drawn specifically to its beaches, coastline, and rural landscape. OpenAir Atlantic is designed to serve that audience alongside year-round residents — providing the same live, reliable conditions information whether someone is planning their first visit to a red-sand beach or deciding whether to take their regular morning walk.
        </p>

        <p>
          Coverage is expanding across PEI communities, with each location receiving its own dedicated conditions page at no cost. For municipalities, tourism organizations, and local websites that want to surface live conditions directly, a free embeddable widget is also available — one line of HTML, no API key, no subscription, three sizes for different layouts.
        </p>

        <p>
          PEI is the first province to receive dedicated OpenAir Atlantic coverage. Additional Atlantic Canadian communities are planned to follow, as part of a broader mission to make reliable outdoor conditions freely accessible to everyone in the region.
        </p>

        <hr className="border-[#E8EDE4] my-8" />

        {/* About boilerplate */}
        <div className="rounded-2xl border border-[#E8EDE4] bg-white p-6 space-y-2 not-prose">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">About OpenAir Atlantic</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            OpenAir Atlantic is a free public-good web service providing real-time outdoor conditions for communities across Atlantic Canada. It was founded by Jared Whyms, originally from the Bahamas, who has called Prince Edward Island home since 2021. Data is sourced from Environment Canada, Fisheries and Oceans Canada, and Open-Meteo. The service carries no advertising and collects no personal user data. More information is available at{" "}
            <a href="https://openairatlantic.com" className="text-forest underline underline-offset-2 hover:text-forest-deep transition">openairatlantic.com</a>.
          </p>
        </div>

        {/* Contact */}
        <div className="border-t border-[#E8EDE4] pt-6 not-prose">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Media Contact</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Jared Whyms<br />
            Founder, OpenAir Atlantic<br />
            <a href="mailto:hello@openairatlantic.com" className="text-forest underline underline-offset-2 hover:text-forest-deep transition">hello@openairatlantic.com</a><br />
            <a href="https://openairatlantic.com" className="text-forest underline underline-offset-2 hover:text-forest-deep transition">openairatlantic.com</a>
          </p>
        </div>

        <p className="text-center text-text-muted tracking-[0.3em] text-lg pt-4">— 30 —</p>

      </div>

      {/* Back to blog */}
      <div className="mt-12 pt-8 border-t border-[#E8EDE4]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-deep transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

    </div>
  );
}
