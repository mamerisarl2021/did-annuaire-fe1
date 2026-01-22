"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UpdateUserPayload } from "@/lib/features/users/types/users.types";
import { Loader2 } from "lucide-react";

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, payload: UpdateUserPayload) => Promise<void>;
  user: User | null;
}

export function UserUpdateModal({ isOpen, onClose, onConfirm, user }: UserUpdateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [funcInput, setFuncInput] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        functions: user.functions,
        status: user.status,
      });
      setFuncInput(user.functions || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await onConfirm(user.id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to update user", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update User Profile</DialogTitle>
          <DialogDescription>
            Modify the user&apos;s personal information and roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="u_first_name">First Name</Label>
              <Input
                id="u_first_name"
                value={formData.first_name || ""}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u_last_name">Last Name</Label>
              <Input
                id="u_last_name"
                value={formData.last_name || ""}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="u_email">Email Address</Label>
            <Input
              id="u_email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="u_phone">Phone Number</Label>
            <Input
              id="u_phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="u_functions">Functions (comma separated)</Label>
            <Input
              id="u_functions"
              value={funcInput}
              onChange={(e) => {
                setFuncInput(e.target.value);
                setFormData({
                  ...formData,
                  functions: e.target.value,
                });
              }}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
