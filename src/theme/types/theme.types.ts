/**
 * Types du système de theming
 * ===========================
 *
 * Ce fichier définit les contrats de données du système de thème.
 * Aucune logique, aucune implémentation - uniquement des types.
 *
 * RESPONSABILITÉ UNIQUE :
 * Définir la forme des données du système de theming.
 */

/**
 * Identifiants des thèmes disponibles
 * Extensible : ajouter un nouveau thème = ajouter une valeur ici
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Thème résolu (après résolution de 'system')
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Palette de couleurs sémantiques
 * Chaque thème doit implémenter cette interface complète
 */
export interface ColorPalette {
  // ═══════════════════════════════════════════════════════════════
  // BACKGROUND & SURFACES
  // ═══════════════════════════════════════════════════════════════
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // ═══════════════════════════════════════════════════════════════
  // BRAND COLORS
  // ═══════════════════════════════════════════════════════════════
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;

  // ═══════════════════════════════════════════════════════════════
  // SEMANTIC STATES
  // ═══════════════════════════════════════════════════════════════
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;

  // ═══════════════════════════════════════════════════════════════
  // UI ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  border: string;
  input: string;
  ring: string;

  // ═══════════════════════════════════════════════════════════════
  // SIDEBAR
  // ═══════════════════════════════════════════════════════════════
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;

  // ═══════════════════════════════════════════════════════════════
  // DATA VISUALIZATION
  // ═══════════════════════════════════════════════════════════════
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

/**
 * Configuration complète d'un thème
 */
export interface ThemeDefinition {
  /** Identifiant unique du thème */
  id: ResolvedTheme;
  /** Nom affiché du thème */
  label: string;
  /** Palette de couleurs */
  colors: ColorPalette;
}

/**
 * État du contexte de thème
 */
export interface ThemeContextState {
  /** Mode sélectionné par l'utilisateur */
  mode: ThemeMode;
  /** Thème résolu (après résolution de 'system') */
  resolvedTheme: ResolvedTheme;
  /** Définition complète du thème actif */
  theme: ThemeDefinition;
}

/**
 * Actions disponibles sur le contexte de thème
 */
export interface ThemeContextActions {
  /** Change le mode de thème */
  setMode: (mode: ThemeMode) => void;
  /** Bascule entre light et dark */
  toggleTheme: () => void;
}

/**
 * Contexte complet exposé aux composants
 */
export type ThemeContextValue = ThemeContextState & ThemeContextActions;
