import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — OpenAir Atlantic",
  description: "Stories, updates, and insights from OpenAir Atlantic — the free outdoor conditions tool for Prince Edward Island and Atlantic Canada.",
  alternates: { canonical: "https://openairatlantic.com/blog" },
  openGraph: {
    title: "Blog — OpenAir Atlantic",
    description: "Stories, updates, and insights from OpenAir Atlantic.",
    url: "https://openairatlantic.com/blog",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "OpenAir Atlantic Blog" }],
  },
};

const POSTS = [
  {
    slug: "openair-atlantic-launches-pei",
    title: "OpenAir Atlantic Launches Free Outdoor Conditions Tool for Prince Edward Island",
    deck: "A new free web tool built by a Bahamian-born Islander gives PEI residents and visitors real-time weather, beach conditions, tide times, and trail reports — all in one place, at no cost.",
    date: "May 23, 2026",
    dateIso: "2026-05-23",
    category: "Press Release",
    author: "Jared Whyms",
    authorImage: "/jaredwhyms.jpg",
    image: "/pei.jpg",
    imageAlt: "Prince Edward Island coastline at golden hour",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14 space-y-12">

      {/* Header */}
      <header className="space-y-3 border-b border-[#E8EDE4] pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-text-muted">
          OpenAir Atlantic
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-text-primary leading-tight">
          Blog
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-xl">
          Stories, updates, and insights from the team building OpenAir Atlantic.
        </p>
      </header>

      {/* Post list */}
      <div className="space-y-8">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-[1.75rem] border border-[#E8EDE4] bg-white overflow-hidden transition hover:shadow-[0_12px_40px_rgba(42,42,42,0.09)]"
          >
            {/* Hero image */}
            <div className="relative h-52 sm:h-64 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                quality={90}
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="inline-block rounded-full bg-forest-deep px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">{post.author}</p>
                  <time dateTime={post.dateIso} className="text-xs text-text-muted">
                    {post.date}
                  </time>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-text-primary leading-snug">
                {post.title}
              </h2>

              <p className="text-text-secondary leading-relaxed">
                {post.deck}
              </p>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-forest group-hover:text-forest-deep transition">
                Read more
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
