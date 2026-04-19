import { PawPrint } from "lucide-react";

import type { PawScore } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<PawScore, string> = {
  Great: "bg-forest-deep text-white",
  Good: "bg-leaf text-forest-deep",
  Caution: "bg-sun text-[#2a2a2a]",
  "Stay Home": "bg-danger text-white",
};

export function PawBadge({
  score,
  className,
}: {
  score: PawScore;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
        STYLES[score],
        className,
      )}
    >
      <PawPrint className="h-3 w-3" />
      {score}
    </span>
  );
}
