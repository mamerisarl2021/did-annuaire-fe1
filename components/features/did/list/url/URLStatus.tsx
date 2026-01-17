"use client";

import React from "react";
import { Info, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface URLStatusProps {
  response: string;
  error: string;
}

export function URLStatus({ response, error }: URLStatusProps) {
  return (
    <>
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
    </>
  );
}
