/**
 * Palette Light
 * =============
 *
 * Définition déclarative des couleurs du thème clair.
 * Aucune logique - uniquement des valeurs statiques.
 *
 * RESPONSABILITÉ UNIQUE :
 * Fournir les valeurs de couleur pour le thème light.
 *
 * FORMAT :
 * OKLCH pour une meilleure perception des couleurs
 * et des gradients plus naturels.
 */

import type { ThemeDefinition } from '../types/theme.types';

export const lightPalette: ThemeDefinition = {
  id: 'light',
  label: 'Clair',
  colors: {
    // ═══════════════════════════════════════════════════════════════
    // BACKGROUND & SURFACES
    // ═══════════════════════════════════════════════════════════════
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.145 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.145 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // BRAND COLORS - Bleu institutionnel sobre
    // ═══════════════════════════════════════════════════════════════
    primary: 'oklch(0.45 0.18 250)',
    primaryForeground: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.97 0 0)',
    secondaryForeground: 'oklch(0.205 0 0)',
    accent: 'oklch(0.97 0 0)',
    accentForeground: 'oklch(0.205 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // SEMANTIC STATES
    // ═══════════════════════════════════════════════════════════════
    muted: 'oklch(0.97 0 0)',
    mutedForeground: 'oklch(0.556 0 0)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.985 0 0)',
    success: 'oklch(0.627 0.194 145)',
    successForeground: 'oklch(0.985 0 0)',
    warning: 'oklch(0.75 0.183 55)',
    warningForeground: 'oklch(0.205 0 0)',

    // ═══════════════════════════════════════════════════════════════
    // UI ELEMENTS
    // ═══════════════════════════════════════════════════════════════
    border: 'oklch(0.922 0 0)',
    input: 'oklch(0.922 0 0)',
    ring: 'oklch(0.45 0.18 250)',

    // ═══════════════════════════════════════════════════════════════
    // SIDEBAR
    // ═══════════════════════════════════════════════════════════════
    sidebar: 'oklch(0.985 0 0)',
    sidebarForeground: 'oklch(0.145 0 0)',
    sidebarPrimary: 'oklch(0.45 0.18 250)',
    sidebarPrimaryForeground: 'oklch(0.985 0 0)',
    sidebarAccent: 'oklch(0.97 0 0)',
    sidebarAccentForeground: 'oklch(0.205 0 0)',
    sidebarBorder: 'oklch(0.922 0 0)',
    sidebarRing: 'oklch(0.45 0.18 250)',

    // ═══════════════════════════════════════════════════════════════
    // DATA VISUALIZATION
    // ═══════════════════════════════════════════════════════════════
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)',
  },
};
