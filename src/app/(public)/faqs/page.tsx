import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "Frequently Asked Questions | Canam Facility Services" };
export default function FaqsPage() { return <CmsPage slug="faqs" />; }
