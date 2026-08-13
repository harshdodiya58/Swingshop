import nodemailer from "nodemailer";

/**
 * EMAIL TRANSPORT
 * Priority: SMTP env vars → dev fallback (logs the OTP to server console).
 * Configure SMTP_* in .env.local to send real emails (e.g. Gmail app password):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=you@gmail.com
 *   SMTP_PASS=<16-char app password>
 *   SMTP_FROM="Shree Chamunda Swings <you@gmail.com>"
 * In dev without SMTP, the OTP is logged to the console so the flow still works.
 */

const SMTP_ENABLED =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!SMTP_ENABLED) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendOtpEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}): Promise<{ delivered: boolean; mode: "smtp" | "dev" }> {
  const tx = getTransporter();
  if (!tx) {
    // Dev fallback: surface the code in server logs only.
    console.log(
      `[OTP:DEV] For ${to} use code ${code}. Configure SMTP_* env vars to send real emails.`,
    );
    return { delivered: false, mode: "dev" };
  }

  const from =
    process.env.SMTP_FROM ??
    `Shree Chamunda Swings <${process.env.SMTP_USER}>`;

  await tx.sendMail({
    from,
    to,
    subject: "Your Shree Chamunda Swings login code",
    text: `Your one-time login code is ${code}. It expires in 10 minutes. If you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f7f3ea;border-radius:16px;">
        <h2 style="color:#633816;margin:0 0 8px;">Shree Chamunda Swings</h2>
        <p style="color:#2a2118;">Use the code below to sign in to your account.</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#633816;margin:16px 0;">${code}</p>
        <p style="color:#7a6e5e;font-size:13px;">This code expires in 10 minutes. If you didn't request it, please ignore this email.</p>
      </div>
    `,
  });
  return { delivered: true, mode: "smtp" };
}
