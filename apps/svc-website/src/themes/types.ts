export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    accent: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface WeddingTheme {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'rustic' | 'minimalist' | 'classic' | 'romantic' | 'vintage';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  preview: string; // URL to preview image
  isPremium?: boolean;
  tags: string[];
}

export const THEME_CATEGORIES = {
  modern: 'Современный',
  rustic: 'Деревенский',
  minimalist: 'Минималистичный',
  classic: 'Классический',
  romantic: 'Романтичный',
  vintage: 'Винтажный',
} as const;

export type ThemeCategory = keyof typeof THEME_CATEGORIES;