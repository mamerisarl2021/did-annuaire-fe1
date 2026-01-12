"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  Search as SearchIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { useOrganizations } from "@/lib/features/super-admin/hooks/useOrganizations";
import { superAdminService } from "@/lib/features/super-admin/services/superadmin.service";
import { StatCard } from "@/lib/features/super-admin/components/StatCard";
import { OrganizationStatusBadge } from "@/lib/features/super-admin/components/OrganizationStatusBadge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SuperUserDashboardPage() {
  const router = useRouter();

  const { organizations, stats, pagination, error, isLoading, refresh, filters } =
    useOrganizations();

  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefuse, setShowRefuse] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const changeStatus = (newStatus: string | undefined) => {
    filters.setStatus(newStatus as any);
    filters.setSearch("");
    if (pagination?.setPage) pagination.setPage(1);
  };

  const currentStatus = filters.status || "all";
  const handleValidate = async (orgId: string) => {
    setActionLoading(true);
    try {
      await superAdminService.validateOrganization(orgId);
      setShowDetails(false);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la validation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!selectedOrg || !refuseReason.trim()) return;
    setActionLoading(true);
    try {
      await superAdminService.refuseOrganization(selectedOrg.id, refuseReason);
      setShowRefuse(false);
      setShowDetails(false);
      setRefuseReason("");
      refresh();
    } catch (e) {
      console.error(e);
      alert("Erreur lors du refus");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (orgId: string) => {
    setActionLoading(true);
    try {
      await superAdminService.toggleOrganizationStatus(orgId);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Erreur lors du changement de statut");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (orgId: string) => {
    setActionLoading(true);
    try {
      await superAdminService.deleteOrganization(orgId);
      setShowDelete(false);
      setSelectedOrg(null);
      refresh();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = pagination ? Math.ceil(pagination.count / pagination.pageSize) : 1;
  const currentPage = pagination?.page || 1;
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      pagination?.setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
        <Button onClick={() => refresh()} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Tous"
          value={
            (stats?.active || 0) +
            (stats?.pending || 0) +
            (stats?.suspended || 0) +
            (stats?.refused || 0)
          }
          active={currentStatus === "all"}
          onClick={() => changeStatus(undefined)}
        />
        <StatCard
          label="En attente"
          value={stats?.pending || 0}
          active={currentStatus === "PENDING"}
          onClick={() => changeStatus("PENDING")}
        />
        <StatCard
          label="Actifs"
          value={stats?.active || 0}
          active={currentStatus === "ACTIVE"}
          onClick={() => changeStatus("ACTIVE")}
        />
        <StatCard
          label="Suspendus"
          value={stats?.suspended || 0}
          active={currentStatus === "SUSPENDED"}
          onClick={() => changeStatus("SUSPENDED")}
        />
        <StatCard
          label="Refusés"
          value={stats?.refused || 0}
          active={currentStatus === "REFUSED"}
          onClick={() => changeStatus("REFUSED")}
        />
      </div>

      {/* Content Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <div className="relative flex-1 max-w-sm w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher (Nom, Email)..."
                value={filters.search}
                onChange={(e) => filters.setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select
                value={filters.status || "all"}
                onValueChange={(v) => changeStatus(v === "all" ? undefined : v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                  <SelectItem value="REFUSED">Refusé</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">{pagination?.count || 0} total</Badge>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Chargement...</div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">{error}</div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune organisation</h3>
              <p className="text-muted-foreground">Modifier les filtres pour voir des résultats.</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Email Admin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow
                        key={org.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowDetails(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          <div>{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{org.type}</Badge>
                        </TableCell>
                        <TableCell>{org.country}</TableCell>
                        <TableCell>{org.adminEmail}</TableCell>
                        <TableCell>
                          <OrganizationStatusBadge status={org.status} />
                        </TableCell>
                        <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedOrg(org);
                                setShowDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Toggle Button for Active/Suspended/Refused */}
                            {["ACTIVE", "SUSPENDED"].includes(org.status) && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                                onClick={() => handleToggle(org.id)}
                                disabled={actionLoading}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Delete Button */}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedOrg(org);
                                setShowDelete(true);
                              }}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            {/* Pending Actions */}
                            {org.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white border-0 mr-1"
                                  onClick={() => handleValidate(org.id)}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedOrg(org);
                                    setShowRefuse(true);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4" />
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

              {/* Pagination */}
              {pagination && totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 text-sm font-medium">
                          Page {currentPage} / {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedOrg?.name}</DialogTitle>
            <DialogDescription>Détails de l&apos;organisation</DialogDescription>
          </DialogHeader>
          {selectedOrg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <div className="font-medium">{selectedOrg.type}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Pays</Label>
                  <div className="font-medium">{selectedOrg.country}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email Org</Label>
                  <div className="font-medium break-all">{selectedOrg.email}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email Admin</Label>
                  <div className="font-medium break-all">{selectedOrg.adminEmail}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Téléphone</Label>
                  <div className="font-medium">{selectedOrg.phone || "-"}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Créé le</Label>
                  <div className="font-medium">
                    {new Date(selectedOrg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex sm:justify-between gap-2">
            {selectedOrg?.status === "PENDING" ? (
              <div className="flex gap-2 w-full justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetails(false);
                    setShowRefuse(true);
                  }}
                >
                  Refuser
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleValidate(selectedOrg.id)}
                >
                  Valider
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refuse Dialog */}
      <Dialog open={showRefuse} onOpenChange={setShowRefuse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser l&apos;organisation</DialogTitle>
            <DialogDescription>Indiquez le motif du refus.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Motif</Label>
            <Textarea
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              placeholder="Raison du refus..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefuse(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefuse}
              disabled={!refuseReason || actionLoading}
            >
              Confirmer Refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;organisation</DialogTitle>
            <DialogDescription>Êtes-vous sûr ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedOrg && handleDelete(selectedOrg.id)}
              disabled={actionLoading}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
