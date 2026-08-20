import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { z } from "zod";
import type { bookingSchema, inquirySchema } from "@/lib/validation";

type InquiryPayload = z.infer<typeof inquirySchema>;
type BookingPayload = z.infer<typeof bookingSchema>;

let transporter: Transporter | null | undefined;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTransporter() {
  if (transporter !== undefined) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

function getMailConfig() {
  const user = process.env.SMTP_USER;
  const to = process.env.NOTIFY_EMAIL ?? user;
  const from =
    process.env.SMTP_FROM ??
    (user ? `Canam Facility Services <${user}>` : undefined);

  return { to, from };
}

function rows(entries: Array<[string, string]>) {
  return entries
    .filter(([, value]) => value.trim().length > 0)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

function plainRows(entries: Array<[string, string]>) {
  return entries
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

async function sendNotification(options: {
  subject: string;
  replyTo: string;
  rows: Array<[string, string]>;
}) {
  const transport = getTransporter();
  const { to, from } = getMailConfig();

  if (!transport || !to || !from) {
    console.warn("SMTP is not configured; notification email skipped.");
    return false;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:20px;">${escapeHtml(options.subject)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">${rows(options.rows)}</table>
    </div>
  `.trim();

  const text = `${options.subject}\n\n${plainRows(options.rows)}`;

  await transport.sendMail({
    from,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    html,
    text,
  });

  return true;
}

export async function sendInquiryNotification(data: Omit<InquiryPayload, "website" | "consent">) {
  return sendNotification({
    subject: `New contact inquiry from ${data.name}`,
    replyTo: data.email,
    rows: [
      ["Name", data.name],
      ["Company", data.company ?? ""],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Customer type", data.customerType],
      ["Service interest", data.serviceInterest],
      ["Location", data.location],
      ["Frequency", data.frequency],
      ["Message", data.message],
    ],
  });
}

export async function sendBookingNotification(data: Omit<BookingPayload, "website" | "consent">) {
  return sendNotification({
    subject: `New booking request from ${data.name}`,
    replyTo: data.email,
    rows: [
      ["Name", data.name],
      ["Company", data.company ?? ""],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Service", data.service],
      ["Cleaning options", data.cleaningOptions.join(", ")],
      ["Frequency", data.frequency],
      ["Location", data.location],
      ["Preferred date", data.preferredDate ?? ""],
      ["Preferred time", data.preferredTime ?? ""],
      ["Notes", data.notes ?? ""],
    ],
  });
}
