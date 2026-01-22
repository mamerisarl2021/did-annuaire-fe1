/**
 * Truncates a DID identifier for display purposes
 * @param did - The full DID identifier (e.g., "did:web:annuairedid-fe.qcdigitalhub.com:yawning:eabd6245-b735-4fa9-8448-a42d9abb09f2:permis_conduire_qrcode")
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Truncated DID (e.g., "did:web:annuairedid-fe.qcdigitalhub.com:yawning..")
 */
export function truncateDID(did: string, maxLength: number = 50): string {
  if (!did || did.length <= maxLength) {
    return did;
  }

  // Split by colon to preserve the DID structure
  const parts = did.split(":");

  // Always keep did:method:domain
  if (parts.length <= 3) {
    return did;
  }

  // Build the truncated version: did:method:domain:first_segment..
  const prefix = parts.slice(0, 4).join(":");

  return `${prefix}..`;
}
