/**
 * Service de thème
 * ================
 *
 * Fonctions pures pour la gestion du thème.
 * Aucun état, aucun side-effect - uniquement de la logique.
 *
 * RESPONSABILITÉ UNIQUE :
 * Fournir la logique métier du système de theming.
 */

import type { ColorPalette, ResolvedTheme, ThemeDefinition, ThemeMode } from './types/theme.types';
import { DEFAULT_THEME_MODE, THEME_DEFINITIONS, THEME_STORAGE_KEY } from './theme.config';

/**
 * Résout le thème système en fonction des préférences OS
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Résout le mode en thème effectif
 */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

/**
 * Récupère la définition complète d'un thème
 */
export function getThemeDefinition(resolvedTheme: ResolvedTheme): ThemeDefinition {
  return THEME_DEFINITIONS[resolvedTheme];
}

/**
 * Persiste le mode dans le localStorage
 */
export function persistThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Récupère le mode depuis le localStorage
 */
export function getPersistedThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME_MODE;
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Silently fail if localStorage is not available
  }

  return DEFAULT_THEME_MODE;
}

/**
 * Applique les variables CSS d'une palette au document
 */
export function applyThemeToDocument(palette: ColorPalette): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Mapping des propriétés de la palette vers les variables CSS
  const cssVarMapping: Record<keyof ColorPalette, string> = {
    background: '--background',
    foreground: '--foreground',
    card: '--card',
    cardForeground: '--card-foreground',
    popover: '--popover',
    popoverForeground: '--popover-foreground',
    primary: '--primary',
    primaryForeground: '--primary-foreground',
    secondary: '--secondary',
    secondaryForeground: '--secondary-foreground',
    accent: '--accent',
    accentForeground: '--accent-foreground',
    muted: '--muted',
    mutedForeground: '--muted-foreground',
    destructive: '--destructive',
    destructiveForeground: '--destructive-foreground',
    success: '--success',
    successForeground: '--success-foreground',
    warning: '--warning',
    warningForeground: '--warning-foreground',
    border: '--border',
    input: '--input',
    ring: '--ring',
    sidebar: '--sidebar',
    sidebarForeground: '--sidebar-foreground',
    sidebarPrimary: '--sidebar-primary',
    sidebarPrimaryForeground: '--sidebar-primary-foreground',
    sidebarAccent: '--sidebar-accent',
    sidebarAccentForeground: '--sidebar-accent-foreground',
    sidebarBorder: '--sidebar-border',
    sidebarRing: '--sidebar-ring',
    chart1: '--chart-1',
    chart2: '--chart-2',
    chart3: '--chart-3',
    chart4: '--chart-4',
    chart5: '--chart-5',
  };

  // Application de chaque variable CSS
  (Object.keys(cssVarMapping) as Array<keyof ColorPalette>).forEach((key) => {
    root.style.setProperty(cssVarMapping[key], palette[key]);
  });
}

/**
 * Applique la classe dark/light au document
 */
export function applyThemeClass(resolvedTheme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
}

/**
 * Bascule vers le thème opposé
 */
export function getNextTheme(current: ResolvedTheme): ResolvedTheme {
  return current === 'light' ? 'dark' : 'light';
}
