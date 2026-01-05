/**
 * Page 404 - Not Found
 * ====================
 *
 * Page d'erreur 404 personnalisée alignée avec l'identité visuelle.
 */

import Link from 'next/link';
import { AlertCircle, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { typography } from '@/lib/typography';
import { ROUTES } from '@/shared/lib/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6 p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
            <AlertCircle className="h-16 w-16 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Error code */}
        <div>
          <h1 className={`${typography.displayPrimary} mb-2 text-slate-900 dark:text-white`}>
            404
          </h1>
          <h2 className={`${typography.h3} mb-4 text-slate-700 dark:text-slate-300`}>
            Page introuvable
          </h2>
          <p className={`${typography.body} text-slate-600 dark:text-slate-400`}>
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={ROUTES.public.home}>
              <Home className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.public.login}>
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className={`${typography.small} text-slate-500 dark:text-slate-500`}>
          Besoin d&apos;aide ? Contactez notre{' '}
          <Link href={ROUTES.public.contact} className="text-primary hover:underline">
            support technique
          </Link>
        </p>
      </Card>
    </div>
  );
}
