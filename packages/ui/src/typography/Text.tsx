import React from 'react';

export interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  as?: 'p' | 'span' | 'div' | 'label';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: 'var(--wt-text-xs)',
  sm: 'var(--wt-text-sm)',
  base: 'var(--wt-text-base)',
  lg: 'var(--wt-text-lg)',
  xl: 'var(--wt-text-xl)',
};

const weightMap = {
  light: 'var(--wt-font-light)',
  normal: 'var(--wt-font-normal)',
  medium: 'var(--wt-font-medium)',
  semibold: 'var(--wt-font-semibold)',
  bold: 'var(--wt-font-bold)',
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

export function Text({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  as: Component = 'p',
  className = '',
  style,
}: TextProps) {
  const textStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-family)',
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    lineHeight: 'var(--wt-leading-normal)',
    margin: 0,
    ...style,
  };

  return (
    <Component className={className} style={textStyles}>
      {children}
    </Component>
  );
}