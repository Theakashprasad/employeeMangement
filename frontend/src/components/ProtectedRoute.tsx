import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { useAuth } from "@/store/useAuthStore";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }
  return <Outlet />;
}
