import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminInquiriesPage() {
  const items = await listAdmin("inquiries");
  return <><AdminPageHeader eyebrow="Submissions" title="Inquiries" description="Customer quote requests saved from the public contact form." /><CollectionList items={items} collection="inquiries" editBase="/admin/inquiries" titleField="name" subtitleField="email" /></>;
}
