import { useState, useEffect, useCallback } from "react";
import { superAdminService } from "../services/superadmin.service";
import {
  type OrganizationListItem,
  type OrganizationStats,
  type OrganizationListParams,
} from "../../organizations/types/organization.types";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    all: 0,
    pending: 0,
    active: 0,
    suspended: 0,
    refused: 0,
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationListParams["status"] | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch Data
   */
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: OrganizationListParams = {
        page,
        page_size: pageSize,
        search: search || undefined,
        status: status || undefined,
      };

      const { data } = await superAdminService.getOrganizations(params);
      setOrganizations(data.results);
      setTotalCount(data.count);
      const statsData = await superAdminService.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading organizations");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, status]);

  // Initial Load & Updates
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    stats,
    isLoading,
    error,
    pagination: {
      page,
      pageSize,
      count: totalCount,
      setPage,
      setPageSize,
    },
    refresh: fetchOrganizations,
    filters: {
      search,
      setSearch,
      status,
      setStatus,
    },
  };
}
