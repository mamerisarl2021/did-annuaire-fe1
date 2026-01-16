import { useState } from "react";
import { MethodType, TabType, Service, DID, VerificationMethod } from "../types";
import { didService } from "../services";
import { logger } from "@/lib/shared/services/logger.service";

const INITIAL_DID_DOCUMENT = JSON.stringify(
  {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
    verificationMethod: [],
    authentication: [],
    assertionMethod: [],
    keyAgreement: [],
    service: [],
  },
  null,
  2
);

export function useDIDCreator() {
  const [selectedMethod, setSelectedMethod] = useState<MethodType>("WEB");
  const [activeTab, setActiveTab] = useState<TabType>("request");
  const [didDocument, setDidDocument] = useState<string>(INITIAL_DID_DOCUMENT);
  const [options, setOptions] = useState("{}");
  const [secret, setSecret] = useState("{}");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [hasCreatedDID, setHasCreatedDID] = useState(false);

  const handleAddKeys = (keys: VerificationMethod[]) => {
    try {
      const doc = JSON.parse(didDocument);
      const didId = doc.id || "did:web:example.com";

      if (!doc.verificationMethod) doc.verificationMethod = [];

      keys.forEach((key: VerificationMethod, index: number) => {
        const keyId = `${didId}${key.id || `#key-${doc.verificationMethod.length + index}`}`;
        doc.verificationMethod.push({
          id: keyId,
          type: key.type,
          controller: didId,
          publicKeyJwk: key.publicKeyJwk,
        });

        if (key.publicKeyJwk.crv === "Ed25519" || key.publicKeyJwk.crv === "P-256") {
          if (!doc.authentication) doc.authentication = [];
          if (!doc.assertionMethod) doc.assertionMethod = [];
          doc.authentication.push(keyId);
          doc.assertionMethod.push(keyId);
        }

        if (key.publicKeyJwk.crv === "X25519" || key.publicKeyJwk.crv === "P-256") {
          if (!doc.keyAgreement) doc.keyAgreement = [];
          doc.keyAgreement.push(keyId);
        }
      });

      setDidDocument(JSON.stringify(doc, null, 2));
    } catch (e) {
      logger.error("Error adding keys to DID document", e);
    }
  };

  const handleAddService = (service: Service) => {
    try {
      const doc = JSON.parse(didDocument);
      if (!doc.service) {
        doc.service = [];
      }
      doc.service.push({
        id: service.id,
        type: service.type,
        serviceEndpoint: service.serviceEndpoint,
      });
      setDidDocument(JSON.stringify(doc, null, 2));
    } catch (e) {
      logger.error("Error adding service to DID document", e);
    }
  };

  const createDID = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const parsedDoc = JSON.parse(didDocument);
      const parsedOptions = JSON.parse(options);
      const parsedSecret = JSON.parse(secret);

      const res = await didService.createDID({
        method: selectedMethod,
        didDocument: parsedDoc,
        options: parsedOptions,
        secret: parsedSecret,
      });

      setResponse(JSON.stringify(res, null, 2));
      setHasCreatedDID(true);
      setActiveTab("response");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(`Invalid JSON format or API error: ${message}`);
      setActiveTab("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDID = (did: DID) => {
    if (!did) return;

    setSelectedMethod(did.method || "WEB");
    setDidDocument(JSON.stringify(did.didDocument || {}, null, 2));
    setOptions(JSON.stringify(did.metadata?.options || {}, null, 2));
    setSecret(JSON.stringify(did.metadata?.secret || {}, null, 2));
    setHasCreatedDID(false);
    setActiveTab("request");
    setError("");
    setResponse("");
  };

  const resetCreator = () => {
    setSelectedMethod("WEB");
    setDidDocument(INITIAL_DID_DOCUMENT);
    setOptions("{}");
    setSecret("{}");
    setHasCreatedDID(false);
    setActiveTab("request");
    setError("");
    setResponse("");
  };

  return {
    selectedMethod,
    setSelectedMethod,
    didDocument,
    setDidDocument,
    options,
    setOptions,
    secret,
    setSecret,
    activeTab,
    setActiveTab,
    createDID,
    loadDID,
    resetCreator,
    handleAddKeys,
    handleAddService,
    response,
    error,
    hasCreatedDID,
    isSubmitting,
  };
}
