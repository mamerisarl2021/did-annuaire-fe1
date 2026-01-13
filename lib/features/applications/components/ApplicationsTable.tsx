import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AppWindow, Trash2, Copy } from "lucide-react";
import { Application } from "../types/application.types";
import { useToast } from "@/components/ui/toast";

interface ApplicationsTableProps {
    applications: Application[];
    onDelete: (id: string) => void;
    isActionsDisabled?: boolean;
}

export function ApplicationsTable({
    applications,
    onDelete,
    isActionsDisabled = false,
}: ApplicationsTableProps) {
    const { addToast } = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast("Copied to clipboard", "success");
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-16">
                <AppWindow className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications</h3>
                <p className="text-muted-foreground">Create your first application to get started.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                                <div>{app.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                        {app.slug}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyToClipboard(app.slug)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-md truncate">
                                {app.description || "-"}
                            </TableCell>
                            <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDelete(app.id)}
                                    disabled={isActionsDisabled}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
