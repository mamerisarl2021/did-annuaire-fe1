"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { useState, useMemo } from "react";
import { DID, DIDDocument } from "../types";
import { didService } from "../services/did.service";
import { logger } from "@/lib/shared/services/logger.service";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useDIDs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search for server-side filtering
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dids", { page, pageSize, search: debouncedSearch }],
    queryFn: async () => {
      const response = await didService.getAllDIDs({
        page,
        page_size: pageSize,
      });

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
        public_key_jwk: item.public_key_jwk as { kty: string; [key: string]: unknown },
        version: item.latest_version,
        is_published: item.is_published ?? false,
      }));

      return {
        items,
        pagination: response.pagination || {
          page: 1,
          page_size: 10,
          total: 0,
          total_pages: 1,
        },
      };
    },
    staleTime: QUERY_CONFIG.STALE_TIME_FAST,
  });

  const pagination = data?.pagination || {
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  };

  // Client-side filtering for instant feedback
  const filteredDIDs = useMemo(() => {
    const dids = data?.items || [];
    if (!searchQuery) return dids;
    const lowerQuery = searchQuery.toLowerCase();
    return dids.filter(
      (did) =>
        did.id.toLowerCase().includes(lowerQuery) ||
        did.method.toLowerCase().includes(lowerQuery) ||
        (did.organization_name && did.organization_name.toLowerCase().includes(lowerQuery))
    );
  }, [data?.items, searchQuery]);

  const deactivateDID = async (did: string) => {
    try {
      const response = await didService.deactivateDID(did);
      logger.info(`[useDIDs] Deactivated DID ${did}`, { response });
      await refetch();
      return response;
    } catch (err) {
      logger.error(`[useDIDs] Failed to deactivate DID ${did}:`, err);
      throw err;
    }
  };

  const publishDID = async (id: string) => {
    try {
      const response = await didService.publishDID(id);
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
    error: error ? (error as Error).message : null,
    searchQuery,
    setSearchQuery,
    refreshDIDs: refetch,
    deactivateDID,
    publishDID,
    pagination: {
      ...pagination,
      setPage,
      setPageSize,
    },
  };
}
