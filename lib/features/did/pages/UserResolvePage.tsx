"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDidResolution } from "../hooks/useDidResolution";
import { DidRequestTab } from "../components/DidRequestTab";
import { DidErrorCard } from "../components/DidErrorCard";
import { DidResponseView } from "../components/DidResponseView";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function UserResolvePage() {
  const { state, resolve } = useDidResolution();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("request");
  const { toast } = useToast();

  // Auto-switch tabs on state change
  useEffect(() => {
    if (state.status === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("response");
      toast({
        title: "DID Resolved",
        description: (
          <div className="flex flex-col gap-1">
            <span>Successfully resolved DID:</span>
            <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded w-fit">
              {state.data?.did}
            </span>
          </div>
        ),
      });
    } else if (state.status === "error") {
      setActiveTab("error");
    }
  }, [state.status, toast, state]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center justify-start p-4 sm:px-6 lg:px-8 pt-10">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="shadow-lg min-h-[600px] flex flex-col">
            <CardHeader className="text-center space-y-1 pb-2">
              {/* Header content if needed, currently mainly driven by Tabs */}
            </CardHeader>
            <CardContent className="flex-1">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full h-full flex flex-col"
              >
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
      </main>
    </div>
  );
}
