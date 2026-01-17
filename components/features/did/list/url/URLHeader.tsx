"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface URLHeaderProps {
  didId: string;
  relativeDidUrl: string;
  onRelativeUrlChange: (url: string) => void;
}

export function URLHeader({ didId, relativeDidUrl, onRelativeUrlChange }: URLHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Top DID Bar */}
      <div className="border bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <ChevronRight size={14} />
            DID URL
          </div>
          <Link href="/dashboard/dids">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              Return to DID List
            </Button>
          </Link>
        </div>
        <div className="p-4 space-y-1">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            DID
          </Label>
          <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 break-all p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-md select-all">
            {didId}
          </div>
        </div>
      </div>

      {/* Relative DID URL Input */}
      <div className="space-y-3">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
          Relative DID URL
        </Label>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 pl-1 font-medium">
            A relative DID URL that is the target of the DID URL create operation
          </p>
          <Input
            value={relativeDidUrl}
            onChange={(e) => onRelativeUrlChange(e.target.value)}
            className="h-11 font-mono text-sm bg-white dark:bg-slate-950"
            placeholder="/resources/123"
          />
        </div>
      </div>
    </div>
  );
}
