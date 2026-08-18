import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminBookingsPage() {
  const items = await listAdmin("bookings");
  return <><AdminPageHeader eyebrow="Submissions" title="Bookings" description="Filter and manage multi-step booking requests through completion." /><CollectionList items={items} collection="bookings" editBase="/admin/bookings" titleField="name" subtitleField="service" /></>;
}
