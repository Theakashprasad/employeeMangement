import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, UserCheck, Building2, TrendingUp } from "lucide-react";
import type { AnalyticsData } from "@/services/employee.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";

const PIE_COLORS = ["#0A65CC", "#27AE60", "#F5A623", "#E84545", "#9B59B6", "#767F8C"];

interface AnalyticsSectionProps {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function AnalyticsSection({
  data,
  loading,
  error,
  onRetry,
}: AnalyticsSectionProps) {
  if (loading) return <LoadingSpinner label="Loading analytics..." />;
  if (error) return <ErrorAlert message={error} onRetry={onRetry} />;
  if (!data) return null;

  const deptData = data.departmentWise.map((d) => ({
    name: d.department,
    value: d.count,
  }));

  const statusData = data.statusDistribution.map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const monthlyData =
    data.monthlyJoined.length > 0
      ? data.monthlyJoined
      : [{ label: "No data", count: 0, year: 0, month: 0 }];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={data.totalEmployees}
          icon={<Users size={20} className="text-[#0A65CC]" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Active Employees"
          value={data.activeEmployees}
          icon={<UserCheck size={20} className="text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Inactive / Leave"
          value={data.inactiveEmployees}
          icon={<Building2 size={20} className="text-amber-600" />}
          bg="bg-amber-50"
        />
        <StatCard
          title="Departments"
          value={data.departmentWise.length}
          icon={<TrendingUp size={20} className="text-purple-600" />}
          bg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Department-wise Count" className="xl:col-span-1">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 10, fill: "#767F8C" }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#0A65CC" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Joined">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#27AE60" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white border border-[#E7E7E7] rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#767F8C] uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-[#18191C] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-[#E7E7E7] rounded-xl p-5 ${className}`}
    >
      <h3 className="text-sm font-semibold text-[#18191C] mb-4">{title}</h3>
      {children}
    </div>
  );
}
