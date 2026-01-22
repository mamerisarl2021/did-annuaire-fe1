"use client";

import React, { useState } from "react";
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
import { CreateUserPayload } from "@/lib/features/users/types/users.types";
import { UserRoleType } from "@/lib/types/roles";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (payload: CreateUserPayload) => Promise<void>;
}

export function UserCreateModal({ isOpen, onClose, onConfirm }: UserCreateModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateUserPayload>({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        functions: "",
        role: "ORG_MEMBER",
    });

    const roleOptions: { value: UserRoleType; label: string }[] = [
        { value: "SUPER_USER", label: "Super User" },
        { value: "ORG_ADMIN", label: "Organization Admin" },
        { value: "ORG_MEMBER", label: "Organization Member" },
        { value: "AUDITOR", label: "Auditor" },
    ];

    const [funcInput, setFuncInput] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onConfirm(formData);
            setFormData({ email: "", first_name: "", last_name: "", phone: "", functions: "", role: "ORG_MEMBER" });
            setFuncInput("");
            onClose();
        } catch (error) {
            console.error("Failed to create user", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New member</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new user account in PENDING state.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="functions">Functions (comma separated)</Label>
                        <Input
                            id="functions"
                            value={funcInput}
                            onChange={(e) => {
                                setFuncInput(e.target.value);
                                setFormData({ ...formData, functions: e.target.value });
                            }}
                            placeholder="Manager, developer..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: UserRoleType) => setFormData({ ...formData, role: value })}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
