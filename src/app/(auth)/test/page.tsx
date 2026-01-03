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
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading font-semibold">
            Test d'Authentification
          </h1>
          <p className="text-muted-foreground">
            Testez les pages d'authentification
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full" variant="default">
              Page de Connexion
            </Button>
          </Link>
          
          <Link href="/register" className="block">
            <Button className="w-full" variant="outline">
              Page d'Inscription
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  );
}