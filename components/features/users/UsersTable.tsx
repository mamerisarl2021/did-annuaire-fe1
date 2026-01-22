"use client";

import React from "react";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  UserCheck,
  UserX,
  RefreshCw,
  Edit,
  Send,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserStatusBadge } from "./UserStatusBadge";
import { User } from "@/lib/features/users/types/users.types";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onInvite: (user: User) => void;
  onResend: (user: User) => void;
  onUpdate: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  onInvite,
  onResend,
  onUpdate,
  onDeactivate,
}: UsersTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <UserCheck className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No users found</h3>
        <p className="text-muted-foreground">Create your first user to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Id</TableHead>
            <TableHead className="w-[25%]">Full Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Function</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">
                <div>{user.id}</div>
              </TableCell>
              <TableCell className="font-medium">
                <div>{user.full_name}</div>
                <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  <span>{user.organization}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="size-3.5" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Briefcase className="size-3.5 text-muted-foreground" />
                  <span className="capitalize">{user.functions}</span>
                </div>
              </TableCell>

              <TableCell>
                <UserStatusBadge status={user.status} />
              </TableCell>

              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-blue-600 border-blue-100 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
                        onClick={() => onInvite(user)}
                      >
                        <Send className="size-4" />
                        <span className="hidden lg:inline text-[11px] font-bold">Invite</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-red-600 border-red-100 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                        onClick={() => onDeactivate(user)}
                      >
                        <UserX className="size-4" />
                        <span className="hidden lg:inline text-[11px] font-bold">Delete</span>
                      </Button>
                    </>
                  )}

                  {user.status === "INVITED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-blue-600 border-blue-100 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
                        onClick={() => onResend(user)}
                      >
                        <RefreshCw className="size-4" />
                        <span className="hidden lg:inline text-[11px] font-bold">Resend</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-red-600 border-red-100 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                        onClick={() => onDeactivate(user)}
                      >
                        <UserX className="size-4" />
                        <span className="hidden lg:inline text-[11px] font-bold">Cancel</span>
                      </Button>
                    </>
                  )}

                  {(user.status === "ACTIVE" || user.status === "DEACTIVATED") && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40"
                        onClick={() => onUpdate(user)}
                      >
                        <Edit className="size-4" />
                        <span className="hidden lg:inline text-[11px] font-bold">Update</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={
                          user.status === "ACTIVE"
                            ? "h-8 gap-1.5 text-red-600 border-red-100 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                            : "h-8 gap-1.5 text-emerald-600 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-900/20"
                        }
                        onClick={() => onDeactivate(user)}
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <UserX className="size-4" />
                            <span className="hidden lg:inline text-[11px] font-bold">
                              Deactivate
                            </span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="size-4" />
                            <span className="hidden lg:inline text-[11px] font-bold">Activate</span>
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
