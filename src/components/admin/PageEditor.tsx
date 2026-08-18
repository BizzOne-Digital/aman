"use client";
/* eslint-disable @next/next/no-img-element -- CMS previews render administrator-selected local files. */

import { useState } from "react";
import { Eye, GripVertical, ImagePlus, Save, Trash2 } from "lucide-react";
import type { PageData, PageSection } from "@/types/cms";

export function PageEditor({ initial, id }: { initial: PageData; id: string }) {
  const [page, setPage] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const updateSection = (index: number, patch: Partial<PageSection>) => setPage((current) => ({ ...current, sections: current.sections.map((section, i) => i === index ? { ...section, ...patch } : section) }));
  async function save() {
    setState("saving");
    const response = await fetch(`/api/admin/data/pages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(page) });
    setState(response.ok ? "saved" : "error");
    setTimeout(() => setState("idle"), 2500);
  }
  async function upload(index: number, file?: File) {
    if (!file) return;
    const form = new FormData();
    form.set("file", file);
    form.set("folder", "pages");
    const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const result = await response.json();
    if (response.ok) updateSection(index, { primaryMedia: { url: result.url, alt: page.sections[index].primaryMedia?.alt ?? "" } });
  }
  return (
    <div className="editor">
      <div className="editor-toolbar"><div><span className={`save-state ${state}`}>{state === "saving" ? "Saving…" : state === "saved" ? "All changes saved" : state === "error" ? "Save failed" : "Ready to edit"}</span></div><div><a className="admin-secondary" href={page.slug === "home" ? "/" : `/${page.slug}`} target="_blank"><Eye />Preview</a><button className="admin-primary" onClick={save} disabled={state === "saving"}><Save />Save page</button></div></div>
      <section className="editor-panel"><header><span>PAGE SETTINGS</span><h2>Identity & search</h2></header><div className="admin-form-grid">
        <label>Page title<input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} /></label>
        <label>Navigation title<input value={page.navigationTitle} onChange={(e) => setPage({ ...page, navigationTitle: e.target.value })} /></label>
        <label>Core slug<input value={page.slug} readOnly title="Core page slugs are locked" /></label>
        <label className="toggle-label"><input type="checkbox" checked={page.published} onChange={(e) => setPage({ ...page, published: e.target.checked })} />Published</label>
        <label className="wide">SEO title<input value={page.seoTitle ?? ""} onChange={(e) => setPage({ ...page, seoTitle: e.target.value })} /></label>
        <label className="wide">SEO description<textarea value={page.seoDescription ?? page.description} onChange={(e) => setPage({ ...page, seoDescription: e.target.value })} rows={3} /></label>
      </div></section>
      <div className="section-editor-heading"><div><span>PUBLIC DISPLAY ORDER</span><h2>Page sections</h2></div><p>Every visible section below maps directly to the public page.</p></div>
      <div className="section-editor-list">{page.sections.sort((a, b) => a.order - b.order).map((section, index) => (
        <section className="editor-panel section-editor" key={section.key}>
          <header><GripVertical /><div><span>{section.type} · ORDER {section.order}</span><h2>{section.adminLabel}</h2></div><label className="visibility"><input type="checkbox" checked={section.visible} onChange={(e) => updateSection(index, { visible: e.target.checked })} />{section.visible ? "Visible" : "Hidden"}</label></header>
          <div className="admin-form-grid">
            <label>Internal label<input value={section.adminLabel} onChange={(e) => updateSection(index, { adminLabel: e.target.value })} /></label>
            <label>Eyebrow<input value={section.eyebrow ?? ""} onChange={(e) => updateSection(index, { eyebrow: e.target.value })} /></label>
            <label className="wide">Heading<input value={section.heading ?? ""} onChange={(e) => updateSection(index, { heading: e.target.value })} /></label>
            <label className="wide">Body<textarea value={section.body ?? ""} onChange={(e) => updateSection(index, { body: e.target.value })} rows={4} /></label>
            <label>Theme<select value={section.theme ?? "light"} onChange={(e) => updateSection(index, { theme: e.target.value as PageSection["theme"] })}>{["light", "ice", "blue", "navy"].map((theme) => <option key={theme}>{theme}</option>)}</select></label>
            <label>Order<input type="number" value={section.order} onChange={(e) => updateSection(index, { order: Number(e.target.value) })} /></label>
            {section.primaryCta && <><label>Primary CTA label<input value={section.primaryCta.label} onChange={(e) => updateSection(index, { primaryCta: { ...section.primaryCta!, label: e.target.value } })} /></label><label>Primary CTA URL<input value={section.primaryCta.href} onChange={(e) => updateSection(index, { primaryCta: { ...section.primaryCta!, href: e.target.value } })} /></label></>}
            {section.primaryMedia && <div className="media-control wide"><div>{section.primaryMedia.url ? <img src={section.primaryMedia.url} alt="" /> : <ImagePlus />}</div><label>Image URL<input value={section.primaryMedia.url} onChange={(e) => updateSection(index, { primaryMedia: { ...section.primaryMedia!, url: e.target.value } })} /></label><label>Accessible alt text<input value={section.primaryMedia.alt} onChange={(e) => updateSection(index, { primaryMedia: { ...section.primaryMedia!, alt: e.target.value } })} /></label><label className="upload-button"><ImagePlus />Upload / replace<input type="file" accept="image/*" onChange={(e) => upload(index, e.target.files?.[0])} /></label><button type="button" className="icon-danger" onClick={() => updateSection(index, { primaryMedia: undefined })} aria-label="Remove image reference"><Trash2 /></button></div>}
          </div>
        </section>
      ))}</div>
    </div>
  );
}
