"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { useDIDs } from "@/lib/features/did/hooks/useDIDs";
import { useDIDsStats } from "@/lib/features/did/hooks/useDIDsStats";
import { DIDTable } from "@/components/features/did/list/DIDTable";
import { PaginationControl } from "@/components/common/PaginationControl";
import { DIDSearchBar } from "@/components/features/did/list/DIDSearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeactivateDIDModal } from "@/components/features/did/list/DeactivateDIDModal";
import { DIDKeysModal } from "@/components/features/did/list/DIDKeysModal";
import { useToast } from "@/components/ui/use-toast";
import { DID } from "@/lib/features/did/types";
import { DIDStatsCards } from "@/lib/features/did/components/DIDStatsCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DIDListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { stats, isLoading: isStatsLoading, error: statsError } = useDIDsStats();
  const { dids, isLoading, searchQuery, setSearchQuery, deactivateDID, publishDID, pagination } =
    useDIDs();

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
        toast({
          title: "DID Published",
          description: `The DID has been successfully published to PROD.`,
          variant: "default",
        });
      } else if (result.didState?.state === "wait") {
        toast({
          title: "Publication Requested",
          description: "Your publication request is awaiting approval from an administrator.",
          variant: "default",
        });
      } else {
        toast({
          title: "Publication Sent",
          description: "The publication process has been initiated.",
          variant: "default",
        });
      }
    } catch (err) {
      toast({
        title: "Publication Failed",
        description: err instanceof Error ? err.message : "An error occurred during publication.",
        variant: "destructive",
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
      toast({
        title: "DID Deactivated",
        description: "The DID has been successfully deactivated.",
      });
    } catch (err) {
      toast({
        title: "Deactivation Failed",
        description: err instanceof Error ? err.message : "An error occurred during deactivation.",
        variant: "destructive",
      });
    } finally {
      setIsDeactivateModalOpen(false);
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_ADMIN, UserRole.ORG_MEMBER]}>
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
                onDelete={handleDelete}
                onFetchKeys={handleFetchKeys}
                onPublish={handlePublish}
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
      </div>
    </RoleGuard>
  );
}
