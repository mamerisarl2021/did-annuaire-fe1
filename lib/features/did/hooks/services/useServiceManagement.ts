import { useCallback } from "react";
import { Service } from "../../types";
import type { DIDState } from "../state/useDIDState";

export interface ServiceManagement {
  handleAddService: (service: Service) => void;
}

export function useServiceManagement(state: DIDState): ServiceManagement {
  const { didDocument, setDidDocument, setIsCompiled } = state;

  const handleAddService = useCallback(
    (service: Service) => {
      try {
        const doc = JSON.parse(didDocument);
        if (!doc.service) doc.service = [];

        doc.service.push({
          id: service.id,
          type: service.type,
          serviceEndpoint: service.serviceEndpoint,
        });

        setDidDocument(JSON.stringify(doc, null, 2));
        setIsCompiled(false);
      } catch (e) {
        console.error("Error adding service:", e);
      }
    },
    [didDocument, setDidDocument, setIsCompiled]
  );

  return {
    handleAddService,
  };
}
