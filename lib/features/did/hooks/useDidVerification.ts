import { resolveDidUrl } from "../domain/resolveDidUrl";
import { fetchDidDocument, DidDocument } from "../infrastructure/didHttpClient";

export type DidVerificationResult = {
  did: string;
  document: DidDocument;
  url: string;
};

export type DidVerificationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: DidVerificationResult };

import { useState } from "react";

export function useDidVerification() {
  const [state, setState] = useState<DidVerificationState>({
    status: "idle",
  });

  const verify = async (input: string) => {
    if (!input.trim()) return;

    setState({ status: "loading" });

    try {
      const url = resolveDidUrl(input);
      const document = await fetchDidDocument(url);

      setState({
        status: "success",
        data: {
          did: (document as { id?: string }).id ?? input,
          document,
          url,
        },
      });
    } catch (e) {
      setState({
        status: "error",
        error: e instanceof Error ? e.message : "Failed to verify DID",
      });
    }
  };

  return { state, verify };
}
