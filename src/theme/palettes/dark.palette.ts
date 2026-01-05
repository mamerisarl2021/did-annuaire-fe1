/**
 * Palette Dark
 * ============
 *
 * Définition déclarative des couleurs du thème sombre.
 * Aucune logique - uniquement des valeurs statiques.
 *
 * RESPONSABILITÉ UNIQUE :
 * Fournir les valeurs de couleur pour le thème dark.
 *
 * FORMAT :
 * OKLCH pour une meilleure perception des couleurs
 * et des gradients plus naturels.
 */

import type { ThemeDefinition } from '../types/theme.types';

export const darkPalette: ThemeDefinition = {
  id: 'dark',
  label: 'Sombre',
  colors: {
    // ═══════════════════════════════════════════════════════════════
    // BACKGROUND & SURFACES
    // ═══════════════════════════════════════════════════════════════
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    cardForeground: 'oklch(0.985 0 0)',
    popover: 'oklch(0.205 0 0)',
    popoverForeground: 'oklch(0.985 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // BRAND COLORS - Bleu institutionnel adapté au dark
    // ═══════════════════════════════════════════════════════════════
    primary: 'oklch(0.65 0.2 250)',
    primaryForeground: 'oklch(0.145 0 0)',
    secondary: 'oklch(0.269 0 0)',
    secondaryForeground: 'oklch(0.985 0 0)',
    accent: 'oklch(0.269 0 0)',
    accentForeground: 'oklch(0.985 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // SEMANTIC STATES
    // ═══════════════════════════════════════════════════════════════
    muted: 'oklch(0.269 0 0)',
    mutedForeground: 'oklch(0.708 0 0)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.985 0 0)',
    success: 'oklch(0.696 0.17 145)',
    successForeground: 'oklch(0.145 0 0)',
    warning: 'oklch(0.8 0.15 55)',
    warningForeground: 'oklch(0.145 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // UI ELEMENTS
    // ═══════════════════════════════════════════════════════════════
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.65 0.2 250)',

    // ═══════════════════════════════════════════════════════════════
    // SIDEBAR
    // ═══════════════════════════════════════════════════════════════
    sidebar: 'oklch(0.205 0 0)',
    sidebarForeground: 'oklch(0.985 0 0)',
    sidebarPrimary: 'oklch(0.65 0.2 250)',
    sidebarPrimaryForeground: 'oklch(0.985 0 0)',
    sidebarAccent: 'oklch(0.269 0 0)',
    sidebarAccentForeground: 'oklch(0.985 0 0)',
    sidebarBorder: 'oklch(1 0 0 / 10%)',
    sidebarRing: 'oklch(0.65 0.2 250)',

    // ═══════════════════════════════════════════════════════════════
    // DATA VISUALIZATION
    // ═══════════════════════════════════════════════════════════════
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)',
  },
};
