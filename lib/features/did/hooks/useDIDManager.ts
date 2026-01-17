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

  // loadDID function - orchestration logic
  const loadDID = (did: DID, newMode: DIDMode = "update") => {
    if (!did) return;
    state.setMode(newMode);

    // Extract logical identifier from DID ID (did:web:domain -> domain)
    const idParts = did.id.split(":");
    if (idParts.length >= 3) {
      state.setLogicalIdentifier(idParts.slice(2).join(":"));
    }

    state.setDidDocument(JSON.stringify(did.didDocument || {}, null, 2));

    // Map existing options if possible
    const purposes: OptionKey[] = [];
    if (did.metadata?.options) {
      const opts = did.metadata.options as Record<string, unknown>;
      (Object.keys(opts) as OptionKey[]).forEach((k) => {
        if (
          [
            "authentication",
            "assertionMethod",
            "keyAgreement",
            "capabilityInvocation",
            "capabilityDelegation",
          ].includes(k)
        ) {
          purposes.push(k);
        }
      });
    }
    state.setSelectedOptions(purposes);

    state.setIsCompiled(false);
    state.setActiveTab("request");
    state.setError("");
    state.setResponse("");
  };

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

    // Operations
    compileDID: compilation.compileDID,
    executeAction: execution.executeAction,
    loadDID,

    // Management
    handleAddService: serviceManagement.handleAddService,
  };
}
