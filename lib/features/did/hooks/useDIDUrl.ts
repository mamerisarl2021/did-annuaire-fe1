import { useState } from "react";

export type DIDUrlTabType = "request" | "response" | "error";
export type DIDUrlOperation = "CREATE" | "UPDATE" | "DEACTIVATE";

export function useDIDUrl(didId: string) {
  const [activeTab, setActiveTab] = useState<DIDUrlTabType>("request");
  const [operation, setOperation] = useState<DIDUrlOperation>("CREATE");
  const [relativeDidUrl, setRelativeDidUrl] = useState("/resources/123");
  const [options, setOptions] = useState("{}");
  const [secret, setSecret] = useState("{}");
  const [content, setContent] = useState("");
  const [contentOperations, setContentOperations] = useState("[]");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleExecute = async () => {
    setIsSubmitting(true);
    setError("");
    setResponse("");

    try {
      // Simulate API call for DID URL operation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = {
        jobId: Math.random().toString(36).substring(7),
        didUrl: `${didId}${relativeDidUrl}`,
        operation,
        status: "action-required",
        action: "redirect",
        timestamp: new Date().toISOString(),
      };

      setResponse(JSON.stringify(res, null, 2));
      setActiveTab("response");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unknown error occurred";
      setError(`Operation failed: ${message}`);
      setActiveTab("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    didId,
    activeTab,
    setActiveTab,
    operation,
    setOperation,
    relativeDidUrl,
    setRelativeDidUrl,
    options,
    setOptions,
    secret,
    setSecret,
    content,
    setContent,
    contentOperations,
    setContentOperations,
    handleExecute,
    isSubmitting,
    response,
    error,
  };
}
