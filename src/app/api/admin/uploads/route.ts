import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const allowedFolders = new Set(["pages", "services", "gallery", "testimonials", "blogs", "settings"]);
const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};
const root = path.resolve(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "");
    if (!(file instanceof File) || !allowedFolders.has(folder)) return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
    const extension = allowedTypes[file.type];
    if (!extension) return NextResponse.json({ ok: false, error: "Use JPG, PNG, WebP, GIF, or SVG." }, { status: 415 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ ok: false, error: "Image must be 8MB or smaller." }, { status: 413 });
    const directory = path.resolve(root, folder);
    if (!directory.startsWith(root)) return NextResponse.json({ ok: false, error: "Invalid path." }, { status: 400 });
    await mkdir(directory, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true, url: `/uploads/${folder}/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const url = String((await request.json()).url ?? "");
    if (!url.startsWith("/uploads/") || url.includes("..")) return NextResponse.json({ ok: false, error: "Invalid file." }, { status: 400 });
    const target = path.resolve(process.cwd(), "public", url.slice(1));
    if (!target.startsWith(root) || target.includes(`${path.sep}demo${path.sep}`)) return NextResponse.json({ ok: false, error: "Protected or invalid file." }, { status: 400 });
    await unlink(target);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
  }
}
