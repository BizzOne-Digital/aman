import type { Metadata } from "next";
import { CmsPage } from "@/components/public/CmsPage";

export const metadata: Metadata = { title: "Privacy Policy | Canam Facility Services" };
export default function PrivacyPage() { return <CmsPage slug="privacy-policy" />; }
