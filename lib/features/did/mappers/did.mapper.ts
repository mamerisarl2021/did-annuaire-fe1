import { type DID, type OptionKey } from "../types";
import { type CertificateKey } from "../types/certificate.types";

const VALID_PURPOSES: OptionKey[] = [
  "authentication",
  "assertionMethod",
  "keyAgreement",
  "capabilityInvocation",
  "capabilityDelegation",
];

export const didMapper = {
  extractLogicalId(did: DID): string {
    if (!did?.id) return "";
    const idParts = did.id.split(":");
    return idParts.length > 0 ? idParts[idParts.length - 1] : "";
  },

  extractCertificateId(did: DID): string | undefined {
    return did.metadata?.certificate_id as string | undefined;
  },

  extractDidDocument(did: DID): string {
    return JSON.stringify(did.didDocument || {}, null, 2);
  },

  extractPurposes(did: DID): OptionKey[] {
    const purposes: OptionKey[] = [];
    const opts = did.metadata?.options;

    if (!opts) return purposes;

    if (Array.isArray(opts)) {
      opts.forEach((item: string) => {
        if (VALID_PURPOSES.includes(item as OptionKey)) {
          purposes.push(item as OptionKey);
        }
      });
    } else if (typeof opts === "object" && opts !== null) {
      (Object.keys(opts) as OptionKey[]).forEach((k) => {
        if (VALID_PURPOSES.includes(k)) {
          purposes.push(k);
        }
      });
    }

    return purposes;
  },

  extractCertificateKey(did: DID, purposes: OptionKey[]): CertificateKey | null {
    if (!did.public_key_jwk) return null;

    const certificateId = this.extractCertificateId(did) || "";

    return {
      certificate_id: certificateId,
      extracted_jwk: did.public_key_jwk as { kty: string; [key: string]: unknown },
      purposes,
    };
  },
};
