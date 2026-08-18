import type { MetadataRoute } from "next";
import { getServices } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const core = ["", "/about", "/services", "/testimonials", "/faqs", "/contact", "/booking", "/privacy-policy", "/terms"];
  const services = await getServices();
  return [
    ...core.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: .8 })),
  ];
}
