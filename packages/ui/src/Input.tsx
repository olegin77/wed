import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  state?: 'default' | 'hover' | 'focus' | 'disabled' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export function Input({
  label,
  error,
  success = false,
  state = 'default',
  size = 'md',
  className = '',
  style,
  ...props
}: InputProps) {
  const inputClasses = [
    'wt-input',
    `wt-input--${size}`,
    state !== 'default' && `wt-state-${state}`,
    error && 'wt-state-error',
    success && 'wt-state-success',
    className
  ].filter(Boolean).join(' ');

  const inputStyles: React.CSSProperties = {
    width: '100%',
    borderRadius: 'var(--wt-radius)',
    border: 'var(--wt-input-border)',
    backgroundColor: 'var(--wt-input-bg)',
    color: 'var(--wt-input-color)',
    boxShadow: 'var(--wt-input-shadow)',
    transition: 'all var(--wt-transition-fast)',
    outline: 'none',
    ...(props.disabled && {
      backgroundColor: 'var(--wt-input-disabled-bg)',
      color: 'var(--wt-input-disabled-color)',
      cursor: 'var(--wt-input-disabled-cursor)',
    }),
    ...style,
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: 'var(--wt-text-sm)', minHeight: '32px' },
    md: { padding: '10px 12px', fontSize: 'var(--wt-text-base)', minHeight: '40px' },
    lg: { padding: '12px 16px', fontSize: 'var(--wt-text-lg)', minHeight: '48px' },
  };

  const finalStyles = {
    ...inputStyles,
    ...sizeStyles[size],
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: 'var(--wt-text-sm)',
            fontWeight: '500',
            color: error ? 'var(--wt-error)' : 'var(--wt-fg)',
          }}
        >
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        style={finalStyles}
        {...props}
      />
      {error && (
        <div
          style={{
            marginTop: '4px',
            fontSize: 'var(--wt-text-sm)',
            color: 'var(--wt-error)',
          }}
        >
          {error}
        </div>
      )}
      {success && !error && (
        <div
          style={{
            marginTop: '4px',
            fontSize: 'var(--wt-text-sm)',
            color: 'var(--wt-success)',
          }}
        >
          ✓ Поле заполнено корректно
        </div>
      )}
    </div>
  );
}
