"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDCreator } from "@/components/features/did/creator/DIDCreator";
import { useDID } from "@/lib/features/did/hooks/useDID";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EditDIDPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const didId = decodeURIComponent(params.id as string);
  const organizationId = user?.organization_id;

  const { did, isLoading: isDidLoading, error } = useDID(didId);

  // Handle error
  React.useEffect(() => {
    if (error) {
      setErrorMessage("The requested DID does not exist or could not be loaded.");
      setShowErrorModal(true);
    }
  }, [error]);

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
            Missing organization ID. Please reload or if user is superadmin, your don&lsquo;t have
            an organization assigned.
          </div>
        )}
      </div>

      <Dialog
        open={showErrorModal}
        onOpenChange={(open) => {
          if (!open) router.push("/dashboard/dids");
          setShowErrorModal(open);
        }}
      >
        <DialogContent className="w-full max-w-sm">
          <DialogHeader className="flex flex-col items-center justify-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Error</DialogTitle>
            <DialogDescription className="text-center pt-2">{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4">
            <Button
              onClick={() => router.push("/dashboard/dids")}
              className="bg-red-600 hover:bg-red-700"
            >
              Return to List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
