"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDidResolution } from "../hooks/useDidResolution";
import { DidRequestTab } from "../components/DidRequestTab";
import { DidErrorCard } from "../components/DidErrorCard";
import { DidResponseView } from "../components/DidResponseView";

/**
 * Resolve DID Content Component (without layout)
 * Can be used in both public pages and dashboard
 */
export function ResolveContent() {
  const { state, resolve } = useDidResolution();
  const [input, setInput] = useState("");
  // Derive active tab from state instead of using useState + useEffect
  const activeTab =
    state.status === "success" ? "response" : state.status === "error" ? "error" : "request";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg min-h-[600px] flex flex-col">
        <CardHeader className="text-center space-y-1 pb-2">
          {/* Header content if needed */}
        </CardHeader>
        <CardContent className="flex-1">
          <Tabs value={activeTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response" disabled={state.status !== "success"}>
                Response
              </TabsTrigger>
              <TabsTrigger value="error" disabled={state.status !== "error"}>
                Error
              </TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="flex-1 outline-none">
              <DidRequestTab
                value={input}
                loading={state.status === "loading"}
                onChange={setInput}
                onResolve={() => resolve(input)}
              />
            </TabsContent>

            <TabsContent value="response" className="flex-1 outline-none">
              {state.status === "success" && <DidResponseView result={state.data} />}
              {state.status !== "success" && (
                <div className="text-center text-gray-500 py-12">
                  No resolution result available. Please resolve a DID first.
                </div>
              )}
            </TabsContent>

            <TabsContent value="error" className="flex-1 outline-none">
              {state.status === "error" && <DidErrorCard message={state.error} />}
              {state.status !== "error" && (
                <div className="text-center text-gray-500 py-12">No error to display.</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
