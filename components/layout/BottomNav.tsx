"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  Map,
  Route,
  Wind,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/air", label: "Air", icon: Wind },
  { href: "/bridge", label: "Bridge", icon: Route },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] border-t border-white/60 bg-[rgba(255,255,255,0.9)] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[0.68rem] font-semibold transition",
                active
                  ? "bg-forest text-white shadow-glow"
                  : "text-text-secondary hover:bg-forest-light hover:text-forest",
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
