import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "Customer Experiences | Canam Facility Services" };
export default function TestimonialsPage() { return <CmsPage slug="testimonials" />; }
