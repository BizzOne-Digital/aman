"use client";
/* eslint-disable @next/next/no-img-element -- CMS previews render administrator-selected local files. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Save } from "lucide-react";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "date" | "list" | "image";
  required?: boolean;
  options?: string[];
};

export function SimpleRecordEditor({ collection, id, initial, fields, returnTo }: { collection: string; id?: string; initial: Record<string, unknown>; fields: FieldConfig[]; returnTo: string }) {
  const [data, setData] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const router = useRouter();
  const set = (key: string, value: unknown) => setData((current) => ({ ...current, [key]: value }));
  async function save() {
    setState("saving");
    const response = await fetch(id ? `/api/admin/data/${collection}/${id}` : `/api/admin/data/${collection}`, { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!response.ok) return setState("error");
    router.push(returnTo);
    router.refresh();
  }
  async function upload(key: string, file?: File) {
    if (!file) return;
    const folder = collection === "blog" ? "blogs" : collection === "testimonials" ? "testimonials" : collection === "gallery" ? "gallery" : "settings";
    const form = new FormData(); form.set("file", file); form.set("folder", folder);
    const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const result = await response.json();
    if (response.ok) set(key, key === "featuredImage" || key === "image" ? { url: result.url, alt: String((data[key] as { alt?: string })?.alt ?? "") } : result.url);
  }
  return (
    <section className="editor-panel simple-editor">
      <header><span>CONTENT RECORD</span><h2>Details</h2><p>Required fields must be complete before publishing.</p></header>
      <div className="admin-form-grid">{fields.map((field) => {
        const value = data[field.key];
        if (field.type === "checkbox") return <label className="toggle-label" key={field.key}><input type="checkbox" checked={Boolean(value)} onChange={(e) => set(field.key, e.target.checked)} />{field.label}</label>;
        if (field.type === "textarea") return <label className="wide" key={field.key}>{field.label}<textarea rows={5} required={field.required} value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)} /></label>;
        if (field.type === "list") return <label className="wide" key={field.key}>{field.label}<textarea rows={4} value={Array.isArray(value) ? value.join("\n") : ""} onChange={(e) => set(field.key, e.target.value.split("\n").filter(Boolean))} /><small>One item per line</small></label>;
        if (field.type === "image") {
          const media = typeof value === "object" && value ? value as { url?: string; alt?: string } : { url: String(value ?? ""), alt: "" };
          return <div className="media-control wide" key={field.key}><div>{media.url ? <img src={media.url} alt="" /> : <ImagePlus />}</div><label>{field.label} URL<input value={media.url ?? ""} onChange={(e) => set(field.key, { ...media, url: e.target.value })} /></label><label>Image alt text<input value={media.alt ?? ""} onChange={(e) => set(field.key, { ...media, alt: e.target.value })} /></label><label className="upload-button"><ImagePlus />Upload / replace<input type="file" accept="image/*" onChange={(e) => upload(field.key, e.target.files?.[0])} /></label></div>;
        }
        return <label key={field.key}>{field.label}{field.options ? <select value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)}><option value="">Select</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} required={field.required} value={String(value ?? "")} onChange={(e) => set(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)} />}</label>;
      })}</div>
      {state === "error" && <div className="admin-error">Could not save. Check required fields and unique values.</div>}
      <div className="editor-save-row"><button className="admin-primary" onClick={save} disabled={state === "saving"}><Save />{state === "saving" ? "Saving…" : "Save changes"}</button></div>
    </section>
  );
}
