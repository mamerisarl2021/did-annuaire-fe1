'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/shared/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { typography } from '@/lib/typography';
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-emerald-500 blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className={`mb-6 ${typography.displayPrimary}`}>
          Prêt à sécuriser vos identités numériques ?
        </h2>
        <p className={`mx-auto mb-10 max-w-2xl ${typography.bodyLg} text-slate-300`}>
          Rejoignez les organisations qui construisent le web de confiance de demain. Commencez dès
          aujourd&apos;hui à émettre vos premiers identifiants décentralisés.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="default"
            className="h-12 bg-white px-8 text-base text-slate-900 hover:bg-slate-100"
            asChild
          >
            <Link href={ROUTES.public.register}>
              Créer un compte organisation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-slate-700 px-8 text-base text-slate-300 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href={ROUTES.public.contact}>Contacter l&apos;équipe commerciale</Link>
          </Button>
        </div>

        <p className={`mt-8 ${typography.small}`}>
          Aucune carte bancaire requise pour démarrer • Conformité RGPD • Support dédié
        </p>
      </div>
    </section>
  );
}
