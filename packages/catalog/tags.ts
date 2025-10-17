export const vendorTags = [
  "kids-friendly",
  "halal",
  "vegan",
  "live-music",
  "outdoor",
  "wheelchair-access",
] as const;

export type VendorTag = (typeof vendorTags)[number];

const allowed = new Set<string>(vendorTags);

export function sanitizeVendorTags(input: Iterable<string>): VendorTag[] {
  const unique: VendorTag[] = [];
  for (const tag of input) {
    const normalized = tag.trim().toLowerCase();
    if (!allowed.has(normalized)) continue;
    if (unique.includes(normalized as VendorTag)) continue;
    unique.push(normalized as VendorTag);
  }
  return unique;
}
