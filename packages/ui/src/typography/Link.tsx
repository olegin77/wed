import React from 'react';

interface LinkProps {
  children: React.ReactNode;
  href?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  underline?: 'none' | 'hover' | 'always';
  as?: 'a' | 'button' | 'span';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const sizeMap = {
  xs: 'var(--wt-text-xs)',
  sm: 'var(--wt-text-sm)',
  base: 'var(--wt-text-base)',
  lg: 'var(--wt-text-lg)',
  xl: 'var(--wt-text-xl)',
};

const weightMap = {
  normal: 'var(--wt-font-normal)',
  medium: 'var(--wt-font-medium)',
  semibold: 'var(--wt-font-semibold)',
  bold: 'var(--wt-font-bold)',
};

const colorMap = {
  default: 'var(--wt-fg)',
  accent: 'var(--wt-accent)',
  success: 'var(--wt-success)',
  warning: 'var(--wt-warning)',
  error: 'var(--wt-error)',
  info: 'var(--wt-info)',
};

export function Link({
  children,
  href,
  size = 'base',
  weight = 'normal',
  color = 'accent',
  underline = 'hover',
  as: Component = 'a',
  className = '',
  style,
  onClick,
}: LinkProps) {
  const linkStyles: React.CSSProperties = {
    fontFamily: 'var(--wt-font-family)',
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    lineHeight: 'var(--wt-leading-normal)',
    letterSpacing: 'var(--wt-tracking-normal)',
    textDecoration: underline === 'always' ? 'underline' : 'none',
    textUnderlineOffset: 'var(--wt-underline-offset)',
    textDecorationThickness: 'var(--wt-underline-thickness)',
    cursor: 'pointer',
    transition: 'var(--wt-transition-fast)',
    margin: 0,
    ...style,
  };

  const hoverStyles = underline === 'hover' ? {
    textDecoration: 'underline',
  } : {};

  return (
    <Component
      href={href}
      className={`wt-text-body ${className}`}
      style={linkStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (underline === 'hover') {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (underline === 'hover') {
          e.currentTarget.style.textDecoration = 'none';
        }
      }}
    >
      {children}
    </Component>
  );
}
