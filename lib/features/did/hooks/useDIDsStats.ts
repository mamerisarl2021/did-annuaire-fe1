"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { didService } from "../services/did.service";
import { superAdminService } from "../../super-admin/services/superadmin.service";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { UserRole } from "@/lib/types/roles";

export function useDIDsStats() {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.roles?.includes(UserRole.SUPER_USER) || user?.role === UserRole.SUPER_USER;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dids", "stats", { isSuperAdmin }],
    queryFn: () => (isSuperAdmin ? superAdminService.getDIDsStats() : didService.getDIDsStats()),
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
