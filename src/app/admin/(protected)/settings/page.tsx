import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SimpleRecordEditor, type FieldConfig } from "@/components/admin/SimpleRecordEditor";
import { getSettings } from "@/lib/content";

const fields: FieldConfig[] = [
  { key: "businessName", label: "Business name", required: true }, { key: "headline", label: "Primary headline" },
  { key: "logo", label: "Logo", type: "image" }, { key: "favicon", label: "Favicon", type: "image" },
  { key: "email", label: "Email", required: true }, { key: "phoneDisplay", label: "Phone display value" },
  { key: "phoneLink", label: "Link-safe phone value" }, { key: "website", label: "Website" },
  { key: "address", label: "Address (when supplied)" }, { key: "serviceArea", label: "Service-area wording" },
  { key: "businessHours", label: "Business hours" }, { key: "footerDescription", label: "Footer description", type: "textarea" },
  { key: "defaultSeoTitle", label: "Default SEO title" }, { key: "defaultSeoDescription", label: "Default SEO description", type: "textarea" },
  { key: "socialImage", label: "Social sharing image", type: "image" },
  { key: "showPricing", label: "Show published pricing publicly", type: "checkbox" },
  { key: "introEnabled", label: "Enable first-session intro", type: "checkbox" },
  { key: "introSessionBehavior", label: "Remember intro for browser session", type: "checkbox" },
];

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <><AdminPageHeader eyebrow="Global" title="Site settings" description="One source for contact details, site identity, pricing visibility, SEO, and animation behavior." /><SimpleRecordEditor collection="settings" id="singleton" initial={settings as unknown as Record<string, unknown>} fields={fields} returnTo="/admin/settings" /></>;
}
