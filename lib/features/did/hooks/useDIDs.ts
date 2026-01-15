"use client";

import { useState, useEffect, useMemo } from "react";
import { DID } from "../types";
import { didService } from "../services";
import { logger } from "@/lib/shared/services/logger.service";

export function useDIDs() {
  const [dids, setDids] = useState<DID[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDIDs = async () => {
    setIsLoading(true);
    try {
      const data = await didService.getDIDs();
      setDids(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch DIDs");
      logger.error("Failed to fetch DIDs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDIDs();
  }, []);

  const filteredDIDs = useMemo(() => {
    if (!searchQuery) return dids;
    const lowerQuery = searchQuery.toLowerCase();
    return dids.filter(
      (did) =>
        did.id.toLowerCase().includes(lowerQuery) || did.method.toLowerCase().includes(lowerQuery)
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
  };
}
