import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "Cleaning Services | Canam Facility Services", description: "Fleet, commercial facility, and residential cleaning with flexible schedules across Canada." };
export default function ServicesPage() { return <CmsPage slug="services" />; }
