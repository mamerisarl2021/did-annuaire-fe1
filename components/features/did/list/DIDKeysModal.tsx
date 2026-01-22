"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Check, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { didService } from "@/lib/features/did/services/did.service";
import { useToast } from "@/components/ui/use-toast";

interface PublicKeyJwk {
  kty: string;
  crv?: string;
  [key: string]: unknown;
}

interface DIDKey {
  id: string;
  publicKeyJwk: PublicKeyJwk;
}

interface DIDKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  didId: string | null;
}

export function DIDKeysModal({ isOpen, onClose, didId }: DIDKeysModalProps) {
  const [keys, setKeys] = useState<DIDKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && didId) {
      const fetchKeys = async () => {
        setIsLoading(true);
        try {
          const fetchedKeys = await didService.fetchKeys(didId);
          setKeys(
            fetchedKeys.map((k) => ({
              id: k.key_id,
              publicKeyJwk: k.public_jwk as unknown as PublicKeyJwk,
            }))
          );
        } catch (error) {
          console.error("Failed to fetch keys:", error);
          toast({
            title: "Error",
            description: "Failed to fetch public keys for this DID.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchKeys();
    }
  }, [isOpen, didId, toast]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      description: "Key copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Key className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Public Keys</DialogTitle>
          </div>
          <DialogDescription className="font-mono text-xs break-all">
            Authorized keys for {didId}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Retrieving keys...</p>
          </div>
        ) : keys.length > 0 ? (
          <div className="border rounded-md mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Public Key (JWK)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => {
                  const keyValue = JSON.stringify(key.publicKeyJwk);
                  const typeLabel = key.publicKeyJwk.crv || key.publicKeyJwk.kty || "Unknown";

                  return (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {typeLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="font-mono text-[11px] truncate text-muted-foreground">
                          {keyValue}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(keyValue, key.id)}
                        >
                          {copiedId === key.id ? (
                            <Check className="size-4 text-green-500" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No public keys found for this identifier.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
