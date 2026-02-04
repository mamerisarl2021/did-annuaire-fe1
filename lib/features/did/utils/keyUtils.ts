import { OptionKey, JWK } from "../types";

/**
 * Mapping of Key Types to allowed DID Key Purposes
 * Based on security best practices and cryptographic capabilities
 */
export const KEY_ALLOWED_PURPOSES: Record<string, OptionKey[]> = {
    ED25519: ["authentication", "assertionMethod", "capabilityInvocation", "capabilityDelegation"],
    X25519: ["keyAgreement"],
    "P-256": ["authentication", "assertionMethod", "keyAgreement", "capabilityInvocation", "capabilityDelegation"],
    "P-384": ["authentication", "assertionMethod", "keyAgreement", "capabilityInvocation", "capabilityDelegation"],
    "P-521": ["authentication", "assertionMethod", "keyAgreement", "capabilityInvocation", "capabilityDelegation"],
    RSA: ["authentication", "assertionMethod", "capabilityInvocation"],
};

/**
 * Identifies the human-readable key type label from a JWK
 */
export function getKeyTypeLabel(jwk: JWK): string | null {
    if (jwk.kty === "RSA") return "RSA";

    if (jwk.kty === "OKP") {
        if (jwk.crv === "Ed25519") return "ED25519";
        if (jwk.crv === "X25519") return "X25519";
    }

    if (jwk.kty === "EC") {
        if (jwk.crv === "P-256") return "P-256";
        if (jwk.crv === "P-384") return "P-384";
        if (jwk.crv === "P-521") return "P-521";
    }

    return null;
}

/**
 * Returns the list of allowed DID purposes for a given JWK.
 * If no JWK is provided, all purposes are allowed by default.
 */
export function getAllowedPurposes(jwk: JWK | null): OptionKey[] | null {
    if (!jwk) return null;

    const label = getKeyTypeLabel(jwk);
    if (!label) return null;

    return KEY_ALLOWED_PURPOSES[label] || null;
}
