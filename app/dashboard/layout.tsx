import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

/**
 * Dashboard Layout
 * Shared layout for all authenticated dashboard pages
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar hidden on mobile, visible on md+ */}
      <aside className="hidden md:block w-64 shrink-0">
        <DashboardSidebar className="h-full" />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
