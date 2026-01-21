import { OptionKey } from "../types";

/**
 * Mirror of backend _detect_key_kind logic
 */
export function detectKeyKind(jwk: { kty: string; crv?: string }): string {
  const { kty, crv } = jwk;
  if (kty === "OKP" && crv === "Ed25519") return "ED25519";
  if (kty === "OKP" && crv === "X25519") return "X25519";
  if (kty === "EC" && (crv === "P-256" || crv === "secp256r1")) return "P-256";
  if (kty === "EC" && (crv === "P-384" || crv === "secp384r1")) return "P-384";
  if (kty === "EC" && (crv === "P-521" || crv === "secp521r1")) return "P-521";
  if (kty === "RSA") return "RSA";
  return "UNKNOWN";
}

const ALL_PURPOSES: OptionKey[] = [
  "authentication",
  "assertionMethod",
  "keyAgreement",
  "capabilityInvocation",
  "capabilityDelegation",
];

/**
 * Validate purposes against key type (Disabled: always valid)
 */
export function validatePurposes(
  _jwk: { kty: string; crv?: string },
  _purposes: OptionKey[]
): { valid: boolean; errors: string[] } {
  return {
    valid: true,
    errors: [],
  };
}

/**
 * Get default purposes for a key type (Returns all)
 */
export function getDefaultPurposes(_jwk: { kty: string; crv?: string }): OptionKey[] {
  return ["authentication", "assertionMethod"]; // Sensible default for UI
}

/**
 * Get allowed purposes for a key type (Returns all)
 */
export function getAllowedPurposes(_jwk: { kty: string; crv?: string }): OptionKey[] {
  return ALL_PURPOSES;
}
