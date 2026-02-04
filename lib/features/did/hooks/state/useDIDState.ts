import { useState, useCallback } from "react";
import { MethodType, TabType, DIDMode, OptionKey } from "../../types";
import type { CertificateKey } from "../../types/certificate.types";
import { getAllowedPurposes } from "../../utils/keyUtils";

// État initial vide pour le document DID
const EMPTY_DID_DOCUMENT = "{}";

export interface DIDState {
  // State values
  mode: DIDMode;
  selectedMethod: MethodType;
  logicalIdentifier: string;
  didDocument: string;
  selectedOptions: OptionKey[];
  activeTab: TabType;
  isSubmitting: boolean;
  isCompiled: boolean;
  response: string;
  error: string;
  organizationId: string;
  ownerId: string;
  certificateKey: CertificateKey | null;
  initialCertificateId?: string;

  setMode: (mode: DIDMode) => void;
  setSelectedMethod: (method: MethodType) => void;
  setLogicalIdentifier: (id: string) => void;
  setDidDocument: (doc: string) => void;
  setSelectedOptions: (options: OptionKey[]) => void;
  toggleOption: (option: OptionKey) => void;
  setActiveTab: (tab: TabType) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setIsCompiled: (compiled: boolean) => void;
  setResponse: (response: string) => void;
  setError: (error: string) => void;
  setOrganizationId: (id: string) => void;
  setOwnerId: (id: string) => void;
  setCertificateKey: (key: CertificateKey | null) => void;
  setInitialCertificateId: (id: string) => void;
}

export function useDIDState(initialMode: DIDMode = "create"): DIDState {
  const [mode, setMode] = useState<DIDMode>(initialMode);
  const [selectedMethod, setSelectedMethod] = useState<MethodType>("WEB");
  const [logicalIdentifier, setLogicalIdentifier] = useState("");
  const [didDocument, setDidDocument] = useState<string>(EMPTY_DID_DOCUMENT);
  const [selectedOptions, setSelectedOptions] = useState<OptionKey[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>("request");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompiled, setIsCompiled] = useState(false);

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  // API integration state
  const [organizationId, setOrganizationId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [certificateKey, setCertificateKey] = useState<CertificateKey | null>(null);
  const [initialCertificateId, setInitialCertificateId] = useState("");

  const handleSetLogicalIdentifier = useCallback((id: string) => {
    setLogicalIdentifier(id);
    setIsCompiled(false);
  }, []);

  const toggleOption = useCallback((option: OptionKey) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
    setIsCompiled(false);
  }, []);

  const handleSetCertificateKey = useCallback(
    (key: CertificateKey | null) => {
      setCertificateKey(key);
      setIsCompiled(false);

      if (key) {
        const allowed = getAllowedPurposes(key.extracted_jwk || null);
        if (allowed) {
          setSelectedOptions((prev) => prev.filter((opt) => allowed.includes(opt)));
        }
      }
    },
    [setSelectedOptions]
  );

  return {
    mode,
    selectedMethod,
    logicalIdentifier,
    didDocument,
    selectedOptions,
    activeTab,
    isSubmitting,
    isCompiled,
    response,
    error,
    organizationId,
    ownerId,
    certificateKey,
    initialCertificateId,
    setMode,
    setSelectedMethod,
    setLogicalIdentifier: handleSetLogicalIdentifier,
    setDidDocument,
    setSelectedOptions,
    toggleOption,
    setActiveTab,
    setIsSubmitting,
    setIsCompiled,
    setResponse,
    setError,
    setOrganizationId,
    setOwnerId,
    setCertificateKey: handleSetCertificateKey,
    setInitialCertificateId,
  };
}
