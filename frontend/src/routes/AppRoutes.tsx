import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import LoginPage from "@/pages/Login";
import SignUpPage from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import EmployeeChart from "@/pages/Employees";
import { ROUTES } from "./paths";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signup} element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.employees} element={<EmployeeChart />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
