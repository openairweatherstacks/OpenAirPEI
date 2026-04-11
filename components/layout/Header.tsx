import Image from "next/image";
import Link from "next/link";

import { LanguageToggle } from "@/components/layout/LanguageToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-[999] border-b border-white/60 bg-[rgba(250,250,247,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sun">
            <Image
              src="/openair-logo.png"
              alt="OpenAir Atlantic logo"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-forest">
              OpenAir Atlantic
            </p>
            <p className="truncate font-serif text-xl text-text-primary">PEI outdoor intelligence</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="rounded-full border border-sun/30 bg-sun-light px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sun-deep">
            Beta MVP
          </div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
