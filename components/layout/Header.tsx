"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageToggle } from "@/components/layout/LanguageToggle";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/bridge", label: "Bridge" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[999] border-b border-white/60 bg-[rgba(250,250,247,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 shrink-0 items-center gap-3" href="/">
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/openair-icon.png"
              alt="OpenAir Atlantic"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-forest">OpenAir</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a3a6b]">Atlantic</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-forest-deep text-white"
                    : "text-text-secondary hover:bg-forest-light hover:text-forest"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-sun/30 bg-sun-light px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sun-text sm:block">
            Beta
          </div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
