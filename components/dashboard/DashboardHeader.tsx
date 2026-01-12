"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/lib/features/auth/components/UserMenu";

/**
 * Dashboard Header Component
 *
 * Single Responsibility: Display dashboard header with branding and user menu
 * - Shows app logo/name
 * - Displays UserMenu with "Logged as: email" and navigation
 */
export function DashboardHeader() {
  return (
    <header className="border-b bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Lock className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-primary">DID Annuaire</h1>
      </Link>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
