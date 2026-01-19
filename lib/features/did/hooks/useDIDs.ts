import { useState, useEffect, useMemo, useCallback } from "react";
import { DID } from "../types";
import { didService } from "../services";
import { logger } from "@/lib/shared/services/logger.service";
import { DIDListPagination } from "../types/api.types";

export function useDIDs() {
  const [dids, setDids] = useState<DID[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState<DIDListPagination>({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  });

  const fetchDIDs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items, pagination: pagingData } = await didService.getDIDs({
        page,
        page_size: pageSize,
      });
      setDids(items);
      setPagination(pagingData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch DIDs");
      logger.error("Failed to fetch DIDs", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchDIDs();
  }, [fetchDIDs]);

  const filteredDIDs = useMemo(() => {
    if (!searchQuery) return dids;
    const lowerQuery = searchQuery.toLowerCase();
    return dids.filter(
      (did) =>
        did.id.toLowerCase().includes(lowerQuery) ||
        did.method.toLowerCase().includes(lowerQuery) ||
        (did.organization_name && did.organization_name.toLowerCase().includes(lowerQuery))
    );
  }, [dids, searchQuery]);

  const deleteDID = async (id: string) => {
    // Mock delete
    setDids((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    dids: filteredDIDs,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refreshDIDs: fetchDIDs,
    deleteDID,
    pagination: {
      ...pagination,
      setPage,
      setPageSize,
    },
  };
}
