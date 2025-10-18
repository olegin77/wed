export interface InviteOptions {
  coupleNames: string;
  eventDate: string; // ISO string
  venueName: string;
  rsvpUrl?: string;
  locale?: "ru" | "uz" | "en";
}

export interface ExportedInvite {
  filename: string;
  contentType: string;
  body: string;
}

const localeCopy: Record<string, { headline: string; rsvp: string }> = {
  ru: { headline: "Приглашение", rsvp: "Подтвердить участие" },
  uz: { headline: "Taklifnoma", rsvp: "Ishtirokni tasdiqlash" },
  en: { headline: "Invitation", rsvp: "RSVP" },
};

export function renderInviteHTML(options: InviteOptions): string {
  const locale = options.locale ?? "ru";
  const copy = localeCopy[locale] ?? localeCopy.ru;
  const formattedDate = new Date(options.eventDate).toLocaleString(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  const rsvpButton = options.rsvpUrl
    ? `<a href="${options.rsvpUrl}" style="display:inline-block;padding:12px 20px;background:#ff6d6d;color:#fff;text-decoration:none;border-radius:999px;">${copy.rsvp}</a>`
    : "";

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <title>${copy.headline}</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background:#f9f5f2; color:#222; }
      .card { max-width: 540px; margin:40px auto; padding:48px; background:#fff; border-radius:24px; text-align:center; }
      h1 { font-size:32px; margin-bottom:16px; }
      p { font-size:18px; margin:12px 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${copy.headline}</h1>
      <p>${options.coupleNames}</p>
      <p>${formattedDate}</p>
      <p>${options.venueName}</p>
      ${rsvpButton}
    </div>
  </body>
</html>`;
}

export function exportInvite(options: InviteOptions): ExportedInvite {
  const body = renderInviteHTML(options);
  return {
    filename: `invite-${options.eventDate.split("T")[0]}.html`,
    contentType: "text/html; charset=utf-8",
    body,
  };
}
