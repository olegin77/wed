import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'error';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  state = 'default',
  disabled = false,
  loading = false,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'wt-button',
    `wt-button--${variant}`,
    `wt-button--${size}`,
    state !== 'default' && `wt-state-${state}`,
    className
  ].filter(Boolean).join(' ');

  const buttonStyles: React.CSSProperties = {
    borderRadius: 'var(--wt-radius)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    transition: 'all var(--wt-transition-fast)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--wt-button-bg)',
    color: 'var(--wt-button-color)',
    borderColor: 'var(--wt-button-border)',
    boxShadow: 'var(--wt-button-shadow)',
    ...(disabled && {
      opacity: 'var(--wt-button-disabled-opacity)',
      cursor: 'var(--wt-button-disabled-cursor)',
    }),
    ...style,
  };

  return (
    <button
      className={baseClasses}
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
            animation: 'wt-spin 1s linear infinite',
          }}
        />
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>{children}</span>
    </button>
  );
}

// CSS for spinner animation
const spinnerCSS = `
  @keyframes wt-spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.querySelector('#wt-button-styles')) {
  const style = document.createElement('style');
  style.id = 'wt-button-styles';
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}
