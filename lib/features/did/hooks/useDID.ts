"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";
import { didService } from "../services/did.service";
import { DID, DIDDocument } from "../types";

/**
 * Hook to fetch a single DID by ID
 * Used in edit pages and detail views
 */
export function useDID(didId: string, environment?: "draft" | "prod", version?: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["did", didId, environment, version],
    queryFn: async () => {
      let result;
      let usedEnv = environment;

      if (environment) {
        result = await didService.getDID(didId, environment, version);
      } else {
        try {
          usedEnv = "draft";
          result = await didService.getDID(didId, "draft", version);
        } catch (err) {
          console.warn("Draft not found, attempting prod fetch...", err);
          usedEnv = "prod";
          result = await didService.getDID(didId, "prod", version);
        }
      }

      if (!result || !result.didState) {
        throw new Error("DID not found");
      }

      const data = result;

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
          version: data.didDocumentMetadata?.version,
          environment: data.didState.environment || usedEnv,
          certificate_id: data.didDocumentMetadata?.key?.certificate?.id,
          options: data.didDocumentMetadata?.key?.purposes,
        },
        is_published: data.didDocumentMetadata?.published,
      };

      return mappedDid;
    },
    enabled: !!didId && didId !== "undefined",
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
    retry: false,
  });

  return {
    did: data || null,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
