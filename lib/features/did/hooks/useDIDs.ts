import { useState, useEffect, useMemo, useCallback } from "react";
import { DID, DIDDocument } from "../types";
import { didApiClient } from "../api/didApiClient";
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
      const response = await didApiClient.getAllDIDs({
        page,
        page_size: pageSize,
      });

      console.log("[useDIDs] Raw API Response:", response);

      const rawItems = response.items || [];
      const items: DID[] = rawItems.map((item) => ({
        id: item.did,
        method: "WEB",
        didDocument: {} as DIDDocument,
        created: item.created_at || new Date().toISOString(),
        organization_id: item.organization_id,
        organization_name: item.organization_name,
        owner_id: item.owner_id,
        document_type: item.document_type,
        public_key_version: item.public_key_version,
        public_key_jwk: item.public_key_jwk as { kty: string;[key: string]: unknown },
        metadata: {
          version: item.latest_version,
          document_type: item.document_type,
        },
      }));

      setDids(items);

      // Handle different pagination structures
      if (response.pagination) {
        setPagination(response.pagination);
      }

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

  const publishDID = async (id: string) => {
    try {
      const response = await didApiClient.publishDID(id);
      logger.info(`[useDIDs] Published DID ${id}`, { response });
      return response;
    } catch (err) {
      logger.error(`[useDIDs] Failed to publish DID ${id}:`, err);
      throw err;
    }
  };

  return {
    dids: filteredDIDs,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refreshDIDs: fetchDIDs,
    deleteDID,
    publishDID,
    pagination: {
      ...pagination,
      setPage,
      setPageSize,
    },
  };
}
