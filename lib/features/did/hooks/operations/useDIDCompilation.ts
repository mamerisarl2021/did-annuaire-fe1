import { didApiClient } from "../../api/didApiClient";
import type { DIDState } from "../state/useDIDState";

export interface DIDCompilation {
  compileDID: () => Promise<void>;
}

export function useDIDCompilation(state: DIDState): DIDCompilation {
  const {
    logicalIdentifier,
    organizationId,
    certificateKey,
    setDidDocument,
    setIsCompiled,
    setIsSubmitting,
    setError,
    setActiveTab,
  } = state;

  const compileDID = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      if (!logicalIdentifier) throw new Error("Logical Identifier is required.");
      if (certificateKey) {
        const params = {
          organization_id: organizationId || "",
          document_type: logicalIdentifier,
          certificate_id: certificateKey.certificate_id,
          key_id: certificateKey.key_id,
          purposes: state.selectedOptions,
        };

        const response = await didApiClient.previewDID(params);

        if (response.didState.state === "action" && response.didState.didDocument) {
          setDidDocument(JSON.stringify(response.didState.didDocument, null, 2));
          setIsCompiled(true);
        } else if (response.didState.state === "error") {
          throw new Error(response.didState.reason || "Compilation failed");
        }
      } else {
        throw new Error("Please upload at least one certificate before compiling.");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(`Compilation failed: ${message}`);
      setIsCompiled(false);
      setActiveTab("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    compileDID,
  };
}
