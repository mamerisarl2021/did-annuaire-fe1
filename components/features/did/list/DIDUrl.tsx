"use client";

import { ChevronRight, RotateCcw, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSONEditor } from "../creator/JSONEditor";
import { useDIDUrl } from "@/lib/features/did/hooks/useDIDUrl";
import Link from "next/link";
import { OperationType, TabType } from "@/lib/features/did/types";

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
    clientManagedSecret,
    handleClientManagedSecretChange,
    handleExecute,
    isSubmitting,
    response,
    error,
  } = useDIDUrl(didId);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/20 rounded-xl border shadow-sm overflow-hidden">
      {/* Ribbon Navigation */}
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
            {/* Top DID Bar */}
            <div className="border bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <ChevronRight size={14} />
                  DID URL
                </div>
                <Link href="/dashboard/dids">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Return to DID List
                  </Button>
                </Link>
              </div>
              <div className="p-4 space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  DID
                </Label>
                <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 break-all p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-md select-all">
                  {didId}
                </div>
              </div>
            </div>

            {/* Relative DID URL Input */}
            <div className="space-y-3">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Relative DID URL
              </Label>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 pl-1 font-medium">
                  A relative DID URL that is the target of the DID URL create operation
                </p>
                <Input
                  value={relativeDidUrl}
                  onChange={(e) => setRelativeDidUrl(e.target.value)}
                  className="h-11 font-mono text-sm bg-white dark:bg-slate-950"
                  placeholder="/resources/123"
                />
              </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Options
                  </Label>
                  <Badge variant="outline" className="text-[9px] font-bold opacity-50">
                    JSON
                  </Badge>
                </div>
                <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                  <JSONEditor value={options} onChange={setOptions} height="200px" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Secret
                  </Label>
                  <Badge variant="outline" className="text-[9px] font-bold opacity-50">
                    JSON
                  </Badge>
                </div>
                <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                  <JSONEditor value={secret} onChange={setSecret} height="200px" />
                </div>
              </div>
            </div>

            {/* Operation Interface */}
            <div className="space-y-6 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <Tabs
                value={operation}
                onValueChange={(v) => setOperation(v as OperationType)}
                className="w-full"
              >
                <TabsList className="w-full justify-start h-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-none border-b px-0">
                  {["CREATE", "UPDATE", "DEACTIVATE"].map((op) => (
                    <TabsTrigger
                      key={op}
                      value={op}
                      className="flex-1 h-full font-bold text-[10px] sm:text-[11px] tracking-widest rounded-none data-[state=active]:bg-slate-300 dark:data-[state=active]:bg-slate-700"
                    >
                      {op}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="p-6 space-y-4">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Content
                  </Label>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Base64-encoded data that is the content of the resource associated with the DID
                    URL
                  </p>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] font-mono text-xs bg-white dark:bg-slate-950 resize-none"
                    placeholder="Enter base64 content..."
                  />
                </div>
              </Tabs>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between p-6 bg-slate-900 border-t border-slate-700 rounded-b-xl shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="secret-mode"
                    className="text-white font-bold text-xs cursor-pointer"
                  >
                    Client-managed Secret Mode
                  </Label>
                  <Switch
                    id="secret-mode"
                    checked={clientManagedSecret}
                    onCheckedChange={handleClientManagedSecretChange}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
                <div className="h-4 w-px bg-slate-700 hidden sm:block" />
                <Button
                  variant="link"
                  className="text-slate-400 hover:text-white text-xs font-bold gap-1 hidden sm:flex"
                >
                  Docs <ExternalLink size={12} />
                </Button>
              </div>

              <Button
                onClick={handleExecute}
                disabled={isSubmitting}
                className="bg-[#2c3e50] hover:bg-slate-800 border border-blue-500/30 text-blue-400 font-black px-12 h-12 shadow-inner transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>Executing...</>
                ) : (
                  <>
                    {operation === "CREATE"
                      ? "Create DID URL"
                      : operation === "UPDATE"
                        ? "Update DID URL"
                        : "Deactivate DID URL"}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="response" className="mt-0">
            <Card className="bg-slate-100 dark:bg-slate-950 p-6 min-h-[400px]">
              {response ? (
                <pre className="font-mono text-xs text-slate-700 dark:text-slate-300 overflow-auto max-h-[600px] whitespace-pre-wrap">
                  {response}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                  <Info className="size-12 opacity-20" />
                  <p className="text-sm font-medium">
                    The operation response will appear here after execution.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="error" className="mt-0">
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 p-6 min-h-[400px]">
              {error ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <RotateCcw size={16} /> Error Execution
                  </div>
                  <pre className="font-mono text-xs text-red-800 dark:text-red-300 p-4 bg-red-100/50 dark:bg-red-900/30 rounded-lg">
                    {error}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                  <Info className="size-12 opacity-20" />
                  <p className="text-sm font-medium">
                    Errors will be logged here if the operation fails.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
