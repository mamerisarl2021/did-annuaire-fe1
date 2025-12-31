/**
 * Fichier de configuration des polices
 * =====================================
 *
 * Ce fichier est la source unique de vérité pour les polices du projet.
 * Aucun autre fichier ne doit importer de polices directement.
 *
 * CHOIX DES POLICES
 * -----------------
 *
 * 1. Inter (Police principale - UI & Corps de texte)
 *    - Conçue pour les interfaces utilisateur modernes
 *    - Excellente lisibilité sur écran à toutes tailles
 *    - Support des features OpenType (tabular figures pour DIDs)
 *    - Standard enterprise SaaS (Stripe, Linear, Vercel)
 *
 * 2. Plus Jakarta Sans (Police des titres stratégiques)
 *    - Géométrique et contemporaine
 *    - Plus de personnalité que Inter pour les headlines
 *    - Communique l'innovation avec sobriété
 *    - Parfait pour les landing pages institutionnelles
 *
 * RESPONSABILITÉS
 * ---------------
 * - Déclaration unique des polices
 * - Exposition des variables CSS (--font-sans, --font-heading)
 * - Configuration des subsets et poids optimisés
 */

import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Police principale pour l'UI et le corps de texte
 * Utilisée via la classe Tailwind `font-sans`
 */
export const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  // Poids optimisés pour performance (pas de 100, 200, 900)
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * Police des titres stratégiques (H1, H2, CTA majeurs)
 * Utilisée via la classe Tailwind `font-heading`
 */
export const fontHeading = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  // Poids pour titres : medium à extrabold
  weight: ['500', '600', '700', '800'],
});

/**
 * Classes CSS à appliquer sur l'élément body
 * Expose les variables CSS pour Tailwind
 */
export const fontVariables = `${fontSans.variable} ${fontHeading.variable}`;
