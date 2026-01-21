import { useCallback } from "react";
import { DID, DIDMode, OptionKey } from "../types";
import { useDIDState } from "./state/useDIDState";
import { useServiceManagement } from "./services/useServiceManagement";
import { useDIDCompilation } from "./operations/useDIDCompilation";
import { useDIDExecution } from "./operations/useDIDExecution";

export function useDIDManager(initialMode: DIDMode = "create") {
  // Initialize state
  const state = useDIDState(initialMode);

  // Initialize specialized hooks
  const serviceManagement = useServiceManagement(state);
  const compilation = useDIDCompilation(state);
  const execution = useDIDExecution(state);

  const {
    setMode,
    setLogicalIdentifier,
    setDidDocument,
    setSelectedOptions,
    setIsCompiled,
    setActiveTab,
    setError,
    setResponse,
    setCertificateKey,
    setInitialCertificateId,
  } = state;

  // loadDID function - orchestration logic
  const loadDID = useCallback(
    (did: DID, newMode: DIDMode = "update") => {
      if (!did) return;
      setMode(newMode);

      if (did.id) {
        const idParts = did.id.split(":");
        if (idParts.length > 0) {
          setLogicalIdentifier(idParts[idParts.length - 1]);
        }
      }

      if (did.metadata?.certificate_id) {
        setInitialCertificateId(did.metadata.certificate_id as string);
      }

      setDidDocument(JSON.stringify(did.didDocument || {}, null, 2));

      const purposes: OptionKey[] = [];
      if (did.metadata?.options) {
        const opts = did.metadata.options;
        const VALID_PURPOSES = [
          "authentication",
          "assertionMethod",
          "keyAgreement",
          "capabilityInvocation",
          "capabilityDelegation",
        ];

        if (Array.isArray(opts)) {
          opts.forEach((item: string) => {
            if (VALID_PURPOSES.includes(item)) {
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
      }
      setSelectedOptions(purposes);

      if (did.public_key_jwk) {
        setCertificateKey({
          certificate_id: (did.metadata?.certificate_id as string) || "",
          extracted_jwk: did.public_key_jwk as { kty: string;[key: string]: unknown },
          purposes: purposes,
        });
      }

      setIsCompiled(false);
      setActiveTab("request");
      setError("");
      setResponse("");
    },
    [
      setMode,
      setLogicalIdentifier,
      setInitialCertificateId,
      setDidDocument,
      setSelectedOptions,
      setCertificateKey,
      setIsCompiled,
      setActiveTab,
      setError,
      setResponse,
    ]
  );

  // Return combined interface
  return {
    // State
    mode: state.mode,
    setMode: state.setMode,
    selectedMethod: state.selectedMethod,
    setSelectedMethod: state.setSelectedMethod,
    logicalIdentifier: state.logicalIdentifier,
    setLogicalIdentifier: state.setLogicalIdentifier,
    didDocument: state.didDocument,
    setDidDocument: state.setDidDocument,
    selectedOptions: state.selectedOptions,
    toggleOption: state.toggleOption,
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    isSubmitting: state.isSubmitting,
    isCompiled: state.isCompiled,
    response: state.response,
    error: state.error,

    // API State
    organizationId: state.organizationId,
    setOrganizationId: state.setOrganizationId,
    ownerId: state.ownerId,
    setOwnerId: state.setOwnerId,
    certificateKey: state.certificateKey,
    setCertificateKey: state.setCertificateKey,
    initialCertificateId: state.initialCertificateId,

    // Operations
    compileDID: compilation.compileDID,
    executeAction: execution.executeAction,
    loadDID,

    // Management
    handleAddService: serviceManagement.handleAddService,
  };
}
