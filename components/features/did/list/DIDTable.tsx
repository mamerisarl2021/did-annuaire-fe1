import {
  Edit,
  Trash2,
  Calendar,
  Fingerprint,
  CloudDownload,
  QrCode,
  Key,
  FileText,
} from "lucide-react";
import { DID } from "@/lib/features/did/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { truncateDID } from "@/lib/features/did/utils/didFormatter";

interface DIDTableProps {
  dids: DID[];
  onDelete: (did: DID) => void;
  onFetchKeys: (did: DID) => void;
  onPublish: (did: DID) => void;
  isLoading?: boolean;
}

export function DIDTable({ dids, onDelete, onFetchKeys, onPublish, isLoading }: DIDTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading DIDs...</div>;
  }

  if (dids.length === 0) {
    return (
      <div className="text-center py-16">
        <Fingerprint className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No DIDs found</h3>
        <p className="text-muted-foreground">Create your first DID to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">DID Identifier</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Algorithm Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dids.map((did) => (
            <TableRow key={did.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-mono text-sm font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{truncateDID(did.id)}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md break-all">
                      <p className="font-mono text-xs text-white">{did.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className="font-normal capitalize border-slate-200 dark:border-slate-800"
                >
                  {did.method}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="size-3.5" />
                  <span className="capitalize">
                    {did.document_type?.replace(/_/g, " ") || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 cursor-help">
                  <Key className="size-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {did.public_key_jwk?.kty}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="size-3.5" />
                  {new Date(did.created).toISOString().split("T")[0]}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Fetch Keys Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-blue-600 border-blue-100 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20"
                    onClick={() => onFetchKeys(did)}
                  >
                    <CloudDownload className="size-4" />
                    <span className="hidden lg:inline text-[11px] font-bold">Fetch Keys</span>
                  </Button>

                  {/* Publish Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-emerald-600 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-900/20"
                    onClick={() => onPublish(did)}
                  >
                    <QrCode className="size-4" />
                    <span className="hidden lg:inline text-[11px] font-bold">Publish</span>
                  </Button>

                  {/* Edit Link */}
                  <Link href={`/dashboard/dids/${encodeURIComponent(did.id)}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40"
                    >
                      <Edit className="size-4" />
                      <span className="hidden lg:inline text-[11px] font-bold">Update</span>
                    </Button>
                  </Link>

                  {/* Deactivate Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-8 gap-1.5 border-red-100 dark:border-red-900/40 ${
                      !did.is_published
                        ? "text-red-300 dark:text-red-900/40 cursor-not-allowed opacity-50"
                        : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                    onClick={() => onDelete(did)}
                    disabled={!did.is_published}
                  >
                    <Trash2 className="size-4" />
                    <span className="hidden lg:inline text-[11px] font-bold">Deactivate</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
