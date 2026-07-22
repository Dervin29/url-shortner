/* eslint-disable react/prop-types */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function DeviceStats({ stats = [] }) {
  const deviceCount = stats.reduce((acc, item) => {
    const device = item.device || "Unknown";

    acc[device] = (acc[device] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(deviceCount).map(([device, count]) => ({
    device,
    count,
  }));

  if (!data.length) {
    return (
      <div className="h-[320px] flex items-center justify-center rounded-xl border text-muted-foreground">
        No device data available.
      </div>
    );
  }

  return (
    <div className="h-[320px] rounded-xl border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="device"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={4}
            label={({ device, percent }) =>
              `${device} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}