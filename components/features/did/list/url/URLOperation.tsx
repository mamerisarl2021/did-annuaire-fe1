"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { JSONEditor } from "../../creator/JSONEditor";
import { OperationType } from "@/lib/features/did/types";

interface URLOperationProps {
  operation: OperationType;
  onOperationChange: (op: OperationType) => void;
  content: string;
  onContentChange: (val: string) => void;
  contentOperations: string;
  onContentOperationsChange: (val: string) => void;
  onExecute: () => void;
  isSubmitting: boolean;
}

export function URLOperation({
  operation,
  onOperationChange,
  content,
  onContentChange,
  contentOperations,
  onContentOperationsChange,
  onExecute,
  isSubmitting,
}: URLOperationProps) {
  return (
    <div className="bg-[#cbd5e1] dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded shadow-sm overflow-hidden">
      <Tabs
        value={operation}
        onValueChange={(v) => onOperationChange(v as OperationType)}
        className="w-full"
      >
        <TabsList className="w-full justify-start h-12 bg-[#cbd5e1] dark:bg-slate-800 rounded-none border-b border-slate-300 dark:border-slate-700 px-0">
          {["CREATE", "UPDATE", "DEACTIVATE"].map((op) => (
            <TabsTrigger
              key={op}
              value={op}
              className="flex-1 h-full font-bold text-xs tracking-widest rounded-none border-r border-slate-300 dark:border-slate-700 data-[state=active]:bg-[#94a3b8] dark:data-[state=active]:bg-slate-700 data-[state=active]:text-white uppercase"
            >
              {op}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="CREATE" className="m-0">
          <div className="p-6 space-y-4">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Content
            </Label>
            <p className="text-[10px] text-slate-400 font-medium">
              Base64-encoded data associated with the DID URL
            </p>
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="h-[300px] font-mono text-xs bg-white dark:bg-slate-950 resize-none shadow-inner"
              placeholder="Enter base64 content..."
            />
          </div>
        </TabsContent>

        <TabsContent value="UPDATE" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#cbd5e1] dark:bg-slate-900">
            <div className="p-6 space-y-4 border-r border-slate-300 dark:border-slate-700">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Content
              </Label>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Base64-encoded data associated with the DID URL
              </p>
              <Textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="h-[300px] font-mono text-xs bg-white dark:bg-slate-950 resize-none shadow-inner"
                placeholder="Enter base64 content..."
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Content Operations
                  </Label>
                  <p className="text-[10px] text-slate-400 font-medium">Update operations</p>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold opacity-50">
                  JSON
                </Badge>
              </div>
              <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-950 min-h-[450px]">
                <JSONEditor
                  value={contentOperations}
                  onChange={onContentOperationsChange}
                  height="300px"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="DEACTIVATE" className="m-0 bg-[#cbd5e1]/30 dark:bg-slate-900/30">
          <div className="p-20 flex items-center justify-center min-h-[300px]">
            <Button
              onClick={onExecute}
              disabled={isSubmitting}
              className="bg-[#2c3e50] hover:bg-slate-800 border border-[#3b82f6]/50 text-[#3b82f6] font-bold px-12 h-14 shadow-lg min-w-[240px] transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? "Processing..." : "Deactivate"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
