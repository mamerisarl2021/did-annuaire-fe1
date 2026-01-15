"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { OperationType } from "@/lib/features/did/types";

interface URLFooterProps {
    operation: OperationType;
    onExecute: () => void;
    isSubmitting: boolean;
}

export function URLFooter({
    operation,
    onExecute,
    isSubmitting,
}: URLFooterProps) {
    return (
        <div className="p-2 bg-[#2c3e50] dark:bg-slate-950 border-t border-slate-700 rounded-b-lg">
            <Button
                onClick={onExecute}
                disabled={isSubmitting}
                className="w-full bg-[#2c3e50] hover:bg-slate-800 border border-blue-500/50 text-blue-400 font-bold uppercase tracking-[0.2em] h-14 transition-all"
            >
                {isSubmitting ? (
                    <>Executing...</>
                ) : (
                    <>
                        {operation === "CREATE"
                            ? "Create DID URL"
                            : operation === "UPDATE"
                                ? "Update DID URL"
                                : "Deactivate DID URL"}
                    </>
                )}
            </Button>
        </div>
    );
}
