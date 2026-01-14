"use client";

import { useState, useEffect, useCallback } from "react";
import { organizationService } from "../services/organization.service";
import {
  type OrganizationListItem,
  type OrganizationStats,
  type OrganizationListParams,
} from "../types/organization.types";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

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
  refresh: () => Promise<void>;
}

/**
 * Hook to manage organizations list for ORG_ADMIN
 */
export function useOrganizations(initialPageSize = 10): UseOrganizationsReturn {
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [statusFilter, setStatusFilter] = useState<OrganizationStatusType | "all">("all");
  const [search, setSearch] = useState("");

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: OrganizationListParams = {
        page,
        page_size: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search.trim() || undefined,
      };

      const response = await organizationService.getOrganizationsList(params);
      setOrganizations(response.results);
      setTotalCount(response.count);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch organizations");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, statusFilter, search]);

  // Handle data fetching
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const refresh = useCallback(async () => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    isLoading,
    error,
    stats,
    totalCount,
    pagination: {
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    filters: {
      status: statusFilter,
      search,
    },
    setPage,
    setPageSize,
    setStatusFilter,
    setSearch,
    refresh,
  };
}
