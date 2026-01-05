'use client';

import { motion } from 'framer-motion';
import { Fingerprint, Lock, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { typography } from '@/lib/typography';

const didFeatures = [
  {
    icon: Fingerprint,
    title: 'Identifiant unique',
    description:
      'Chaque DID est un identifiant globalement unique qui vous appartient, sans dépendance à une autorité centrale.',
  },
  {
    icon: Lock,
    title: 'Contrôle cryptographique',
    description:
      'Associé à des clés cryptographiques, le DID permet de prouver votre identité de manière sécurisée.',
  },
  {
    icon: FileCheck,
    title: 'DID Document',
    description:
      'Chaque DID est associé à un document JSON-LD contenant les clés publiques et méthodes de vérification.',
  },
];

export function DidExplanation() {
  return (
    <section className="bg-white py-24 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 ${typography.displaySecondary} text-slate-900 dark:text-white`}>
            Qu&apos;est-ce qu&apos;un DID ?
          </h2>
          <p className={`${typography.bodyLg} text-slate-600 dark:text-slate-300`}>
            Un Decentralized Identifier (DID) est un nouveau type d&apos;identifiant numérique
            standardisé par le W3C, permettant une identité vérifiable et décentralisée.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {didFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className={`${typography.h4} dark:text-white`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${typography.body} text-slate-600 dark:text-slate-300`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
