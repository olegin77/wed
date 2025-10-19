import type { ImgHTMLAttributes } from "react";

export interface LazyImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * LazyImg renders a responsive-friendly <img> tag with explicit dimensions and native lazy loading.
 * Explicit width/height stabilise layout to avoid CLS, while the `loading` hint defers offscreen fetches.
 */
export function LazyImg({ className, width, height, ...rest }: LazyImgProps) {
  return (
    <img
      width={width}
      height={height}
      loading="lazy"
      className={`rounded-2xl ${className ?? ""}`.trim()}
      {...rest}
    />
  );
}

export default LazyImg;
