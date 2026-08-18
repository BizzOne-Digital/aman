import {
  BlogPost, BookingRequest, FAQ, GalleryCategory, GalleryImage, Inquiry,
  Page, PricingPlan, Service, SiteSettings, Testimonial,
} from "@/models";

export const adminModels = {
  pages: Page,
  services: Service,
  "gallery-categories": GalleryCategory,
  gallery: GalleryImage,
  testimonials: Testimonial,
  faqs: FAQ,
  pricing: PricingPlan,
  blog: BlogPost,
  inquiries: Inquiry,
  bookings: BookingRequest,
  settings: SiteSettings,
} as const;

export type AdminCollection = keyof typeof adminModels;

const allowedFields: Record<AdminCollection, string[]> = {
  pages: ["title", "navigationTitle", "slug", "description", "sections", "seoTitle", "seoDescription", "socialImage", "published"],
  services: ["title", "slug", "summary", "mainImage", "icon", "features", "ctaLabel", "published", "archived", "order", "hero", "sections", "galleryCategory", "seoTitle", "seoDescription"],
  "gallery-categories": ["name", "slug", "published", "order"],
  gallery: ["title", "url", "alt", "caption", "category", "featured", "published", "order"],
  testimonials: ["clientName", "company", "quote", "image", "rating", "serviceLabel", "featured", "published", "order"],
  faqs: ["question", "answer", "category", "published", "order"],
  pricing: ["title", "service", "description", "features", "priceLabel", "frequency", "cta", "featured", "published", "order"],
  blog: ["title", "slug", "excerpt", "content", "featuredImage", "category", "tags", "author", "publishDate", "published", "featured", "order", "seoTitle", "seoDescription"],
  inquiries: ["status", "internalNotes"],
  bookings: ["status", "internalNotes"],
  settings: ["businessName", "headline", "logo", "favicon", "email", "phoneDisplay", "phoneLink", "website", "address", "serviceArea", "businessHours", "footerDescription", "headerCta", "socialLinks", "defaultSeoTitle", "defaultSeoDescription", "socialImage", "showPricing", "introEnabled", "introSessionBehavior"],
};

export function isAdminCollection(value: string): value is AdminCollection {
  return Object.hasOwn(adminModels, value);
}

export function pickAllowed(collection: AdminCollection, input: Record<string, unknown>) {
  return Object.fromEntries(allowedFields[collection].filter((field) => field in input).map((field) => [field, input[field]]));
}
