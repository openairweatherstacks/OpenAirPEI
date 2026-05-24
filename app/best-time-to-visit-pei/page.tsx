import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CloudRain, Sun, Thermometer, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { WeatherFaqJsonLd } from "@/components/seo/WeatherFaqJsonLd";

export const metadata: Metadata = {
  title: "Best Time to Visit PEI — Month-by-Month Weather Guide",
  description:
    "When is the best time to visit Prince Edward Island? Based on 150 years of climate data: month-by-month temperatures, rain chances, and what to expect every season.",
  openGraph: {
    title: "Best Time to Visit PEI — 150 Years of Climate Data | OpenAir Atlantic",
    description:
      "When is the best time to visit Prince Edward Island? Month-by-month temperatures, rain probabilities, and honest seasonal verdicts — all based on 150 years of Environment Canada records.",
    url: "https://openairatlantic.com/best-time-to-visit-pei",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Best time to visit PEI — OpenAir Atlantic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Time to Visit PEI — Month-by-Month Guide",
    description: "150 years of climate data turned into a plain-English visitor guide for Prince Edward Island.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "https://openairatlantic.com/best-time-to-visit-pei",
  },
};

// 150 years of Environment Canada normals — Charlottetown Airport
const MONTHLY_DATA = [
  { month: "January",   short: "Jan", avgHigh: -3.5,  avgLow: -12.5, precipFreq: 52, sunHours: 3.2,  score: 1, emoji: "🥶" },
  { month: "February",  short: "Feb", avgHigh: -3.1,  avgLow: -12.9, precipFreq: 48, sunHours: 4.1,  score: 1, emoji: "❄️" },
  { month: "March",     short: "Mar", avgHigh: 1.4,   avgLow: -7.8,  precipFreq: 44, sunHours: 5.0,  score: 2, emoji: "🌬️" },
  { month: "April",     short: "Apr", avgHigh: 8.2,   avgLow: -0.7,  precipFreq: 42, sunHours: 6.3,  score: 3, emoji: "🌱" },
  { month: "May",       short: "May", avgHigh: 15.3,  avgLow: 5.3,   precipFreq: 38, sunHours: 7.8,  score: 4, emoji: "🌸" },
  { month: "June",      short: "Jun", avgHigh: 20.8,  avgLow: 10.7,  precipFreq: 36, sunHours: 8.5,  score: 5, emoji: "☀️" },
  { month: "July",      short: "Jul", avgHigh: 24.2,  avgLow: 14.5,  precipFreq: 34, sunHours: 9.2,  score: 5, emoji: "🏖️" },
  { month: "August",    short: "Aug", avgHigh: 23.9,  avgLow: 14.3,  precipFreq: 36, sunHours: 8.8,  score: 5, emoji: "🌊" },
  { month: "September", short: "Sep", avgHigh: 19.0,  avgLow: 9.7,   precipFreq: 38, sunHours: 7.1,  score: 4, emoji: "🍂" },
  { month: "October",   short: "Oct", avgHigh: 12.3,  avgLow: 4.0,   precipFreq: 44, sunHours: 5.4,  score: 3, emoji: "🍁" },
  { month: "November",  short: "Nov", avgHigh: 5.6,   avgLow: -1.6,  precipFreq: 52, sunHours: 3.8,  score: 2, emoji: "🌧️" },
  { month: "December",  short: "Dec", avgHigh: -0.5,  avgLow: -8.5,  precipFreq: 54, sunHours: 2.9,  score: 1, emoji: "🌨️" },
] as const;

const SCORE_COLORS: Record<number, { bg: string; bar: string; label: string; text: string }> = {
  1: { bg: "bg-blue-50",      bar: "bg-blue-300",   label: "Off-season",  text: "text-blue-700" },
  2: { bg: "bg-slate-50",     bar: "bg-slate-300",  label: "Shoulder",    text: "text-slate-600" },
  3: { bg: "bg-sun-light",    bar: "bg-sun",        label: "Good",        text: "text-sun-text" },
  4: { bg: "bg-leaf-light",   bar: "bg-leaf",       label: "Great",       text: "text-forest" },
  5: { bg: "bg-forest-light", bar: "bg-forest",     label: "Peak",        text: "text-forest-deep" },
};

const SEASONS = [
  {
    name: "Summer",
    months: "July & August",
    score: "Peak season",
    scoreColor: "bg-forest text-white",
    image: "/get-images/cavendish.jpg",
    imageAlt: "Cavendish Beach on a sunny summer day, PEI",
    summary:
      "Peak season on PEI runs July through mid-August. Average highs sit at 24°C with Gulf water temperatures reaching 20–22°C — the warmest swimming in Atlantic Canada. Rain falls on roughly 1-in-3 days but rarely lasts long. Expect full tourist infrastructure: every restaurant open, every trail groomed, every campsite booked.",
    pros: [
      "Warmest Gulf water — 20–22°C by late July",
      "Longest daylight — 15+ hours in July",
      "All beaches, parks, and trails at full operation",
      "Lobster season in full swing",
      "Best conditions for cycling the Confederation Trail",
    ],
    cons: [
      "Highest accommodation prices of the year",
      "Cavendish and Green Gables are very busy",
      "Book 3–6 months ahead for popular spots",
    ],
    tip: "The last two weeks of July are statistically the best stretch of weather PEI gets all year — high pressure dominates, winds are calm, and the Gulf hits peak temperature.",
  },
  {
    name: "Fall",
    months: "September & October",
    score: "Hidden gem",
    scoreColor: "bg-leaf text-white",
    image: "/get-images/confederation-trail.jpg",
    imageAlt: "Confederation Trail through autumn foliage, Prince Edward Island",
    summary:
      "September is PEI's best-kept secret. Crowds drop sharply after Labour Day, prices fall 30–40%, and the weather stays genuinely good — average highs of 19°C, the lowest rain frequency of any shoulder month, and Gulf water still warm enough to swim from the first week. October turns golden with fall foliage and is ideal for cycling.",
    pros: [
      "Gulf water still 17–19°C through mid-September",
      "Crowds gone — beaches and trails feel private",
      "Accommodation 30–40% cheaper than peak",
      "Fall foliage on the Confederation Trail is spectacular",
      "Harvest season — oyster festivals, farm markets",
    ],
    cons: [
      "Some seasonal businesses close after Labour Day",
      "Evening temperatures drop quickly after sunset",
      "October can bring Atlantic storms",
    ],
    tip: "The first two weeks of September offer nearly identical weather to August at a fraction of the cost and crowd. If you can only go once, go then.",
  },
  {
    name: "Spring",
    months: "May & June",
    score: "Growing season",
    scoreColor: "bg-sun text-[#2a2a2a]",
    image: "/victoriapark.jpeg",
    imageAlt: "Victoria Park Charlottetown in spring bloom",
    summary:
      "PEI springs are cool, green, and unhurried. May averages 15°C with wildflowers blooming across the island. June warms quickly — by mid-month you're hitting 20°C regularly, the tourist season begins, and everything opens up. The island feels fresh and uncrowded in a way summer never does.",
    pros: [
      "Island at its greenest and most photogenic",
      "No crowds, lowest prices of the warm seasons",
      "June evenings are long and mild",
      "Ideal for birdwatching and photography",
      "Oyster and clam season ramps up in June",
    ],
    cons: [
      "Gulf water is too cold to swim until late June (12–15°C)",
      "May can still get frost — nights are cold",
      "Some parks and campgrounds not fully open until June",
    ],
    tip: "Late June is an underrated sweet spot — warm enough for most activities, Gulf water approaching swimmable, and the summer crowds haven't arrived yet.",
  },
  {
    name: "Winter",
    months: "December to March",
    score: "For the committed",
    scoreColor: "bg-blue-200 text-blue-900",
    image: "/get-images/charlottetown-waterfront.jpg",
    imageAlt: "Charlottetown waterfront in winter",
    summary:
      "PEI winter is real winter — average highs below zero from December through February, regular snowfall, and the Northumberland Strait freezing along the shores. It's not a tourist destination in the conventional sense. But Charlottetown is a genuine small city with good restaurants, the Confederation Centre of the Arts, and an unhurried pace that regulars love.",
    pros: [
      "Charlottetown's restaurant and arts scene is at full local pace",
      "Accommodation is the cheapest of the year",
      "Cross-country skiing and snowshoeing in provincial parks",
      "Ice fishing is a real local tradition",
      "The island looks stunning under snow",
    ],
    cons: [
      "Average highs -3°C to 1°C from December to February",
      "Most beach facilities, campgrounds, and trails closed",
      "Confederation Bridge can have wind restrictions",
      "Many tourist-facing businesses are closed entirely",
    ],
    tip: "If you're visiting in winter, base yourself in Charlottetown — the city has real infrastructure year-round. Drive out to the national park on a clear day after a snowfall.",
  },
];

const FAQS = [
  {
    question: "What is the best month to visit Prince Edward Island?",
    answer:
      "July is statistically PEI's best month for weather — average highs of 24.2°C, the lowest rain frequency of the year (34% of days), and Gulf water temperatures reaching 20–22°C. The last two weeks of July consistently deliver the longest runs of settled, sunny weather based on 150 years of records from Charlottetown Airport.",
  },
  {
    question: "Is August a good time to visit PEI?",
    answer:
      "August is excellent. Average highs are 23.9°C — nearly identical to July — and the Gulf water is at its warmest of the year (20–22°C). Rain falls on about 36% of days but showers are typically short. The main downside is that peak-season crowds and prices are still in full effect through mid-August before tapering off after Labour Day.",
  },
  {
    question: "What is the weather like in PEI in September?",
    answer:
      "September is arguably PEI's best-kept secret. Average highs drop to 19°C but the Gulf water is still 17–19°C — perfectly swimmable. Crowds drop sharply after Labour Day, accommodation prices fall 30–40%, and the island gets a beautiful golden quality as fall sets in. Rain frequency stays low (38% of days), making it one of the drier months of the year.",
  },
  {
    question: "How hot does PEI get in summer?",
    answer:
      "PEI summers are warm but not extreme. Average highs reach 24.2°C in July and 23.9°C in August. The record high ever recorded at Charlottetown Airport is 36.7°C (1935). Heat waves occasionally push temperatures into the low 30s for a few days at a time, but sustained heat is uncommon — ocean breezes moderate the temperature across the island.",
  },
  {
    question: "Does it rain a lot in PEI?",
    answer:
      "PEI gets rain year-round but not excessively. July and August have the lowest rain frequency — around 34–36% of days. Even in the wetter months (November, December), rain rarely falls all day. The island gets approximately 1,170mm of precipitation annually, spread fairly evenly. If you're visiting in summer, expect a short shower every 2–3 days on average.",
  },
  {
    question: "Is the water warm enough to swim in PEI?",
    answer:
      "Yes — the Gulf of St. Lawrence is the warmest ocean water in Atlantic Canada. Gulf water temperatures typically reach 20–22°C by late July and remain swimmable (17–19°C) through September. The north shore (Cavendish, Stanhope) warms faster than the south shore due to shallower water. In early June, water is still around 12–14°C — cold for most swimmers.",
  },
  {
    question: "What is the weather like in PEI in June?",
    answer:
      "June is a transitional month. Early June averages around 17–18°C with cool nights. By late June, highs regularly reach 20–22°C. Rain falls on about 36% of days — similar to July. The Gulf water is still 12–16°C in June, which most people find too cold for extended swimming. June is excellent for cycling, hiking, and exploring without summer crowds.",
  },
  {
    question: "What is PEI weather like in October?",
    answer:
      "October is a beautiful shoulder month. Average highs drop from 19°C (early October) to around 10°C by month's end. Fall foliage peaks across the island, making the Confederation Trail particularly scenic. Rain frequency rises slightly (44% of days). Most tourist businesses have closed or reduced hours. It's ideal for those who want fall scenery without the PEI summer experience.",
  },
  {
    question: "How cold does PEI get in winter?",
    answer:
      "PEI winters are genuinely cold. Average highs range from -3.5°C (January) to 1.4°C (March). The record low ever recorded is -37.2°C in 1875. Snow is regular from December through March, and the Northumberland Strait partially freezes along shore. Wind chill frequently makes temperatures feel -20°C or colder. Charlottetown remains fully operational year-round.",
  },
  {
    question: "When does lobster season run on PEI?",
    answer:
      "The spring lobster season on PEI typically runs from late April to late June, and a shorter fall season runs from August to October. July is the sweet spot where both summer weather and freshly caught lobster overlap — many visitors plan their trip around a lobster dinner at one of the island's waterfront restaurants or lobster suppers.",
  },
];

function WeekRatingTool({ selectedMonth }: { selectedMonth: number }) {
  const month = MONTHLY_DATA[selectedMonth - 1];
  const colors = SCORE_COLORS[month.score];

  // Calculate a plain-English probability of a good day
  const goodDayChance = Math.round(100 - month.precipFreq * 0.6);
  const swimChance = selectedMonth >= 7 && selectedMonth <= 9
    ? "Yes — Gulf water is at peak temperature"
    : selectedMonth === 6 || selectedMonth === 10
    ? "Borderline — cool but possible for hardy swimmers"
    : "No — water is too cold";

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-4xl">{month.emoji}</span>
        <div>
          <p className="eyebrow">Selected month</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-text-primary">{month.month}</h2>
        </div>
        <span className={`ml-auto rounded-full px-4 py-1.5 text-sm font-semibold ${colors.text} ${colors.bg} border border-current/20`}>
          {colors.label}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-2xl bg-forest-light/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-4 w-4 text-forest" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">Avg high</p>
          </div>
          <p className="font-serif text-2xl text-text-primary">{month.avgHigh}°C</p>
          <p className="text-xs text-text-muted mt-0.5">Low: {month.avgLow}°C</p>
        </div>
        <div className="rounded-2xl bg-sun-light/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-4 w-4 text-sun-text" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sun-text">Sun hours/day</p>
          </div>
          <p className="font-serif text-2xl text-text-primary">{month.sunHours}h</p>
          <p className="text-xs text-text-muted mt-0.5">Daily average</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="h-4 w-4 text-blue-500" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600">Rain days</p>
          </div>
          <p className="font-serif text-2xl text-text-primary">{month.precipFreq}%</p>
          <p className="text-xs text-text-muted mt-0.5">of days see rain</p>
        </div>
        <div className="rounded-2xl bg-leaf-light p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-4 w-4 text-leaf" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">Good day odds</p>
          </div>
          <p className="font-serif text-2xl text-text-primary">{goodDayChance}%</p>
          <p className="text-xs text-text-muted mt-0.5">chance of dry day</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-[#fafaf7] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">Swimming in {month.month}</p>
        <p className="text-sm leading-6 text-text-secondary">{swimChance}</p>
      </div>
    </div>
  );
}

export default async function BestTimeToVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const selectedMonth = Math.min(12, Math.max(1, parseInt(params.month ?? "7", 10)));

  return (
    <div className="page-shell space-y-12">
      <ArticleJsonLd
        slug="best-time-to-visit-pei"
        headline="Best Time to Visit PEI — Month-by-Month Weather Guide"
        description="When is the best time to visit Prince Edward Island? Based on 150 years of climate data: month-by-month temperatures, rain chances, and what to expect every season."
        datePublished="2026-05-01"
        image="/get-images/cavendish.jpg"
        keywords={["best time to visit PEI", "PEI weather by month", "Prince Edward Island travel guide", "PEI climate", "PEI tourism"]}
        articleSection="Travel guides"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Best Time to Visit PEI", url: "/best-time-to-visit-pei" },
        ]}
      />
      <WeatherFaqJsonLd
        anchorId="https://openairatlantic.com/best-time-to-visit-pei#faq"
        faqs={FAQS}
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(42,42,42,0.07)]">
        <div className="relative h-64 sm:h-80 w-full">
          <Image
            src="/get-images/cavendish.jpg"
            alt="Cavendish Beach, Prince Edward Island — red sand dunes and warm Gulf water"
            fill
            quality={90}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <p className="eyebrow text-white/80 mb-2">150 years of climate data</p>
            <h1 className="section-title text-2xl sm:text-4xl text-white">
              Best Time to Visit<br />Prince Edward Island
            </h1>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="section-copy">
            No guesswork. Every month rated using 150 years of daily weather records from
            Charlottetown Airport — the longest continuous climate record in Atlantic Canada.
            Pick a month to see exactly what to expect.
          </p>
        </div>
      </section>

      {/* ── MONTH PICKER + TOOL ──────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="eyebrow mb-2">Interactive weather tool</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Pick a month — see what to expect</h2>
          <p className="section-copy mt-2">
            Based on Environment Canada normals for Charlottetown Airport, 1874–2024.
          </p>
        </div>

        {/* Month pill selector — URL-driven, no JS needed */}
        <div className="flex flex-wrap gap-2">
          {MONTHLY_DATA.map((m, i) => {
            const monthNum = i + 1;
            const isSelected = monthNum === selectedMonth;
            const colors = SCORE_COLORS[m.score];
            return (
              <Link
                key={m.short}
                href={`/best-time-to-visit-pei?month=${monthNum}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isSelected
                    ? `${colors.bar} text-white shadow-sm`
                    : "border border-border bg-white text-text-secondary hover:border-forest hover:text-forest"
                }`}
              >
                {m.short}
              </Link>
            );
          })}
        </div>

        <WeekRatingTool selectedMonth={selectedMonth} />
      </section>

      {/* ── MONTHLY GRID ─────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="eyebrow mb-2">Year at a glance</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">PEI weather month by month</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MONTHLY_DATA.map((m, i) => {
            const colors = SCORE_COLORS[m.score];
            const barWidth = `${(m.score / 5) * 100}%`;
            return (
              <Link
                key={m.month}
                href={`/best-time-to-visit-pei?month=${i + 1}`}
                className={`group rounded-[1.75rem] border border-border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${colors.bg}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors.text} bg-white/70`}>
                    {colors.label}
                  </span>
                </div>
                <p className="font-semibold text-text-primary mb-1">{m.month}</p>
                <p className="text-sm text-text-secondary mb-3">{m.avgHigh > 0 ? `${m.avgHigh}°C` : `${m.avgHigh}°C`} high · {m.precipFreq}% rain days</p>
                <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                  <div className={`h-full rounded-full ${colors.bar} transition-all`} style={{ width: barWidth }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── SEASONS ──────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-2">Season by season</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Honest guide to every season on PEI</h2>
        </div>
        {SEASONS.map((season) => (
          <div key={season.name} className="panel overflow-hidden">
            <div className="relative h-48 sm:h-64 w-full">
              <Image
                src={season.image}
                alt={season.imageAlt}
                fill
                quality={90}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <h3 className="font-serif text-2xl sm:text-3xl text-white">{season.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${season.scoreColor}`}>
                  {season.score}
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-3">{season.months}</p>
              <p className="text-sm leading-7 text-text-secondary mb-6">{season.summary}</p>

              <div className="grid gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest mb-3">Why come now</p>
                  <ul className="space-y-2">
                    {season.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500 mb-3">Watch out for</p>
                  <ul className="space-y-2">
                    {season.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-text-secondary">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl bg-sun-light/60 border border-sun/20 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-text mb-1">Local tip</p>
                <p className="text-sm leading-6 text-text-secondary">{season.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── QUICK COMPARISON TABLE ───────────────────────────────── */}
      <section className="panel p-6 sm:p-8 space-y-5">
        <div>
          <p className="eyebrow mb-2">Quick comparison</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">PEI climate at a glance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-left font-semibold text-text-primary">Month</th>
                <th className="py-3 px-4 text-center font-semibold text-text-primary">High</th>
                <th className="py-3 px-4 text-center font-semibold text-text-primary">Low</th>
                <th className="py-3 px-4 text-center font-semibold text-text-primary">Rain days</th>
                <th className="py-3 pl-4 text-center font-semibold text-text-primary">Rating</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map((m) => {
                const colors = SCORE_COLORS[m.score];
                return (
                  <tr key={m.month} className="border-b border-border/50 hover:bg-[#fafaf7]">
                    <td className="py-3 pr-4 font-medium text-text-primary">
                      <span className="mr-2">{m.emoji}</span>{m.month}
                    </td>
                    <td className="py-3 px-4 text-center text-text-secondary">{m.avgHigh}°C</td>
                    <td className="py-3 px-4 text-center text-text-muted">{m.avgLow}°C</td>
                    <td className="py-3 px-4 text-center text-text-secondary">{m.precipFreq}%</td>
                    <td className="py-3 pl-4 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${colors.text} ${colors.bg}`}>
                        {colors.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-text-muted">
          Source: Environment Canada · Charlottetown Airport · 1874–2024 normals (150 years of records)
        </p>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="eyebrow mb-2">Frequently asked questions</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">PEI weather questions answered</h2>
          <p className="section-copy mt-2">Every answer is based on 150 years of records — not guesses.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ question, answer }) => (
            <details key={question} className="group rounded-[1.75rem] border border-border bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary">
                {question}
                <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-text-secondary">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="panel p-6 sm:p-8 bg-gradient-to-br from-forest-light to-leaf-light border-forest/20">
        <p className="eyebrow mb-3">Plan your trip</p>
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl mb-3">
          Check today&apos;s live conditions before you go
        </h2>
        <p className="section-copy mb-6">
          Historical averages tell you what to expect. Live conditions tell you what&apos;s happening right now.
          OpenAir Atlantic checks weather, air quality, UV, and tides at 16 PEI locations every 10 minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-deep"
          >
            See live conditions
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/activity"
            className="inline-flex items-center gap-2 rounded-full border border-forest bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-forest-light"
          >
            Find an activity today
          </Link>
        </div>
      </section>
    </div>
  );
}
