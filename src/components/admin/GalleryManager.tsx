"use client";
/* eslint-disable @next/next/no-img-element -- CMS previews render administrator-selected local files. */

import { useState } from "react";
import { ImagePlus, Save, Trash2 } from "lucide-react";

type GalleryItem = { _id: string; title?: string; url: string; alt: string; caption?: string; category: string; featured: boolean; published: boolean; order: number };

export function GalleryManager({ initial, category }: { initial: GalleryItem[]; category: string }) {
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData(); form.set("file", file); form.set("folder", "gallery");
      const uploaded = await fetch("/api/admin/uploads", { method: "POST", body: form });
      const result = await uploaded.json();
      if (!uploaded.ok) continue;
      const created = await fetch("/api/admin/data/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: file.name.replace(/\.[^.]+$/, ""), url: result.url, alt: `${category} cleaning image`, category, featured: false, published: true, order: items.length }) });
      const payload = await created.json();
      if (created.ok) setItems((current) => [...current, payload.data]);
    }
    setUploading(false);
  }
  const update = (index: number, patch: Partial<GalleryItem>) => setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  async function save(item: GalleryItem) { await fetch(`/api/admin/data/gallery/${item._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); }
  async function remove(item: GalleryItem) {
    if (!confirm("Delete this gallery record?")) return;
    const response = await fetch(`/api/admin/data/gallery/${item._id}`, { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((entry) => entry._id !== item._id));
  }
  return (
    <div>
      <label className="gallery-drop"><ImagePlus /><strong>{uploading ? "Uploading…" : "Upload one or multiple images"}</strong><span>JPG, PNG, WebP, GIF, or SVG up to 8MB</span><input type="file" multiple accept="image/*" disabled={uploading} onChange={(e) => upload(e.target.files)} /></label>
      <div className="admin-gallery-grid">{items.map((item, index) => <article key={item._id}><div><img src={item.url} alt="" /></div><label>Title<input value={item.title ?? ""} onChange={(e) => update(index, { title: e.target.value })} /></label><label>Alt text<input value={item.alt} onChange={(e) => update(index, { alt: e.target.value })} /></label><label>Caption<textarea value={item.caption ?? ""} onChange={(e) => update(index, { caption: e.target.value })} /></label><div className="gallery-flags"><label><input type="checkbox" checked={item.published} onChange={(e) => update(index, { published: e.target.checked })} />Published</label><label><input type="checkbox" checked={item.featured} onChange={(e) => update(index, { featured: e.target.checked })} />Featured</label></div><div className="gallery-actions"><button onClick={() => save(item)}><Save />Save</button><button className="danger" onClick={() => remove(item)}><Trash2 /></button></div></article>)}</div>
    </div>
  );
}
