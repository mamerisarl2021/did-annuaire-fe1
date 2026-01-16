"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { redirectToRoleDashboard } = useRoleRedirect();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && user.role) {
        redirectToRoleDashboard(user.role);
      } else if (!user) {
        router.push("/auth/login");
      }
    }
  }, [user, loading, redirectToRoleDashboard, router]);

  if (!loading && user && !user.role) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="rounded-md bg-destructive/10 p-6 text-destructive">
          <h1 className="text-xl font-bold">Access Undefined</h1>
          <p>Your account is authenticated but no role was detected.</p>
          <p className="mt-2 text-xs font-mono text-muted-foreground">
            ID: {user.id}
            <br />
            Email: {user.email}
          </p>
          <div className="mt-4">
            <button onClick={() => router.push("/auth/login")} className="underline">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
