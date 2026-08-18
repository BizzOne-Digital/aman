import { z } from "zod";

const safeText = z.string().trim().max(2_000);

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(7).max(30),
  customerType: z.string().trim().min(1).max(80),
  serviceInterest: z.string().trim().min(1).max(120),
  location: z.string().trim().min(2).max(160),
  frequency: z.string().trim().min(1).max(40),
  message: safeText.min(10),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export const bookingSchema = z.object({
  service: z.enum(["Fleet Cleaning", "Facility / Commercial Cleaning", "House / Residential Cleaning"]),
  cleaningOptions: z.array(z.string().trim().max(100)).max(12).default([]),
  frequency: z.enum(["One-time", "Daily", "Weekly", "Monthly", "Yearly"]),
  location: z.string().trim().min(2).max(160),
  preferredDate: z.string().max(20).optional().default(""),
  preferredTime: z.string().max(20).optional().default(""),
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(7).max(30),
  notes: safeText.optional().default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(8).max(200),
});

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 6, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
