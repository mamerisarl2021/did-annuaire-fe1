"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { useState, useMemo } from "react";
import { DID, DIDDocument } from "../types";
import { didService } from "../services/did.service";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { useErrorToast } from "@/lib/shared/hooks/useErrorToast";
import { useApiError } from "@/lib/shared/hooks/useApiError";

export function useDIDs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showError, showSuccess } = useErrorToast();
  const { error: apiError, setError: setApiError, clearError } = useApiError();

  // Debounce search for server-side filtering
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dids", { page, pageSize, search: debouncedSearch }],
    queryFn: async () => {
      try {
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
          status: item.status,
          state: item.state,
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
      } catch (err) {
        setApiError(err);
        throw err;
      }
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
      showSuccess("Le DID a été désactivé avec succès.");
      await refetch();
      return response;
    } catch (err) {
      showError(err, "Échec de la désactivation");
      throw err;
    }
  };

  const publishDID = async (id: string) => {
    try {
      const response = await didService.publishDID(id);
      showSuccess("Le DID a été publié avec succès.");
      await refetch(); // Proactively refetch after publish
      return response;
    } catch (err) {
      showError(err, "Échec de la publication");
      throw err;
    }
  };

  return {
    dids: filteredDIDs,
    isLoading,
    error: apiError,
    searchQuery,
    setSearchQuery,
    refreshDIDs: refetch,
    deactivateDID,
    publishDID,
    clearError,
    pagination: {
      ...pagination,
      setPage,
      setPageSize,
    },
  };
}
