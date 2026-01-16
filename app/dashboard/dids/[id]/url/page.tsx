"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIDUrl } from "@/components/features/did/list/DIDUrl";

export default function DIDUrlPage() {
  const params = useParams();
  const didId = decodeURIComponent(params.id as string);

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/dids">
          <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto hover:bg-transparent">
            <ChevronLeft size={16} />
            Back to List
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Resolver: DID URL
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Resolve and interact with specific resources associated with this DID.
          </p>
        </div>
      </div>

      <DIDUrl didId={didId} />
    </div>
  );
}
