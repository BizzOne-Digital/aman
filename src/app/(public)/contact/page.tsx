import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getPage, getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Contact | Canam Facility Services", description: "Request a custom cleaning quote anywhere in Canada." };

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()]);
  const hero = page?.sections.find((section) => section.type === "hero");
  return (
    <>
      {hero && <SectionRenderer section={hero} priority />}
      <section className="section contact-section">
        <div className="shell contact-layout">
          <div className="contact-aside" data-reveal>
            <span className="eyebrow">Direct contact</span>
            <h2>Let&apos;s talk about the work.</h2>
            <a href={settings.phoneLink}><Phone /> <span><small>Call us</small>{settings.phoneDisplay}</span></a>
            <a href={`mailto:${settings.email}`}><Mail /> <span><small>Email us</small>{settings.email}</span></a>
            <div><MapPin /> <span><small>Service area</small>{settings.serviceArea}</span></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
