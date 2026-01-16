"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDCreator } from "@/components/features/did/creator/DIDCreator";

export default function CreateDIDPage() {
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
        <DIDCreator mode="create" />
      </div>
    </div>
  );
}
