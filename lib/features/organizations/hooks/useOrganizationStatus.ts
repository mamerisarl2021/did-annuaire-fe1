"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { organizationService } from "../services/organization.service";

interface UseOrganizationStatusReturn {
  status: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch organization status
 * Migrated to React Query
 */
export function useOrganizationStatus(organizationId?: string): UseOrganizationStatusReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organization", organizationId, "status"],
    queryFn: async () => {
      if (!organizationId) throw new Error("Organization ID is required");
      return organizationService.getOrganizationStatus(organizationId);
    },
    enabled: !!organizationId && organizationId !== "undefined" && organizationId !== "null",
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });

  return {
    status: data?.status || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch: useCallback(() => {
      refetch();
    }, [refetch]),
  };
}
