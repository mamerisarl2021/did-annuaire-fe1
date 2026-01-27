"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { superAdminService } from "../services/superadmin.service";
import { type OrganizationListParams } from "../../organizations/types/organization.types";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useOrganizations() {
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationListParams["status"] | undefined>(undefined);

  // Debounce search
  const debouncedSearch = useDebounce(search, 300);

  // Main organizations query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["super-admin", "organizations", { page, pageSize, search: debouncedSearch, status }],
    queryFn: async () => {
      const params: OrganizationListParams = {
        page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        status: status || undefined,
      };

      const { data } = await superAdminService.getOrganizations(params);
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Separate stats query with longer cache
  const { data: statsData } = useQuery({
    queryKey: ["super-admin", "organizations", "stats"],
    queryFn: () => superAdminService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    organizations: data?.results || [],
    stats: statsData || {
      all: 0,
      pending: 0,
      active: 0,
      suspended: 0,
      refused: 0,
    },
    isLoading,
    error: error ? (error as Error).message : null,
    pagination: {
      page,
      pageSize,
      count: data?.count || 0,
      setPage,
      setPageSize,
    },
    refresh: refetch,
    filters: {
      search,
      setSearch,
      status,
      setStatus,
    },
  };
}
