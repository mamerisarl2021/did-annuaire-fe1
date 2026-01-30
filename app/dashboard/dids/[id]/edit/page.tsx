"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDCreator } from "@/components/features/did/creator/DIDCreator";
import { useDID } from "@/lib/features/did/hooks/useDID";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export default function EditDIDPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const didId = decodeURIComponent(params.id as string);
  const organizationId = user?.organization_id;

  // Use React Query hook instead of manual useEffect
  const { did, isLoading: isDidLoading, error } = useDID(didId, "prod");

  // Handle error
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Not Found",
        description: "The requested DID does not exist.",
        variant: "destructive",
      });
      router.push("/dashboard/dids");
    }
  }, [error, router, toast]);

  if (authLoading || isDidLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!did) return null;

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/dids">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 p-0 h-auto hover:bg-transparent text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft size={16} />
            Back to List
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Update DID
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Modify the document and configuration for this identifier.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border shadow-sm overflow-hidden">
        {organizationId ? (
          <DIDCreator
            mode="update"
            initialDid={did}
            organizationId={organizationId}
            ownerId={user?.id}
          />
        ) : (
          <div className="p-8 text-center text-red-500">
            Missing organization ID. Please reload.
          </div>
        )}
      </div>
    </div>
  );
}
