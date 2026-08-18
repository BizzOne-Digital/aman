import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CollectionList } from "@/components/admin/CollectionList";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminPricingPage() {
  const items = await listAdmin("pricing");
  return <><AdminPageHeader eyebrow="Commerce" title="Pricing & plans" description="Custom-quote language remains public until showPricing is enabled in Settings." action={<Link className="admin-primary" href="/admin/pricing/new"><Plus />Add plan</Link>} /><CollectionList items={items} collection="pricing" editBase="/admin/pricing" titleField="title" subtitleField="frequency" /></>;
}
