import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminPagesPage() {
  const items = await listAdmin("pages");
  return <><AdminPageHeader eyebrow="Website" title="Pages" description="Edit page-level settings and every public section in display order." /><CollectionList items={items} collection="pages" editBase="/admin/pages" titleField="title" subtitleField="slug" allowDelete={false} /></>;
}
