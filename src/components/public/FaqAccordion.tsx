"use client";

import { useId, useMemo, useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import type { FaqData } from "@/types/cms";

export function FaqAccordion({ items, preview = false }: { items: FaqData[]; preview?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const id = useId();
  const filtered = useMemo(
    () => items.filter((item) => preview || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(query.toLowerCase())),
    [items, preview, query],
  );

  return (
    <div className="faq-wrap">
      {!preview && (
        <label className="faq-search"><Search size={18} /><span className="sr-only">Search questions</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions…" /></label>
      )}
      <div className="accordion">
        {filtered.map((item, index) => {
          const active = open === index;
          return (
            <div className="accordion-item" key={item._id ?? item.question}>
              <button type="button" aria-expanded={active} aria-controls={`${id}-${index}`} onClick={() => setOpen(active ? null : index)}>
                <span><small>{item.category}</small>{item.question}</span>{active ? <Minus /> : <Plus />}
              </button>
              <div id={`${id}-${index}`} className="accordion-panel" hidden={!active}><p>{item.answer}</p></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
