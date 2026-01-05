/**
 * Layout d'authentification
 * =========================
 *
 * Layout partagé entre les pages de connexion et d'inscription.
 * Panneau gauche : branding et réassurance
 * Panneau droit : formulaires
 */

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Panneau gauche - Branding */}
      <div className="from-primary/10 via-primary/5 to-background hidden flex-col justify-center bg-gradient-to-br p-12 lg:flex lg:w-1/2">
        <div className="mx-auto max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="font-heading text-foreground text-4xl font-bold">DID Annuaire</h1>
            <p className="text-primary text-xl font-medium">
              Gérez vos identités décentralisées en toute sécurité
            </p>
          </div>

          <div className="text-muted-foreground space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
              <p className="text-left">
                Créez et gérez des identités décentralisées conformes aux standards W3C
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
              <p className="text-left">Sécurité renforcée avec authentification multi-facteurs</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
              <p className="text-left">Interface intuitive pour les organisations françaises</p>
            </div>
          </div>

          {/* Illustration abstraite */}
          <div className="relative">
            <div className="from-primary/20 to-accent/20 mx-auto h-32 w-32 rotate-12 transform rounded-2xl bg-gradient-to-br" />
            <div className="from-primary/30 to-secondary/30 absolute inset-0 mx-auto my-auto h-24 w-24 -rotate-12 transform rounded-xl bg-gradient-to-tl" />
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaires */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="font-heading text-foreground text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          <Card className="p-6">{children}</Card>
        </div>
      </div>
    </div>
  );
}
