"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDCreator } from "@/components/features/did/creator/DIDCreator";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export default function CreateDIDPage() {
  const { user, loading } = useAuth();
  const organizationId = user?.organization_id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
          <p className="text-slate-500">Loading user session...</p>
        </div>
      </div>
    );
  }

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
            Register DID
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure and register a new decentralized identifier.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border shadow-sm overflow-hidden">
        {organizationId ? (
          <DIDCreator mode="create" organizationId={organizationId} ownerId={user?.id} />
        ) : (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3">
            <p>Unable to retrieve Organization ID.</p>
            {user && (
              <div className="text-sm bg-slate-50 p-4 rounded-md mx-auto max-w-lg text-left">
                <p className="font-mono text-xs">User Role: {user.role}</p>
                <p className="font-mono text-xs">User ID: {user.id}</p>
                <p className="font-mono text-xs text-red-500 mt-2">
                  Missing organization_id in session.
                </p>
                <p className="text-xs mt-2 text-slate-600">
                  Please try logging out and logging back in to refresh your session.
                </p>
              </div>
            )}
            {!user && <p>Please log in to continue.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
