import { useState, useEffect } from "react";
import { didApiClient } from "../api/didApiClient";
import type { DIDMethod } from "../types/api.types";
import { logger } from "@/lib/shared/services/logger.service";

export interface UseDIDMethodsReturn {
  methods: DIDMethod[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage the list of supported DID methods from the backend.
 */
export function useDIDMethods(): UseDIDMethodsReturn {
  const [methods, setMethods] = useState<DIDMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMethods() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await didApiClient.getDIDMethods();
        setMethods(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load DID methods";
        logger.error("[useDIDMethods] Error:", message);
        setError(message);
        setMethods(["web"]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMethods();
  }, []);

  return { methods, isLoading, error };
}
