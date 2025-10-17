export interface VCardContact {
  fullName: string;
  email?: string;
  phone?: string;
}

export function parseVCard(input: string): VCardContact[] {
  const cards = input.split(/END:VCARD/i);
  const contacts: VCardContact[] = [];
  for (const raw of cards) {
    const lines = raw.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) continue;
    let fullName = "";
    let email: string | undefined;
    let phone: string | undefined;
    lines.forEach((line) => {
      if (line.startsWith("FN:")) {
        fullName = line.substring(3).trim();
      } else if (line.startsWith("EMAIL")) {
        email = line.split(":").pop()?.trim();
      } else if (line.startsWith("TEL")) {
        phone = line.split(":").pop()?.trim();
      }
    });
    if (fullName) {
      contacts.push({ fullName, email, phone });
    }
  }
  return contacts;
}
