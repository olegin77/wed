import { clear, insert } from "@wt/semantic";

type VendorRecord = {
  id: string;
  title: string;
  city?: string | null;
  type?: string | null;
  tags?: string[] | null;
  description?: string | null;
};

function buildDocument(vendor: VendorRecord): string {
  const parts: string[] = [];
  parts.push(vendor.title);
  if (vendor.city) parts.push(vendor.city);
  if (vendor.type) parts.push(vendor.type);
  if (vendor.tags?.length) parts.push(vendor.tags.join(" "));
  if (vendor.description) parts.push(vendor.description);
  return parts.join(" ").trim();
}

export function indexVendor(vendor: VendorRecord): void {
  const document = buildDocument(vendor);
  if (!document) {
    return;
  }
  insert(vendor.id, document);
}

export function reindex(vendors: VendorRecord[]): void {
  clear();
  vendors.forEach(indexVendor);
}
