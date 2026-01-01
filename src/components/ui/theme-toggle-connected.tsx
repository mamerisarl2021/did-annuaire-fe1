/**
 * ThemeToggleConnected
 * ====================
 *
 * Composant connecté au contexte de thème.
 * Fait le pont entre le contexte et le composant UI pur.
 *
 * RESPONSABILITÉ UNIQUE :
 * Connecter le ThemeToggle au ThemeProvider.
 */

'use client';

import { useTheme } from '@/theme';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ui/theme-toggle';

interface ThemeToggleConnectedProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * ThemeToggle connecté avec dropdown (light/dark/system)
 */
export function ThemeToggleConnected({
  variant,
  size,
  className,
}: ThemeToggleConnectedProps) {
  const { resolvedTheme, mode, setMode } = useTheme();

  return (
    <ThemeToggle
      resolvedTheme={resolvedTheme}
      currentMode={mode}
      onModeChange={setMode}
      variant={variant}
      size={size}
      className={className}
    />
  );
}

/**
 * SimpleThemeToggle connecté (toggle simple light/dark)
 */
export function SimpleThemeToggleConnected({
  variant,
  size,
  className,
}: ThemeToggleConnectedProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <SimpleThemeToggle
      resolvedTheme={resolvedTheme}
      onToggle={toggleTheme}
      variant={variant}
      size={size}
      className={className}
    />
  );
}
