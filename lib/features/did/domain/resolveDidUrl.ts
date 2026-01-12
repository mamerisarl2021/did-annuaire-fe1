export function resolveDidUrl(input: string): string {
  const trimmed = input.trim();

  if (trimmed.startsWith("did:web:")) {
    const parts = trimmed.replace("did:web:", "").split(":");
    const domain = parts[0].replace(/%3A/g, ":");
    const path = parts.slice(1).join("/");
    return `https://${domain}/${path}/did.json`;
  }

  if (!trimmed.endsWith("/did.json")) {
    return trimmed.endsWith("/") ? `${trimmed}did.json` : `${trimmed}/did.json`;
  }

  return trimmed;
}
