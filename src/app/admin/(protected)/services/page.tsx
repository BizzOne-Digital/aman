import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminServicesPage() {
  const items = await listAdmin("services");
  return <><AdminPageHeader eyebrow="Content" title="Services" description="Listing content and detail pages are managed independently." action={<Link className="admin-primary" href="/admin/services/new"><Plus />Add new service</Link>} /><CollectionList items={items} collection="services" editBase="/admin/services" titleField="title" subtitleField="slug" /></>;
}
