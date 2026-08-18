import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  defaultFaqs,
  defaultGallery,
  defaultPages,
  defaultPosts,
  defaultServices,
  defaultSettings,
  defaultTestimonials,
} from "../src/data/seed-content";
import {
  AdminUser, BlogPost, FAQ, GalleryCategory, GalleryImage, Page, PricingPlan,
  Service, SiteSettings, Testimonial,
} from "../src/models";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/canam_facility";

async function seed() {
  await mongoose.connect(uri);
  await SiteSettings.findOneAndUpdate(
    { singletonKey: "site" },
    { $set: defaultSettings, $setOnInsert: { singletonKey: "site" } },
    { upsert: true, new: true },
  );
  for (const page of defaultPages) await Page.findOneAndUpdate({ slug: page.slug }, { $set: page }, { upsert: true, runValidators: true });
  await Page.deleteMany({ slug: { $in: ["gallery", "blog"] } });
  for (const service of defaultServices) await Service.findOneAndUpdate({ slug: service.slug }, { $set: service }, { upsert: true, runValidators: true });
  const categories = [
    { name: "Fleet", slug: "fleet", order: 0 },
    { name: "Commercial", slug: "commercial", order: 1 },
    { name: "Residential", slug: "residential", order: 2 },
  ];
  for (const category of categories) {
    await GalleryCategory.findOneAndUpdate(
      { name: category.name },
      { $set: { ...category, published: true } },
      { upsert: true },
    );
  }
  await GalleryImage.deleteMany({ category: "2025-2026 Action Pics" });
  await GalleryCategory.deleteOne({ name: "2025-2026 Action Pics" });
  await GalleryImage.deleteMany({ url: { $regex: "^/api/demo/" } });
  for (const item of defaultGallery) await GalleryImage.findOneAndUpdate({ url: item.url }, { $set: item }, { upsert: true });
  for (const item of defaultFaqs) await FAQ.findOneAndUpdate({ question: item.question }, { $set: item }, { upsert: true });
  await Testimonial.deleteMany({ quote: /Replace this draft/i });
  for (const item of defaultTestimonials) await Testimonial.findOneAndUpdate({ clientName: item.clientName, quote: item.quote }, { $set: item }, { upsert: true });
  for (const post of defaultPosts) await BlogPost.findOneAndUpdate({ slug: post.slug }, { $set: post }, { upsert: true, runValidators: true });
  for (const [order, frequency] of ["One-time", "Daily", "Weekly", "Monthly", "Yearly"].entries()) {
    await PricingPlan.findOneAndUpdate({ title: `${frequency} flexible plan` }, { $set: { title: `${frequency} flexible plan`, description: "Contact us for a custom quote shaped around your scope.", features: ["Custom scope", "Flexible scheduling"], priceLabel: "Custom quote", frequency, cta: { label: "Request a quote", href: "/booking" }, featured: false, published: false, order } }, { upsert: true });
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { email: email.toLowerCase(), passwordHash, name: "Administrator", active: true } }, { upsert: true });
  console.log("Canam CMS seed complete.");
  console.log(`Database: ${mongoose.connection.name}`);
  console.log(`Admin: ${email.toLowerCase()}`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
