"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { JSONEditor } from "../../creator/JSONEditor";

interface URLConfigProps {
    options: string;
    onOptionsChange: (val: string) => void;
    secret: string;
    onSecretChange: (val: string) => void;
}

export function URLConfig({
    options,
    onOptionsChange,
    secret,
    onSecretChange,
}: URLConfigProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Options
                    </Label>
                    <Badge variant="outline" className="text-[9px] font-bold opacity-50">
                        JSON
                    </Badge>
                </div>
                <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                    <JSONEditor value={options} onChange={onOptionsChange} height="200px" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Secret
                    </Label>
                    <Badge variant="outline" className="text-[9px] font-bold opacity-50">
                        JSON
                    </Badge>
                </div>
                <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                    <JSONEditor value={secret} onChange={onSecretChange} height="200px" />
                </div>
            </div>
        </div>
    );
}
