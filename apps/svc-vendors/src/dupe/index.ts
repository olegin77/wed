export interface VendorProfile {
  id: string;
  title: string;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  return phone.replace(/\D/g, "");
}

function normalize(text?: string | null): string | null {
  return text?.trim().toLowerCase() ?? null;
}

export function isDupe(a: VendorProfile, b: VendorProfile): boolean {
  if (normalizePhone(a.phone) && normalizePhone(a.phone) === normalizePhone(b.phone)) {
    return true;
  }

  const sameTitle = normalize(a.title) === normalize(b.title);
  const sameCity = normalize(a.city) === normalize(b.city);
  if (sameTitle && sameCity) {
    return true;
  }

  const sameEmail = normalize(a.email) && normalize(a.email) === normalize(b.email);
  if (sameEmail) {
    return true;
  }

  const sameDomain = normalize(a.website)?.replace(/^https?:\/\//, "") === normalize(b.website)?.replace(/^https?:\/\//, "");
  return Boolean(sameDomain);
}
