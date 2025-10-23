export * from './types';
export * from './modern';
export * from './rustic';
export * from './minimalist';
export * from './ThemeSelector';

// Re-export all themes
export { modernTheme } from './modern';
export { rusticTheme } from './rustic';
export { minimalistTheme } from './minimalist';

// Theme registry
import { modernTheme } from './modern';
import { rusticTheme } from './rustic';
import { minimalistTheme } from './minimalist';
import { WeddingTheme } from './types';

export const themeRegistry: WeddingTheme[] = [
  modernTheme,
  rusticTheme,
  minimalistTheme,
];

export function getTheme(themeId: string): WeddingTheme | undefined {
  return themeRegistry.find(theme => theme.id === themeId);
}

export function getThemesByCategory(category: string): WeddingTheme[] {
  if (category === 'all') {
    return themeRegistry;
  }
  return themeRegistry.filter(theme => theme.category === category);
}