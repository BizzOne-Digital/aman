"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import type { GalleryItemData } from "@/types/cms";

export function GalleryGrid({ items, compact = false }: { items: GalleryItemData[]; compact?: boolean }) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<GalleryItemData | null>(null);
  const source = compact ? items.filter((item) => item.featured) : items;
  const categories = ["All", ...Array.from(new Set(source.map((item) => item.category)))];
  const filtered = (category === "All" ? source : source.filter((item) => item.category === category)).slice(0, compact ? 6 : undefined);

  return (
    <>
      <div className="filter-row" role="group" aria-label="Gallery categories">
        {categories.map((label) => <button type="button" className={category === label ? "active" : ""} onClick={() => setCategory(label)} key={label}>{label}</button>)}
      </div>
      <div className="gallery-grid">
        {filtered.map((item, index) => (
          <button className={`gallery-tile tile-${index % 5}`} type="button" onClick={() => setSelected(item)} key={`${item.url}-${index}`}>
            <Image src={item.url} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 33vw" />
            <span><small>{item.category}</small>{item.title ?? item.alt}<ZoomIn size={18} /></span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.alt} onClick={() => setSelected(null)}>
          <button type="button" aria-label="Close image" onClick={() => setSelected(null)}><X /></button>
          <div className="lightbox-image" onClick={(event) => event.stopPropagation()}><Image src={selected.url} alt={selected.alt} fill sizes="90vw" /></div>
          <p>{selected.caption ?? selected.alt}</p>
        </div>
      )}
    </>
  );
}
