import { cn } from "@/lib/utils";

export function AirQualityBar({ value }: { value: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, index) => {
          const active = index < value;
          return (
            <div
              key={index}
              className={cn(
                "h-3 rounded-full",
                index < 3
                  ? active
                    ? "bg-forest"
                    : "bg-forest-light"
                  : index < 6
                    ? active
                      ? "bg-sun"
                      : "bg-sun-light"
                    : active
                      ? "bg-danger"
                      : "bg-rose-100",
              )}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        <span>Low risk</span>
        <span>AQHI {value}</span>
        <span>High risk</span>
      </div>
    </div>
  );
}
