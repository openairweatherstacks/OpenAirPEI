import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  title?: string;
  insight: string;
  rawLabel: string;
  icon?: LucideIcon;
  accentClassName?: string;
  className?: string;
}

export function MetricCard({
  title,
  insight,
  rawLabel,
  icon: Icon,
  accentClassName,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("rounded-[1.75rem] border border-border bg-white p-4 shadow-sm", className)}>
      {(Icon || title) && (
        <div className="mb-3 flex items-center gap-2">
          {Icon && (
            <div className={cn("rounded-2xl bg-bg p-2 text-forest", accentClassName)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          {title && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">{title}</p>
          )}
        </div>
      )}
      <p className="font-serif text-[1.08rem] leading-7 text-text-primary">{insight}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        {rawLabel}
      </p>
    </div>
  );
}
