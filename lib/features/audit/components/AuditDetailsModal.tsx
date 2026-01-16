"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { SeverityBadge } from "./SeverityBadge";
import { type AuditAction } from "../types/audit.types";
import { Calendar, Globe, User, Building, ShieldCheck, Terminal } from "lucide-react";

interface AuditDetailsModalProps {
    audit: AuditAction | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

export function AuditDetailsModal({ audit, isOpen, onClose, isLoading }: AuditDetailsModalProps) {
    if (!audit && !isLoading) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 border-b bg-[#fafbfc]">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-[#172b4d]">
                            Audit Action Details
                        </DialogTitle>
                        {audit && <SeverityBadge severity={audit.severity} />}
                    </div>
                    <DialogDescription className="text-[#5e6c84]">
                        ID: {audit?.id || "Loading..."} • {audit?.action}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0052cc]"></div>
                        </div>
                    ) : (
                        <>
                            {/* Summary Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem
                                    icon={<Calendar className="h-4 w-4" />}
                                    label="Timestamp"
                                    value={new Date(audit!.timestamp).toLocaleString()}
                                />
                                <DetailItem
                                    icon={<Terminal className="h-4 w-4" />}
                                    label="Category"
                                    value={audit!.category}
                                />
                                <DetailItem
                                    icon={<User className="h-4 w-4" />}
                                    label="User"
                                    value={audit!.user || "System"}
                                />
                                <DetailItem
                                    icon={<Building className="h-4 w-4" />}
                                    label="Organization"
                                    value={audit!.organization || "-"}
                                />
                                <DetailItem
                                    icon={<Globe className="h-4 w-4" />}
                                    label="IP Address"
                                    value={audit!.ip || "N/A"}
                                />
                                <DetailItem
                                    icon={<ShieldCheck className="h-4 w-4" />}
                                    label="Request ID"
                                    value={audit!.request_id || "N/A"}
                                />
                            </div>

                            {/* User Agent */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-[#172b4d] flex items-center gap-2">
                                    User Agent
                                </h4>
                                <div className="text-xs bg-[#f4f5f7] p-3 rounded-md text-[#5e6c84] font-mono break-all leading-relaxed border">
                                    {audit!.user_agent || "N/A"}
                                </div>
                            </div>

                            {/* Action Details (JSON) */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-[#172b4d]">Technical Details</h4>
                                <div className="bg-[#172b4d] text-[#fafbfc] p-4 rounded-md overflow-hidden border">
                                    <pre className="text-xs font-mono overflow-x-auto">
                                        {JSON.stringify(audit!.details || {}, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg border bg-white shadow-sm">
            <div className="mt-0.5 text-[#5e6c84] bg-[#f4f5f7] p-1.5 rounded-md">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-[#5e6c84] uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-[#172b4d] break-all">{value}</p>
            </div>
        </div>
    );
}
