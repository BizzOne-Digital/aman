import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "About | Canam Facility Services", description: "A dependable, flexible cleaning partner serving fleets, facilities, and homes across Canada." };
export default function AboutPage() { return <CmsPage slug="about" />; }
