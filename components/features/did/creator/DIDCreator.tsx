"use client";

import React, { useEffect } from "react";
import { useDIDManager } from "@/lib/features/did/hooks/useDIDManager";
import { TabType, DIDMode, DID } from "@/lib/features/did/types";
import { didDocumentParser } from "@/lib/features/did/utils/didDocumentParser";
import { DIDCreatorLayout } from "./layout/DIDCreatorLayout";
import { DIDMethodSection } from "./sections/DIDMethodSection";
import { DIDDocumentSection } from "./sections/DIDDocumentSection";
import { KeyPurposesSection } from "./sections/KeyPurposesSection";
import { DIDCreatorFooter } from "./sections/DIDCreatorFooter";
import { DIDResponseSection } from "./sections/DIDResponseSection";
import { ServiceModal } from "./ServiceModal";
import { CertificateModal } from "./CertificateModal";
import { getAllowedPurposes } from "@/lib/features/did/utils/keyUtils";

export interface DIDCreatorProps {
  mode: DIDMode;
  initialDid?: DID | null;
  organizationId: string;
  ownerId?: string;
  onClose?: () => void;
}

export function DIDCreator({
  mode: initialMode,
  initialDid,
  organizationId,
  ownerId,
}: DIDCreatorProps) {
  const manager = useDIDManager(initialMode);

  const {
    mode,
    logicalIdentifier,
    setLogicalIdentifier,
    didDocument,
    setDidDocument,
    selectedOptions,
    toggleOption,
    activeTab,
    setActiveTab,
    compileDID,
    executeAction,
    certificateKey,
    setCertificateKey,
    setOrganizationId,
    setOwnerId,
    handleAddService,
    loadDID,
    response,
    error,
    isSubmitting,
    isCompiled,
  } = manager;

  useEffect(() => {
    if (organizationId) {
      setOrganizationId(organizationId);
    }
    if (ownerId) {
      setOwnerId(ownerId);
    }
  }, [organizationId, ownerId, setOrganizationId, setOwnerId]);

  useEffect(() => {
    if (initialDid) {
      loadDID(initialDid, initialMode);
    }
  }, [initialDid, initialMode, loadDID]);

  const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = React.useState(false);

  const services = didDocumentParser.parseServices(didDocument);

  const handleRemoveService = (serviceId: string) => {
    const updatedDocument = didDocumentParser.removeService(didDocument, serviceId);
    setDidDocument(updatedDocument);
  };

  const responseElement = response ? <DIDResponseSection response={response} /> : null;

  const errorElement = error ? (
    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 rounded-lg">
      <p className="text-red-700 dark:text-red-400 font-mono text-xs whitespace-pre-wrap">
        {error}
      </p>
    </div>
  ) : null;

  return (
    <div className="h-full">
      <DIDCreatorLayout
        activeTab={activeTab}
        onTabChange={(v) => setActiveTab(v as TabType)}
        response={responseElement}
        error={errorElement}
      >
        <div className="flex flex-col h-full gap-2 p-4">
          {/* Section: Method Discovery */}
          <DIDMethodSection
            logicalIdentifier={logicalIdentifier}
            onLogicalIdentifierChange={setLogicalIdentifier}
            mode={mode}
            selectedMethod={manager.selectedMethod}
            onMethodChange={manager.setSelectedMethod}
          />

          {/* Section: DID Document Editor */}
          <DIDDocumentSection
            didDocument={didDocument}
            services={services}
            certificateKey={certificateKey}
            onDocumentChange={setDidDocument}
            onAddService={() => setIsServiceModalOpen(true)}
            onRemoveService={handleRemoveService}
            onAddCertificate={() => setIsCertificateModalOpen(true)}
            onRemoveCertificate={() => setCertificateKey(null)}
          />

          <KeyPurposesSection
            selectedPurposes={selectedOptions}
            onTogglePurpose={toggleOption}
            disabled={mode === "resolve"}
            allowedPurposes={getAllowedPurposes(certificateKey?.extracted_jwk || null)}
          />

          {/* Section: Footer Actions */}
          <DIDCreatorFooter
            onCompile={compileDID}
            onAction={executeAction}
            isSubmitting={isSubmitting}
            isCompiled={isCompiled}
            mode={mode}
            canCompile={!!logicalIdentifier && !!certificateKey}
          />
        </div>
      </DIDCreatorLayout>

      {/* Persistence Modals */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onAdd={handleAddService}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        onUpload={setCertificateKey}
        organizationId={organizationId}
      />
    </div>
  );
}
