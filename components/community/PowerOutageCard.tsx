import { CheckCircle2, Phone, Zap, ZapOff } from "lucide-react";

import { describeETR, describeReportedAt, getCurrentOutage } from "@/lib/power-outage";

const SEVERITY_STYLES = {
  none: {
    border: "border-border",
    accent: "bg-leaf-light",
    icon: "text-forest",
    badgeBg: "bg-forest-light",
    badgeText: "text-forest",
    label: "All clear",
  },
  advisory: {
    border: "border-sun/60",
    accent: "bg-sun-light",
    icon: "text-sun-text",
    badgeBg: "bg-sun-light",
    badgeText: "text-sun-text",
    label: "Advisory",
  },
  active: {
    border: "border-red-400",
    accent: "bg-red-50",
    icon: "text-red-600",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    label: "Outage active",
  },
  widespread: {
    border: "border-red-600",
    accent: "bg-red-50",
    icon: "text-red-700",
    badgeBg: "bg-red-200",
    badgeText: "text-red-800",
    label: "Widespread outage",
  },
} as const;

export function PowerOutageCard() {
  const outage = getCurrentOutage();
  const style = SEVERITY_STYLES[outage.severity];
  const Icon = outage.severity === "none" ? CheckCircle2 : ZapOff;
  const reportedLabel = describeReportedAt(outage.reportedAt);
  const etrLabel = describeETR(outage.estimatedRestoration);

  return (
    <div className={`rounded-[1.75rem] border-2 ${style.border} bg-white p-5 shadow-sm sm:p-6`}>
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-forest" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">Power status</p>
      </div>

      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.accent}`}>
          <Icon className={`h-7 w-7 ${style.icon}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="font-serif text-xl leading-tight text-text-primary break-words sm:text-2xl">
              {outage.headline}
            </p>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badgeBg} ${style.badgeText}`}>
              {style.label}
            </span>
          </div>
          <p className="text-xs text-text-muted">{outage.area}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-text-secondary break-words">{outage.detail}</p>

      {outage.severity !== "none" && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs sm:grid-cols-3">
          {outage.affectedCustomers !== null && (
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Affected</p>
              <p className="font-medium text-text-primary">{outage.affectedCustomers.toLocaleString()} customers</p>
            </div>
          )}
          {etrLabel && (
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Estimated restoration</p>
              <p className="font-medium text-text-primary">{etrLabel}</p>
            </div>
          )}
          {outage.cause && (
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Cause</p>
              <p className="font-medium text-text-primary">{outage.cause}</p>
            </div>
          )}
          {reportedLabel && (
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Reported</p>
              <p className="font-medium text-text-primary">{reportedLabel}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-text-muted">
        <span>Source: Maritime Electric</span>
        <a
          href="tel:18006701012"
          className="inline-flex items-center gap-1.5 font-semibold text-forest hover:text-forest-deep"
        >
          <Phone className="h-3 w-3" />
          Report: 1-800-670-1012
        </a>
      </div>
    </div>
  );
}
