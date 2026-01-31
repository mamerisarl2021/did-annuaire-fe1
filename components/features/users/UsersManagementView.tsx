"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useUsers } from "@/lib/features/users/hooks/useUsers";
import { useUsersStats } from "@/lib/features/users/hooks/useUsersStats";
import { UsersTable } from "./UsersTable";
import { UsersSearchBar } from "./UsersSearchBar";
import { UserCreateModal } from "./modals/UserCreateModal";
import { UserDeactivateModal } from "./modals/UserDeactivateModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, CreateUserPayload, UpdateUserPayload } from "@/lib/features/users/types/users.types";
import { UserUpdateModal } from "./modals/UserUpdateModal";
import { UserResendModal } from "./modals/UserResendModal";
import { UserStatsCards } from "@/lib/features/users/components/UserStatsCards";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersManagementViewProps {
  scope: "SUPER_USER" | "ORG_ADMIN";
  orgId?: string;
}

export function UsersManagementView({ scope, orgId }: UsersManagementViewProps) {
  const { stats, isLoading: isStatsLoading, error: statsError } = useUsersStats();
  const {
    filteredUsers,
    isLoading,
    createUser,
    inviteUser,
    updateUser,
    toggleUserStatus,
    setClientSearch,
    setStatus,
  } = useUsers({
    org_id: orgId,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setClientSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setStatus(value);
  };

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    success: boolean;
    title: string;
    message: string;
  } | null>(null);

  const handleInvite = async (user: User) => {
    setSelectedUser(user);
    try {
      await onConfirmInvite(user.id);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send invitation.";
      setActionFeedback({ success: false, title: "Invitation Failed", message: msg });
    }
  };

  const handleResend = (user: User) => {
    setSelectedUser(user);
    setIsResendModalOpen(true);
  };

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setIsDeactivateModalOpen(true);
  };

  const onConfirmCreate = async (payload: CreateUserPayload) => {
    try {
      await createUser(payload);
      setActionFeedback({
        success: true,
        title: "User Created",
        message: "User created in PENDING state.",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      setActionFeedback({
        success: false,
        title: "Creation Failed",
        message: error instanceof Error ? error.message : "Failed to create user",
      });
    }
  };

  const onConfirmInvite = async (userId: string) => {
    try {
      await inviteUser(userId);
      setActionFeedback({
        success: true,
        title: "Invitation Sent",
        message: "Invitation sent successfully.",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send invitation.";
      setActionFeedback({ success: false, title: "Invitation Failed", message: msg });
    }
  };

  const onConfirmResend = async (userId: string) => {
    try {
      await inviteUser(userId);
      setActionFeedback({
        success: true,
        title: "Invitation Resent",
        message: "Invitation resent successfully.",
      });
      setIsResendModalOpen(false);
    } catch (error) {
      setActionFeedback({
        success: false,
        title: "Invitation Failure",
        message: error instanceof Error ? error.message : "Failed to resend invitation",
      });
    }
  };

  const onConfirmUpdate = async (userId: string, payload: UpdateUserPayload) => {
    try {
      await updateUser(userId, payload);
      setActionFeedback({
        success: true,
        title: "Profile Updated",
        message: "Profile updated successfully.",
      });
      setIsUpdateModalOpen(false);
    } catch (error) {
      setActionFeedback({
        success: false,
        title: "Update Failed",
        message: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  const onConfirmToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      setActionFeedback({
        success: true,
        title: "Status Updated",
        message: "User status updated successfully.",
      });
      setIsDeactivateModalOpen(false);
    } catch (error) {
      setActionFeedback({
        success: false,
        title: "Update Failed",
        message: error instanceof Error ? error.message : "Failed to update status",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center px-8 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {scope === "SUPER_USER" ? "Global" : "Organization"} Users
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage members, invite new users and control access levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={18} />
            <span className="font-bold">Create member</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!isStatsLoading && stats && (
        <div className="px-8">
          <UserStatsCards stats={stats} />
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
              <UsersSearchBar value={searchQuery} onChange={handleSearchChange} />
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="INVITED">Invited</SelectItem>
                  <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UsersTable
              users={filteredUsers}
              isLoading={isLoading}
              onInvite={handleInvite}
              onResend={handleResend}
              onUpdate={handleUpdate}
              onToggleStatus={handleToggleStatus}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={onConfirmCreate}
      />

      <UserResendModal
        isOpen={isResendModalOpen}
        onClose={() => {
          setIsResendModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={onConfirmResend}
        userId={selectedUser?.id}
      />

      <UserUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={onConfirmUpdate}
        user={selectedUser}
      />

      <UserDeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={onConfirmToggleStatus}
        user={selectedUser}
      />

      {/* Action Response Modal (Success/Error) */}
      <Dialog open={!!actionFeedback} onOpenChange={() => setActionFeedback(null)}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4">
              {actionFeedback?.success ? (
                <div className="bg-emerald-100 p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              ) : (
                <div className="bg-rose-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
              )}
            </div>
            <DialogTitle className="text-center">{actionFeedback?.title}</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {actionFeedback?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setActionFeedback(null)}
              className={
                actionFeedback?.success
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
  );
}
