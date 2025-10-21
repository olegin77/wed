import type { VendorCardProps } from "../ui/vendor/VendorCard";
import { VendorCard } from "../ui/vendor/VendorCard";

export interface RelatedVendorsProps {
  /** Collection of vendor cards to display. */
  items: Array<Pick<VendorCardProps, "title" | "city" | "verified" | "rating"> & { id?: string | number }>;
  /** Optional heading that will be rendered above the grid. */
  heading?: string;
  /** Optional description displayed under the heading for context. */
  description?: string;
}

/**
 * RelatedVendors renders a responsive grid of vendor cards used on vendor detail pages.
 * The widget is intentionally presentation-only: data fetching happens in the page layer.
 */
export function RelatedVendors({ heading, description, items }: RelatedVendorsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section aria-label={heading ?? "Похожие поставщики"} className="space-y-4">
      {heading ? <h2 className="text-xl font-semibold text-[var(--fg)]">{heading}</h2> : null}
      {description ? <p className="small max-w-2xl">{description}</p> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((vendor, index) => (
          <VendorCard
            key={vendor.id ?? `${vendor.title}-${index}`}
            title={vendor.title}
            city={vendor.city}
            verified={vendor.verified}
            rating={vendor.rating}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedVendors;
