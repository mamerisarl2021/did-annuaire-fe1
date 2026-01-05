/**
 * Page d'inscription
 * ==================
 *
 * Page minimaliste pour l'inscription d'une organisation.
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout title="Créer une organisation" subtitle="Rejoignez la plateforme DID Annuaire">
      <RegisterForm />
    </AuthLayout>
  );
}
