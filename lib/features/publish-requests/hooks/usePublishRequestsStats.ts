"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { publishRequestService } from "../services/publish-request.service";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { UserRole } from "@/lib/types/roles";

export function usePublishRequestsStats(org_id?: string) {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.roles?.includes(UserRole.SUPER_USER) || user?.role === UserRole.SUPER_USER;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publish-requests", "stats", { org_id, isSuperAdmin }],
    queryFn: async () => {
      if (isSuperAdmin) return null; // No global stats endpoint for now
      if (!org_id) return null;
      return publishRequestService.getPublishRequestsStats(org_id);
    },
    enabled: !!org_id || isSuperAdmin,
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
  });

  return {
    stats: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
