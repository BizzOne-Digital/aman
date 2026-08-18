"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import type { ServiceData, SiteSettingsData } from "@/types/cms";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Testimonials", "/testimonials"],
  ["FAQs", "/faqs"],
  ["Contact", "/contact"],
];

export function Header({
  settings,
  services,
}: {
  settings: SiteSettingsData;
  services: ServiceData[];
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo image={settings.logo} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.slice(0, 2).map(([label, href]) => (
            <Link key={href} className={active(href) ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <div
            className={`service-menu ${servicesOpen ? "open" : ""}`}
            ref={servicesRef}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`service-trigger ${active("/services") ? "active" : ""}`}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              onClick={() => setServicesOpen((current) => !current)}
            >
              Services
              <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className="service-popover" role="menu" aria-label="Services">
              <span>Our environments</span>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  role="menuitem"
                  onClick={() => setServicesOpen(false)}
                >
                  <strong>{service.title}</strong>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
              <Link className="service-popover-all" href="/services" role="menuitem" onClick={() => setServicesOpen(false)}>
                View all services
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          {links.slice(2).map(([label, href]) => (
            <Link key={href} className={active(href) ? "active" : ""} href={href}>{label}</Link>
          ))}
        </nav>
        <Link className="button button-small header-cta" href={settings.headerCta.href}>
          {settings.headerCta.label}<ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {[...links.slice(0, 2), ...links.slice(2)].map(([label, href], index) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>
          ))}
          <button
            type="button"
            className={`mobile-services-toggle ${mobileServicesOpen ? "open" : ""}`}
            aria-expanded={mobileServicesOpen}
            onClick={() => setMobileServicesOpen((current) => !current)}
          >
            <span>0{links.length + 1}</span>
            Services
            <ChevronDown size={22} aria-hidden="true" />
          </button>
        </nav>
        <div className={`mobile-services ${mobileServicesOpen ? "open" : ""}`}>
          <Link href="/services" onClick={() => setOpen(false)}>All services</Link>
          {services.map((service) => <Link onClick={() => setOpen(false)} key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}
        </div>
        <a className="mobile-phone" href={settings.phoneLink}><Phone size={18} />{settings.phoneDisplay}</a>
      </div>
    </header>
  );
}
