"use client";
/* eslint-disable @next/next/no-img-element -- CMS previews render administrator-selected local files. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Eye, GripVertical, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import type { PageSection, ServiceData } from "@/types/cms";

const blankSection = (): PageSection => ({
  key: `section-${Date.now()}`, type: "splitMedia", adminLabel: "New detail section", heading: "New section",
  body: "", theme: "light", visible: true, order: 50,
});

export function ServiceEditor({ initial, id }: { initial: ServiceData; id?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"listing" | "detail">("listing");
  const [service, setService] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const updateSection = (index: number, patch: Partial<PageSection>) => setService((current) => ({ ...current, sections: current.sections.map((section, i) => i === index ? { ...section, ...patch } : section) }));
  async function save() {
    setState("saving");
    const response = await fetch(id ? `/api/admin/data/services/${id}` : "/api/admin/data/services", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(service) });
    setState(response.ok ? "saved" : "error");
    if (!id && response.ok) {
      const result = await response.json();
      router.push(`/admin/services/${result.data._id}`);
      router.refresh();
    }
  }
  async function upload(target: "listing" | "hero" | number, file?: File) {
    if (!file) return;
    const form = new FormData(); form.set("file", file); form.set("folder", "services");
    const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) return;
    if (target === "listing") setService({ ...service, mainImage: { ...service.mainImage, url: result.url } });
    else if (target === "hero") setService({ ...service, hero: { ...service.hero, background: { ...service.hero.background, url: result.url } } });
    else updateSection(target, { primaryMedia: { url: result.url, alt: service.sections[target].primaryMedia?.alt ?? "" } });
  }
  return (
    <div className="editor">
      <div className="editor-toolbar"><div className="editor-tabs" role="tablist"><button className={tab === "listing" ? "active" : ""} onClick={() => setTab("listing")}>Listing / Description</button><button className={tab === "detail" ? "active" : ""} onClick={() => setTab("detail")}>Detail Page</button></div><div>{id && <a className="admin-secondary" href={`/services/${service.slug}`} target="_blank"><Eye />Preview</a>}<button className="admin-primary" onClick={save} disabled={state === "saving"}><Save />{state === "saving" ? "Saving…" : "Save service"}</button></div></div>
      {state === "error" && <div className="admin-error">Unable to save. Check required fields and ensure the slug is unique.</div>}
      {tab === "listing" ? <section className="editor-panel"><header><span>SERVICES INDEX CONTENT</span><h2>Listing / Description</h2><p>These fields power the main Services page and previews.</p></header><div className="admin-form-grid">
        <label>Title<input required value={service.title} onChange={(e) => setService({ ...service, title: e.target.value })} /></label><label>Unique slug<input value={service.slug} onChange={(e) => setService({ ...service, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></label>
        <label className="wide">Short description<textarea rows={4} value={service.summary} onChange={(e) => setService({ ...service, summary: e.target.value })} /></label>
        <label>Icon key<input value={service.icon} onChange={(e) => setService({ ...service, icon: e.target.value })} /></label><label>CTA label<input value={service.ctaLabel} onChange={(e) => setService({ ...service, ctaLabel: e.target.value })} /></label>
        <label>Display order<input type="number" value={service.order} onChange={(e) => setService({ ...service, order: Number(e.target.value) })} /></label><label className="toggle-label"><input type="checkbox" checked={service.published} onChange={(e) => setService({ ...service, published: e.target.checked })} />Published</label>
        <label className="wide">Feature bullets (one per line)<textarea rows={5} value={service.features.join("\n")} onChange={(e) => setService({ ...service, features: e.target.value.split("\n").filter(Boolean) })} /></label>
        <div className="media-control wide"><div>{service.mainImage.url ? <img src={service.mainImage.url} alt="" /> : <ImagePlus />}</div><label>Card image URL<input value={service.mainImage.url} onChange={(e) => setService({ ...service, mainImage: { ...service.mainImage, url: e.target.value } })} /></label><label>Card image alt text<input value={service.mainImage.alt} onChange={(e) => setService({ ...service, mainImage: { ...service.mainImage, alt: e.target.value } })} /></label><label className="upload-button"><ImagePlus />Upload / replace<input type="file" accept="image/*" onChange={(e) => upload("listing", e.target.files?.[0])} /></label></div>
        <label className="wide">SEO title<input value={service.seoTitle ?? ""} onChange={(e) => setService({ ...service, seoTitle: e.target.value })} /></label><label className="wide">SEO description<textarea rows={3} value={service.seoDescription ?? ""} onChange={(e) => setService({ ...service, seoDescription: e.target.value })} /></label>
      </div></section> : <div className="detail-editor">
        <section className="editor-panel"><header><span>DYNAMIC ROUTE HERO</span><h2>Service hero</h2></header><div className="admin-form-grid"><label>Eyebrow<input value={service.hero.eyebrow} onChange={(e) => setService({ ...service, hero: { ...service.hero, eyebrow: e.target.value } })} /></label><label className="wide">Hero title<input value={service.hero.title} onChange={(e) => setService({ ...service, hero: { ...service.hero, title: e.target.value } })} /></label><label className="wide">Hero description<textarea rows={3} value={service.hero.description} onChange={(e) => setService({ ...service, hero: { ...service.hero, description: e.target.value } })} /></label><div className="media-control wide"><div>{service.hero.background.url ? <img src={service.hero.background.url} alt="" /> : <ImagePlus />}</div><label>Hero image URL<input value={service.hero.background.url} onChange={(e) => setService({ ...service, hero: { ...service.hero, background: { ...service.hero.background, url: e.target.value } } })} /></label><label>Hero image alt text<input value={service.hero.background.alt} onChange={(e) => setService({ ...service, hero: { ...service.hero, background: { ...service.hero.background, alt: e.target.value } } })} /></label><label className="upload-button"><ImagePlus />Upload / replace<input type="file" accept="image/*" onChange={(e) => upload("hero", e.target.files?.[0])} /></label></div></div></section>
        <div className="section-editor-heading"><div><span>REUSABLE DETAIL TEMPLATE</span><h2>Ordered sections</h2></div><button className="admin-secondary" onClick={() => setService({ ...service, sections: [...service.sections, blankSection()] })}><Plus />Add section</button></div>
        {service.sections.map((section, index) => <section className="editor-panel section-editor" key={`${section.key}-${index}`}><header><GripVertical /><div><span>{section.type} · {section.theme}</span><h2>{section.adminLabel}</h2></div><div className="section-actions"><button onClick={() => setService({ ...service, sections: [...service.sections.slice(0, index + 1), { ...section, key: `${section.key}-copy-${Date.now()}` }, ...service.sections.slice(index + 1)] })} aria-label="Duplicate"><Copy /></button><button className="danger" onClick={() => confirm("Delete this detail section?") && setService({ ...service, sections: service.sections.filter((_, i) => i !== index) })} aria-label="Delete"><Trash2 /></button></div></header><div className="admin-form-grid">
          <label>Internal label<input value={section.adminLabel} onChange={(e) => updateSection(index, { adminLabel: e.target.value })} /></label><label>Type<select value={section.type} onChange={(e) => updateSection(index, { type: e.target.value as PageSection["type"] })}>{["richText", "splitMedia", "featureGrid", "imageMosaic", "galleryRail", "process", "plans", "faqs", "cta"].map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>Eyebrow<input value={section.eyebrow ?? ""} onChange={(e) => updateSection(index, { eyebrow: e.target.value })} /></label><label>Heading<input value={section.heading ?? ""} onChange={(e) => updateSection(index, { heading: e.target.value })} /></label><label className="wide">Rich text<textarea rows={5} value={section.body ?? ""} onChange={(e) => updateSection(index, { body: e.target.value })} /></label>
          <label>Theme<select value={section.theme} onChange={(e) => updateSection(index, { theme: e.target.value as PageSection["theme"] })}>{["light", "ice", "blue", "navy"].map((x) => <option key={x}>{x}</option>)}</select></label><label>Layout<select value={section.layout ?? "standard"} onChange={(e) => updateSection(index, { layout: e.target.value as PageSection["layout"] })}>{["standard", "reverse", "centered", "editorial"].map((x) => <option key={x}>{x}</option>)}</select></label><label>Order<input type="number" value={section.order} onChange={(e) => updateSection(index, { order: Number(e.target.value) })} /></label><label className="toggle-label"><input type="checkbox" checked={section.visible} onChange={(e) => updateSection(index, { visible: e.target.checked })} />Visible</label>
          {section.primaryMedia && <div className="media-control wide"><div><img src={section.primaryMedia.url} alt="" /></div><label>Image URL<input value={section.primaryMedia.url} onChange={(e) => updateSection(index, { primaryMedia: { ...section.primaryMedia!, url: e.target.value } })} /></label><label>Alt text<input value={section.primaryMedia.alt} onChange={(e) => updateSection(index, { primaryMedia: { ...section.primaryMedia!, alt: e.target.value } })} /></label><label className="upload-button"><ImagePlus />Upload / replace<input type="file" onChange={(e) => upload(index, e.target.files?.[0])} /></label></div>}
        </div></section>)}
      </div>}
    </div>
  );
}
