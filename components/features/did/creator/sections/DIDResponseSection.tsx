"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DIDResponseSectionProps {
    response: string;
}

export function DIDResponseSection({ response }: DIDResponseSectionProps) {
    let parsedResponse: any = null;
    try {
        parsedResponse = JSON.parse(response);
    } catch (e) {
        return (
            <div className="bg-[#2c3e50] dark:bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                <pre className="font-mono text-[13px] text-slate-100 p-8 whitespace-pre-wrap leading-relaxed">
                    {response}
                </pre>
            </div>
        );
    }

    const { didDocumentMetadata, didRegistrationMetadata } = parsedResponse || {};

    return (
        <Tabs defaultValue="registrar" className="w-full">
            <div className="flex justify-center mb-6 border-b border-slate-200 dark:border-slate-800">
                <TabsList className="bg-transparent h-12 p-0 gap-12">
                    <TabsTrigger
                        value="registrar"
                        className="px-2 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 transition-all"
                    >
                        Registrar Response
                    </TabsTrigger>
                    <TabsTrigger
                        value="document"
                        className="px-2 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 transition-all"
                    >
                        DID Document Metadata
                    </TabsTrigger>
                    <TabsTrigger
                        value="registration"
                        className="px-2 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent font-bold text-[11px] uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 transition-all"
                    >
                        DID Registration Metadata
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="registrar" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#2c3e50] dark:bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                    <pre className="font-mono text-[13px] text-slate-100 p-8 whitespace-pre-wrap leading-relaxed min-h-[400px]">
                        {JSON.stringify(parsedResponse, null, 2)}
                    </pre>
                </div>
            </TabsContent>

            <TabsContent value="document" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#2c3e50] dark:bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                    <pre className="font-mono text-[13px] text-slate-100 p-8 whitespace-pre-wrap leading-relaxed min-h-[400px]">
                        {JSON.stringify(didDocumentMetadata || {}, null, 2)}
                    </pre>
                </div>
            </TabsContent>

            <TabsContent value="registration" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#2c3e50] dark:bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                    <pre className="font-mono text-[13px] text-slate-100 p-8 whitespace-pre-wrap leading-relaxed min-h-[400px]">
                        {JSON.stringify(didRegistrationMetadata || {}, null, 2)}
                    </pre>
                </div>
            </TabsContent>
        </Tabs>
    );
}
