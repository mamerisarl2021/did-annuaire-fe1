import { useState } from "react";
import { MethodType, TabType, DIDMode, OptionKey } from "../../types";
import type { CertificateKey } from "../../types/certificate.types";

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
  certificateKey: CertificateKey | null;

  setMode: (mode: DIDMode) => void;
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
  setCertificateKey: (key: CertificateKey | null) => void;
}

export function useDIDState(initialMode: DIDMode = "create"): DIDState {
  const [mode, setMode] = useState<DIDMode>(initialMode);
  const [selectedMethod] = useState<MethodType>("WEB");
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
  const [certificateKey, setCertificateKey] = useState<CertificateKey | null>(null);

  const toggleOption = (option: OptionKey) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
    setIsCompiled(false);
  };

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
    certificateKey,
    setMode,
    setLogicalIdentifier,
    setDidDocument,
    setSelectedOptions,
    toggleOption,
    setActiveTab,
    setIsSubmitting,
    setIsCompiled,
    setResponse,
    setError,
    setOrganizationId,
    setCertificateKey,
  };
}
