import { clear, insert } from "@wt/semantic";

export interface VendorSemanticRecord {
  id: string;
  title: string;
  city?: string | null;
  type?: string | null;
  tags?: string[] | null;
  description?: string | null;
  score?: number | null;
}

export interface IndexVendorOptions {
  includePayload?: boolean;
}

function buildDocument(vendor: VendorSemanticRecord): string {
  const parts: string[] = [vendor.title];

  if (vendor.city) {
    parts.push(vendor.city);
  }

  if (vendor.type) {
    parts.push(vendor.type);
  }

  if (vendor.tags?.length) {
    parts.push(vendor.tags.join(" "));
  }

  if (vendor.description) {
    parts.push(vendor.description);
  }

  return parts.join(" ").trim();
}

/**
 * Indexes a single vendor into the shared semantic index. Vendors without any
 * textual surface (title/description/tags) are skipped to avoid empty
 * embeddings.
 */
export function indexVendor(vendor: VendorSemanticRecord, options: IndexVendorOptions = {}): void {
  const document = buildDocument(vendor);
  if (!document) {
    return;
  }

  insert(vendor.id, document, {
    payload: options.includePayload ? { id: vendor.id, score: vendor.score ?? undefined } : undefined,
  });
}

/**
 * Rebuilds the vendor semantic index from scratch. Useful after nightly syncs
 * or bulk data imports.
 */
export function reindex(vendors: VendorSemanticRecord[], options: IndexVendorOptions = {}): void {
  clear();
  vendors.forEach((vendor) => indexVendor(vendor, options));
}
