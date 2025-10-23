/**
 * Lazy loading utilities and components
 * Provides code splitting and lazy loading capabilities
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { SkeletonLoader } from '../feedback/SkeletonLoader';

export interface LazyComponentProps {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

/**
 * Create a lazy component with error boundary and retry logic
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentProps = {}
): React.LazyExoticComponent<T> {
  const {
    fallback = <SkeletonLoader />,
    errorBoundary = true,
    retryDelay = 1000,
    maxRetries = 3,
  } = options;

  let retryCount = 0;

  const retryImport = (): Promise<{ default: T }> => {
    return importFunc().catch((error) => {
      if (retryCount < maxRetries) {
        retryCount++;
        console.warn(`Lazy loading failed, retrying in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})`);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(retryImport());
          }, retryDelay);
        });
      }
      
      throw error;
    });
  };

  return lazy(retryImport);
}

/**
 * Lazy load a component with custom fallback
 */
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = createLazyComponent(importFunc);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <Suspense fallback={fallback || <SkeletonLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  ));
}

/**
 * Preload a component
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): Promise<{ default: T }> {
  return importFunc();
}

/**
 * Preload multiple components
 */
export function preloadComponents(
  importFuncs: Array<() => Promise<any>>
): Promise<any[]> {
  return Promise.all(importFuncs.map(func => func()));
}

/**
 * Lazy route component for React Router
 */
export function createLazyRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = createLazyComponent(importFunc, options);
  
  return function LazyRoute(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={options.fallback || <SkeletonLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Dynamic import with loading state
 */
export function useDynamicImport<T>(
  importFunc: () => Promise<T>,
  deps: React.DependencyList = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
} {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await importFunc();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    retry: loadData,
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Lazy image component with intersection observer
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  ...props
}: {
  src: string;
  alt: string;
  placeholder?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (isIntersecting && !loaded && !error) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      img.src = src;
    }
  }, [isIntersecting, src, loaded, error]);

  return (
    <div ref={ref} {...props}>
      {loaded ? (
        <img src={src} alt={alt} />
      ) : error ? (
        <div style={{ backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Failed to load image</span>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {placeholder || <SkeletonLoader />}
        </div>
      )}
    </div>
  );
}

/**
 * Lazy load a module with retry logic
 */
export async function lazyLoadModule<T>(
  importFunc: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFunc();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      console.warn(`Module loading failed, retrying in ${delay}ms (attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Module loading failed after all retries');
}