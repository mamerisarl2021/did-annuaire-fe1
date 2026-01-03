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
    <div className="min-h-screen flex">
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 flex-col justify-center">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-heading font-bold text-foreground">
              DID Annuaire
            </h1>
            <p className="text-xl text-primary font-medium">
              Gérez vos identités décentralisées en toute sécurité
            </p>
          </div>
          
          <div className="space-y-6 text-muted-foreground">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-left">
                Créez et gérez des identités décentralisées conformes aux standards W3C
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-left">
                Sécurité renforcée avec authentification multi-facteurs
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-left">
                Interface intuitive pour les organisations françaises
              </p>
            </div>
          </div>

          {/* Illustration abstraite */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl rotate-12 transform" />
            <div className="absolute inset-0 w-24 h-24 mx-auto my-auto bg-gradient-to-tl from-primary/30 to-secondary/30 rounded-xl -rotate-12 transform" />
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaires */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <Card className="p-6">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}