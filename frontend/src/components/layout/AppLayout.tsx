import { useState } from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/store/useAuthStore";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, subtitle, children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";

  return (
    <div className="flex h-screen bg-[#F7F8FA] font-sans overflow-hidden">
      <AppSidebar collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-[#E7E7E7] flex items-center px-5 gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="text-[#767F8C] hover:text-[#18191C] lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-[#18191C] truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-[#767F8C] truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-lg border border-[#E7E7E7] flex items-center justify-center text-[#767F8C]"
          >
            <Bell size={17} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0A65CC] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[#18191C] capitalize">{displayName}</p>
              <p className="text-[10px] text-[#A0A7B4]">Admin</p>
            </div>
            <ChevronDown size={14} className="text-[#A0A7B4] hidden sm:block" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
