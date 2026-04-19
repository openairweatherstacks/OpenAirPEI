import type { ConditionsScore } from "@/lib/types";
import { cn } from "@/lib/utils";

const SCORE_STYLES: Record<ConditionsScore, string> = {
  Excellent: "bg-forest-deep text-white",
  Good: "bg-leaf text-forest-deep",
  Fair: "bg-sun text-[#2a2a2a]",
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
