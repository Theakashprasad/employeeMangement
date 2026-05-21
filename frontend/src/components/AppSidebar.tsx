import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { LayoutDashboard, BarChart2, LogOut } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { toast } from "sonner";

const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.employees, label: "Employees", icon: BarChart2 },
];

interface AppSidebarProps {
  collapsed: boolean;
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside
      className={`h-full bg-white border-r border-[#E7E7E7] flex flex-col flex-shrink-0 transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-5 border-b border-[#E7E7E7] ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
          <circle cx="16" cy="16" r="16" fill="#0A65CC" />
          <path
            d="M10 16.5C10 13.46 12.46 11 15.5 11H22v2h-6.5C13.57 13 12 14.57 12 16.5S13.57 20 15.5 20H22v2h-6.5C12.46 22 10 19.54 10 16.5Z"
            fill="white"
          />
          <circle cx="21" cy="16.5" r="2" fill="white" />
        </svg>
        {!collapsed && (
          <span className="font-bold text-[15px] text-[#18191C] tracking-tight">
            EmployeeHub
          </span>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#E8F1FB] text-[#0A65CC]"
                  : "text-[#474C54] hover:bg-[#F7F7F8] hover:text-[#18191C]"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? "text-[#0A65CC]" : "text-[#767F8C]"}
                />
                {!collapsed && label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-[#E7E7E7]">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#474C54] hover:bg-red-50 hover:text-red-500 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="text-[#767F8C]" />
          {!collapsed && "Log Out"}
        </button>
      </div>
    </aside>
  );
}
