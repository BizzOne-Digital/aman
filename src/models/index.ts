import { Schema, model, models } from "mongoose";

const mediaSchema = new Schema(
  { url: { type: String, required: true }, alt: { type: String, required: true }, title: String, caption: String },
  { _id: false },
);

const linkSchema = new Schema(
  { label: { type: String, required: true }, href: { type: String, required: true } },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    adminLabel: { type: String, required: true },
    eyebrow: String,
    heading: String,
    subheading: String,
    body: String,
    items: { type: [Schema.Types.Mixed], default: [] },
    primaryMedia: mediaSchema,
    media: { type: [mediaSchema], default: [] },
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    layout: String,
    theme: { type: String, enum: ["light", "ice", "blue", "navy"], default: "light" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const pageSchema = new Schema(
  {
    title: { type: String, required: true },
    navigationTitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    sections: { type: [sectionSchema], default: [] },
    seoTitle: String,
    seoDescription: String,
    socialImage: mediaSchema,
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    mainImage: { type: mediaSchema, required: true },
    icon: { type: String, default: "Sparkles" },
    features: { type: [String], default: [] },
    ctaLabel: { type: String, default: "Explore service" },
    published: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    hero: {
      eyebrow: String,
      title: String,
      description: String,
      background: mediaSchema,
    },
    sections: { type: [sectionSchema], default: [] },
    galleryCategory: String,
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true },
);

const galleryCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const galleryImageSchema = new Schema(
  {
    title: String,
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: String,
    category: { type: String, required: true, index: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const testimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    company: String,
    quote: { type: String, required: true },
    image: mediaSchema,
    rating: { type: Number, min: 1, max: 5 },
    serviceLabel: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const pricingPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    service: String,
    description: String,
    features: [String],
    priceLabel: { type: String, default: "Custom quote" },
    frequency: String,
    cta: linkSchema,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: [sectionSchema], default: [] },
    featuredImage: { type: mediaSchema, required: true },
    category: { type: String, required: true, index: true },
    tags: [String],
    author: String,
    publishDate: Date,
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true },
);

const siteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, unique: true, default: "site" },
    businessName: String,
    headline: String,
    logo: mediaSchema,
    favicon: mediaSchema,
    email: String,
    phoneDisplay: String,
    phoneLink: String,
    website: String,
    address: String,
    serviceArea: String,
    businessHours: String,
    footerDescription: String,
    headerCta: linkSchema,
    socialLinks: { type: Map, of: String, default: {} },
    defaultSeoTitle: String,
    defaultSeoDescription: String,
    socialImage: mediaSchema,
    showPricing: { type: Boolean, default: false },
    introEnabled: { type: Boolean, default: true },
    introSessionBehavior: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const inquirySchema = new Schema(
  {
    name: { type: String, required: true },
    company: String,
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    customerType: String,
    serviceInterest: String,
    location: String,
    frequency: String,
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ["New", "Contacted", "Archived"], default: "New", index: true },
    internalNotes: String,
    ipHash: String,
  },
  { timestamps: true },
);

const bookingSchema = new Schema(
  {
    service: { type: String, required: true },
    cleaningOptions: [String],
    frequency: { type: String, required: true },
    location: { type: String, required: true },
    preferredDate: String,
    preferredTime: String,
    name: { type: String, required: true },
    company: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: String,
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Scheduled", "Completed", "Archived"],
      default: "New",
      index: true,
    },
    internalNotes: String,
    ipHash: String,
  },
  { timestamps: true },
);

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Administrator" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Page = models.Page || model("Page", pageSchema);
export const Service = models.Service || model("Service", serviceSchema);
export const GalleryCategory = models.GalleryCategory || model("GalleryCategory", galleryCategorySchema);
export const GalleryImage = models.GalleryImage || model("GalleryImage", galleryImageSchema);
export const Testimonial = models.Testimonial || model("Testimonial", testimonialSchema);
export const FAQ = models.FAQ || model("FAQ", faqSchema);
export const PricingPlan = models.PricingPlan || model("PricingPlan", pricingPlanSchema);
export const BlogPost = models.BlogPost || model("BlogPost", blogPostSchema);
export const SiteSettings = models.SiteSettings || model("SiteSettings", siteSettingsSchema);
export const Inquiry = models.Inquiry || model("Inquiry", inquirySchema);
export const BookingRequest = models.BookingRequest || model("BookingRequest", bookingSchema);
export const AdminUser = models.AdminUser || model("AdminUser", adminUserSchema);
