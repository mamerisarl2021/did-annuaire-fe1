"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { organizationService } from "../services/organization.service";
import {
  type OrganizationListItem,
  type OrganizationStats,
  type OrganizationListParams,
} from "../types/organization.types";
import { type OrganizationStatusType } from "@/lib/types/organization-status";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface UseOrganizationsReturn {
  /** The list of organizations */
  organizations: OrganizationListItem[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Statistics for organizations */
  stats: OrganizationStats | null;
  /** Total count of organizations */
  totalCount: number;
  /** Current pagination state */
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  /** Active filters */
  filters: {
    status: OrganizationStatusType | "all";
    search: string;
  };
  /** Update current page */
  setPage: (page: number) => void;
  /** Update page size */
  setPageSize: (size: number) => void;
  /** Update status filter */
  setStatusFilter: (status: OrganizationStatusType | "all") => void;
  /** Update search query */
  setSearch: (query: string) => void;
  /** Refresh the data */
  refresh: () => void;
}

/**
 * Hook to manage organizations list for ORG_ADMIN
 * Migrated to React Query for better caching and performance
 */
export function useOrganizations(initialPageSize = 10): UseOrganizationsReturn {
  // Filters and pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [statusFilter, setStatusFilter] = useState<OrganizationStatusType | "all">("all");
  const [search, setSearch] = useState("");

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(search, 300);

  // Main organizations query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organizations", { page, pageSize, status: statusFilter, search: debouncedSearch }],
    queryFn: async () => {
      const params: OrganizationListParams = {
        page,
        page_size: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch.trim() || undefined,
      };
      return organizationService.getOrganizationsList(params);
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Separate stats query with longer cache time
  const { data: statsData } = useQuery({
    queryKey: ["organizations", "stats"],
    queryFn: () => organizationService.getOrganizationsStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change often
  });

  return {
    organizations: data?.results || [],
    isLoading,
    error: error ? (error as Error).message : null,
    stats: data?.stats || statsData || null,
    totalCount: data?.count || 0,
    pagination: {
      page,
      pageSize,
      totalPages: Math.ceil((data?.count || 0) / pageSize),
    },
    filters: {
      status: statusFilter,
      search,
    },
    setPage,
    setPageSize,
    setStatusFilter,
    setSearch,
    refresh: refetch,
  };
}
