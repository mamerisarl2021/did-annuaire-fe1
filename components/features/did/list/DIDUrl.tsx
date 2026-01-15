"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDIDUrl } from "@/lib/features/did/hooks/useDIDUrl";
import { TabType } from "@/lib/features/did/types";
import { URLHeader } from "./url/URLHeader";
import { URLConfig } from "./url/URLConfig";
import { URLOperation } from "./url/URLOperation";
import { URLFooter } from "./url/URLFooter";
import { URLStatus } from "./url/URLStatus";

interface DIDUrlProps {
  didId: string;
}

export function DIDUrl({ didId }: DIDUrlProps) {
  const {
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
  } = useDIDUrl(didId);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/20 rounded-xl border shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
        <TabsList className="w-full justify-start h-12 bg-slate-100 dark:bg-slate-900 rounded-none border-b border-slate-200 dark:border-slate-800 px-0">
          <TabsTrigger
            value="request"
            className="flex-1 h-full data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-none border-r"
          >
            Request
          </TabsTrigger>
          <TabsTrigger
            value="response"
            disabled={!response}
            className="flex-1 h-full data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-none border-r disabled:opacity-40 disabled:grayscale cursor-not-allowed"
          >
            Response
          </TabsTrigger>
          <TabsTrigger
            value="error"
            disabled={!error}
            className="flex-1 h-full data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-none disabled:opacity-40 disabled:grayscale cursor-not-allowed"
          >
            Error
          </TabsTrigger>
        </TabsList>

        <div className="p-6 space-y-8">
          <TabsContent value="request" className="mt-0 space-y-8 animate-in fade-in duration-300">
            <URLHeader
              didId={didId}
              relativeDidUrl={relativeDidUrl}
              onRelativeUrlChange={setRelativeDidUrl}
            />

            <URLConfig
              options={options}
              onOptionsChange={setOptions}
              secret={secret}
              onSecretChange={setSecret}
            />

            <URLOperation
              operation={operation}
              onOperationChange={setOperation}
              content={content}
              onContentChange={setContent}
              contentOperations={contentOperations}
              onContentOperationsChange={setContentOperations}
              onExecute={handleExecute}
              isSubmitting={isSubmitting}
            />

            <URLFooter
              operation={operation}
              onExecute={handleExecute}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <URLStatus response={response} error={error} />
        </div>
      </Tabs>
    </div>
  );
}
