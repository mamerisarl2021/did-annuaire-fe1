'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Database, Boxes, Code2, Lock, Fingerprint } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { typography } from '@/lib/typography';
const features = [
  {
    icon: ShieldCheck,
    title: 'Sécurité Maximale',
    description:
      'Chiffrement de bout en bout et gestion des clés cryptographiques selon les normes de sécurité les plus strictes (HSM, FIPS 140-2).',
  },
  {
    icon: Boxes,
    title: 'Interopérabilité W3C',
    description:
      "Support natif des standards DID et Verifiable Credentials garantissant une compatibilité totale avec l'écosystème SSI mondial.",
  },
  {
    icon: Database,
    title: 'Souveraineté des Données',
    description:
      'Vos données restent sous votre contrôle exclusif. Infrastructure hébergée localement sans dépendance critique à des tiers.',
  },
  {
    icon: Fingerprint,
    title: 'Identité Vérifiée',
    description:
      "Processus de vérification d'organisation rigoureux (KYB) pour garantir la légitimité des émetteurs d'identifiants.",
  },
  {
    icon: Lock,
    title: 'Confidentialité par Design',
    description:
      "Architecture minimisant l'exposition des données personnelles (Selective Disclosure) et respectant le RGPD.",
  },
  {
    icon: Code2,
    title: 'API Développeur',
    description:
      'Intégration simple via nos SDKs et API REST documentées pour émettre et vérifier des justificatifs en quelques lignes de code.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 ${typography.displaySecondary} text-slate-900`}>
            Une infrastructure conçue pour la confiance
          </h2>
          <p className={`${typography.bodyLg} text-slate-600`}>
            Combinez la puissance de la cryptographie moderne avec la facilité d&apos;usage
            d&apos;une plateforme SaaS professionnelle.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className={typography.h4}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${typography.body} text-slate-600`}>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
