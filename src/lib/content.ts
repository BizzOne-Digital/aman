import { cache } from "react";
import { connectDb, serialize } from "@/lib/db";
import {
  BlogPost,
  FAQ,
  GalleryImage,
  Page,
  Service,
  SiteSettings,
  Testimonial,
} from "@/models";
import {
  defaultFaqs,
  defaultGallery,
  defaultPages,
  defaultPosts,
  defaultServices,
  defaultSettings,
  defaultTestimonials,
} from "@/data/seed-content";
import type {
  BlogPostData,
  FaqData,
  GalleryItemData,
  PageData,
  ServiceData,
  SiteSettingsData,
  TestimonialData,
} from "@/types/cms";

async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDb();
    return await query();
  } catch {
    return fallback;
  }
}

export const getSettings = cache(async (): Promise<SiteSettingsData> =>
  withFallback(async () => {
    const item = await SiteSettings.findOne({ singletonKey: "site" }).lean();
    return item ? serialize(item) : defaultSettings;
  }, defaultSettings),
);

export const getPage = cache(async (slug: string): Promise<PageData | null> =>
  withFallback(async () => {
    const item = await Page.findOne({ slug, published: true }).lean();
    return item ? serialize(item) : defaultPages.find((page) => page.slug === slug) ?? null;
  }, defaultPages.find((page) => page.slug === slug) ?? null),
);

export const getServices = cache(async (): Promise<ServiceData[]> =>
  withFallback(async () => {
    const items = await Service.find({ published: true, archived: { $ne: true } }).sort({ order: 1 }).lean();
    return items.length ? serialize(items) : defaultServices;
  }, defaultServices),
);

export const getService = cache(async (slug: string): Promise<ServiceData | null> =>
  withFallback(async () => {
    const item = await Service.findOne({ slug, published: true, archived: { $ne: true } }).lean();
    return item ? serialize(item) : defaultServices.find((service) => service.slug === slug) ?? null;
  }, defaultServices.find((service) => service.slug === slug) ?? null),
);

export const getGallery = cache(async (): Promise<GalleryItemData[]> =>
  withFallback(async () => {
    const items = await GalleryImage.find({ published: true }).sort({ order: 1 }).lean();
    return items.length ? serialize(items) : defaultGallery;
  }, defaultGallery),
);

export const getFaqs = cache(async (): Promise<FaqData[]> =>
  withFallback(async () => {
    const items = await FAQ.find({ published: true }).sort({ order: 1 }).lean();
    return items.length ? serialize(items) : defaultFaqs;
  }, defaultFaqs),
);

export const getTestimonials = cache(async (): Promise<TestimonialData[]> =>
  withFallback(async () => serialize(await Testimonial.find({ published: true }).sort({ order: 1 }).lean()), defaultTestimonials.filter((item) => item.published)),
);

export const getPosts = cache(async (): Promise<BlogPostData[]> =>
  withFallback(async () => {
    const items = await BlogPost.find({ published: true }).sort({ order: 1, publishDate: -1 }).lean();
    return items.length ? serialize(items) : defaultPosts.filter((post) => post.published);
  }, defaultPosts.filter((post) => post.published)),
);

export const getPost = cache(async (slug: string): Promise<BlogPostData | null> =>
  withFallback(async () => {
    const item = await BlogPost.findOne({ slug, published: true }).lean();
    return item ? serialize(item) : defaultPosts.find((post) => post.slug === slug && post.published) ?? null;
  }, defaultPosts.find((post) => post.slug === slug && post.published) ?? null),
);
