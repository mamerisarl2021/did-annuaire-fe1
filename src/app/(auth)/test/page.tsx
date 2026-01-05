/**
 * Page de test d'authentification
 * ===============================
 *
 * Page simple pour tester les composants d'authentification.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AuthTestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-semibold">Test d&apos;Authentification</h1>
          <p className="text-muted-foreground">Testez les pages d&apos;authentification</p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full" variant="default">
              Page de Connexion
            </Button>
          </Link>

          <Link href="/register" className="block">
            <Button className="w-full" variant="outline">
              Page d&apos;Inscription
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-muted-foreground text-sm hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </Card>
    </div>
  );
}
