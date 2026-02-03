"use client";

import { useTokenExpiration } from "@/lib/features/auth/hooks/useTokenExpiration";

/**
 * Component to monitor token expiration across the application
 * Should be used in the root layout to ensure global monitoring
 */
export function TokenExpirationMonitor() {
  useTokenExpiration();
  return null;
}
