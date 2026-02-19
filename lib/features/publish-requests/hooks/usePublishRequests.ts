"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { publishRequestService } from "../services/publish-request.service";
import { superAdminService } from "../../super-admin/services/superadmin.service";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { UserRole } from "@/lib/types/roles";

import { useApiError } from "@/lib/shared/hooks/useApiError";

export function usePublishRequests(org_id?: string) {
  const { user } = useAuth();
  const isSuperAdmin = useMemo(
    () => user?.roles?.includes(UserRole.SUPER_USER) || user?.role === UserRole.SUPER_USER,
    [user]
  );

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { error: apiError, setError: setApiError, clearError } = useApiError();

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "publish-requests",
      { org_id, status: statusFilter, search: debouncedSearch, isSuperAdmin },
    ],
    queryFn: async () => {
      if (!org_id && !isSuperAdmin) return [];

      try {
        if (isSuperAdmin) {
          const response = await superAdminService.getPublishRequests({ page: 1, page_size: 50 });
          return response.items;
        }

        return await publishRequestService.getPublishRequests({
          org_id: org_id as string,
          status: statusFilter === "all" ? undefined : statusFilter,
          offset: 0,
          limit: 50,
        });
      } catch (err) {
        setApiError(err);
        throw err;
      }
    },
    enabled: !!org_id || isSuperAdmin,
    staleTime: QUERY_CONFIG.STALE_TIME_FAST,
  });

  // Clear error on successful data fetch
  useEffect(() => {
    if (data && apiError) {
      clearError();
    }
  }, [data, apiError, clearError]);

  // Client-side filtering for instant feedback
  const filteredRequests = useMemo(() => {
    const requests = data || [];
    if (!searchQuery.trim()) return requests;

    const searchLower = searchQuery.toLowerCase();
    return requests.filter(
      (req) =>
        req.did.toLowerCase().includes(searchLower) ||
        req.requested_by.toLowerCase().includes(searchLower)
    );
  }, [data, searchQuery]);

  return {
    requests: filteredRequests,
    isLoading,
    error: apiError,
    clearError,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh: refetch,
  };
}
