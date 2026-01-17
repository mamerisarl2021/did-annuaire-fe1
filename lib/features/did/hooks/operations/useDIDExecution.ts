import { didApiClient } from "../../api/didApiClient";
import type { DIDState } from "../state/useDIDState";

export interface DIDExecution {
  executeAction: () => Promise<void>;
}

export function useDIDExecution(state: DIDState): DIDExecution {
  const {
    mode,
    didDocument,
    isCompiled,
    organizationId,
    logicalIdentifier,
    certificateKey,
    setIsSubmitting,
    setResponse,
    setError,
    setActiveTab,
  } = state;

  const executeAction = async () => {
    if (!isCompiled) {
      setError("Please compile the DID first.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      if (mode === "create") {
        if (!certificateKey) {
          throw new Error("No certificate found. Cannot create DID.");
        }
        const payload = {
          organization_id: organizationId,
          document_type: logicalIdentifier,
          certificate_id: certificateKey.certificate_id,
          key_id: certificateKey.key_id,
          purposes: state.selectedOptions,
          owner_id: state.ownerId || "",
          services: [],
          keys: [],
        };

        const result = await didApiClient.createDID(payload);

        if (result.didState.state === "wait") {
          setResponse(JSON.stringify(result, null, 2));
          setActiveTab("response");
        } else if (result.didState.state === "error") {
          throw new Error(result.didState.reason || "DID creation failed");
        } else {
          setResponse(JSON.stringify(result, null, 2));
          setActiveTab("response");
        }
      } else {
        const parsedDoc = JSON.parse(didDocument);
        setResponse(
          JSON.stringify(
            { message: "Update not yet fully integrated with backend", doc: parsedDoc },
            null,
            2
          )
        );
        setActiveTab("response");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(`Execution failed: ${message}`);
      setActiveTab("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    executeAction,
  };
}
