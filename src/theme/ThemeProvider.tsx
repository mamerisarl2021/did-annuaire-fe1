/**
 * ThemeProvider
 * =============
 *
 * Composant provider pour le système de theming.
 * Gère l'état et orchestre les side-effects.
 *
 * RESPONSABILITÉ UNIQUE :
 * Fournir le contexte de thème à l'application.
 */

'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeContextValue, ThemeMode, ResolvedTheme } from './types/theme.types';
import { DEFAULT_THEME_MODE } from './theme.config';
import {
  resolveTheme,
  getThemeDefinition,
  persistThemeMode,
  getPersistedThemeMode,
  applyThemeToDocument,
  applyThemeClass,
  getNextTheme,
  getSystemTheme,
} from './theme.service';

/**
 * Contexte React pour le thème
 * Exporté pour useTheme
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Props du ThemeProvider
 */
interface ThemeProviderProps {
  children: ReactNode;
  /** Mode initial (override le localStorage) */
  defaultMode?: ThemeMode;
  /** Désactive la persistance localStorage */
  disablePersistence?: boolean;
}

// SSR-safe useLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Provider du système de thème
 */
export function ThemeProvider({
  children,
  defaultMode,
  disablePersistence = false,
}: ThemeProviderProps) {
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════

  // Track if initial mount has happened
  const isInitialMount = useRef(true);

  const [mode, setModeState] = useState<ThemeMode>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') {
      return defaultMode ?? DEFAULT_THEME_MODE;
    }
    return defaultMode ?? getPersistedThemeMode();
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    // SSR-safe initialization - always start with light for SSR
    if (typeof window === 'undefined') {
      return 'light';
    }
    return resolveTheme(mode);
  });

  // ═══════════════════════════════════════════════════════════════
  // DERIVED STATE
  // ═══════════════════════════════════════════════════════════════

  const theme = useMemo(() => getThemeDefinition(resolvedTheme), [resolvedTheme]);

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      const newResolved = resolveTheme(newMode);
      setResolvedTheme(newResolved);

      if (!disablePersistence) {
        persistThemeMode(newMode);
      }

      // Apply immediately
      applyThemeClass(newResolved);
      applyThemeToDocument(getThemeDefinition(newResolved).colors);
    },
    [disablePersistence]
  );

  const toggleTheme = useCallback(() => {
    const nextResolved = getNextTheme(resolvedTheme);
    setMode(nextResolved);
  }, [resolvedTheme, setMode]);

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════

  // Initial application of theme (synchronous to avoid flash)
  useIsomorphicLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const currentResolved = resolveTheme(mode);

      // Only update state if different (avoid unnecessary re-render)
      if (currentResolved !== resolvedTheme) {
        setResolvedTheme(currentResolved);
      }

      // Apply theme to DOM (this is the external system sync)
      applyThemeClass(currentResolved);
      applyThemeToDocument(getThemeDefinition(currentResolved).colors);
    }
  }, [mode, resolvedTheme]);

  // Listen to system theme changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const newResolved = getSystemTheme();
      setResolvedTheme(newResolved);
      applyThemeClass(newResolved);
      applyThemeToDocument(getThemeDefinition(newResolved).colors);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      theme,
      setMode,
      toggleTheme,
    }),
    [mode, resolvedTheme, theme, setMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
