/**
 * Page de connexion
 * =================
 *
 * Page minimaliste pour la connexion utilisateur.
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace organisation">
      <LoginForm />
    </AuthLayout>
  );
}
