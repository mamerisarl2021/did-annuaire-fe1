'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import LandingScene from './3d/LandingScene';
import { Button } from '@/components/ui/button';
import { typography } from '@/lib/typography';
import { ROUTES } from '@/shared/lib/constants/routes';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background decorators */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-slate-200/50 opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 ${typography.overline} normal-case text-blue-700`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Disponible pour les administrations et entreprises
            </div>

            <h1 className={`mb-6 ${typography.displayHero} text-slate-900`}>
              L&apos;identité numérique <br />
              <span className="text-primary">décentralisée</span> et de confiance.
            </h1>

            <p className={`mb-8 max-w-lg ${typography.lead}`}>
              Émettez des identifiants vérifiables (W3C VCs) et gérez vos DIDs en toute conformité.
              Une infrastructure souveraine pour bâtir la confiance numérique.
            </p>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href={ROUTES.public.register}>
                  Créer une organisation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="#features">Découvrir la plateforme</Link>
              </Button>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center gap-2 ${typography.caption}`}>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Conforme W3C DID Core & Verifiable Credentials v2</span>
              </div>
              <div className={`flex items-center gap-2 ${typography.caption}`}>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Hébergement souverain & Sécurité auditable</span>
              </div>
            </div>
          </motion.div>

          {/* 3D Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] w-full lg:h-[600px]"
          >
            <LandingScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
