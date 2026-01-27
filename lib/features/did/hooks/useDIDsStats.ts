"use client";

import { useState, useEffect, useCallback } from "react";
import { didService } from "../services/did.service";
import { type DIDStats } from "../types";

export function useDIDsStats() {
  const [stats, setStats] = useState<DIDStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await didService.getDIDsStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch DIDs stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refresh: fetchStats };
}
