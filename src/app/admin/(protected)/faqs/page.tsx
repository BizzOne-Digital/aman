import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminFaqsPage() {
  const items = await listAdmin("faqs");
  return <><AdminPageHeader eyebrow="Content" title="FAQs" description="Manage answers by category and public display order." action={<Link className="admin-primary" href="/admin/faqs/new"><Plus />Add FAQ</Link>} /><CollectionList items={items} collection="faqs" editBase="/admin/faqs" titleField="question" subtitleField="category" /></>;
}
