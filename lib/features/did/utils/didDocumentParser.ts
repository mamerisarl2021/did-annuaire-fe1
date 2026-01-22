import { type Service } from "@/lib/features/did/types";
import { logger } from "@/lib/shared/services/logger.service";

export const didDocumentParser = {
  parseServices(didDocument: string): Service[] {
    try {
      const doc = JSON.parse(didDocument);
      return (doc.service || []) as Service[];
    } catch {
      return [];
    }
  },

  removeService(didDocument: string, serviceId: string): string {
    try {
      const doc = JSON.parse(didDocument);
      doc.service = (doc.service || []).filter((s: { id: string }) => s.id !== serviceId);
      return JSON.stringify(doc, null, 2);
    } catch (e) {
      logger.error("Error removing service from DID document", e);
      return didDocument;
    }
  },
};
