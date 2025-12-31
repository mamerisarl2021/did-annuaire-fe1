/**
 * Configuration du système de thème
 * =================================
 *
 * Fichier de configuration statique du système de theming.
 * Aucune logique - uniquement des mappings et constantes.
 *
 * RESPONSABILITÉ UNIQUE :
 * Centraliser la configuration du système de thème.
 */

import type { ResolvedTheme, ThemeDefinition, ThemeMode } from './types/theme.types';
import { lightPalette, darkPalette } from './palettes';

/**
 * Clé de stockage localStorage
 */
export const THEME_STORAGE_KEY = 'did-annuaire-theme-mode';

/**
 * Mode par défaut au premier chargement
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

/**
 * Mapping des thèmes résolus vers leurs définitions
 * Ajouter un nouveau thème = ajouter une entrée ici
 */
export const THEME_DEFINITIONS: Record<ResolvedTheme, ThemeDefinition> = {
  light: lightPalette,
  dark: darkPalette,
};

/**
 * Liste ordonnée des modes disponibles (pour le cycle toggle)
 */
export const AVAILABLE_MODES: ThemeMode[] = ['light', 'dark', 'system'];

/**
 * Labels des modes pour l'affichage
 */
export const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Clair',
  dark: 'Sombre',
  system: 'Système',
};
