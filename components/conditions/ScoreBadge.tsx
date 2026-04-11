import type { ConditionsScore } from "@/lib/types";
import { cn } from "@/lib/utils";

const SCORE_STYLES: Record<ConditionsScore, string> = {
  Excellent: "bg-forest text-white shadow-glow",
  Good: "bg-leaf text-forest-deep",
  Fair: "bg-sun text-sun-deep",
  "Stay Inside": "bg-danger text-white",
};

export function ScoreBadge({ score, className }: { score: ConditionsScore; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
        SCORE_STYLES[score],
        className,
      )}
    >
      {score}
    </span>
  );
}
