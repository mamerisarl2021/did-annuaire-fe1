/**
 * Index du système de thème
 * =========================
 *
 * Point d'entrée public du module de theming.
 * Expose uniquement les API nécessaires aux consommateurs.
 *
 * RÈGLE D'IMPORT :
 * Les composants importent depuis '@/theme' uniquement.
 */

// Provider
export { ThemeProvider } from './ThemeProvider';

// Hook
export { useTheme } from './hooks';

// Types (pour les consumers qui en ont besoin)
export type {
  ThemeMode,
  ResolvedTheme,
  ThemeContextValue,
  ColorPalette,
  ThemeDefinition,
} from './types/theme.types';

// Config (pour les cas avancés)
export { AVAILABLE_MODES, MODE_LABELS } from './theme.config';
