"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard Dispatcher Page
 * Redirects user to their specific dashboard based on role
 */
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
          <h1 className="text-xl font-bold">Accès Non Défini</h1>
          <p>Votre compte est authentifié mais aucun rôle n'a été détecté.</p>
          <p className="mt-2 text-xs font-mono text-muted-foreground">
            ID: {user.id}
            <br />
            Email: {user.email}
          </p>
          <div className="mt-4">
            <button onClick={() => router.push("/auth/login")} className="underline">
              Retour à la connexion
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
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
}
