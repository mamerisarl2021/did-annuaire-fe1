import { describe, it, expect } from "vitest";
import { didMapper } from "@/lib/features/did/mappers/did.mapper";
import type { DID, OptionKey } from "@/lib/features/did/types";

describe("didMapper", () => {
  describe("extractLogicalId", () => {
    it("should extract logical ID from DID", () => {
      const did = {
        id: "did:web:example.com:users:alice",
      } as DID;

      expect(didMapper.extractLogicalId(did)).toBe("alice");
    });

    it("should return empty string for missing ID", () => {
      const did = {} as DID;
      expect(didMapper.extractLogicalId(did)).toBe("");
    });
  });

  describe("extractCertificateId", () => {
    it("should extract certificate ID from metadata", () => {
      const did = {
        metadata: {
          certificate_id: "cert-123",
        },
      } as unknown as DID;

      expect(didMapper.extractCertificateId(did)).toBe("cert-123");
    });

    it("should return undefined when missing", () => {
      const did = {} as DID;
      expect(didMapper.extractCertificateId(did)).toBeUndefined();
    });
  });

  describe("extractPurposes", () => {
    it("should extract purposes from array metadata", () => {
      const did = {
        metadata: {
          options: ["authentication", "assertionMethod", "invalid"],
        },
      } as unknown as DID;

      const purposes = didMapper.extractPurposes(did);
      expect(purposes).toEqual(["authentication", "assertionMethod"]);
      expect(purposes).not.toContain("invalid");
    });

    it("should extract purposes from object metadata", () => {
      const did = {
        metadata: {
          options: {
            authentication: true,
            keyAgreement: true,
            invalid: true,
          },
        },
      } as unknown as DID;

      const purposes = didMapper.extractPurposes(did);
      expect(purposes).toContain("authentication");
      expect(purposes).toContain("keyAgreement");
      expect(purposes).not.toContain("invalid");
    });

    it("should return empty array when no options", () => {
      const did = {} as DID;
      expect(didMapper.extractPurposes(did)).toEqual([]);
    });
  });

  describe("extractCertificateKey", () => {
    it("should extract certificate key with purposes", () => {
      const did = {
        public_key_jwk: { kty: "EC", crv: "P-256" },
        metadata: {
          certificate_id: "cert-123",
        },
      } as unknown as DID;

      const purposes: OptionKey[] = ["authentication", "assertionMethod"];
      const result = didMapper.extractCertificateKey(did, purposes);

      expect(result).toEqual({
        certificate_id: "cert-123",
        extracted_jwk: { kty: "EC", crv: "P-256" },
        purposes,
      });
    });

    it("should return null when no public key", () => {
      const did = {} as DID;
      const purposes: OptionKey[] = ["authentication"];

      expect(didMapper.extractCertificateKey(did, purposes)).toBeNull();
    });
  });
});
