import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { connectDb, serialize } from "@/lib/db";
import { GalleryCategory, GalleryImage } from "@/models";

export default async function AdminGalleryCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  await connectDb();
  const category = await GalleryCategory.findById(categoryId).lean();
  if (!category) notFound();
  const images = serialize(await GalleryImage.find({ category: category.name }).sort({ order: 1 }).lean());
  return <><AdminPageHeader eyebrow="Gallery" title={String(category.name)} description="Upload and manage every image in this category." /><GalleryManager initial={images} category={String(category.name)} /></>;
}
