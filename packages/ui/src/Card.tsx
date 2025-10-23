import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  state?: 'default' | 'hover' | 'active' | 'focus' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({
  children,
  variant = 'default',
  state = 'default',
  size = 'md',
  interactive = false,
  className = '',
  style,
  ...props
}: CardProps) {
  const cardClasses = [
    'wt-card',
    `wt-card--${variant}`,
    `wt-card--${size}`,
    state !== 'default' && `wt-state-${state}`,
    interactive && 'wt-card--interactive',
    className
  ].filter(Boolean).join(' ');

  const cardStyles: React.CSSProperties = {
    borderRadius: 'var(--wt-radius)',
    backgroundColor: 'var(--wt-card-bg)',
    border: 'var(--wt-card-border)',
    boxShadow: 'var(--wt-card-shadow)',
    transition: 'all var(--wt-transition-fast)',
    ...(interactive && {
      cursor: 'pointer',
    }),
    ...style,
  };

  const sizeStyles = {
    sm: { padding: 'var(--wt-space-sm)' },
    md: { padding: 'var(--wt-space-md)' },
    lg: { padding: 'var(--wt-space-lg)' },
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--wt-bg)',
      border: '1px solid #e5e7eb',
      boxShadow: 'var(--wt-shadow)',
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '1px solid var(--wt-accent)',
      boxShadow: 'none',
    },
    elevated: {
      backgroundColor: 'var(--wt-bg)',
      border: 'none',
      boxShadow: 'var(--wt-shadow-lg)',
    },
    filled: {
      backgroundColor: 'var(--wt-muted)',
      border: 'none',
      boxShadow: 'none',
    },
  };

  const finalStyles = {
    ...cardStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <div
      className={cardClasses}
      style={finalStyles}
      {...props}
    >
      {children}
    </div>
  );
}
