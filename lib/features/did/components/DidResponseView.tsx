"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DidResolutionResult } from "../hooks/useDidResolution";
import { ResolutionService, ResolutionVerificationMethod } from "../types/api.types";

interface Props {
  result: DidResolutionResult;
}

export function DidResponseView({ result }: Props) {
  const { did, document, url, resolutionResponse } = result;

  const parser = resolutionResponse?.resolution_response?.parser ?? {
    did: did,
    method: did.split(":")[1] || "",
    method_id: did.split(":").slice(2).join(":"),
    query: "Not available",
  };

  const rawServices = resolutionResponse?.resolution_response?.services;
  const services = Array.isArray(rawServices) ? rawServices : [];
  const verificationMethods = resolutionResponse?.resolution_response?.verification_methods ?? [];

  const docAny = document as unknown as Record<string, unknown>;
  const documentMetadata = resolutionResponse?.didDocumentMetadata ?? {
    created: docAny.created,
    updated: docAny.updated,
    versionId: docAny.versionId,
    deactivated: docAny.deactivated,
  };

  const resolutionMetadata = resolutionResponse?.didResolutionMetadata ?? {
    contentType: "application/did+json",
    retrievedFrom: url,
    didUrl: {
      did: did,
      methodName: "web",
      methodSpecificId: did.replace("did:web:", ""),
    },
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="response" className="w-full">
        <div className="flex justify-center border-b border-slate-200">
          <TabsList className="bg-transparent h-12 p-0 gap-8">
            <TabsTrigger
              value="response"
              className="px-4 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-semibold text-sm text-slate-500 data-[state=active]:text-blue-600 transition-all"
            >
              Response
            </TabsTrigger>
            <TabsTrigger
              value="document"
              className="px-4 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-semibold text-sm text-slate-500 data-[state=active]:text-blue-600 transition-all"
            >
              DID Document
            </TabsTrigger>
            <TabsTrigger
              value="doc-meta"
              className="px-4 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-semibold text-sm text-slate-500 data-[state=active]:text-blue-600 transition-all"
            >
              Document Metadata
            </TabsTrigger>
            <TabsTrigger
              value="res-meta"
              className="px-4 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-semibold text-sm text-slate-500 data-[state=active]:text-blue-600 transition-all"
            >
              Resolution Metadata
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="response"
          className="py-6 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* PARSER SECTION */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
              Parser
            </h3>
            <div className="space-y-1">
              <ParserRow label="DID" value={parser.did} />
              <ParserRow label="METHOD" value={parser.method} />
              <ParserRow label="METHOD-SPECIFIC ID" value={parser.method_id} />
              <ParserRow label="PATH-ABEMPTY" value="Not available" />
              <ParserRow label="QUERY" value={parser.query} />
            </div>
          </section>

          {/* SERVICES SECTION */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
              Services
            </h3>
            <div className="space-y-6">
              {services.length > 0 ? (
                services.map((s: ResolutionService, i: number) => (
                  <div key={i} className="space-y-1">
                    <ParserRow label="ID" value={s.id} />
                    <ParserRow label="TYPE" value={s.type} />
                    <ParserRow
                      label="SERVICE ENDPOINT"
                      value={
                        typeof s.service_endpoint === "string"
                          ? s.service_endpoint
                          : JSON.stringify(s.service_endpoint)
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No services found.</p>
              )}
            </div>
          </section>

          {/* VERIFICATION METHODS SECTION */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
              Verification Methods
            </h3>
            <div className="space-y-6">
              {verificationMethods.length > 0 ? (
                verificationMethods.map((vm: ResolutionVerificationMethod, i: number) => (
                  <div key={i} className="space-y-1">
                    <ParserRow label="ID" value={vm.id} />
                    <ParserRow label="TYPE" value={vm.type} />
                    <ParserRow
                      label="PUBLIC KEY (JWK)"
                      value={JSON.stringify(vm.public_key_jwk)}
                      truncate
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No verification methods found.</p>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="document">
          <CodeBlock json={document} />
        </TabsContent>

        <TabsContent value="doc-meta">
          <CodeBlock json={documentMetadata} />
        </TabsContent>

        <TabsContent value="res-meta">
          <CodeBlock json={resolutionMetadata} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ParserRow({
  label,
  value,
  truncate = false,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 py-1">
      <div className="text-xs font-bold text-slate-400 uppercase pt-0.5">{label}</div>
      <div className={`text-sm font-mono text-slate-700 ${truncate ? "truncate" : "break-all"}`}>
        {value}
      </div>
    </div>
  );
}

function CodeBlock({ json }: { json: unknown }) {
  return (
    <div className="bg-[#2c3e50] border border-slate-700/50 rounded-xl overflow-hidden shadow-sm mt-4">
      <pre className="font-mono text-xs text-slate-100 p-6 whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {JSON.stringify(json, null, 2)}
      </pre>
    </div>
  );
}
