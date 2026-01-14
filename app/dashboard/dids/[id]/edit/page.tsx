"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDCreator } from "@/components/features/did/creator/DIDCreator";
import { didService } from "@/lib/features/did/services";
import { DID } from "@/lib/features/did/types";
import { useToast } from "@/components/ui/use-toast";
import { useDIDCreator } from "@/lib/features/did/hooks/useDIDCreator";

export default function EditDIDPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const creator = useDIDCreator();
  const { loadDID } = creator;

  const [did, setDid] = useState<DID | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const didId = decodeURIComponent(params.id as string);

  useEffect(() => {
    const fetchDID = async () => {
      try {
        const data = await didService.getDIDById(didId);
        if (data) {
          setDid(data);
          loadDID(data);
        } else {
          toast({
            title: "NotFound",
            description: "The requested DID does not exist.",
            variant: "destructive",
          });
          router.push("/dashboard/dids");
        }
      } catch (error) {
        console.error("Error fetching DID:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDID();
  }, [didId, router, toast, loadDID]);

  if (isLoading) {
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
        <DIDCreator
          {...creator}
          isEditing={true}
          editingDidId={did.id}
          onClose={() => router.push("/dashboard/dids")}
        />
      </div>
    </div>
  );
}
