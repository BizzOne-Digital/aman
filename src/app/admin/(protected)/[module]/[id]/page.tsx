import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SimpleRecordEditor } from "@/components/admin/SimpleRecordEditor";
import { adminConfigs } from "@/data/admin-config";
import { stockImage } from "@/data/stock-images";
import { getAdminItem } from "@/lib/admin-queries";
import type { AdminCollection } from "@/lib/admin-data";

const allowed = new Set(["testimonials", "faqs", "pricing", "blog", "inquiries", "bookings"]);

export default async function GenericAdminEditor({ params }: { params: Promise<{ module: string; id: string }> }) {
  const { module, id } = await params;
  if (!allowed.has(module) || !adminConfigs[module]) notFound();
  const item: Record<string, unknown> | null = id === "new" ? {} : await getAdminItem(module as AdminCollection, id);
  if (!item) notFound();
  const config = adminConfigs[module];
  const defaults: Record<string, unknown> = module === "blog"
    ? { published: false, featured: false, tags: [], content: [], author: "Canam Facility Services", publishDate: new Date().toISOString().slice(0, 10), featuredImage: { url: stockImage("blog-frequency"), alt: "" }, order: 10 }
    : { published: false, featured: false, order: 10, priceLabel: "Custom quote" };
  return (
    <>
      <AdminPageHeader eyebrow={config.title} title={id === "new" ? `Add ${config.title.toLowerCase()} record` : String(item[config.titleField] ?? "Edit record")} description={config.description} />
      <SimpleRecordEditor collection={module} id={id === "new" ? undefined : id} initial={{ ...defaults, ...item }} fields={config.fields} returnTo={`/admin/${module}`} />
    </>
  );
}
