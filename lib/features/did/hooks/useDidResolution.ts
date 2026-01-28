import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { didService } from "../services/did.service";
import { DIDResolutionResponse } from "../types/api.types";
import { DIDDocument } from "../types";

export type DidResolutionResult = {
  did: string;
  document: DIDDocument;
  url: string;
  resolutionResponse?: DIDResolutionResponse;
};

export type DidResolutionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: DidResolutionResult };


export function useDidResolution() {
  const mutation = useMutation({
    mutationFn: (input: string) => didService.resolveDID(input),
  });

  const state: DidResolutionState = useMemo(() => {
    if (mutation.isIdle) return { status: "idle" };
    if (mutation.isPending) return { status: "loading" };
    if (mutation.isError) {
      return {
        status: "error",
        error: mutation.error instanceof Error ? mutation.error.message : "Failed to resolve DID",
      };
    }
    if (mutation.isSuccess && mutation.data) {
      const response = mutation.data;
      const didMeta = response.didResolutionMetadata;
      return {
        status: "success",
        data: {
          did: didMeta.did?.didString || (mutation.variables as string),
          document: response.didDocument,
          url: didMeta.driverUrl || "",
          resolutionResponse: response,
        },
      };
    }
    return { status: "idle" };
  }, [mutation.isIdle, mutation.isPending, mutation.isError, mutation.isSuccess, mutation.data, mutation.error, mutation.variables]);

  return { state, resolve: mutation.mutate };
}
