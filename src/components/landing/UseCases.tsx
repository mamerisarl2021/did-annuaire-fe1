'use client';

import { Landmark, GraduationCap, FileCheck, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { typography } from '@/lib/typography';

export function UseCases() {
  return (
    <section id="cas-usage" className="bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className={`mb-4 ${typography.displaySecondary} text-slate-900`}>
            Des applications concrètes
          </h2>
          <p className={`mx-auto max-w-2xl ${typography.bodyLg} text-slate-600`}>
            La plateforme DID Annuaire s&apos;adapte à de nombreux secteurs pour sécuriser les
            échanges et simplifier les démarches.
          </p>
        </div>

        <Tabs defaultValue="public" className="mx-auto max-w-4xl">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-3 p-1">
            <TabsTrigger value="public" className="py-3 text-sm md:text-base">
              Sécurité Publique
            </TabsTrigger>
            <TabsTrigger value="education" className="py-3 text-sm md:text-base">
              Éducation & Formation
            </TabsTrigger>
            <TabsTrigger value="corporate" className="py-3 text-sm md:text-base">
              Supply Chain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-6">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Landmark className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>Administration & Citoyenneté</CardTitle>
                </div>
                <CardDescription>Dématérialisation des justificatifs officiels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="grid gap-4 sm:grid-cols-2">
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Carte d&apos;identité numérique mobile
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Justificatifs de domicile vérifiables
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Permis de conduire dématérialisés
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">Votes électroniques sécurisés</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <GraduationCap className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>Diplômes & Certifications</CardTitle>
                </div>
                <CardDescription>Lutte contre la fraude aux diplômes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="grid gap-4 sm:grid-cols-2">
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Diplômes universitaires infalsifiables
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Certificats de formation professionnelle
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">Micro-crédits éducatifs</span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">CV vérifiés automatiquement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corporate" className="mt-6">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Truck className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>Traçabilité & Logistique</CardTitle>
                </div>
                <CardDescription>
                  Transparence de la chaîne d&apos;approvisionnement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="grid gap-4 sm:grid-cols-2">
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Passeport produit numérique (DPP)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Certification d&apos;origine et qualité
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Accès sécurisé aux sites sensibles
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheck className="h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      Mandats et délégations de signature
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
