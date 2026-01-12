"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "../services/auth.service";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { type AuthUser } from "../types/auth.types";

/**
 * User Menu Component
 *
 * Single Responsibility: Display authenticated user menu in header
 * - Shows "Logged as: email"
 * - Dashboard link (redirects based on role)
 * - Settings link
 * - Logout action
 */
export function UserMenu() {
  const router = useRouter();
  const { redirectToRoleDashboard } = useRoleRedirect();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  /**
   * Handle dashboard click - redirect to role-specific dashboard
   */
  const handleDashboardClick = () => {
    if (user?.role) {
      redirectToRoleDashboard(user.role);
    } else {
      router.push("/dashboard");
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="size-4" />
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="text-muted-foreground">Logged as:</span>
            <span className="font-medium max-w-[150px] truncate">{user.email}</span>
          </span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Dashboard */}
        <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
          <LayoutDashboard className="mr-2 size-4" />
          Dashboard
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
