import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/BookingForm";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPage } from "@/lib/content";

export const metadata: Metadata = { title: "Request a Cleaning Plan | Canam Facility Services", description: "Build a custom fleet, commercial, or residential cleaning request." };
export default async function BookingPage() {
  const page = await getPage("booking");
  const hero = page?.sections.find((section) => section.type === "hero");
  return <>{hero && <SectionRenderer section={hero} priority />}<section className="section booking-section"><div className="shell"><BookingForm /></div></section></>;
}
