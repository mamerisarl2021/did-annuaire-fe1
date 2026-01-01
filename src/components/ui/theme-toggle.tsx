/**
 * ThemeToggle
 * ===========
 *
 * Bouton de basculement de thème.
 * Composant UI pur - aucune logique de theming.
 *
 * RESPONSABILITÉ UNIQUE :
 * Afficher un bouton et appeler le callback au clic.
 *
 * CE QUE CE COMPOSANT NE FAIT PAS :
 * - Ne connaît pas les palettes de couleurs
 * - Ne connaît pas les thèmes disponibles
 * - Ne contient aucune logique de décision
 * - N'accède pas au localStorage
 */

'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResolvedTheme, ThemeMode } from '@/theme/types/theme.types';

/**
 * Props du ThemeToggle
 * Tout est passé par props - aucune dépendance au contexte
 */
interface ThemeToggleProps {
  /** Thème actuellement résolu (pour l'icône) */
  resolvedTheme: ResolvedTheme;
  /** Mode actuellement sélectionné */
  currentMode: ThemeMode;
  /** Callback de changement de mode */
  onModeChange: (mode: ThemeMode) => void;
  /** Variante du bouton */
  variant?: 'default' | 'outline' | 'ghost';
  /** Taille du bouton */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Icône correspondant au thème résolu
 */
function ThemeIcon({ theme }: { theme: ResolvedTheme }) {
  return theme === 'dark' ? (
    <Moon className="h-4 w-4" />
  ) : (
    <Sun className="h-4 w-4" />
  );
}

/**
 * Bouton de toggle de thème avec dropdown
 */
export function ThemeToggle({
  resolvedTheme,
  currentMode,
  onModeChange,
  variant = 'ghost',
  size = 'icon',
  className,
}: ThemeToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <ThemeIcon theme={resolvedTheme} />
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onModeChange('light')}
          className={currentMode === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="mr-2 h-4 w-4" />
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onModeChange('dark')}
          className={currentMode === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="mr-2 h-4 w-4" />
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onModeChange('system')}
          className={currentMode === 'system' ? 'bg-accent' : ''}
        >
          <Monitor className="mr-2 h-4 w-4" />
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Bouton de toggle simple (light/dark uniquement)
 */
interface SimpleThemeToggleProps {
  /** Thème actuellement résolu */
  resolvedTheme: ResolvedTheme;
  /** Callback de basculement */
  onToggle: () => void;
  /** Variante du bouton */
  variant?: 'default' | 'outline' | 'ghost';
  /** Taille du bouton */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Classes CSS additionnelles */
  className?: string;
}

export function SimpleThemeToggle({
  resolvedTheme,
  onToggle,
  variant = 'ghost',
  size = 'icon',
  className,
}: SimpleThemeToggleProps) {
  return (
    <Button variant={variant} size={size} onClick={onToggle} className={className}>
      <ThemeIcon theme={resolvedTheme} />
      <span className="sr-only">Basculer le thème</span>
    </Button>
  );
}
