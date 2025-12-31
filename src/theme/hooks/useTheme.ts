/**
 * Hook useTheme
 * =============
 *
 * Interface minimaliste pour consommer le thème dans les composants.
 * Ne contient aucune logique - délègue tout au contexte.
 *
 * RESPONSABILITÉ UNIQUE :
 * Exposer le contexte de thème aux composants de manière type-safe.
 */

'use client';

import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';
import type { ThemeContextValue } from '../types/theme.types';

/**
 * Hook pour accéder au système de thème
 *
 * @returns Le contexte de thème complet
 * @throws Error si utilisé en dehors du ThemeProvider
 *
 * @example
 * ```tsx
 * const { resolvedTheme, toggleTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
