"use client";

import React, { useState, useMemo } from "react";
import { Plus, Send } from "lucide-react";
import { useUsers } from "@/lib/features/users/hooks/useUsers";
import { useUsersStats } from "@/lib/features/users/hooks/useUsersStats";
import { UsersTable } from "./UsersTable";
import { UsersSearchBar } from "./UsersSearchBar";
import { UserCreateModal } from "./modals/UserCreateModal";
import { UserInviteModal } from "./modals/UserInviteModal";
import { UserDeactivateModal } from "./modals/UserDeactivateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, CreateUserPayload, UpdateUserPayload } from "@/lib/features/users/types/users.types";
import { UserUpdateModal } from "./modals/UserUpdateModal";
import { UserResendModal } from "./modals/UserResendModal";
import { UserStatsCards } from "@/lib/features/users/components/UserStatsCards";
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
  const { toast } = useToast();
  const { stats, isLoading: isStatsLoading, error: statsError } = useUsersStats();
  const {
    filteredUsers,
    isLoading,
    createUser,
    inviteUser,
    updateUser,
    deactivateUser,
    setClientSearch,
  } = useUsers({
    org_id: orgId,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setClientSearch(value);
  };

  // Filter users by role
  const displayedUsers = useMemo(() => {
    if (roleFilter === "all") return filteredUsers;
    return filteredUsers.filter((user) => user.role === roleFilter);
  }, [filteredUsers, roleFilter]);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleInvite = (user: User) => {
    setSelectedUser(user);
    setIsInviteModalOpen(true);
  };

  const handleResend = (user: User) => {
    setSelectedUser(user);
    setIsResendModalOpen(true);
  };

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeactivate = (user: User) => {
    setSelectedUser(user);
    setIsDeactivateModalOpen(true);
  };

  const onConfirmCreate = async (payload: CreateUserPayload) => {
    await createUser(payload);
    toast({ title: "Success", description: "User created in PENDING state." });
  };

  const onConfirmInvite = async (userId: string) => {
    await inviteUser(userId);
    toast({ title: "Success", description: "Invitation sent successfully." });
  };

  const onConfirmResend = async (userId: string) => {
    await inviteUser(userId); // Assuming invite is same endpoint as resend
    toast({ title: "Success", description: "Invitation resent successfully." });
  };

  const onConfirmUpdate = async (userId: string, payload: UpdateUserPayload) => {
    await updateUser(userId, payload);
    toast({ title: "Success", description: "Profile updated successfully." });
  };

  const onConfirmDeactivate = async (userId: string) => {
    await deactivateUser(userId);
    toast({ title: "Success", description: "User status updated successfully." });
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
            onClick={() => setIsInviteModalOpen(true)}
            variant="outline"
            className="gap-2 h-11 px-6 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl"
          >
            <Send size={16} />
            Invite user
          </Button>
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="org_admin">Org Admin</SelectItem>
                  <SelectItem value="org_member">Org Member</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UsersTable
              users={displayedUsers}
              isLoading={isLoading}
              onInvite={handleInvite}
              onResend={handleResend}
              onUpdate={handleUpdate}
              onDeactivate={handleDeactivate}
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

      <UserInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={onConfirmInvite}
        initialUserId={selectedUser?.id}
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
        onConfirm={onConfirmDeactivate}
        user={selectedUser}
      />
    </div>
  );
}
