import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { getAdminItem } from "@/lib/admin-queries";
import type { ServiceData } from "@/types/cms";

export default async function AdminServiceEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminItem("services", id);
  if (!item) notFound();
  return <><AdminPageHeader eyebrow="Services" title={String(item.title)} description="Manage index listing content and the complete dynamic service page." /><ServiceEditor initial={item as unknown as ServiceData} id={id} /></>;
}
