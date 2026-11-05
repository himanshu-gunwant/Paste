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
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 flex items-center justify-center text-xs text-zinc-500 font-mono"
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
    <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

            <XAxis
              dataKey="formattedDay"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
              allowDecimals={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md">
                      <p className="text-xs font-semibold text-zinc-300 pb-1 mb-2 border-b border-zinc-800">
                        {label}
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-violet-400" />
                          <span className="text-zinc-400">Total Views:</span>
                          <span className="font-mono font-bold text-zinc-100">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                          <span className="text-zinc-400">Unique Visitors:</span>
                          <span className="font-mono font-bold text-zinc-100">
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
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#viewsGradient)"
            />
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              name="Unique Visitors"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#visitorsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-end gap-5 pt-3 mt-2 border-t border-zinc-900 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span>Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
          <span>Unique Visitors</span>
        </div>
      </div>
    </div>
  );
}
