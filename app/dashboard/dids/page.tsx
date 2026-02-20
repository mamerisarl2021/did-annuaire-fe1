"use client";

import React, { useState, useMemo } from "react";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { useDIDs } from "@/lib/features/did/hooks/useDIDs";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { DIDTable } from "@/components/features/did/list/DIDTable";
import { PaginationControl } from "@/components/common/PaginationControl";
import { DIDSearchBar } from "@/components/features/did/list/DIDSearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeactivateDIDModal } from "@/components/features/did/list/DeactivateDIDModal";
import { DIDKeysModal } from "@/components/features/did/list/DIDKeysModal";
import { DID } from "@/lib/features/did/types";
import { DIDStatsCards } from "@/lib/features/did/components/DIDStatsCards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DIDListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, isLoading: isStatsLoading, error: statsError } = useDIDsStats();
  const {
    dids,
    isLoading,
    searchQuery,
    setSearchQuery,
    deactivateDID,
    publishDID,
    pagination,
    isSuperAdmin,
  } = useDIDs();

  const handleUpdate = (did: DID) => {
    if (did.owner_id !== user?.id && !isSuperAdmin) {
      setActionResult({
        success: false,
        title: "Pas d'autorisation",
        message: "Vous n'êtes pas le propriétaire de ce DID. Seul le créateur peut le modifier.",
      });
      return;
    }
    router.push(`/dashboard/dids/${encodeURIComponent(did.id)}/edit`);
  };

  const [actionResult, setActionResult] = useState<{
    success: boolean;
    title: string;
    message: string;
  } | null>(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [didToDeactivate, setDidToDeactivate] = useState<DID | null>(null);

  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [selectedDidId, setSelectedDidId] = useState<string | null>(null);
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all");

  // Filter DIDs by environment
  const displayedDids = useMemo(() => {
    if (environmentFilter === "all") return dids;
    const isProd = environmentFilter === "prod";
    return dids.filter((did) => (isProd ? did.is_published : !did.is_published));
  }, [dids, environmentFilter]);

  const handleCreate = () => {
    router.push("/dashboard/dids/create");
  };

  const handleFetchKeys = (did: DID) => {
    setSelectedDidId(did.id);
    setIsKeysModalOpen(true);
  };

  const handlePublish = async (did: DID) => {
    try {
      const result = await publishDID(did.id);

      if (result.didState?.state === "finished") {
        setActionResult({
          success: true,
          title: "DID Published",
          message: "The DID has been successfully published to PROD.",
        });
      } else if (result.didState?.state === "wait") {
        setActionResult({
          success: true,
          title: "Publication Requested",
          message: "Your publication request is awaiting approval from an administrator.",
        });
      } else {
        setActionResult({
          success: true,
          title: "Publication Sent",
          message: "The publication process has been initiated.",
        });
      }
    } catch (err) {
      setActionResult({
        success: false,
        title: "Publication Failed",
        message: err instanceof Error ? err.message : "An error occurred during publication.",
      });
    }
  };

  const handleDelete = (did: DID) => {
    setDidToDeactivate(did);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = async (did: DID) => {
    try {
      await deactivateDID(did.id);
      setActionResult({
        success: true,
        title: "DID Deactivated",
        message: "The DID has been successfully deactivated.",
      });
    } catch (err) {
      setActionResult({
        success: false,
        title: "Deactivation Failed",
        message: err instanceof Error ? err.message : "An error occurred during deactivation.",
      });
    } finally {
      setIsDeactivateModalOpen(false);
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_ADMIN, UserRole.ORG_MEMBER, UserRole.SUPER_USER]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DIDs</h1>
            <p className="text-muted-foreground mt-1">
              Manage your decentralized identifiers and their associated documents.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={18} />
            <span className="font-bold">Create DID</span>
          </Button>
        </div>

        {/* Stats Cards */}
        {!isStatsLoading && stats && (
          <div className="px-8">
            <DIDStatsCards stats={stats} />
          </div>
        )}

        {statsError && (
          <div className="px-8">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              Unable to load statistics: {statsError}
            </div>
          </div>
        )}

        <div className="px-8 space-y-6 pb-8">
          <Card className="border shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <DIDSearchBar value={searchQuery} onChange={setSearchQuery} />
                <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by env" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Environments</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DIDTable
                dids={displayedDids}
                isLoading={isLoading}
                isSuperAdmin={isSuperAdmin}
                currentUserId={user?.id}
                onDelete={handleDelete}
                onFetchKeys={handleFetchKeys}
                onPublish={handlePublish}
                onUpdate={handleUpdate}
              />

              <div className="px-6 border-t">
                <PaginationControl
                  currentPage={pagination.page}
                  totalPages={pagination.total_pages}
                  onPageChange={pagination.setPage}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DIDKeysModal
          isOpen={isKeysModalOpen}
          onClose={() => setIsKeysModalOpen(false)}
          didId={selectedDidId}
        />

        <DeactivateDIDModal
          isOpen={isDeactivateModalOpen}
          onClose={() => setIsDeactivateModalOpen(false)}
          onConfirm={handleConfirmDeactivate}
          did={didToDeactivate}
        />

        {/* Action Response Modal */}
        <Dialog open={!!actionResult} onOpenChange={() => setActionResult(null)}>
          <DialogContent className="w-full max-w-sm">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4">
                {actionResult?.success ? (
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                ) : (
                  <div className="bg-rose-100 p-3 rounded-full">
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                  </div>
                )}
              </div>
              <DialogTitle className="text-center">{actionResult?.title}</DialogTitle>
              <DialogDescription className="text-center pt-2">
                {actionResult?.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={() => setActionResult(null)}
                className={
                  actionResult?.success
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
