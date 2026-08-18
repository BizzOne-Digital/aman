"use client";
/* eslint-disable @next/next/no-img-element -- CMS previews render administrator-selected local files. */

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Pencil, Search, Trash2 } from "lucide-react";

type Item = Record<string, unknown> & { _id: string };

export function CollectionList({
  items: initial,
  collection,
  editBase,
  titleField = "title",
  subtitleField = "slug",
  allowDelete = true,
}: {
  items: Item[];
  collection: string;
  editBase?: string;
  titleField?: string;
  subtitleField?: string;
  allowDelete?: boolean;
}) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [items, query]);
  async function remove(item: Item) {
    if (!confirm(`Delete "${String(item[titleField] ?? "this record")}"? This action requires confirmation.`)) return;
    const response = await fetch(`/api/admin/data/${collection}/${item._id}`, { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((entry) => entry._id !== item._id));
  }
  return (
    <div className="admin-list-panel">
      <div className="admin-list-tools"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" /></label><span>{filtered.length} records</span></div>
      {filtered.length ? <div className="admin-record-list">{filtered.map((item) => {
        const published = item.published;
        const href = editBase ? `${editBase}/${item._id}` : undefined;
        return <div className="admin-record" key={item._id}>
          <div className="record-image">{typeof item.url === "string" ? <img src={item.url} alt="" /> : <span>{String(item[titleField] ?? "?").charAt(0)}</span>}</div>
          <div><h3>{String(item[titleField] ?? "Untitled")}</h3><p>{String(item[subtitleField] ?? item.category ?? "")}</p></div>
          {typeof published === "boolean" && <span className={`status ${published ? "published" : "draft"}`}>{published ? "Published" : "Draft"}</span>}
          {typeof item.status === "string" && <span className={`status ${String(item.status).toLowerCase()}`}>{String(item.status)}</span>}
          <div className="record-actions">{href && <Link href={href} aria-label="Edit"><Pencil /></Link>}{href && <Link href={href} aria-label="Open"><ArrowUpRight /></Link>}{allowDelete && <button type="button" onClick={() => remove(item)} aria-label="Delete"><Trash2 /></button>}</div>
        </div>;
      })}</div> : <div className="admin-empty">No matching records.</div>}
    </div>
  );
}
