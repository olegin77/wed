import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: 'var(--wt-text-xs)',
  sm: 'var(--wt-text-sm)',
  base: 'var(--wt-text-base)',
  lg: 'var(--wt-text-lg)',
  xl: 'var(--wt-text-xl)',
  '2xl': 'var(--wt-text-2xl)',
  '3xl': 'var(--wt-text-3xl)',
  '4xl': 'var(--wt-text-4xl)',
  '5xl': 'var(--wt-text-5xl)',
};

const weightMap = {
  light: 'var(--wt-font-light)',
  normal: 'var(--wt-font-normal)',
  medium: 'var(--wt-font-medium)',
  semibold: 'var(--wt-font-semibold)',
  bold: 'var(--wt-font-bold)',
  extrabold: 'var(--wt-font-extrabold)',
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

export function Heading({
  children,
  level = 1,
  size,
  weight = 'bold',
  color = 'default',
  align = 'left',
  className = '',
  style,
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  const headingStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-family)',
    fontSize: size ? sizeMap[size] : undefined,
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    lineHeight: 'var(--wt-leading-tight)',
    margin: 0,
    ...style,
  };

  return (
    <Component className={className} style={headingStyles}>
      {children}
    </Component>
  );
}