import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import type { ServiceData, SiteSettingsData } from "@/types/cms";

export function Footer({
  settings,
  services,
}: {
  settings: SiteSettingsData;
  services: ServiceData[];
}) {
  return (
    <footer className="site-footer">
      <div className="footer-glow" />
      <div className="shell">
        <div className="footer-cta" data-reveal>
          <span className="eyebrow">Your next clean starts here</span>
          <h2>Let&apos;s make your space<br /><em>work brighter.</em></h2>
          <Link className="button button-white" href="/booking">Build your request <ArrowUpRight /></Link>
        </div>
        <div className="footer-grid">
          <div>
            <Logo image={settings.logo} />
            <p>{settings.footerDescription}</p>
            <span className="nationwide"><MapPin size={16} />{settings.serviceArea}</span>
          </div>
          <div>
            <h3>Services</h3>
            {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}
          </div>
          <div>
            <h3>Company</h3>
            <Link href="/about">About</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <a href={`mailto:${settings.email}`}><Mail size={16} />{settings.email}</a>
            <a href={settings.phoneLink}><Phone size={16} />{settings.phoneDisplay}</a>
            <Link href="/booking">Request a custom quote <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.businessName}</span>
          <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/admin/login">Admin</Link></div>
        </div>
      </div>
    </footer>
  );
}
