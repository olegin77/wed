import type { HTMLAttributes } from "react";

export interface CardSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of text rows to render under the media placeholder.
   * Use this to roughly match the height of the final card content.
   */
  rows?: 1 | 2 | 3;
}

const shimmerBase = "bg-[linear-gradient(110deg,#f5f5f5,45%,#eaeaea,55%,#f5f5f5)] bg-[length:200%_100%]";

/**
 * CardSkeleton provides a shimmering placeholder that mimics the layout of vendor catalog cards.
 * It reserves space for media, title, and metadata rows to keep the grid stable while data loads.
 */
export function CardSkeleton({ className = "", rows = 2, ...rest }: CardSkeletonProps) {
  const textRows = Array.from({ length: rows }, (_, index) => (
    <div
      key={index}
      className={`h-3 rounded-full bg-neutral-200/90 ${shimmerBase} animate-[shimmer_1.6s_ease_infinite]`}
      style={{ animationDelay: `${index * 90}ms` }}
    />
  ));

  return (
    <div
      aria-hidden
      className={`rounded-2xl border border-black/5 p-4 shadow-sm ${shimmerBase} animate-[shimmer_1.6s_ease_infinite] [background-position:0_0] ${className}`.trim()}
      {...rest}
    >
      <div className="mb-3 h-40 w-full rounded-2xl bg-neutral-200/80" />
      <div className="space-y-2 text-transparent">{textRows}</div>
    </div>
  );
}

export default CardSkeleton;
