"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Footer } from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard Layout
 * Shared layout for all authenticated dashboard pages
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar hidden on mobile, visible on md+ */}
      <aside className="hidden md:block w-64 shrink-0 pt-[73px]">
        <DashboardSidebar className="h-full" />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 pt-[73px]">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 md:p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
