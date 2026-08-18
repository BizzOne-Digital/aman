import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "Terms of Use | Canam Facility Services" };
export default function TermsPage() { return <CmsPage slug="terms" />; }
