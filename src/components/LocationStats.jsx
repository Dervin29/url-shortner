/* eslint-disable react/prop-types */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function LocationStats({ stats = [] }) {
  const cityCount = stats.reduce((acc, item) => {
    const city = item.city || "Unknown";

    acc[city] = (acc[city] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(cityCount)
    .map(([city, count]) => ({
      city,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (!data.length) {
    return (
      <div className="h-[320px] flex items-center justify-center rounded-xl border text-muted-foreground">
        No location data available.
      </div>
    );
  }

  return (
    <div className="h-[320px] rounded-xl border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
          />

          <XAxis
            dataKey="city"
            tick={{ fontSize: 12 }}
          />

          <YAxis allowDecimals={false} />

          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "none",
            }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 5,
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}