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
    <div className={cn("surface-card-soft flex h-full flex-col p-5", className)}>
      {(Icon || title) && (
        <div className="mb-4 flex items-center gap-3">
          {Icon && (
            <div className={cn("rounded-full border border-border bg-bg p-2.5 text-forest", accentClassName)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          {title && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{title}</p>
          )}
        </div>
      )}
      <p className="font-serif text-[1.12rem] leading-7 text-text-primary break-words">{insight}</p>
      <p className="mt-auto pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        {rawLabel}
      </p>
    </div>
  );
}
