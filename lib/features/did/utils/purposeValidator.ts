import { OptionKey } from "../types";

/**
 * Purpose validation rules by key type
 * Based on W3C DID specification and cryptographic standards
 */
const PURPOSE_RULES: Record<string, OptionKey[]> = {
  // Ed25519: Signature keys
  Ed25519: ["authentication", "assertionMethod", "capabilityInvocation", "capabilityDelegation"],
  // X25519: Key agreement only
  X25519: ["keyAgreement"],
  // P-256: All purposes
  "P-256": [
    "authentication",
    "assertionMethod",
    "keyAgreement",
    "capabilityInvocation",
    "capabilityDelegation",
  ],
  // RSA: Signature keys (no key agreement)
  RSA: ["authentication", "assertionMethod", "capabilityInvocation"],
};

/**
 * Validate purposes against key type
 */
export function validatePurposes(
  jwk: { kty: string; crv?: string },
  purposes: OptionKey[]
): { valid: boolean; errors: string[] } {
  const keyType = jwk.crv || jwk.kty;
  const allowedPurposes = PURPOSE_RULES[keyType];

  if (!allowedPurposes) {
    return {
      valid: false,
      errors: [`Unknown key type: ${keyType}`],
    };
  }

  const errors: string[] = [];
  purposes.forEach((purpose) => {
    if (!allowedPurposes.includes(purpose)) {
      errors.push(`Purpose "${purpose}" is not allowed for ${keyType} keys`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get default purposes for a key type
 */
export function getDefaultPurposes(jwk: { kty: string; crv?: string }): OptionKey[] {
  const keyType = jwk.crv || jwk.kty;
  return PURPOSE_RULES[keyType] || [];
}

/**
 * Get allowed purposes for a key type
 */
export function getAllowedPurposes(jwk: { kty: string; crv?: string }): OptionKey[] {
  const keyType = jwk.crv || jwk.kty;
  return PURPOSE_RULES[keyType] || [];
}
