"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface DailySnapshot {
  date: string;
  tempHigh: number;
  tempLow: number;
  tempAvg: number;
  precipTotal: number;
  windAvg: number;
  windGustMax: number;
  uvIndexMax: number;
}

type TabId = "temperature" | "precipitation" | "wind" | "uv";

const TABS: { id: TabId; label: string }[] = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Rain" },
  { id: "wind", label: "Wind" },
  { id: "uv", label: "UV" },
];

function formatXAxis(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function tickEvery(data: DailySnapshot[], n = 10): string[] {
  return data.filter((_, i) => i % n === 0 || i === data.length - 1).map((d) => d.date);
}

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #E8EDE4",
  borderRadius: "12px",
  fontSize: "0.75rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

export function StationHistoryChart() {
  const [data, setData] = useState<DailySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("temperature");

  useEffect(() => {
    fetch("/api/cameron-heights/history?days=90")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => setData(json.history ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
        <div className="h-6 w-48 rounded-lg bg-slate-100 animate-pulse mb-4" />
        <div className="h-[220px] rounded-xl bg-slate-50 animate-pulse" />
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
        <p className="text-sm text-text-muted">Station history unavailable right now.</p>
      </div>
    );
  }

  const ticks = tickEvery(data, Math.max(1, Math.floor(data.length / 9)));

  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Station history</p>
          <h2 className="font-serif text-xl text-text-primary sm:text-2xl">
            90 days from your backyard
          </h2>
        </div>
        <p className="text-xs text-text-muted">{data.length} days of data</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
              activeTab === tab.id
                ? "bg-forest text-white"
                : "bg-[#fafaf7] text-text-secondary hover:bg-forest-light"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "temperature" && (
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE4" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}°`}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(v) => formatXAxis(v as string)}
              formatter={(v, name) => [v != null ? `${v}°C` : "—", String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            <Area
              type="monotone"
              dataKey="tempHigh"
              name="High"
              fill="#FDF0D5"
              stroke="#F5A623"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="tempAvg"
              name="Avg"
              stroke="#3A8C2F"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="tempLow"
              name="Low"
              stroke="#7DC832"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "precipitation" && (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE4" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}mm`}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(v) => formatXAxis(v as string)}
              formatter={(v) => [v != null ? `${v} mm` : "—", "Rain"]}
            />
            <Bar
              dataKey="precipTotal"
              name="Rain"
              fill="#3A8C2F"
              radius={[3, 3, 0, 0]}
              maxBarSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeTab === "wind" && (
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE4" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}`}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
              unit=" km/h"
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(v) => formatXAxis(v as string)}
              formatter={(v, name) => [v != null ? `${v} km/h` : "—", String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            <Area
              type="monotone"
              dataKey="windGustMax"
              name="Gust max"
              fill="#FDF0D5"
              stroke="#F5A623"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="windAvg"
              name="Avg"
              stroke="#3A8C2F"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "uv" && (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE4" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 11]}
              ticks={[0, 3, 6, 8, 11]}
              tick={{ fontSize: 10, fill: "#9BA696" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(v) => formatXAxis(v as string)}
              formatter={(v) => [v != null ? `UV ${v}` : "—", "Daily peak"]}
            />
            <Area
              type="monotone"
              dataKey="uvIndexMax"
              name="UV peak"
              fill="#FDF0D5"
              stroke="#F5A623"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <p className="mt-3 text-[10px] text-text-muted">
        Daily summaries from your on-site Tempest station · All times Atlantic
      </p>
    </div>
  );
}
