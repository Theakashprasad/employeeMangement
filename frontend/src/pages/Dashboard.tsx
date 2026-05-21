import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import EmployeeTableSection from "@/components/dashboard/EmployeeTableSection";
import { fetchAnalytics, type AnalyticsData } from "@/services/employee.service";

export default function Dashboard() {
  const location = useLocation();
  const focusEmployees = location.pathname.includes("employees");

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      setAnalyticsError(
        err instanceof Error ? err.message : "Failed to load analytics",
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics, refreshKey]);

  useEffect(() => {
    if (focusEmployees) {
      document.getElementById("employees-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [focusEmployees]);

  const handleEmployeesChanged = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <AppLayout
      title="Employee Management Dashboard"
      subtitle="Analytics, employee listing, and CRUD operations"
    >
      <section className="mb-8">
        <h2 className="text-base font-bold text-[#18191C] mb-4">Analytics Overview</h2>
        <AnalyticsSection
          data={analytics}
          loading={analyticsLoading}
          error={analyticsError}
          onRetry={loadAnalytics}
        />
      </section>

      <section>
        <EmployeeTableSection
          refreshKey={refreshKey}
          onEmployeesChanged={handleEmployeesChanged}
        />
      </section>
    </AppLayout>
  );
}
