export function normalize(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}
