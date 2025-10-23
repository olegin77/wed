import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles = {
    borderRadius: 'var(--wt-radius)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--wt-accent)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--wt-accent)',
        opacity: 0.9,
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    secondary: {
      backgroundColor: 'var(--wt-muted)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--wt-muted)',
        opacity: 0.9,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--wt-accent)',
      border: '1px solid var(--wt-accent)',
      '&:hover': {
        backgroundColor: 'var(--wt-accent)',
        color: 'white',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--wt-accent)',
      '&:hover': {
        backgroundColor: 'var(--wt-accent)',
        color: 'white',
        opacity: 0.1,
      },
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' },
  };

  const buttonStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled && {
      opacity: 0.5,
      cursor: 'not-allowed',
    }),
    ...style,
  };

  return (
    <button
      className={className}
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>{children}</span>
      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
