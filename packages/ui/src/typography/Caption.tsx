import React from 'react';

interface CaptionProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm';
  weight?: 'light' | 'normal' | 'medium' | 'semibold';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right';
  as?: 'p' | 'span' | 'div' | 'label' | 'caption';
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  xs: 'var(--wt-text-xs)',
  sm: 'var(--wt-text-sm)',
};

const weightMap = {
  light: 'var(--wt-font-light)',
  normal: 'var(--wt-font-normal)',
  medium: 'var(--wt-font-medium)',
  semibold: 'var(--wt-font-semibold)',
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

export function Caption({
  children,
  size = 'sm',
  weight = 'normal',
  color = 'muted',
  align = 'left',
  as: Component = 'span',
  className = '',
  style,
}: CaptionProps) {
  const captionStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-family)',
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    lineHeight: 'var(--wt-leading-normal)',
    letterSpacing: 'var(--wt-tracking-wide)',
    margin: 0,
    ...style,
  };

  return (
    <Component className={`wt-text-caption ${className}`} style={captionStyles}>
      {children}
    </Component>
  );
}
