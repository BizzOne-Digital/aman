import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PageEditor } from "@/components/admin/PageEditor";
import { getAdminItem } from "@/lib/admin-queries";
import type { PageData } from "@/types/cms";

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getAdminItem("pages", slug);
  if (!item) notFound();
  return <><AdminPageHeader eyebrow="Pages" title={String(item.title)} description="Edit page settings, copy, calls to action, images, visibility, and display order." /><PageEditor initial={item as unknown as PageData} id={slug} /></>;
}
