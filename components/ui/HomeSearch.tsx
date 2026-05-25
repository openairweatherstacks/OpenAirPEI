"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const LOCATIONS = [
  { id: "cavendish", name: "Cavendish Beach", type: "Beach", href: "/location/cavendish" },
  { id: "charlottetown", name: "Charlottetown", type: "City", href: "/city/charlottetown" },
  { id: "summerside", name: "Summerside", type: "City", href: "/city/summerside" },
  { id: "greenwich", name: "Greenwich Dunes", type: "Park", href: "/location/greenwich" },
  { id: "confederation-trail", name: "Confederation Trail", type: "Trail", href: "/location/confederation-trail" },
  { id: "confederation-bridge", name: "Confederation Bridge", type: "Bridge", href: "/location/confederation-bridge" },
  { id: "victoria-park", name: "Victoria Park", type: "Park", href: "/location/victoria-park" },
  { id: "basin-head", name: "Basin Head (Singing Sands)", type: "Beach", href: "/location/basin-head" },
  { id: "north-cape", name: "North Cape", type: "Landmark", href: "/location/north-cape" },
  { id: "brackley-beach", name: "Brackley Beach", type: "Beach", href: "/location/brackley-beach" },
  { id: "stratford", name: "Stratford", type: "Town", href: "/town/stratford" },
  { id: "cornwall", name: "Cornwall", type: "Town", href: "/town/cornwall" },
  { id: "pondside-park", name: "Pondside Park", type: "Park", href: "/location/pondside-park" },
  { id: "tea-hill", name: "Tea Hill Provincial Park", type: "Park", href: "/location/tea-hill" },
  { id: "kinlock-beach", name: "Kinlock Beach", type: "Beach", href: "/location/kinlock-beach" },
  { id: "fullertons-creek", name: "Fullerton's Creek", type: "Park", href: "/location/fullertons-creek" },
  { id: "fox-meadow-golf", name: "Fox Meadow Golf", type: "Golf", href: "/location/fox-meadow-golf" },
  { id: "belvedere-golf", name: "Belvedere Golf Club", type: "Golf", href: "/location/belvedere-golf" },
  { id: "cavendish-campground", name: "Cavendish Campground", type: "Campground", href: "/location/cavendish-campground" },
  { id: "stanhope-campground", name: "Stanhope Campground", type: "Campground", href: "/location/stanhope-campground" },
];

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return LOCATIONS.filter(
      (l) => l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    setCursor(-1);
  }, [results]);

  function go(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      if (cursor >= 0 && results[cursor]) {
        go(results[cursor].href);
      } else if (results[0]) {
        go(results[0].href);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Search beaches, parks, towns…"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="text-text-muted hover:text-text-primary transition text-xs font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#E8EDE4] bg-white shadow-[0_16px_60px_rgba(0,0,0,0.14)]"
        >
          {results.map((loc, i) => (
            <li key={loc.id}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(loc.href)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
                  i === cursor ? "bg-forest-light" : "hover:bg-[#FAFAF7]"
                } ${i !== 0 ? "border-t border-[#F2F4EF]" : ""}`}
              >
                <span className="text-sm font-medium text-text-primary">{loc.name}</span>
                <span className="ml-3 shrink-0 rounded-full bg-[#F2F4EF] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                  {loc.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
