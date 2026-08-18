import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminBlogPage() {
  const items = await listAdmin("blog");
  return <><AdminPageHeader eyebrow="Publishing" title="Blog" description="Draft, publish, and preview practical cleaning articles." action={<Link className="admin-primary" href="/admin/blog/new"><Plus />New post</Link>} /><CollectionList items={items} collection="blog" editBase="/admin/blog" titleField="title" subtitleField="category" /></>;
}
