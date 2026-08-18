import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminTestimonialsPage() {
  const items = await listAdmin("testimonials");
  return <><AdminPageHeader eyebrow="Content" title="Testimonials" description="Keep samples unpublished until replaced by verified customer experiences." action={<Link className="admin-primary" href="/admin/testimonials/new"><Plus />Add testimonial</Link>} /><CollectionList items={items} collection="testimonials" editBase="/admin/testimonials" titleField="clientName" subtitleField="serviceLabel" /></>;
}
