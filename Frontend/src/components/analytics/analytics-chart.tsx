"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DailyStat } from "@/types/analytics";

interface AnalyticsChartProps {
  data: DailyStat[];
  height?: number;
}

export function AnalyticsChart({ data, height = 300 }: AnalyticsChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-xs text-muted font-mono"
      >
        Loading analytics graph...
      </div>
    );
  }

  // Format short date for X-Axis (e.g. "Nov 5")
  const chartData = data.map((d) => {
    try {
      const date = new Date(d.day);
      return {
        ...d,
        formattedDay: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      };
    } catch {
      return {
        ...d,
        formattedDay: d.day,
      };
    }
  });

  return (
    <div className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5f5f5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f5f5f5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey="formattedDay"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              allowDecimals={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-white/10 bg-[#141414] p-3 shadow-2xl backdrop-blur-md">
                      <p className="text-xs font-semibold text-foreground pb-1 mb-2 border-b border-white/10">
                        {label}
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          <span className="text-muted">Total Views:</span>
                          <span className="font-mono font-semibold text-foreground">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-muted" />
                          <span className="text-muted">Unique Visitors:</span>
                          <span className="font-mono font-semibold text-foreground">
                            {payload[1]?.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="#f5f5f5"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#viewsGradient)"
            />
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              name="Unique Visitors"
              stroke="#9ca3af"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#visitorsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-end gap-5 pt-3 mt-2 border-t border-white/5 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span>Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span>Unique Visitors</span>
        </div>
      </div>
    </div>
  );
}
