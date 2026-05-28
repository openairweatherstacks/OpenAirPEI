import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Stratford, PEI — Live Weather, Trails & Beach Conditions | OpenAir Atlantic",
  description:
    "OpenAir Atlantic tracks real-time weather, UV, air quality, and trail conditions for Stratford, PEI. Know before you go — free, no account required.",
  alternates: {
    canonical: "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
  },
  keywords: [
    "Stratford PEI outdoor conditions",
    "Stratford PEI weather real-time",
    "Kinlock Beach conditions",
    "Stratford PEI trails",
    "Pondside Park Stratford",
    "OpenAir Atlantic Stratford",
    "Stratford PEI UV index",
    "Stratford PEI air quality",
    "things to do Stratford PEI",
  ],
  openGraph: {
    title: "Stratford, PEI — Live Weather, Trails & Beach Conditions | OpenAir Atlantic",
    description:
      "Real-time weather, UV, air quality, and trail conditions for Stratford, PEI. OpenAir Atlantic tells you exactly when to go and how long you have.",
    url: "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
    type: "article",
    publishedTime: "2026-05-27",
    authors: ["Jared Whyms"],
    images: [
      {
        url: "/stratford-hero.png",
        width: 1200,
        height: 630,
        alt: "Stratford, PEI — Pondside Park and the Hillsborough River waterfront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stratford, PEI — Live Weather, Trails & Beach Conditions | OpenAir Atlantic",
    description:
      "Know before you go. OpenAir Atlantic tracks real-time conditions for Stratford parks, trails, and beaches — free, updated every 10 minutes.",
    images: ["/stratford-hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Stratford, PEI — Live Weather, Trails & Beach Conditions | OpenAir Atlantic",
  description:
    "OpenAir Atlantic tracks real-time weather, UV, air quality, and trail conditions for Stratford, PEI. Know before you go — free, no account required.",
  image: "https://openairatlantic.com/stratford-hero.png",
  datePublished: "2026-05-27",
  dateModified: "2026-05-27",
  author: {
    "@type": "Person",
    name: "Jared Whyms",
    url: "https://openairatlantic.com",
  },
  publisher: {
    "@type": "Organization",
    name: "OpenAir Atlantic",
    logo: {
      "@type": "ImageObject",
      url: "https://openairatlantic.com/openair-logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
  },
};

export default function StratfordGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            Tool Guide
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight mb-5">
          Stratford, PEI — Live Weather, Beach & Trail Conditions Explained
        </h1>

        {/* Deck */}
        <p className="font-serif text-xl sm:text-2xl text-text-secondary leading-relaxed italic mb-8 pb-8 border-b border-[#E8EDE4]">
          Stratford has parks, beaches, and trails that most visitors never find.
          OpenAir Atlantic monitors real-time conditions for every one of them —
          so you know exactly when to go, what to bring, and how long you have.
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
            <p className="text-sm font-semibold text-text-primary">
              Jared Whyms
            </p>
            <p className="text-xs text-text-muted">
              Founder, OpenAir Atlantic ·{" "}
              <time dateTime="2026-05-27">May 27, 2026</time> · Charlottetown,
              Prince Edward Island
            </p>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full aspect-[16/9] rounded-[1.75rem] overflow-hidden mb-10">
          <Image
            src="/stratford-hero.png"
            alt="Stratford, PEI — Pondside Park waterfront on a clear summer morning"
            fill
            quality={90}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Body */}
        <div className="space-y-8 text-[17px] leading-[1.8] text-text-secondary">

          {/* Intro */}
          <p>
            <span className="font-serif text-5xl font-normal leading-none float-left mr-2 mt-1 text-text-primary">
              S
            </span>
            tratford sits directly across the Hillsborough River from Charlottetown —
            10 minutes by car, a short ferry ride in summer. It has a real trail network,
            a quiet red-sand beach, waterfront parks, and a growing outdoor community.
            Most visitors to PEI never cross the bridge. That means less crowd pressure
            on everything Stratford has — and the same weather data powering OpenAir
            Atlantic applies here just as much as it does in Cavendish or downtown
            Charlottetown.
          </p>

          <p>
            This page explains what OpenAir Atlantic monitors for Stratford, what each
            data point means in practice, and which specific spots in the community each
            reading applies to. If you are planning a visit — or you live here and want
            to get more out of your outdoor time —{" "}
            <Link
              href="/"
              className="text-forest font-semibold underline underline-offset-2 hover:text-forest-deep transition"
            >
              the live dashboard is free and updated every 10 minutes
            </Link>
            .
          </p>

          {/* What OAA tracks */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            What OpenAir Atlantic Monitors for Stratford
          </h2>

          <p>
            OpenAir Atlantic pulls real-time data from Environment Canada weather
            stations and the Air Quality Health Index network. For Stratford, the
            nearest station is the Charlottetown airport — close enough that temperature,
            wind, and humidity readings are accurate to within a few minutes of current
            conditions. The tool displays six data points that directly affect outdoor
            decisions in this community:
          </p>

          {/* Data point cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            {[
              {
                label: "Temperature & Feels Like",
                value: "Updated every 10 min",
                detail:
                  "The felt temperature accounts for wind and humidity — more useful than the air temperature alone for deciding whether to bring a layer on the trail.",
              },
              {
                label: "UV Index",
                value: "Burn time calculated",
                detail:
                  "PEI UV regularly hits 7–9 in July. OpenAir calculates how long fair skin can be in direct sun before burning — shown per UV reading, not as a generic warning.",
              },
              {
                label: "Air Quality (AQHI)",
                value: "Health-based scale 1–10",
                detail:
                  "Stratford sits in a river valley. On hot, still days air quality can stratify. The AQHI reading tells you directly whether conditions are safe for children, seniors, and people with asthma.",
              },
              {
                label: "Wind Speed & Direction",
                value: "Live from EC stations",
                detail:
                  "Wind matters at Kinlock Beach, on the Hillsborough Bridge crossing, and on the exposed trail sections. Direction matters as much as speed — a southwest wind hits different spots than a northwest.",
              },
              {
                label: "Precipitation Timing",
                value: "3-hour window forecast",
                detail:
                  "Not just probability — the tool estimates when rain actually arrives. That difference between \"40% chance of rain\" and \"rain arrives at 2:30pm\" is the difference between a wasted trip and a good one.",
              },
              {
                label: "Visibility",
                value: "In kilometres",
                detail:
                  "Visibility above 12km means the cross-river view of Charlottetown from Stratford is at its best. Below 5km, fog has moved in from the Gulf — useful to know before a photography session.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#E8EDE4] bg-white p-5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-text-primary text-sm leading-snug">
                    {item.label}
                  </p>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-forest bg-forest-light px-2 py-0.5 rounded-full">
                    {item.value}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Kinlock */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Kinlock Beach — How to Use the Tool Here
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/kinlock-beach.jpeg"
              alt="Kinlock Beach, Stratford PEI — calm red-sand shoreline on the Hillsborough River"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            Kinlock Beach is a sheltered red-sand shoreline on the Stratford side of the
            Hillsborough River. Because it faces the river rather than the open Gulf, it
            reads differently from Cavendish or Basin Head — calmer water, warmer surface
            temperature in summer, and almost no wave action. It is excellent for children
            and paddlers.
          </p>

          <p>
            The specific readings that matter most at Kinlock:
          </p>

          <div className="rounded-2xl border border-[#E8EDE4] border-l-4 border-l-forest bg-forest-light p-6 not-prose space-y-3">
            {[
              {
                reading: "Temperature above 20°C",
                means: "Comfortable swimming. River surface typically 2–3°C above air in peak summer.",
              },
              {
                reading: "Wind under 15km/h from the SW",
                means: "Glassy river surface. Ideal for paddleboarding and kayaking.",
              },
              {
                reading: "AQHI under 4",
                means: "Safe for all ages, including children and people with asthma.",
              },
              {
                reading: "UV above 6",
                means: "Bring SPF. Check the burn-time calculator — fair skin burns in under 20 min at UV 7.",
              },
              {
                reading: "Precipitation arriving in under 2 hours",
                means: "Worth checking before the drive. OpenAir shows the exact arrival window.",
              },
            ].map((item) => (
              <div key={item.reading} className="flex items-start gap-3 text-sm">
                <span className="font-bold text-forest shrink-0 w-52">{item.reading}</span>
                <span className="text-text-secondary leading-relaxed">{item.means}</span>
              </div>
            ))}
          </div>

          {/* Trails */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            The Trail Network — Cycling and Walking Conditions
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/charlottetown-waterfront-hero.jpg"
              alt="Stratford trail network and Hillsborough River waterfront on a clear PEI morning"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            Stratford has invested in a paved multi-use trail corridor that runs
            roughly parallel to the Trans Canada Highway, connecting residential areas
            to the waterfront and linking into the broader Trans-Canada Trail network.
            Road bikes, hybrids, strollers, and inline skates all use it.
          </p>

          <p>
            The trail is exposed in several sections — meaning wind, UV, and rain all
            hit harder here than in a wooded park. OpenAir Atlantic makes this visible:
          </p>

          <div className="rounded-2xl border border-[#E8EDE4] bg-white p-6 not-prose">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
              Trail Conditions at a Glance
            </p>
            <div className="space-y-3">
              {[
                {
                  condition: "Ideal cycling day",
                  detail: "10–22°C · Wind under 20km/h · No precipitation · UV under 7",
                  status: "good",
                },
                {
                  condition: "Bring a layer",
                  detail: "Under 12°C or wind above 25km/h from the northwest",
                  status: "fair",
                },
                {
                  condition: "Skip the exposed sections",
                  detail: "Wind above 35km/h sustained — the trail has no shelter",
                  status: "avoid",
                },
                {
                  condition: "Sunscreen required",
                  detail: "UV above 6 on the open trail — reapply every 90 minutes",
                  status: "fair",
                },
                {
                  condition: "Best walking window",
                  detail: "Morning before 10am on hot days — shade only on the Kinlock spur",
                  status: "good",
                },
              ].map((row) => (
                <div
                  key={row.condition}
                  className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm border-b border-[#E8EDE4] pb-3 last:border-0 last:pb-0"
                >
                  <span
                    className={`font-semibold shrink-0 w-full sm:w-48 ${
                      row.status === "good"
                        ? "text-forest"
                        : row.status === "avoid"
                        ? "text-danger"
                        : "text-sun-deep"
                    }`}
                  >
                    {row.condition}
                  </span>
                  <span className="text-text-secondary">{row.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pondside */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Pondside Park — The Waterfront Greenspace
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/pondside.jpeg"
              alt="Pondside Park, Stratford PEI — flat waterfront greenspace with picnic areas"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            Pondside Park is Stratford&apos;s main waterfront greenspace — flat, accessible,
            open ground with water views and picnic areas. It connects directly to the
            trail network and is the easiest entry point for visitors arriving by car.
            On a good morning in July it is exactly what you want: river light, open sky,
            room to move.
          </p>

          <p>
            The park is almost entirely open and east-facing — morning sun hits it fully,
            and by midday in summer the UV exposure is significant. The AQHI and UV
            readings on OpenAir Atlantic are the two most relevant data points here.
            Anything above UV 7 with children under 10 means shade is not optional.
            On AQHI days above 6, this is not a comfortable spot for people with
            respiratory conditions — the open river channel concentrates any pollution
            that has built up in the valley.
          </p>

          <div className="rounded-2xl border border-[#E8EDE4] border-l-4 border-l-sun bg-sun-light p-6 not-prose">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-deep mb-3">
              Why This Matters for Families
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              OpenAir Atlantic was built specifically to answer questions like &ldquo;is it safe
              to bring my kids to the park right now?&rdquo; The AQHI reading is translated into
              plain English — not a number on a scale, but a direct statement about who
              it is and is not safe for. Check it before the drive, not after you arrive.
            </p>
          </div>

          {/* Why the tool */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Why OpenAir Atlantic Exists — and Why Stratford Specifically Benefits
          </h2>

          <p>
            Most weather apps give you a number. They do not tell you what it means for
            the specific thing you are trying to do — swim at Kinlock, cycle the trail,
            sit in Pondside Park with a toddler, or photograph the Charlottetown skyline
            from the Stratford shore at golden hour.
          </p>

          <p>
            OpenAir Atlantic was built to close that gap. It takes the same Environment
            Canada data every other weather app uses — and interprets it. The UV index
            becomes a burn timer. The AQHI becomes a sentence about who should stay
            inside. The precipitation probability becomes an exact arrival time. Wind speed
            becomes a verdict on whether the bridge crossing is safe for cyclists.
          </p>

          <p>
            Stratford benefits from this specifically because its outdoor spots are diverse
            enough that one reading does not apply everywhere. The wind that makes Kinlock
            Beach choppy does not affect the wooded Kinlock trail spur at all. The UV that
            makes Pondside Park uncomfortable at noon is irrelevant if you are walking
            under the tree canopy. The tool surfaces that distinction — so you can choose
            the right spot for the actual conditions, not just check if it is sunny.
          </p>

          <blockquote className="border-l-2 border-[#E8EDE4] pl-7 my-8">
            <p className="font-serif text-xl sm:text-2xl text-text-primary italic leading-relaxed mb-3">
              &ldquo;We built OpenAir Atlantic so that checking conditions before going outside
              takes 10 seconds and gives you a decision — not a forecast to interpret
              yourself.&rdquo;
            </p>
            <cite className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted not-italic">
              — Jared Whyms, Founder, OpenAir Atlantic
            </cite>
          </blockquote>

          {/* When to visit */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Best Time to Visit — and How OpenAir Makes the Call Easy
          </h2>

          <p>
            June through September is the reliable outdoor window for Stratford. July is
            peak — warmest temperatures, best swimming, most daylight. August is the local
            favourite: crowds thin mid-month, river water peaks at 22–24°C, and the
            evenings are long. September is underrated — UV drops, wind shifts northwest,
            and the light turns the particular gold-and-amber that PEI photographers wait
            for all year.
          </p>

          <p>
            But the season is only part of the picture. A good July week can have three
            bad outdoor days in it. A grey September can have four perfect ones. The
            reason to use OpenAir Atlantic is precisely this: instead of planning around
            the calendar, you plan around the actual conditions on the actual day. The
            tool gives you a score — Excellent, Good, Fair, or Stay Inside — for every
            location, every 10 minutes. You look at it the night before, the morning of,
            and again an hour before you leave. That is the whole workflow.
          </p>

          <div className="rounded-2xl border border-[#E8EDE4] bg-forest-light p-6 not-prose space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep">
              Stratford Conditions by Season
            </p>
            {[
              {
                season: "June",
                summary:
                  "Trails open, weather variable. Great cycling. Water still cold (12–16°C). UV rising.",
              },
              {
                season: "July",
                summary:
                  "Peak conditions. Best UV risk — check the burn timer daily. Water 18–22°C.",
              },
              {
                season: "August",
                summary:
                  "Best overall month. Crowds drop mid-August. Water peaks 22–24°C. Long evenings.",
              },
              {
                season: "September",
                summary:
                  "Best light of the year. Quiet trails. Water holds above 18°C. AQHI consistently low.",
              },
              {
                season: "October",
                summary:
                  "Foliage season. Cold nights, crisp days. Hiking and photography only.",
              },
            ].map((row) => (
              <div
                key={row.season}
                className="flex items-start gap-4 text-sm border-b border-forest/10 pb-4 last:border-0 last:pb-0"
              >
                <span className="font-bold text-forest w-20 shrink-0">
                  {row.season}
                </span>
                <span className="text-text-secondary leading-relaxed">
                  {row.summary}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-forest/20 bg-forest-light p-7 not-prose space-y-4 mt-8">
            <p className="font-serif text-xl text-text-primary leading-snug">
              Check live conditions for Stratford right now — free, no account required.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              OpenAir Atlantic shows real-time temperature, UV, air quality, wind, and
              precipitation timing for Stratford and surrounding areas. Updated every
              10 minutes from Environment Canada data. Built for Atlantic Canadians.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-deep transition"
            >
              See live conditions →
            </Link>
          </div>

          <hr className="border-[#E8EDE4] my-8" />

          {/* About */}
          <div className="rounded-2xl border border-[#E8EDE4] bg-white p-6 space-y-2 not-prose">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">
              About OpenAir Atlantic
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              OpenAir Atlantic is a free public-good web service providing real-time outdoor
              conditions for communities across Atlantic Canada. Data is sourced from
              Environment Canada, Fisheries and Oceans Canada, and Open-Meteo. No
              advertising. No personal data collected.{" "}
              <Link
                href="/"
                className="text-forest underline underline-offset-2 hover:text-forest-deep transition"
              >
                openairatlantic.com
              </Link>
            </p>
          </div>
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
    </>
  );
}
