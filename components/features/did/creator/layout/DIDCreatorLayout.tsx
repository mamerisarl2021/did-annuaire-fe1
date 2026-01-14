"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DIDCreatorLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  response?: React.ReactNode;
  error?: React.ReactNode;
}

export function DIDCreatorLayout({
  activeTab,
  onTabChange,
  children,
  response,
  error,
}: DIDCreatorLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950/20 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex flex-col h-full">
        <TabsList className="w-full justify-start h-12 bg-[#f1f5f9] dark:bg-slate-900 rounded-none border-b border-slate-300 dark:border-slate-800 p-0 text-slate-500">
          <TabsTrigger
            value="request"
            className="flex-1 h-full px-8 data-[state=active]:bg-[#cbd5e1] dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 rounded-none border-r border-slate-300 dark:border-slate-800 font-bold text-xs uppercase tracking-widest transition-none"
          >
            Request
          </TabsTrigger>
          <TabsTrigger
            value="response"
            disabled={!response}
            className="flex-1 h-full px-8 data-[state=active]:bg-[#cbd5e1] dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 rounded-none border-r border-slate-300 dark:border-slate-800 font-bold text-xs uppercase tracking-widest transition-none disabled:opacity-40 disabled:grayscale cursor-not-allowed"
          >
            Response
          </TabsTrigger>
          <TabsTrigger
            value="error"
            disabled={!error}
            className="flex-1 h-full px-8 data-[state=active]:bg-[#cbd5e1] dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 rounded-none font-bold text-xs uppercase tracking-widest transition-none disabled:opacity-40 disabled:grayscale cursor-not-allowed"
          >
            Error
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar">
          <TabsContent value="request" className="m-0 p-0 h-full animate-in fade-in duration-300">
            {children}
          </TabsContent>

          <TabsContent value="response" className="m-0 p-8 h-full">
            {response || (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                <p className="text-sm font-medium">The DID operation response will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="error" className="m-0 p-8 h-full">
            {error || (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                <p className="text-sm font-medium">Any execution errors will be displayed here.</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
