/**
 * Page de suivi de statut d'organisation
 * =======================================
 *
 * Affiche la progression de validation avec un stepper visuel.
 * Étapes : Inscription → Validation Admin → Vérification OTP → Actif
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Mail,
  Loader2,
  FileCheck,
  Shield,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { typography } from '@/lib/typography';
import { OrganizationStatus, type OrganizationStatusData } from '@/features/auth/types/auth.types';
import {
  getOrganizationStatus,
  sendOrganizationOtp,
  contactSuperAdmin,
} from '@/features/auth/services/status.service';
import { OtpModal } from '@/features/auth/components/OtpModal';

// Définition des étapes de progression
const progressSteps = [
  {
    id: 1,
    label: 'Inscription',
    icon: FileCheck,
    description: 'Dossier soumis',
  },
  {
    id: 2,
    label: 'Validation Admin',
    icon: Shield,
    description: 'Vérification en cours',
  },
  {
    id: 3,
    label: 'Vérification OTP',
    icon: Mail,
    description: 'Confirmation sécurisée',
  },
  {
    id: 4,
    label: 'Compte Actif',
    icon: Sparkles,
    description: 'Accès plateforme',
  },
];

export default function OrganizationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  const [status, setStatus] = useState<OrganizationStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Chargement du statut
  useEffect(() => {
    if (!organizationId) return;

    const loadStatus = async () => {
      try {
        const data = await getOrganizationStatus(organizationId);
        setStatus(data);
      } catch {
        toast.error('Erreur lors du chargement du statut');
        router.push('/register');
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
  }, [organizationId, router]);

  // Gestion de l'envoi OTP
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      await sendOrganizationOtp(organizationId);
      setShowOtpModal(true);
      toast.success('Code OTP envoyé');
    } catch {
      toast.error("Erreur lors de l'envoi du code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Gestion du contact super admin
  const handleContactAdmin = async () => {
    try {
      await contactSuperAdmin(organizationId, "Demande d'information sur ma demande");
      toast.success("Message envoyé à l'équipe de validation");
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  // Déterminer l'étape actuelle basée sur le statut
  const getCurrentStep = () => {
    if (!status) return 1;
    switch (status.status) {
      case OrganizationStatus.PENDING:
        return 2; // En attente de validation admin (étape 2)
      case OrganizationStatus.ACTIVE:
        return 3; // Validé, en attente de vérification OTP (étape 3)
      case OrganizationStatus.REFUSED:
      case OrganizationStatus.SUSPENDED:
        return -1; // État d'erreur
      default:
        return 2;
    }
  };

  const currentStep = getCurrentStep();

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!status) {
    return null;
  }

  // Rendu pour les états d'erreur (REFUSED ou SUSPENDED)
  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                {status.status === OrganizationStatus.REFUSED ? (
                  <>
                    <div className="bg-destructive/10 rounded-full p-3">
                      <XCircle className="text-destructive h-12 w-12" />
                    </div>
                    <div>
                      <h2
                        className={`${typography.displaySecondary} mb-2 text-slate-900 dark:text-white`}
                      >
                        Demande Refusée
                      </h2>
                      <p className={`${typography.body} mb-4 text-slate-600 dark:text-slate-400`}>
                        Votre demande d&apos;inscription a été refusée par notre équipe de
                        validation.
                      </p>
                      {status.refusalReason && (
                        <Alert variant="destructive" className="text-left">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Raison du refus</AlertTitle>
                          <AlertDescription>{status.refusalReason}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <p className={`${typography.small} text-slate-500 dark:text-slate-500`}>
                      Veuillez consulter votre email pour plus de détails et les actions à
                      entreprendre.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                      <AlertTriangle className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2
                        className={`${typography.displaySecondary} mb-2 text-slate-900 dark:text-white`}
                      >
                        Compte Suspendu
                      </h2>
                      <p className={`${typography.body} text-slate-600 dark:text-slate-400`}>
                        Votre organisation est temporairement suspendue. Veuillez consulter vos
                        communications officielles ou contacter notre équipe pour plus
                        d&apos;informations.
                      </p>
                    </div>
                  </>
                )}

                <Button variant="outline" onClick={() => router.push('/')}>
                  Retour à l&apos;accueil
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className={`${typography.small} mt-6 text-center text-slate-500 dark:text-slate-500`}>
            Pour toute question, contactez notre support à{' '}
            <a href="mailto:support@did-annuaire.fr" className="text-primary hover:underline">
              support@did-annuaire.fr
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`${typography.displayPrimary} mb-3 text-slate-900 dark:text-white`}>
            Suivi de votre inscription
          </h1>
          <p className={`${typography.bodyLg} text-slate-600 dark:text-slate-400`}>
            {status.organizationName}
          </p>
        </div>

        {/* Stepper de progression */}
        <Card className="mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="relative">
              {/* Ligne de progression */}
              <div className="absolute top-[52px] right-0 left-0 h-1 bg-slate-200 dark:bg-slate-700">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / (progressSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Étapes */}
              <div className="relative grid grid-cols-4 gap-4">
                {progressSteps.map((step, index) => {
                  const isCompleted = index + 1 < currentStep;
                  const isCurrent = index + 1 === currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`relative z-10 mb-3 flex h-[104px] w-[104px] items-center justify-center rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-primary text-white shadow-lg'
                            : isCurrent
                              ? 'bg-primary ring-primary/20 animate-pulse text-white shadow-xl ring-4'
                              : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                        } `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-12 w-12" />
                        ) : isCurrent ? (
                          <Clock className="h-12 w-12" />
                        ) : (
                          <Icon className="h-12 w-12" />
                        )}
                      </div>
                      <p
                        className={`mb-1 text-center text-sm font-semibold ${
                          isCompleted || isCurrent
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-500'
                        } `}
                      >
                        {step.label}
                      </p>
                      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu selon le statut */}
        <Card>
          <CardContent className="pt-6 pb-6">
            {/* PENDING - En attente de validation */}
            {status.status === OrganizationStatus.PENDING && (
              <div className="space-y-6">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Validation en cours</AlertTitle>
                  <AlertDescription>
                    Votre organisation est en cours de vérification par notre équipe. Ce processus
                    prend généralement entre 24 et 72 heures. Nous vous notifierons par email dès
                    que la validation sera effectuée.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center">
                  <Button onClick={handleContactAdmin} size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Contacter le Super Admin
                  </Button>
                </div>

                <div className="text-center">
                  <p className={`${typography.small} text-slate-500 dark:text-slate-500`}>
                    Inscrit le{' '}
                    {new Date(status.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIVE - Compte validé, en attente OTP */}
            {status.status === OrganizationStatus.ACTIVE && (
              <div className="space-y-6">
                <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                    Organisation Validée ! 🎉
                  </AlertTitle>
                  <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                    Félicitations ! Votre organisation a été validée avec succès par notre équipe.
                    Pour finaliser l&apos;activation de votre compte et accéder à la plateforme,
                    veuillez compléter la vérification par code OTP.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center">
                  <Button size="lg" onClick={handleSendOtp} disabled={isSendingOtp}>
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Passer à la Vérification OTP
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className={`${typography.small} text-slate-500 dark:text-slate-500`}>
                    Un code de vérification à 6 chiffres sera envoyé à votre adresse email
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information de contact */}
        <p className={`${typography.small} mt-8 text-center text-slate-500 dark:text-slate-500`}>
          Besoin d&apos;aide ?{' '}
          <a
            href="mailto:support@did-annuaire.fr"
            className="text-primary font-medium hover:underline"
          >
            support@did-annuaire.fr
          </a>
        </p>
      </div>

      {/* Modal OTP */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          toast.success('Vérification réussie ! Redirection...');
          setTimeout(() => router.push('/dashboard'), 1500);
        }}
      />
    </div>
  );
}
