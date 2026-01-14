"use client";

import React, { useState } from "react";import { useDIDCreator } from "@/lib/features/did/hooks/useDIDCreator";
import { TabType, Service } from "@/lib/features/did/types";
import { DIDCreatorLayout } from "./layout/DIDCreatorLayout";
import { DIDMethodSection } from "./sections/DIDMethodSection";
import { DIDDocumentSection } from "./sections/DIDDocumentSection";
import { DIDConfigSection } from "./sections/DIDConfigSection";
import { DIDCreatorFooter } from "./sections/DIDCreatorFooter";
import { ServiceModal } from "./ServiceModal";
import { CertificateModal } from "./CertificateModal";

interface DIDCreatorProps {
  isEditing?: boolean;
  editingDidId?: string;
  onClose?: () => void;
  [key: string]: unknown;
}

export function DIDCreator(props: DIDCreatorProps) {
  const internalCreator = useDIDCreator();

  const creator = { ...internalCreator, ...props };

  const {
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
    handleAddKeys,
    handleAddService,
    response,
    error,
    isSubmitting,
  } = creator;

  const { isEditing } = props;

  const [isMethodSelectOpen, setIsMethodSelectOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Dynamic services parsing for the UI
  let services = [];
  try {
    const doc = JSON.parse(didDocument);
    services = doc.service || [];
  } catch {
  }

  const handleRemoveService = (serviceId: string) => {
    try {
      const doc = JSON.parse(didDocument);
      doc.service = (doc.service || []).filter((s: Service) => s.id !== serviceId);
      setDidDocument(JSON.stringify(doc, null, 2));
    } catch (e) {
      console.error("Error removing service:", e);
    }
  };

  const responseElement = response ? (
    <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 p-4 bg-white dark:bg-slate-950 border rounded shadow-inner whitespace-pre-wrap">
      {response}
    </pre>
  ) : null;

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
        <div className="flex flex-col h-full">
          {/* Section: Method Discovery */}
          <DIDMethodSection
            selectedMethod={selectedMethod}
            onMethodSelect={setSelectedMethod}
            isOpen={isMethodSelectOpen}
            onOpenChange={setIsMethodSelectOpen}
          />

          {/* Section: DID Document Editor */}
          <DIDDocumentSection
            didDocument={didDocument}
            services={services}
            onDocumentChange={setDidDocument}
            onAddService={() => setIsServiceModalOpen(true)}
            onRemoveService={handleRemoveService}
          />

          {/* Section: Configuration (Options/Secret) */}
          <DIDConfigSection
            options={options}
            onOptionsChange={setOptions}
            secret={secret}
            onSecretChange={setSecret}
            isEditing={isEditing}
          />

          {/* Section: Footer Actions */}
          <DIDCreatorFooter
            onAction={createDID}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
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
        onUpload={handleAddKeys}
      />
    </div>
  );
}
