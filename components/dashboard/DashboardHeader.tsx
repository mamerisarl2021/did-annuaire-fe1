"use client";

import { Lock, Menu } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/lib/features/auth/components/UserMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

/**
 * Dashboard Header Component
 *
 * Single Responsibility: Display dashboard header with branding and user menu
 * - Shows app logo/name
 * - Displays UserMenu with "Logged as: email" and navigation
 * - Provides mobile menu trigger
 */
export function DashboardHeader() {
  return (
    <header className="border-b bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation menu for the dashboard
            </SheetDescription>
            <DashboardSidebar className="border-none" />
          </SheetContent>
        </Sheet>

        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Lock className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-primary">DID Annuaire</h1>
        </Link>
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
