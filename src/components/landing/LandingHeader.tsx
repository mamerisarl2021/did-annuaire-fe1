'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggleConnected } from '../ui/theme-toggle-connected';
import { typography } from '@/lib/typography';
import { ROUTES } from '@/shared/lib/constants/routes';

export function LandingHeader() {
  return (
    <header className="border-border bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.public.home} className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <Shield className="text-primary h-6 w-6" />
          </div>
          <span className="font-heading from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
            DID Annuaire
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-8 ${typography.label} text-muted-foreground md:flex`}
        >
          <Link href="#features" className="hover:text-primary transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#security" className="hover:text-primary transition-colors">
            Sécurité
          </Link>
          <Link href="#cas-usage" className="hover:text-primary transition-colors">
            Cas d&apos;usage
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleConnected />
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href={ROUTES.public.login}>Connexion</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.public.register}>Commencer</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
