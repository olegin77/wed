import React from 'react';

interface CodeProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  as?: 'code' | 'pre' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: 'var(--wt-text-xs)',
  sm: 'var(--wt-text-sm)',
  base: 'var(--wt-text-base)',
  lg: 'var(--wt-text-lg)',
};

const weightMap = {
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

export function Code({
  children,
  size = 'sm',
  weight = 'normal',
  color = 'default',
  as: Component = 'code',
  className = '',
  style,
}: CodeProps) {
  const codeStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-mono)',
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    lineHeight: 'var(--wt-leading-normal)',
    letterSpacing: 'var(--wt-tracking-normal)',
    backgroundColor: 'var(--wt-bg)',
    padding: '2px 4px',
    borderRadius: 'var(--wt-radius-sm)',
    border: '1px solid var(--wt-muted)',
    margin: 0,
    ...style,
  };

  return (
    <Component className={`wt-text-mono ${className}`} style={codeStyles}>
      {children}
    </Component>
  );
}
