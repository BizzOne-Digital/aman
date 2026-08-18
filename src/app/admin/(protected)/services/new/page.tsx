import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { stockImage } from "@/data/stock-images";
import type { ServiceData } from "@/types/cms";

const blank: ServiceData = {
  title: "", slug: "", summary: "", mainImage: { url: stockImage("commercial"), alt: "" }, icon: "Sparkles",
  features: [], ctaLabel: "Explore service", published: false, order: 10,
  hero: { eyebrow: "Canam service", title: "", description: "", background: { url: stockImage("hero"), alt: "" } },
  sections: [], seoTitle: "", seoDescription: "",
};
export default function NewServicePage() {
  return <><AdminPageHeader eyebrow="Services" title="Add new service" description="Publish once the listing, dynamic detail page, images, and SEO are ready." /><ServiceEditor initial={blank} /></>;
}
