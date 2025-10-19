export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

async function loadNodemailer(): Promise<any | null> {
  try {
    const mod = await import("nodemailer");
    return mod.default ?? mod;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("nodemailer not available", error);
    }
    return null;
  }
}

export async function send({ to, subject, html, from }: SendMailInput) {
  const smtpUrl = process.env.SMTP_URL ?? "";
  const mailFrom = from ?? process.env.MAIL_FROM ?? "noreply@weddingtech.uz";

  const nodemailer = await loadNodemailer();
  if (!smtpUrl || !nodemailer) {
    return { ok: false, reason: "transport-missing" } as const;
  }

  const transporter = nodemailer.createTransport(smtpUrl);
  await transporter.sendMail({ to, subject, html, from: mailFrom });
  return { ok: true } as const;
}
