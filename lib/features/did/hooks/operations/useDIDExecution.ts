import { didService } from "../../services/did.service";
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
          purposes: state.selectedOptions,
          owner_id: state.ownerId || "",
          services: [],
          keys: [],
        };

        const result = await didService.createDID(payload);
        setResponse(JSON.stringify(result, null, 2));
        setActiveTab("response");
      } else if (mode === "update") {
        const doc = JSON.parse(didDocument);
        const didId = doc.id;

        if (!didId) throw new Error("DID ID missing in document.");

        const certId = certificateKey?.certificate_id || state.initialCertificateId || "";

        if (!certId) {
          throw new Error("Missing Certificate ID for rotation.");
        }

        const result = await didService.rotateKey(didId, {
          certificate_id: certId,
          purposes: state.selectedOptions,
        });

        setResponse(JSON.stringify(result, null, 2));
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
