import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPage } from "@/lib/content";

export async function CmsPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <>
      {page.sections.sort((a, b) => a.order - b.order).map((section, index) => (
        <SectionRenderer key={section.key} section={section} priority={index === 0} />
      ))}
    </>
  );
}
