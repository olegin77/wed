import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...props
}, ref) => {
  const baseStyles = {
    width: '100%',
    borderRadius: 'var(--wt-radius)',
    border: '1px solid #e5e7eb',
    backgroundColor: 'var(--wt-bg)',
    color: 'var(--wt-fg)',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    '&:focus': {
      borderColor: 'var(--wt-accent)',
      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  const variantStyles = {
    default: {
      border: '1px solid #e5e7eb',
      backgroundColor: 'var(--wt-bg)',
    },
    filled: {
      border: 'none',
      backgroundColor: '#f3f4f6',
      '&:focus': {
        backgroundColor: 'var(--wt-bg)',
      },
    },
    outlined: {
      border: '2px solid #e5e7eb',
      backgroundColor: 'transparent',
      '&:focus': {
        borderColor: 'var(--wt-accent)',
      },
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 12px', fontSize: '16px' },
    lg: { padding: '12px 16px', fontSize: '18px' },
  };

  const inputStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(error && {
      borderColor: '#ef4444',
      '&:focus': {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      },
    }),
    ...style,
  };

  return (
    <div className={className} style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--wt-fg)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              zIndex: 1,
              color: 'var(--wt-muted)',
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          style={{
            ...inputStyles,
            ...(leftIcon && { paddingLeft: '40px' }),
            ...(rightIcon && { paddingRight: '40px' }),
          }}
          {...props}
        />
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              zIndex: 1,
              color: 'var(--wt-muted)',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#ef4444',
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'var(--wt-muted)',
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
