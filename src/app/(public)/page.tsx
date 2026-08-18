import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Canam Facility Services Ltd | Fleet, Facility & Home Cleaning",
  description:
    "Professional fleet, commercial facility, and residential cleaning across Canada. Flexible one-time, daily, weekly, monthly, and yearly plans.",
};

export default async function HomePage() {
  const page = await getPage("home");
  return (
    <div className="home-page">
      {page?.sections.sort((a, b) => a.order - b.order).map((section, index) => (
        <SectionRenderer key={section.key} section={section} priority={index === 0} preview={section.key === "faqs"} />
      ))}
    </div>
  );
}
