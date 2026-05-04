"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface RouteFiltersProps {
  currentDifficulty: string | null;
  currentDistance: string | null;
  currentActivity: string | null;
  filteredCount: number;
  totalCount: number;
}

export function RouteFilters({
  currentDifficulty,
  currentDistance,
  currentActivity,
  filteredCount,
  totalCount,
}: RouteFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const difficultyOptions = ["easy", "moderate", "challenging"];
  const distanceOptions = [
    { value: "short", label: "< 20 km" },
    { value: "medium", label: "20–50 km" },
    { value: "long", label: "50+ km" },
  ];
  const activityOptions = ["cycling", "walking", "running"];

  return (
    <div className="space-y-6 mb-8">
      {/* Difficulty Filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
          Difficulty {currentDifficulty && `• ${currentDifficulty}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => updateFilter("difficulty", currentDifficulty === opt ? null : opt)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentDifficulty === opt
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-text-secondary hover:border-forest-light"
              }`}
            >
              {opt === "easy" ? "🟢" : opt === "moderate" ? "🟡" : "🔴"} {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
          Distance {currentDistance && `• ${distanceOptions.find((d) => d.value === currentDistance)?.label}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {distanceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("distance", currentDistance === opt.value ? null : opt.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentDistance === opt.value
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-text-secondary hover:border-forest-light"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
          Activity {currentActivity && `• ${currentActivity}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {activityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => updateFilter("activity", currentActivity === opt ? null : opt)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentActivity === opt
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-text-secondary hover:border-forest-light"
              }`}
            >
              {opt === "cycling" ? "🚴" : opt === "walking" ? "🚶" : "🏃"} {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-text-muted pt-2">
        {filteredCount} of {totalCount} routes
      </div>
    </div>
  );
}
