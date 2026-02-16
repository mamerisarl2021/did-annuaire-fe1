"use client";

import React from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  Shield,
  Calendar,
  Key,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "SUPER_USER":
      return "bg-purple-500/10 text-purple-700 border-purple-200";
    case "ORG_ADMIN":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "ORG_MEMBER":
      return "bg-green-500/10 text-green-700 border-green-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "SUPER_USER":
      return "Super Administrateur";
    case "ORG_ADMIN":
      return "Administrateur Organisation";
    case "ORG_MEMBER":
      return "Membre Organisation";
    default:
      return role;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-500/10 text-green-700 border-green-200">
          <CheckCircle2 size={12} className="mr-1" />
          Actif
        </Badge>
      );
    case "INACTIVE":
      return (
        <Badge className="bg-gray-500/10 text-gray-700 border-gray-200">
          <Clock size={12} className="mr-1" />
          Inactif
        </Badge>
      );
    case "DEACTIVATED":
      return (
        <Badge className="bg-red-500/10 text-red-700 border-red-200">
          <XCircle size={12} className="mr-1" />
          Désactivé
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Impossible de charger les informations du profil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Breadcrumbs / Back Link */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} />
          Retour au Dashboard
        </Link>
        <ChevronRight size={14} className="text-muted-foreground/50" />
        <span className="text-foreground font-medium">Mon Profil</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#172b4d]">Mon Profil</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos informations personnelles et vos paramètres de sécurité
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="border-[#dfe1e6] shadow-sm">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-[#dfe1e6]">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                  <User size={48} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(user.status || "ACTIVE")}
                  </div>
                  <Badge className={cn("mb-3", getRoleBadgeColor(user.role))}>
                    <Shield size={12} className="mr-1" />
                    {getRoleLabel(user.role)}
                  </Badge>
                  {user.functions && user.functions.length > 0 && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Briefcase size={14} />
                      {Array.isArray(user.functions) ? user.functions.join(", ") : user.functions}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail size={16} className="text-primary" />
                    Email
                  </div>
                  <p className="text-sm font-mono bg-secondary/30 px-3 py-2 rounded-lg border border-[#dfe1e6]">
                    {user.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone size={16} className="text-primary" />
                    Téléphone
                  </div>
                  <p className="text-sm font-mono bg-secondary/30 px-3 py-2 rounded-lg border border-[#dfe1e6]">
                    {user.phone}
                  </p>
                </div>

                {/* User full_name */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Key size={16} className="text-primary" />
                    Nom complet
                  </div>
                  <p className="text-xs font-mono bg-secondary/30 px-3 py-2 rounded-lg border border-[#dfe1e6] break-all">
                    {user.full_name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          {user.organization && (
            <Card className="border-[#dfe1e6] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#172b4d]">
                  <Building2 className="text-primary" size={20} />
                  Organisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Nom de l&apos;organisation
                    </div>
                    <p className="text-lg font-semibold text-[#172b4d]">{user.organization.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Card */}
          <Card className="border-[#dfe1e6] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#172b4d]">
                <Shield className="text-accent" size={20} />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 2FA Status */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-[#dfe1e6]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        user.totp_enabled
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-500/10 text-gray-600"
                      )}
                    >
                      <Key size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#172b4d]">Authentification 2FA</div>
                      <div className="text-xs text-muted-foreground">TOTP</div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      user.totp_enabled ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                </div>
                <Badge
                  className={cn(
                    "w-full justify-center",
                    user.totp_enabled
                      ? "bg-green-500/10 text-green-700 border-green-200"
                      : "bg-gray-500/10 text-gray-700 border-gray-200"
                  )}
                >
                  {user.totp_enabled ? "Activé" : "Désactivé"}
                </Badge>
              </div>

              {/* Publish Permission */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-[#dfe1e6]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        user.can_publish_prod
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-gray-500/10 text-gray-600"
                      )}
                    >
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#172b4d]">Publication Production</div>
                      <div className="text-xs text-muted-foreground">Permissions</div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      user.can_publish_prod ? "bg-blue-500" : "bg-gray-400"
                    )}
                  />
                </div>
                <Badge
                  className={cn(
                    "w-full justify-center",
                    user.can_publish_prod
                      ? "bg-blue-500/10 text-blue-700 border-blue-200"
                      : "bg-gray-500/10 text-gray-700 border-gray-200"
                  )}
                >
                  {user.can_publish_prod ? "Autorisé" : "Non autorisé"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="border-[#dfe1e6] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#172b4d]">
                <Activity className="text-primary" size={20} />
                Activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.last_login && (
                  <div className="p-4 rounded-xl bg-secondary/30 border border-[#dfe1e6]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-bold text-[#172b4d] mb-1">
                          Dernière connexion
                        </div>
                        <div className="text-xs text-muted-foreground break-words">
                          {formatDate(user.last_login)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
