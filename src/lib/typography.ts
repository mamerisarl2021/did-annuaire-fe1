/**
 * Tokens Typographiques
 * =====================
 *
 * Ce fichier définit l'échelle typographique du projet.
 * Les composants consomment ces tokens, jamais de valeurs en dur.
 *
 * ÉCHELLE TYPOGRAPHIQUE
 * ---------------------
 * Basée sur une échelle modulaire (ratio 1.25 - Major Third)
 * permettant une progression harmonieuse des tailles.
 *
 * Base: 16px (1rem)
 * Ratio: 1.25
 *
 * HIÉRARCHIE
 * ----------
 * - Display: Titres hero, sections majeures
 * - Heading: Titres de sections, cartes
 * - Body: Texte courant, UI
 * - Detail: Captions, labels, métadonnées
 *
 * LINE-HEIGHT
 * -----------
 * - Titres: 1.1-1.2 (dense, impact visuel)
 * - Body: 1.5-1.6 (optimal pour lecture écran)
 * - UI: 1.4 (compact mais lisible)
 *
 * LETTER-SPACING
 * --------------
 * - Titres grands: légèrement resserré (-0.02em)
 * - Body: normal (0)
 * - Small caps/labels: légèrement écarté (+0.02em)
 */

/**
 * Tokens de taille de police
 * Clé sémantique → valeur Tailwind/CSS
 */
export const fontSizeTokens = {
  // Display - Titres hero
  'display-2xl': 'text-6xl lg:text-7xl', // 60px → 72px
  'display-xl': 'text-5xl lg:text-6xl', // 48px → 60px
  'display-lg': 'text-4xl lg:text-5xl', // 36px → 48px

  // Heading - Titres de sections
  'heading-xl': 'text-3xl lg:text-4xl', // 30px → 36px
  'heading-lg': 'text-2xl lg:text-3xl', // 24px → 30px
  'heading-md': 'text-xl lg:text-2xl', // 20px → 24px
  'heading-sm': 'text-lg lg:text-xl', // 18px → 20px

  // Body - Texte courant
  'body-xl': 'text-xl', // 20px
  'body-lg': 'text-lg', // 18px
  'body-md': 'text-base', // 16px (base)
  'body-sm': 'text-sm', // 14px

  // Detail - Captions, labels
  'detail-md': 'text-sm', // 14px
  'detail-sm': 'text-xs', // 12px
} as const;

/**
 * Tokens de line-height
 */
export const lineHeightTokens = {
  tight: 'leading-tight', // 1.25
  snug: 'leading-snug', // 1.375
  normal: 'leading-normal', // 1.5
  relaxed: 'leading-relaxed', // 1.625
  display: 'leading-[1.1]', // 1.1 - pour les très grands titres
} as const;

/**
 * Tokens de letter-spacing
 */
export const letterSpacingTokens = {
  tighter: 'tracking-tighter', // -0.05em
  tight: 'tracking-tight', // -0.025em
  normal: 'tracking-normal', // 0
  wide: 'tracking-wide', // 0.025em
  wider: 'tracking-wider', // 0.05em
} as const;

/**
 * Tokens de font-weight
 */
export const fontWeightTokens = {
  light: 'font-light', // 300
  normal: 'font-normal', // 400
  medium: 'font-medium', // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold', // 700
  extrabold: 'font-extrabold', // 800
} as const;

/**
 * Compositions typographiques pré-définies
 * Classes Tailwind complètes pour usage direct
 */
export const typography = {
  // ═══════════════════════════════════════════════════════════════
  // DISPLAY - Titres hero, sections majeures
  // ═══════════════════════════════════════════════════════════════

  /** Hero principal - Plus grande taille, impact maximal */
  displayHero: 'font-heading text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight',

  /** Display principal - Titres de section majeurs */
  displayPrimary: 'font-heading text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight',

  /** Display secondaire - Sous-titres hero */
  displaySecondary: 'font-heading text-3xl lg:text-4xl font-semibold leading-tight tracking-tight',

  // ═══════════════════════════════════════════════════════════════
  // HEADINGS - Titres de sections, cartes, modales
  // ═══════════════════════════════════════════════════════════════

  /** H1 - Titre de page principal */
  h1: 'font-heading text-3xl lg:text-4xl font-bold leading-tight tracking-tight',

  /** H2 - Sections principales */
  h2: 'font-heading text-2xl lg:text-3xl font-semibold leading-snug tracking-tight',

  /** H3 - Sous-sections, cartes */
  h3: 'font-heading text-xl lg:text-2xl font-semibold leading-snug',

  /** H4 - Titres de cartes, accordéons */
  h4: 'font-sans text-lg lg:text-xl font-semibold leading-snug',

  /** H5 - Petits titres, labels de section */
  h5: 'font-sans text-base lg:text-lg font-semibold leading-normal',

  /** H6 - Micro-titres */
  h6: 'font-sans text-sm font-semibold leading-normal tracking-wide uppercase',

  // ═══════════════════════════════════════════════════════════════
  // BODY - Texte courant et paragraphes
  // ═══════════════════════════════════════════════════════════════

  /** Lead - Paragraphe d'introduction mis en valeur */
  lead: 'font-sans text-xl lg:text-2xl font-normal leading-relaxed text-muted-foreground',

  /** Body large - Texte principal, paragraphes importants */
  bodyLg: 'font-sans text-lg font-normal leading-relaxed',

  /** Body - Texte courant standard */
  body: 'font-sans text-base font-normal leading-relaxed',

  /** Body small - Texte secondaire */
  bodySm: 'font-sans text-sm font-normal leading-relaxed',

  // ═══════════════════════════════════════════════════════════════
  // UI - Éléments d'interface
  // ═══════════════════════════════════════════════════════════════

  /** Label de formulaire */
  label: 'font-sans text-sm font-medium leading-none',

  /** Texte de bouton */
  button: 'font-sans text-sm font-medium leading-none',

  /** Texte de bouton large */
  buttonLg: 'font-sans text-base font-medium leading-none',

  /** Lien */
  link: 'font-sans text-base font-medium underline underline-offset-4',

  // ═══════════════════════════════════════════════════════════════
  // DETAIL - Captions, métadonnées, annotations
  // ═══════════════════════════════════════════════════════════════

  /** Caption - Légendes, crédits */
  caption: 'font-sans text-sm font-normal leading-normal text-muted-foreground',

  /** Overline - Labels de catégorie, badges */
  overline: 'font-sans text-xs font-semibold leading-none tracking-wider uppercase',

  /** Code inline - Identifiants DID, clés */
  code: 'font-mono text-sm font-normal',

  /** Small - Texte très petit (legal, footnotes) */
  small: 'font-sans text-xs font-normal leading-normal text-muted-foreground',
} as const;

/**
 * Type pour l'auto-complétion
 */
export type TypographyToken = keyof typeof typography;
