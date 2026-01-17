"use client";

import { useState, useCallback } from "react";
import { auditService } from "../services/audit.service";
import { type AuditAction } from "../types/audit.types";

export function useAuditDetails() {
    const [selectedAudit, setSelectedAudit] = useState<AuditAction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const details = await auditService.getAuditActionDetails(id);
            setSelectedAudit(details);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch audit details");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearDetails = useCallback(() => {
        setSelectedAudit(null);
        setError(null);
    }, []);

    return {
        selectedAudit,
        isLoading,
        error,
        fetchDetails,
        clearDetails,
    };
}
