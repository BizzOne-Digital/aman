import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="hero theme-navy"><div className="hero-grid" /><div className="shell hero-content"><span className="eyebrow">404 / Off route</span><h1>This page missed the turn.</h1><p>The page may have moved, remained unpublished, or no longer exists.</p><div className="cta-row"><Link className="button" href="/"><ArrowLeft />Return home</Link><Link className="text-link" href="/contact">Contact Canam</Link></div></div></main>;
}
