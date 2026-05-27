import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Things to Do in Stratford, PEI — Outdoor Guide 2026",
  description:
    "Stratford, PEI sits just minutes from Charlottetown across the Hillsborough River. Discover the best parks, trails, beaches, and outdoor activities — with real-time conditions to plan your visit.",
  alternates: {
    canonical: "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
  },
  keywords: [
    "things to do in Stratford PEI",
    "Stratford Prince Edward Island",
    "Stratford PEI outdoor activities",
    "Stratford PEI parks and trails",
    "Stratford PEI weather",
    "what to do Stratford PEI",
    "Stratford PEI beach",
    "Hillsborough River Stratford",
    "Stratford PEI guide",
  ],
  openGraph: {
    title: "Best Things to Do in Stratford, PEI — Outdoor Guide 2026",
    description:
      "Stratford sits just across the Hillsborough River from Charlottetown. Here's everything worth doing outdoors — parks, trails, beaches, and when to go.",
    url: "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
    type: "article",
    publishedTime: "2026-05-27",
    authors: ["Jared Whyms"],
    images: [
      {
        url: "/stratford-hero.png",
        width: 1200,
        height: 630,
        alt: "Stratford, PEI — a view across the Hillsborough River",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Things to Do in Stratford, PEI",
    description:
      "Parks, trails, beaches, and outdoor activities in Stratford — with live weather conditions from OpenAir Atlantic.",
    images: ["/stratford-hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Things to Do in Stratford, PEI — Outdoor Guide 2026",
  description:
    "Stratford, PEI sits just minutes from Charlottetown across the Hillsborough River. Discover the best parks, trails, beaches, and outdoor activities.",
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
    "@id":
      "https://openairatlantic.com/blog/best-things-to-do-stratford-pei",
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
          <span className="inline-block rounded-full bg-sun-light px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sun-deep border border-sun/20">
            Destination Guide
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight mb-5">
          Best Things to Do in Stratford, PEI — The Complete Outdoor Guide
        </h1>

        {/* Deck */}
        <p className="font-serif text-xl sm:text-2xl text-text-secondary leading-relaxed italic mb-8 pb-8 border-b border-[#E8EDE4]">
          Stratford sits just across the Hillsborough River from
          Charlottetown — close enough to feel connected, quiet enough to
          feel like its own place. Here is everything worth doing outdoors,
          and exactly when to do it.
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
            alt="Stratford, PEI — view across the Hillsborough River toward the waterfront"
            fill
            quality={90}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <div className="absolute bottom-4 left-5 right-5">
            <p className="text-xs text-white/70 font-medium">
              Stratford, PEI — a quiet community with direct water access and a
              growing trail network
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-8 text-[17px] leading-[1.8] text-text-secondary">

          {/* Intro */}
          <p>
            <span className="font-serif text-5xl font-normal leading-none float-left mr-2 mt-1 text-text-primary">
              S
            </span>
            tratford does not get the same press as Cavendish or the Charlottetown waterfront. It is
            a working community — around 10,000 people, a grocery store, a rec centre, and a
            shoreline most visitors never see. That is exactly why it is worth knowing. The
            Hillsborough River wraps along its western edge, the Trans Canada Trail passes
            through, and on a clear summer morning it is one of the most pleasant places on
            Prince Edward Island to be outside.
          </p>

          <p>
            This guide covers everything worth doing outdoors in Stratford — from its trail
            network to its water access to the best times of day to visit each spot. All
            conditions referenced here are available live on{" "}
            <Link
              href="/"
              className="text-forest font-semibold underline underline-offset-2 hover:text-forest-deep transition"
            >
              OpenAir Atlantic
            </Link>
            , updated every 10 minutes from Environment Canada data.
          </p>

          {/* Section 1 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Kinlock Beach — Stratford&apos;s Quiet Shoreline
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
            Kinlock Beach is the kind of place locals keep to themselves. A small red-sand
            beach tucked into the Stratford shoreline, it faces the river rather than the
            open Gulf — which means calmer water, warmer surface temperatures in July and
            August, and almost no wave action. It is excellent for children, for paddlers,
            and for anyone who finds the north shore beaches too exposed.
          </p>

          <p>
            The best window for Kinlock Beach is mid-morning to early afternoon on a
            southwest wind day — the river stays glassy and the sun reaches the beach fully
            by 9am. Check the AQHI before you go: on still summer days the valley can hold
            heat. Anything under 4 on the Air Quality Health Index is comfortable for
            everyone, including young children and people with respiratory conditions.
          </p>

          {/* Tip block */}
          <div className="rounded-2xl border border-[#E8EDE4] border-l-4 border-l-sun bg-sun-light p-6 not-prose">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun-deep mb-3">
              Local Timing Tip
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Kinlock Beach faces west. For the softest light and warmest sand, arrive by
              10am. After 3pm the shoreline catches the afternoon heat — ideal for a late
              swim, less ideal if UV is above 6. Check the UV timer on OpenAir Atlantic
              before heading out.
            </p>
          </div>

          {/* Section 2 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            The Stratford Trail Network — Walking and Cycling
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/charlottetown-waterfront-hero.jpg"
              alt="Charlottetown waterfront and Hillsborough River viewed from the Stratford side"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <figcaption className="sr-only">
              The Hillsborough River connects Stratford to the Charlottetown waterfront —
              a view locals get every day
            </figcaption>
          </div>

          <p>
            Stratford has invested significantly in its trail system over the past decade.
            The main corridor runs roughly parallel to the Trans Canada Highway, connecting
            several residential areas to the waterfront and linking into the broader
            Trans-Canada Trail network that crosses PEI. The surface is paved multi-use
            trail — appropriate for road bikes, hybrid bikes, strollers, and inline skates.
          </p>

          <p>
            The best cycling conditions on this trail are northwest winds under 20km/h,
            temperature between 12°C and 24°C, and low precipitation probability. Those
            days happen reliably from mid-June through September. The trail is fully exposed
            in several sections — on a high-UV day, bring sunscreen and a hat. The
            trail runs roughly east-west, so morning cyclists head into the sun and evening
            cyclists have it behind them.
          </p>

          <p>
            If you are walking rather than cycling, the Kinlock area has a quieter spur
            that loops through a wooded buffer and back to the river. It takes about 25
            minutes at a comfortable pace and has significant tree cover — useful on hot
            summer afternoons when the main trail is fully exposed.
          </p>

          {/* Section 3 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            The View Across the River — Why Stratford Has the Best Angle on Charlottetown
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/charlottetown.jpg"
              alt="Charlottetown skyline and waterfront as seen from across the Hillsborough River"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            One thing visitors to Stratford consistently notice is the view looking back
            across the Hillsborough River. The Charlottetown waterfront — Province House,
            the Peake's Wharf district, the steeples of St. Dunstan's — reads as a
            compact skyline from the Stratford shore in a way that is impossible to see
            from within the city itself.
          </p>

          <p>
            This is a particularly good photography spot in the hour before sunset on a
            clear westerly day. The light hits the waterfront directly. The river surface
            picks up the colour. On high-pressure days with visibility above 15km — which
            is common in July and August — you can see individual buildings clearly across
            the water. Check the visibility reading on OpenAir Atlantic before heading out:
            anything above 12km gives you clean lines.
          </p>

          <blockquote className="border-l-2 border-[#E8EDE4] pl-7 my-8">
            <p className="font-serif text-xl sm:text-2xl text-text-primary italic leading-relaxed mb-3">
              &ldquo;Most people photograph Charlottetown from inside Charlottetown. The
              best shot of the city is from Stratford, looking west, at 7pm on a clear
              July evening.&rdquo;
            </p>
            <cite className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted not-italic">
              — Jared Whyms, OpenAir Atlantic
            </cite>
          </blockquote>

          {/* Section 4 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Pondside Park and the Stratford Waterfront
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/pondside.jpeg"
              alt="Pondside Park, Stratford PEI — waterfront greenspace along the Hillsborough River"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            Pondside Park sits at the edge of Stratford's central waterfront area —
            a flat, accessible greenspace with water views, picnic areas, and enough open
            ground for casual sports, kite flying, or an afternoon with young children.
            It connects to the broader trail network and is one of the easiest entry
            points for visitors arriving by car.
          </p>

          <p>
            In summer, the park fills up on weekday mornings with strollers and dog
            walkers. By 10am on a warm day, it is at its most active. The east-facing
            orientation means the morning light is excellent and the afternoon can get
            hot. Bring shade if you plan to stay past noon in July and August — the UV
            index regularly reaches 7 or 8 on clear PEI summer days, which means
            fair-skinned adults can start burning in under 20 minutes.
          </p>

          {/* Activity table */}
          <div className="rounded-2xl border border-[#E8EDE4] bg-white p-6 not-prose">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
              Stratford Outdoor Activity Conditions at a Glance
            </p>
            <div className="space-y-3">
              {[
                {
                  activity: "Trail walking / cycling",
                  ideal: "10–22°C · Wind under 25km/h · No rain",
                  avoid: "Sustained winds above 35km/h, rain",
                },
                {
                  activity: "Kinlock Beach swimming",
                  ideal: "Air above 20°C · AQHI under 4 · Calm river",
                  avoid: "Easterly winds above 20km/h, thunderstorm risk",
                },
                {
                  activity: "Waterfront photography",
                  ideal: "Visibility above 12km · Sunset window · Clear sky",
                  avoid: "Fog, overcast, rain",
                },
                {
                  activity: "Pondside Park picnic",
                  ideal: "Morning, UV under 6 · Light wind",
                  avoid: "UV above 8 without shade, humidity above 80%",
                },
                {
                  activity: "Kayaking / paddleboarding",
                  ideal: "Wind under 15km/h · Calm river · Morning",
                  avoid: "Afternoon southwest winds, thunderstorm risk",
                },
              ].map((row) => (
                <div
                  key={row.activity}
                  className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm border-b border-[#E8EDE4] pb-3 last:border-0 last:pb-0"
                >
                  <span className="font-semibold text-text-primary w-full sm:w-44 shrink-0">
                    {row.activity}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-forest text-xs">
                      ✓ {row.ideal}
                    </span>
                    <span className="text-danger text-xs">
                      ✗ {row.avoid}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            Getting to Stratford From Charlottetown
          </h2>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-6">
            <Image
              src="/charlottetown-waterfront-hero.jpg"
              alt="The Charlottetown waterfront — 10 minutes from Stratford by car or ferry"
              fill
              quality={90}
              className="object-cover object-bottom"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <p>
            Stratford is a 10-minute drive from downtown Charlottetown via the Hillsborough
            Bridge. By bicycle, the route across the bridge is accessible — though the
            bridge deck has no dedicated cycling lane, so on windy days (above 30km/h
            sustained) the crossing is uncomfortable and on days above 50km/h it is
            genuinely unsafe for cyclists. Check the wind reading before you ride.
          </p>

          <p>
            There is a seasonal passenger ferry service that runs across the harbour
            between Charlottetown and the Victoria Row area — this is the most scenic
            way to approach from the city and eliminates the bridge crossing entirely.
            Check the schedule locally; the service typically operates late June through
            early September.
          </p>

          <p>
            Parking in Stratford is generally uncomplicated — most trailheads and park
            areas have free off-street parking, and the community is laid out for cars.
            If you are arriving by bicycle from Charlottetown and the wind is against you,
            plan your return trip before you head out.
          </p>

          {/* Section 6 */}
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary pt-4">
            When Is the Best Time to Visit Stratford, PEI?
          </h2>

          <p>
            The honest answer: June through September is the reliable outdoor window. July
            is peak — warmest water, most daylight, highest probability of the 25°C
            blue-sky days that make PEI feel like a different island than it does in
            November. But July is also peak UV and peak visitor traffic across the whole
            province.
          </p>

          <p>
            August is the local favourite. The crowds thin after the first week, the water
            temperature in the river and near-shore areas is at its annual peak (often
            22–24°C surface temperature), and the evenings are long enough to be outside
            comfortably until nearly 9pm. The goldenrod along the trail edges starts to
            show in late August — a distinctly PEI August smell that long-time residents
            associate with the end of summer.
          </p>

          <p>
            September is underrated. The UV drops, the wind shifts northwest, and the light
            turns the particular gold-and-amber that PEI photographers wait for all year.
            The trails are quiet. The beaches are empty. Water temperature holds above 18°C
            for most of September. If you have flexibility in your visit, the second week
            of September is often the single best outdoor week of the year on the Island.
          </p>

          {/* Season guide */}
          <div className="rounded-2xl border border-[#E8EDE4] bg-forest-light p-6 not-prose space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-deep">
              Stratford Season by Season
            </p>
            {[
              {
                season: "June",
                summary:
                  "Trails open, weather still variable. Great for cycling. Water cold (12–16°C). UV rising.",
              },
              {
                season: "July",
                summary:
                  "Peak conditions. Warmest temperatures, best UV risk. Water 18–22°C. Book early.",
              },
              {
                season: "August",
                summary:
                  "Local favourite. Crowds drop mid-month. Water peaks 22–24°C. Golden evenings.",
              },
              {
                season: "September",
                summary:
                  "Best light of the year. Quiet trails and empty beaches. Water holds above 18°C.",
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
          <div className="rounded-2xl border border-[#E8EDE4] bg-white p-6 not-prose space-y-3 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Check conditions before you go
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              OpenAir Atlantic shows live weather, UV index, air quality, and trail
              conditions for Charlottetown and Stratford — updated every 10 minutes from
              Environment Canada data. Free, no account required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-deep transition"
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
              Environment Canada, Fisheries and Oceans Canada, and Open-Meteo. The service
              carries no advertising and collects no personal user data.{" "}
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
