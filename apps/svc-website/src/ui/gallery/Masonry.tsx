import type { ImgHTMLAttributes } from "react";

export interface MasonryImage extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export interface MasonryProps {
  images: MasonryImage[];
  columnClassName?: string;
}

export function Masonry({ images, columnClassName }: MasonryProps) {
  const columnClasses = columnClassName ?? "gap-2 columns-2 sm:columns-3 lg:columns-4";
  return (
    <div className={columnClasses}>
      {images.map(({ src, alt, className, ...rest }, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          loading="lazy"
          className={`mb-2 inline-block w-full rounded-2xl ${className ?? ""}`.trim()}
          {...rest}
        />
      ))}
    </div>
  );
}

export default Masonry;
