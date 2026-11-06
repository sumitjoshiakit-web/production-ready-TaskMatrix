"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDatum = { date: string; completed: number };

export default function CompletionChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 5, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6658d3" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#6658d3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#edf0ed" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#77817c" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#77817c" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e7ebe7", fontSize: 12 }} />
        <Area type="monotone" dataKey="completed" name="Completed" stroke="#6658d3" strokeWidth={2.5} fill="url(#completionFill)" activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
