"use client";

import { useLogout } from "@/lib/features/auth/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function DashboardHeader() {
  const { logout, isLoading } = useLogout();

  return (
    <header className="border-b bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-primary">DID Annuaire</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={logout} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </header>
  );
}
