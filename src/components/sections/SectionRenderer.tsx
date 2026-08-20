import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { TestimonialCarousel } from "@/components/public/TestimonialCarousel";
import { getFaqs, getGallery, getServices, getTestimonials } from "@/lib/content";
import type { PageSection } from "@/types/cms";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { GalleryGrid } from "@/components/public/GalleryGrid";

function Ctas({ section }: { section: PageSection }) {
  return (
    <div className="cta-row">
      {section.primaryCta && <Link className="button" href={section.primaryCta.href}>{section.primaryCta.label}<ArrowUpRight size={18} /></Link>}
      {section.secondaryCta && <Link className="text-link" href={section.secondaryCta.href}>{section.secondaryCta.label}<ArrowRight size={17} /></Link>}
    </div>
  );
}

function HeaderBlock({ section }: { section: PageSection }) {
  return (
    <header className="section-header" data-reveal>
      {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p className="section-subheading">{section.subheading}</p>}
      {section.body && <p>{section.body}</p>}
    </header>
  );
}

export async function SectionRenderer({
  section,
  priority = false,
  preview = false,
}: {
  section: PageSection;
  priority?: boolean;
  preview?: boolean;
}) {
  if (!section.visible) return null;
  const theme = `theme-${section.theme ?? "light"}`;

  if (section.type === "hero") {
    return (
      <section className={`hero ${theme}`}>
        {section.primaryMedia && (
          <div className="hero-media" data-parallax>
            <Image src={section.primaryMedia.url} alt={section.primaryMedia.alt} fill priority={priority} sizes="100vw" />
          </div>
        )}
        <div className="hero-overlay" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-content">
          <span className="hero-index">CANAM / {String(section.order).padStart(2, "0")}</span>
          {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
          {section.subheading && <strong className="hero-subheading">{section.subheading}</strong>}
          <h1>{section.heading}</h1>
          {section.body && <p>{section.body}</p>}
          <Ctas section={section} />
          {section.key === "hero" && (
            <div className="hero-stats" aria-label="Service highlights">
              <div><strong>Canada-wide</strong><span>Nationwide coverage</span></div>
              <div><strong>3 worlds</strong><span>Fleet, facility & home</span></div>
              <div><strong>Flexible</strong><span>One-time to yearly plans</span></div>
            </div>
          )}
        </div>
        <div className="hero-orbit"><span>FLEET</span><span>FACILITY</span><span>HOME</span></div>
        <div className="hero-scroll"><i />SCROLL TO EXPLORE</div>
      </section>
    );
  }

  if (section.type === "serviceCards") {
    const services = await getServices();
    return (
      <section className={`section service-worlds ${theme}`}>
        <div className="shell">
          <HeaderBlock section={section} />
          <div className="service-grid">
            {services.map((service, index) => (
              <Link className="service-card" href={`/services/${service.slug}`} key={service.slug} data-reveal>
                <div className="service-card-media">
                  <Image src={service.mainImage.url} alt={service.mainImage.alt} fill sizes="(max-width: 800px) 100vw, 33vw" />
                  <span>0{index + 1}</span>
                </div>
                <div className="service-card-copy">
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <ul>{service.features.slice(0, 3).map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
                  <span className="card-link">{service.ctaLabel}<ArrowUpRight size={18} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "splitMedia") {
    return (
      <section className={`section split-section ${theme}`}>
        <div className="shell split-grid">
          <div className="split-copy">
            <HeaderBlock section={section} />
            {section.items?.map((item) => <div className="split-item" key={item.title} data-reveal><Sparkles size={19} /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}
            <Ctas section={section} />
          </div>
          <div className="editorial-media" data-reveal>
            {section.primaryMedia && <div className="media-main"><Image src={section.primaryMedia.url} alt={section.primaryMedia.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>}
            {section.media?.[0] && <div className="media-float"><Image src={section.media[0].url} alt={section.media[0].alt} fill sizes="220px" /></div>}
            <span className="media-caption">CANAM / CLEAN ENVIRONMENTS</span>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "galleryRail" || section.type === "imageMosaic") {
    const gallery = await getGallery();
    return (
      <section className={`section gallery-section ${theme}`}>
        <div className="shell"><HeaderBlock section={section} /><GalleryGrid items={gallery} compact={section.type === "galleryRail"} /></div>
      </section>
    );
  }

  if (section.type === "faqs") {
    const faqs = await getFaqs();
    const items = preview ? faqs.slice(0, 4) : faqs;
    return (
      <section className={`section faq-section ${theme}`}>
        <div className="shell narrow">
          <HeaderBlock section={section} />
          <FaqAccordion items={items} preview={preview} />
          {preview && (
            <div className="section-footer-link">
              <Link className="text-link" href="/faqs">View all FAQs <ArrowRight size={17} /></Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "testimonials") {
    const testimonials = await getTestimonials();
    return (
      <section className={`section ${theme}`}>
        <div className="shell">
          <HeaderBlock section={section} />
          {testimonials.length ? (
            <TestimonialCarousel items={testimonials} />
          ) : (
            <div className="empty-public">Verified customer stories will appear here soon.</div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "cta") {
    return (
      <section className={`section final-cta ${theme}`}>
        <div className="shell final-cta-inner" data-reveal><HeaderBlock section={section} /><Ctas section={section} /></div>
      </section>
    );
  }

  if (section.type === "plans") {
    return (
      <section className={`section plans-section ${theme}`}>
        <div className="shell">
          <HeaderBlock section={section} />
          <div className="plans-row">
            {section.items?.map((item) => (
              <article className="plans-card" key={item.title} data-reveal>
                <span className="plans-card-mark" aria-hidden="true" />
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
          <Ctas section={{ ...section, primaryCta: section.primaryCta ?? { label: "Request a custom quote", href: "/booking" } }} />
        </div>
      </section>
    );
  }

  if (section.type === "featureGrid" && !section.heading && section.items?.length) {
    return (
      <section className={`trust-ribbon ${theme}`}>
        <div className="shell trust-ribbon-inner">
          <div className="trust-ribbon-grid">
            {section.items.map((item) => (
              <article key={item.title} data-reveal>
                <span className="trust-ribbon-mark" aria-hidden="true" />
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "richText") {
    return (
      <section className={`section rich-section ${theme}`}>
        <div className="shell narrow"><HeaderBlock section={section} />{section.media && <div className="image-strip">{section.media.map((item) => <div key={item.url}><Image src={item.url} alt={item.alt} fill sizes="50vw" /></div>)}</div>}</div>
      </section>
    );
  }

  return (
    <section className={`section grid-section ${theme}`}>
      <div className="shell">
        <HeaderBlock section={section} />
        <div
          className={`content-grid ${section.type === "process" ? "process-grid" : ""} ${
            section.type === "featureGrid" && section.items?.length ? "feature-grid" : ""
          }`}
          style={
            section.type === "featureGrid" && section.items?.length
              ? ({ "--feature-cols": section.items.length } as React.CSSProperties)
              : undefined
          }
        >
          {section.items?.map((item) => (
            <article key={item.title} data-reveal>
              <span className="item-line" />
              <h3>{item.title}</h3>
              {item.text && <p>{item.text}</p>}
              {item.bullets && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </article>
          ))}
        </div>
        {section.media && <div className="image-strip">{section.media.map((item) => <div key={item.url}><Image src={item.url} alt={item.alt} fill sizes="50vw" /></div>)}</div>}
        <Ctas section={section} />
      </div>
    </section>
  );
}
