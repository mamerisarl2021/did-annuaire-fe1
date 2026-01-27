"use client";

import { useQuery } from "@tanstack/react-query";
import { didService } from "../services/did.service";
import { DID, DIDDocument } from "../types";

/**
 * Hook to fetch a single DID by ID
 * Used in edit pages and detail views
 */
export function useDID(didId: string, environment: "draft" | "prod" = "prod") {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["did", didId, environment],
    queryFn: async () => {
      const data = await didService.getDID(didId, environment);

      if (!data || !data.didState) {
        throw new Error("DID not found");
      }

      // Map to DID type
      const mappedDid: DID = {
        id: data.didState.did || "",
        method: "WEB",
        didDocument: data.didState.didDocument || ({} as DIDDocument),
        created: new Date().toISOString(),
        organization_id: data.didState.organization_id,
        owner_id: data.didState.owner_id,
        document_type: data.didDocumentMetadata?.document_type || "document",
        public_key_version: data.didDocumentMetadata?.key?.public_key_version,
        public_key_jwk: data.didDocumentMetadata?.key?.public_key_jwk,
        metadata: {
          version: data.didDocumentMetadata?.versionId,
          environment: data.didState.environment,
          certificate_id: data.didDocumentMetadata?.key?.certificate?.id,
          options: data.didDocumentMetadata?.key?.purposes,
        },
      };

      return mappedDid;
    },
    enabled: !!didId && didId !== "undefined",
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  return {
    did: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
