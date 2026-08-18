import type { FieldConfig } from "@/components/admin/SimpleRecordEditor";

export const adminConfigs: Record<string, { title: string; description: string; titleField: string; subtitleField: string; fields: FieldConfig[] }> = {
  testimonials: {
    title: "Testimonials", description: "Publish only verified customer experiences.", titleField: "clientName", subtitleField: "serviceLabel",
    fields: [
      { key: "clientName", label: "Client name", required: true }, { key: "company", label: "Company / role" },
      { key: "quote", label: "Quote", type: "textarea", required: true }, { key: "image", label: "Optional image", type: "image" },
      { key: "rating", label: "Rating (optional)", type: "number" }, { key: "serviceLabel", label: "Service label" },
      { key: "featured", label: "Featured", type: "checkbox" }, { key: "published", label: "Published", type: "checkbox" }, { key: "order", label: "Display order", type: "number" },
    ],
  },
  faqs: {
    title: "FAQs", description: "Answers update the public FAQ and homepage preview.", titleField: "question", subtitleField: "category",
    fields: [
      { key: "question", label: "Question", required: true }, { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "category", label: "Category", options: ["General", "Fleet", "Commercial", "Residential", "Scheduling", "Quotes"] },
      { key: "published", label: "Published", type: "checkbox" }, { key: "order", label: "Display order", type: "number" },
    ],
  },
  pricing: {
    title: "Pricing & plans", description: "Pricing remains hidden publicly while showPricing is disabled.", titleField: "title", subtitleField: "frequency",
    fields: [
      { key: "title", label: "Plan title", required: true }, { key: "service", label: "Service" },
      { key: "description", label: "Description", type: "textarea" }, { key: "features", label: "Features", type: "list" },
      { key: "priceLabel", label: "Price label" }, { key: "frequency", label: "Frequency", options: ["One-time", "Daily", "Weekly", "Monthly", "Yearly"] },
      { key: "featured", label: "Featured", type: "checkbox" }, { key: "published", label: "Published", type: "checkbox" }, { key: "order", label: "Display order", type: "number" },
    ],
  },
  blog: {
    title: "Blog", description: "Create image-rich useful content, then publish when ready.", titleField: "title", subtitleField: "category",
    fields: [
      { key: "title", label: "Post title", required: true }, { key: "slug", label: "Unique slug", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true }, { key: "featuredImage", label: "Featured image", type: "image" },
      { key: "category", label: "Category", required: true }, { key: "tags", label: "Tags", type: "list" },
      { key: "author", label: "Author display name" }, { key: "publishDate", label: "Publish date", type: "date" },
      { key: "seoTitle", label: "SEO title" }, { key: "seoDescription", label: "SEO description", type: "textarea" },
      { key: "featured", label: "Featured", type: "checkbox" }, { key: "published", label: "Published", type: "checkbox" }, { key: "order", label: "Display order", type: "number" },
    ],
  },
  inquiries: {
    title: "Inquiries", description: "Review the request, update its status, and add private team notes.", titleField: "name", subtitleField: "email",
    fields: [
      { key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "email", label: "Email" },
      { key: "phone", label: "Phone" }, { key: "serviceInterest", label: "Service interest" }, { key: "location", label: "Location" },
      { key: "frequency", label: "Frequency" }, { key: "message", label: "Customer message", type: "textarea" },
      { key: "status", label: "Status", options: ["New", "Contacted", "Archived"] }, { key: "internalNotes", label: "Internal notes", type: "textarea" },
    ],
  },
  bookings: {
    title: "Bookings", description: "Review booking details, advance the workflow, and add private notes.", titleField: "name", subtitleField: "service",
    fields: [
      { key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "email", label: "Email" },
      { key: "phone", label: "Phone" }, { key: "service", label: "Service" }, { key: "cleaningOptions", label: "Cleaning options", type: "list" },
      { key: "frequency", label: "Frequency" }, { key: "location", label: "Location" }, { key: "preferredDate", label: "Preferred date" },
      { key: "preferredTime", label: "Preferred time" }, { key: "notes", label: "Customer notes", type: "textarea" },
      { key: "status", label: "Status", options: ["New", "Contacted", "Quoted", "Scheduled", "Completed", "Archived"] },
      { key: "internalNotes", label: "Internal notes", type: "textarea" },
    ],
  },
};
