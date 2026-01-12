export type DidDocument = Record<string, unknown>;

export async function fetchDidDocument(url: string): Promise<DidDocument> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to resolve DID: ${res.status}`);
  }

  return res.json();
}
