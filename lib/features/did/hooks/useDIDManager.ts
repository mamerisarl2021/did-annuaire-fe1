import { useCallback } from "react";
import { DID, DIDMode } from "../types";
import { useDIDState } from "./state/useDIDState";
import { useServiceManagement } from "./services/useServiceManagement";
import { useDIDCompilation } from "./operations/useDIDCompilation";
import { useDIDExecution } from "./operations/useDIDExecution";
import { didMapper } from "../mappers/did.mapper";

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
      setLogicalIdentifier(didMapper.extractLogicalId(did));

      const certId = didMapper.extractCertificateId(did);
      if (certId) setInitialCertificateId(certId);

      setDidDocument(didMapper.extractDidDocument(did));

      const purposes = didMapper.extractPurposes(did);
      setSelectedOptions(purposes);

      const certKey = didMapper.extractCertificateKey(did, purposes);
      if (certKey) setCertificateKey(certKey);

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
