"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDIDs } from "@/lib/features/did/hooks/useDIDs";
import { DIDTable } from "@/components/features/did/list/DIDTable";
import { DIDSearchBar } from "@/components/features/did/list/DIDSearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeactivateDIDModal } from "@/components/features/did/list/DeactivateDIDModal";
import { DIDKeysModal } from "@/components/features/did/list/DIDKeysModal";
import { DID } from "@/lib/features/did/types";

export default function DIDListPage() {
  const router = useRouter();
  const { dids, isLoading, searchQuery, setSearchQuery, deleteDID } = useDIDs();

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [didToDeactivate, setDidToDeactivate] = useState<DID | null>(null);

  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [selectedDidId, setSelectedDidId] = useState<string | null>(null);

  const handleCreate = () => {
    router.push("/dashboard/dids/create");
  };

  const handleFetchKeys = (did: DID) => {
    setSelectedDidId(did.id);
    setIsKeysModalOpen(true);
  };

  const handleDelete = (did: DID) => {
    setDidToDeactivate(did);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = (did: DID) => {
    deleteDID(did.id);
    setIsDeactivateModalOpen(false);
  };

  return (
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

      <div className="px-8 space-y-6 pb-8">
        <Card className="border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <DIDSearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <DIDTable
              dids={dids}
              isLoading={isLoading}
              onDelete={handleDelete}
              onFetchKeys={handleFetchKeys}
            />
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
  );
}
