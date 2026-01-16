import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Footer } from "@/components/landing/Footer";

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
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 md:p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
