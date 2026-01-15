"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { useDidVerification } from "../hooks/useDidVerification";
import { DidVerifyForm } from "../components/DidVerifyForm";
import { DidErrorCard } from "../components/DidErrorCard";
import { DidResultCard } from "../components/DidResultCard";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { logger } from "@/lib/shared/services/logger.service";

export default function UserVerifyPage() {
  const { state, verify } = useDidVerification();
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      logger.error("Failed to copy to clipboard", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold">DID Verification</CardTitle>
              <CardDescription>Public decentralized identity verification tool</CardDescription>
            </CardHeader>
            <CardContent>
              <DidVerifyForm
                value={input}
                loading={state.status === "loading"}
                onChange={setInput}
                onVerify={() => verify(input)}
              />
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-4">
            {state.status === "error" && <DidErrorCard message={state.error} />}
            {state.status === "success" && (
              <DidResultCard
                result={state.data}
                onCopy={handleCopy}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
