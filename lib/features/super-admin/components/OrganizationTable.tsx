import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";
import { type OrganizationListItem } from "../types/organization.types";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationTableProps {
  data: OrganizationListItem[];
  isLoading: boolean;
  pagination: {
    page: number;
    totalPages: number;
    setPage: (p: number) => void;
  };
}

export function OrganizationTable({ data, isLoading, pagination }: OrganizationTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Date création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No organizations found via API.
                </TableCell>
              </TableRow>
            ) : (
              data.map((org) => (
                <TableRow key={org.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.type}</TableCell>
                  <TableCell>{org.country}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>
                    <OrganizationStatusBadge status={org.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{org.adminEmail}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(org.createdAt).toLocaleDateString("en-US")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page > 1) pagination.setPage(pagination.page - 1);
                }}
                aria-disabled={pagination.page <= 1}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Simple Page Indicator */}
            <PaginationItem>
              <span className="text-sm px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page < pagination.totalPages)
                    pagination.setPage(pagination.page + 1);
                }}
                aria-disabled={pagination.page >= pagination.totalPages}
                className={
                  pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
