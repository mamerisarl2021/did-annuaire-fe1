"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "../services/auth.service";
import { useRoleRedirect } from "@/lib/guards/useRoleRedirect";
import { type AuthUser } from "../types/auth.types";
import { logger } from "@/lib/shared/services/logger.service";

/**
 * User Menu Component
 *
 * Single Responsibility: Display authenticated user menu in header
 * - Shows Avatar with fallback initials
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
        logger.error("Failed to load user in UserMenu", error);
      }
    };

    loadUser();
  }, []);

  /**
   * Get user initials for avatar fallback
   */
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return email.substring(0, 2).toUpperCase();
  };

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
      logger.error("Logout failed in UserMenu", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if no user
  if (!user) {
    return null;
  }

  const initials = getInitials(user.full_name || null, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.full_name || user.email} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
            <LayoutDashboard className="mr-2 size-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer w-full flex items-center">
              <Settings className="mr-2 size-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 size-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
