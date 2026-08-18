import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getService, getServices } from "@/lib/content";
import type { PageSection } from "@/types/cms";

export async function generateStaticParams() {
  return (await getServices()).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = await getService((await params).slug);
  return service ? { title: service.seoTitle ?? `${service.title} | Canam Facility Services`, description: service.seoDescription ?? service.summary } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const service = await getService((await params).slug);
  if (!service) notFound();
  const hero: PageSection = {
    key: "hero",
    type: "hero",
    adminLabel: "Service hero",
    eyebrow: service.hero.eyebrow,
    heading: service.hero.title,
    body: service.hero.description,
    primaryMedia: service.hero.background,
    primaryCta: { label: "Request a custom quote", href: `/booking?service=${service.slug}` },
    secondaryCta: { label: "Call (587) 433-0000", href: "tel:+15874330000" },
    theme: "navy",
    visible: true,
    order: 1,
  };
  return <><SectionRenderer section={hero} priority />{service.sections.sort((a, b) => a.order - b.order).map((section) => <SectionRenderer key={section.key} section={section} />)}</>;
}
