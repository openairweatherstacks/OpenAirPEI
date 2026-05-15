import type { AlertItem } from "@/lib/types";

const SEVERITY_STYLES: Record<AlertItem["severity"], { bg: string; border: string; pill: string; pillText: string }> = {
  info: { bg: "bg-[#FDF0D5]", border: "border-[#F5A623]", pill: "bg-[#F5A623]", pillText: "text-[#1A1A1A]" },
  watch: { bg: "bg-[#FDE8D5]", border: "border-[#E8960F]", pill: "bg-[#E8960F]", pillText: "text-white" },
  warning: { bg: "bg-[#FCE9E6]", border: "border-[#C0392B]", pill: "bg-[#C0392B]", pillText: "text-white" },
};

export function StormBanner({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const styles = SEVERITY_STYLES[alert.severity];
        return (
          <div
            key={`${alert.title}-${index}`}
            className={`${styles.bg} border-l-4 ${styles.border} rounded-r-2xl px-5 py-4`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`${styles.pill} ${styles.pillText} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}
              >
                {alert.severity}
              </span>
              <h3
                className="text-base sm:text-lg font-bold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-barlow), system-ui, sans-serif" }}
              >
                {alert.title}
              </h3>
            </div>
            <p className="text-sm text-[#2A2A2A] leading-relaxed">{alert.summary}</p>
          </div>
        );
      })}
    </div>
  );
}
