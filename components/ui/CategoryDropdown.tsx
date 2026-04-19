"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategoryOption {
  id: string;
  label: string;
  count: number;
  bestScore: string | null;
}

export function CategoryDropdown({ categories }: { categories: CategoryOption[] }) {
  const [selected, setSelected] = useState(categories[0]?.id ?? "");

  function handleChange(id: string) {
    setSelected(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const active = categories.find((c) => c.id === selected);

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-[1.75rem] border border-border bg-white/90 px-5 py-4 shadow-[0_8px_40px_rgba(42,42,42,0.07)]">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
            Browse by category
          </p>
          <p className="mt-0.5 font-serif text-xl text-text-primary">
            {active?.label ?? "Select a category"}
            {active && (
              <span className="ml-2 font-sans text-sm font-normal text-text-secondary">
                — {active.count} location{active.count !== 1 ? "s" : ""}
                {active.bestScore ? ` · Best: ${active.bestScore}` : ""}
              </span>
            )}
          </p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-text-muted" />
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer rounded-[1.75rem] opacity-0"
          aria-label="Jump to category"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label} — {cat.count} location{cat.count !== 1 ? "s" : ""}
              {cat.bestScore ? ` · Best: ${cat.bestScore}` : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
