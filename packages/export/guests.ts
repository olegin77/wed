export interface GuestRecord {
  fullName: string;
  phone?: string;
  email?: string;
  rsvpStatus?: string;
}

export function guestsToCsv(guests: GuestRecord[]): string {
  const header = "fullName,phone,email,rsvpStatus";
  const rows = guests.map((guest) =>
    [guest.fullName, guest.phone ?? "", guest.email ?? "", guest.rsvpStatus ?? ""].map(escapeCsv).join(","),
  );
  return [header, ...rows].join("\n");
}

export function guestsToVCard(guests: GuestRecord[]): string {
  return guests
    .map(
      (guest) => `BEGIN:VCARD\nVERSION:3.0\nFN:${guest.fullName}\n${
        guest.phone ? `TEL;TYPE=CELL:${guest.phone}\n` : ""
      }${guest.email ? `EMAIL;TYPE=INTERNET:${guest.email}\n` : ""}END:VCARD`,
    )
    .join("\n");
}

function escapeCsv(value: string): string {
  if (value === "") {
    return value;
  }
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
