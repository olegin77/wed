import React from 'react';

export interface DisplayProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: 'var(--wt-text-2xl)',
  sm: 'var(--wt-text-3xl)',
  base: 'var(--wt-text-4xl)',
  lg: 'var(--wt-text-5xl)',
  xl: 'var(--wt-text-6xl)',
  '2xl': 'var(--wt-text-7xl)',
  '3xl': 'var(--wt-text-8xl)',
  '4xl': 'var(--wt-text-9xl)',
  '5xl': 'var(--wt-text-9xl)',
  '6xl': 'var(--wt-text-9xl)',
  '7xl': 'var(--wt-text-9xl)',
  '8xl': 'var(--wt-text-9xl)',
  '9xl': 'var(--wt-text-9xl)',
};

const weightMap = {
  thin: 'var(--wt-font-thin)',
  extralight: 'var(--wt-font-extralight)',
  light: 'var(--wt-font-light)',
  normal: 'var(--wt-font-normal)',
  medium: 'var(--wt-font-medium)',
  semibold: 'var(--wt-font-semibold)',
  bold: 'var(--wt-font-bold)',
  extrabold: 'var(--wt-font-extrabold)',
  black: 'var(--wt-font-black)',
};

const colorMap = {
  default: 'var(--wt-fg)',
  muted: 'var(--wt-muted)',
  accent: 'var(--wt-accent)',
  success: 'var(--wt-success)',
  warning: 'var(--wt-warning)',
  error: 'var(--wt-error)',
  info: 'var(--wt-info)',
};

export function Display({
  children,
  size = 'base',
  weight = 'bold',
  color = 'default',
  align = 'left',
  className = '',
  style,
}: DisplayProps) {
  const displayStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-display)',
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    lineHeight: 'var(--wt-leading-tight)',
    letterSpacing: 'var(--wt-tracking-tight)',
    margin: 0,
    ...style,
  };

  return (
    <h1 className={`wt-text-display ${className}`} style={displayStyles}>
      {children}
    </h1>
  );
}
