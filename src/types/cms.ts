export type Theme = "light" | "ice" | "blue" | "navy";

export type MediaItem = {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type ContentItem = {
  title: string;
  text?: string;
  icon?: string;
  href?: string;
  media?: MediaItem;
  bullets?: string[];
};

export type SectionType =
  | "hero"
  | "richText"
  | "splitMedia"
  | "serviceCards"
  | "featureGrid"
  | "imageMosaic"
  | "galleryRail"
  | "process"
  | "plans"
  | "testimonials"
  | "faqs"
  | "contactPanel"
  | "cta";

export type PageSection = {
  key: string;
  type: SectionType;
  adminLabel: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  items?: ContentItem[];
  primaryMedia?: MediaItem;
  media?: MediaItem[];
  primaryCta?: LinkItem;
  secondaryCta?: LinkItem;
  layout?: "standard" | "reverse" | "centered" | "editorial";
  theme?: Theme;
  visible: boolean;
  order: number;
};

export type PageData = {
  title: string;
  navigationTitle: string;
  slug: string;
  description: string;
  sections: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
};

export type ServiceData = {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  mainImage: MediaItem;
  icon: string;
  features: string[];
  ctaLabel: string;
  published: boolean;
  order: number;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    background: MediaItem;
  };
  sections: PageSection[];
  galleryCategory?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type SiteSettingsData = {
  businessName: string;
  headline: string;
  logo?: MediaItem;
  favicon?: MediaItem;
  email: string;
  phoneDisplay: string;
  phoneLink: string;
  website: string;
  serviceArea: string;
  footerDescription: string;
  headerCta: LinkItem;
  showPricing: boolean;
  introEnabled: boolean;
  socialLinks: Record<string, string>;
};

export type GalleryItemData = MediaItem & {
  _id?: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
};

export type FaqData = {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
};

export type TestimonialData = {
  _id?: string;
  clientName: string;
  company?: string;
  quote: string;
  image?: MediaItem;
  rating?: number;
  serviceLabel: string;
  featured: boolean;
  published: boolean;
  order: number;
};

export type BlogPostData = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: PageSection[];
  featuredImage: MediaItem;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  published: boolean;
  featured: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
};
