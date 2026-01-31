"use client";

import { useState } from "react";
import { organizationService } from "../services/organization.service";
import { type OrgCreatePayload } from "../types/organization.types";
import { ApiException } from "@/lib/shared/api/api.errors";

export function useCreateOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrganization = async (payload: OrgCreatePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await organizationService.createOrganization(payload);
      return response;
    } catch (err) {
      const message = ApiException.getMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
    error,
  };
}
