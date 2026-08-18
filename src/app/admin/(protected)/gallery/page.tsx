import Link from "next/link";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { listAdmin } from "@/lib/admin-queries";

export default async function AdminGalleryPage() {
  const [categories, images] = await Promise.all([listAdmin("gallery-categories"), listAdmin("gallery")]);
  return (
    <>
      <AdminPageHeader eyebrow="Media" title="Gallery" description="Open a category to upload, caption, feature, publish, and reorder its images." />
      <div className="category-grid">{categories.map((category) => {
        const count = images.filter((image) => image.category === category.name).length;
        return <Link href={`/admin/gallery/${category._id}`} key={category._id}><FolderOpen /><span>{count} images</span><h2>{String(category.name)}</h2><p>{category.published ? "Published" : "Hidden"}</p><ArrowUpRight /></Link>;
      })}</div>
    </>
  );
}
