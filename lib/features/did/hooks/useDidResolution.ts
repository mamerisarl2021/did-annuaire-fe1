import { useState } from "react";
import { didApiClient } from "../api/didApiClient";
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
  const [state, setState] = useState<DidResolutionState>({
    status: "idle",
  });

  const resolve = async (input: string) => {
    if (!input.trim()) return;

    setState({ status: "loading" });

    try {
      const response = await didApiClient.resolveDID(input);

      const didMeta = response.didResolutionMetadata;

      setState({
        status: "success",
        data: {
          did: didMeta.did?.didString || input,
          document: response.didDocument,
          url: didMeta.driverUrl || "",
          resolutionResponse: response,
        },
      });
    } catch (e) {
      setState({
        status: "error",
        error: e instanceof Error ? e.message : "Failed to resolve DID",
      });
    }
  };

  return { state, resolve };
}
