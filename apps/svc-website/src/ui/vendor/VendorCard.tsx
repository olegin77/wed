import type { HTMLAttributes } from "react";

export interface VendorCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name of the vendor. */
  title: string;
  /** City or region where the vendor operates. */
  city: string;
  /** Whether the vendor passed manual verification. */
  verified?: boolean;
  /** Average rating score from 0 to 5. */
  rating: number;
}

const ratingFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function clampRating(value: number) {
  return Math.max(0, Math.min(5, value));
}

/**
 * VendorCard renders a compact summary card with verification and rating chips.
 * It is used in catalog grids and related vendor sections on vendor detail pages.
 */
export function VendorCard({
  title,
  city,
  verified = false,
  rating,
  className = "",
  ...rest
}: VendorCardProps) {
  const safeRating = clampRating(rating);
  const ratingLabel = `${ratingFormatter.format(safeRating)} из 5`;

  return (
    <article
      className={`rounded-2xl border border-black/5 bg-[var(--card)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`.trim()}
      aria-label={`${title}, ${city}`}
      {...rest}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--fg-strong,#111)]">{title}</h3>
          <p className="small mt-1 text-[var(--muted)]">{city}</p>
        </div>
        {verified && (
          <span
            className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
            aria-label="Проверенный поставщик"
          >
            <span aria-hidden>✔</span>
            Verified
          </span>
        )}
      </header>
      <dl className="flex items-center gap-2 text-sm text-[var(--fg)]">
        <dt className="sr-only">Рейтинг</dt>
        <dd
          className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700"
          aria-label={`Рейтинг: ${ratingLabel}`}
        >
          <span aria-hidden>★</span>
          {ratingFormatter.format(safeRating)}
        </dd>
      </dl>
    </article>
  );
}

export default VendorCard;
