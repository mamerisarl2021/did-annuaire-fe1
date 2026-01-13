import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CreateApplicationData } from "../types/application.types";

interface CreateApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateApplicationData) => Promise<boolean>;
    isLoading?: boolean;
}

export function CreateApplicationDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreateApplicationDialogProps) {
    const [formData, setFormData] = useState<CreateApplicationData>({
        name: "",
        description: "",
    });

    const handleSubmit = async () => {
        const success = await onSubmit(formData);
        if (success) {
            setFormData({ name: "", description: "" });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Application</DialogTitle>
                    <DialogDescription>
                        Applications help you organize your DIDs. Each DID belongs to one application.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="app-name">Application Name</Label>
                        <Input
                            id="app-name"
                            placeholder="e.g. Finance App"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            A unique slug will be automatically generated from the name.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="app-desc">Description (optional)</Label>
                        <Textarea
                            id="app-desc"
                            placeholder="Describe what this application is for..."
                            value={formData.description}
                            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !formData.name}>
                        {isLoading ? "Creating..." : "Create Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
