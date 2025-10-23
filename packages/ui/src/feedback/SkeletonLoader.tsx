import React from 'react';

export interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

export function SkeletonLoader({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };
  
  const variantClasses = {
    text: 'h-4',
    rectangular: 'rounded',
    circular: 'rounded-full',
  };

  const classes = [
    baseClasses,
    animationClasses[animation],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        width,
        height,
      }}
      aria-label="Loading..."
    />
  );
}