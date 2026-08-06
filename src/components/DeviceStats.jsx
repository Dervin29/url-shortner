import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { MonitorSmartphone } from "lucide-react";
import { useTheme } from "@/context/theme";

const LIGHT_COLORS = ["#3B82F6", "#2563EB", "#60A5FA", "#93C5FD", "#1D4ED8"];
const DARK_COLORS = ["#60A5FA", "#3B82F6", "#93C5FD", "#BFDBFE", "#2563EB"];

export default function DeviceStats({ stats = [] }) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

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
      <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-xl border text-center text-muted-foreground">
        <MonitorSmartphone className="size-6 opacity-60" aria-hidden="true" />
        <p className="text-sm">No device data available.</p>
      </div>
    );
  }

  return (
    <div className="h-72 rounded-xl border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="device"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={55}
            paddingAngle={3}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 13,
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
