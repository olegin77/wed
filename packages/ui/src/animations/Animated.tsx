import React, { useState, useEffect } from 'react';
import './animations.css';

interface AnimatedProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeOut' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'scaleOut' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'pulse' | 'spin' | 'bounce' | 'shake';
  delay?: number;
  duration?: number;
  trigger?: 'mount' | 'hover' | 'click' | 'focus' | 'scroll';
  className?: string;
  style?: React.CSSProperties;
}

export function Animated({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration,
  trigger = 'mount',
  className = '',
  style,
}: AnimatedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger === 'mount') {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsAnimating(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsAnimating(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      setIsAnimating(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      setIsAnimating(false);
    }
  };

  const getAnimationClass = () => {
    if (!isVisible && trigger === 'mount') return '';
    if (!isAnimating && (trigger === 'hover' || trigger === 'click' || trigger === 'focus')) return '';
    return `animate-${animation}`;
  };

  const animationStyle: React.CSSProperties = {
    ...style,
    ...(duration && { animationDuration: `${duration}ms` }),
  };

  const eventHandlers = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <div
      className={`${getAnimationClass()} ${className}`}
      style={animationStyle}
      {...(trigger !== 'mount' ? eventHandlers : {})}
    >
      {children}
    </div>
  );
}

// Preset animation components
export function FadeIn({ children, ...props }: Omit<AnimatedProps, 'animation'>) {
  return <Animated animation="fadeIn" {...props}>{children}</Animated>;
}

export function FadeInUp({ children, ...props }: Omit<AnimatedProps, 'animation'>) {
  return <Animated animation="fadeInUp" {...props}>{children}</Animated>;
}

export function ScaleIn({ children, ...props }: Omit<AnimatedProps, 'animation'>) {
  return <Animated animation="scaleIn" {...props}>{children}</Animated>;
}

export function SlideInUp({ children, ...props }: Omit<AnimatedProps, 'animation'>) {
  return <Animated animation="slideInUp" {...props}>{children}</Animated>;
}

export function Pulse({ children, ...props }: Omit<AnimatedProps, 'animation'>) {
  return <Animated animation="pulse" {...props}>{children}</Animated>;
}