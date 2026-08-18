import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarCheck, FileText, GalleryHorizontal, MessageSquareText, Sparkles } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { connectDb, serialize } from "@/lib/db";
import { BlogPost, BookingRequest, FAQ, GalleryImage, Inquiry, Page, Service, Testimonial } from "@/models";

async function getDashboard() {
  try {
    await connectDb();
    const [pages, services, publishedServices, gallery, testimonials, faqs, blogs, publishedBlogs, newInquiries, newBookings, inquiries, bookings] = await Promise.all([
      Page.countDocuments(), Service.countDocuments({ archived: { $ne: true } }), Service.countDocuments({ published: true, archived: { $ne: true } }),
      GalleryImage.countDocuments(), Testimonial.countDocuments(), FAQ.countDocuments(), BlogPost.countDocuments(), BlogPost.countDocuments({ published: true }),
      Inquiry.countDocuments({ status: "New" }), BookingRequest.countDocuments({ status: "New" }),
      Inquiry.find().sort({ createdAt: -1 }).limit(4).lean(), BookingRequest.find().sort({ createdAt: -1 }).limit(4).lean(),
    ]);
    return { pages, services, publishedServices, gallery, testimonials, faqs, blogs, publishedBlogs, newInquiries, newBookings, recent: serialize([...inquiries.map((x) => ({ ...x, kind: "Inquiry" })), ...bookings.map((x) => ({ ...x, kind: "Booking" }))].sort((a, b) => +new Date(b.createdAt as string) - +new Date(a.createdAt as string)).slice(0, 6)) };
  } catch {
    return { pages: 0, services: 0, publishedServices: 0, gallery: 0, testimonials: 0, faqs: 0, blogs: 0, publishedBlogs: 0, newInquiries: 0, newBookings: 0, recent: [] };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboard();
  const cards = [
    ["Pages", data.pages, "Content records", FileText, "/admin/pages"],
    ["Services", data.services, `${data.publishedServices} published`, Sparkles, "/admin/services"],
    ["Gallery", data.gallery, "Images", GalleryHorizontal, "/admin/gallery"],
    ["Blog", data.blogs, `${data.publishedBlogs} published`, BookOpen, "/admin/blog"],
    ["Inquiries", data.newInquiries, "New", MessageSquareText, "/admin/inquiries"],
    ["Bookings", data.newBookings, "New", CalendarCheck, "/admin/bookings"],
  ] as const;
  return (
    <>
      <AdminPageHeader eyebrow="Overview" title="Good to see you." description="A live view of your content and customer requests." action={<Link className="admin-primary" href="/admin/pages">Edit website <ArrowUpRight /></Link>} />
      <div className="admin-stat-grid">{cards.map(([label, value, note, Icon, href]) => <Link href={href} className="admin-stat" key={label}><div><Icon /><ArrowUpRight /></div><strong>{value}</strong><h2>{label}</h2><p>{note}</p></Link>)}</div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel"><header><div><span>LIVE ACTIVITY</span><h2>Recent requests</h2></div><Link href="/admin/bookings">View all</Link></header>{data.recent.length ? <div className="admin-table">{data.recent.map((item: Record<string, unknown>) => <div key={String(item._id)}><span className="status new">{String(item.status)}</span><b>{String(item.name)}</b><span>{String(item.kind)} · {String(item.serviceInterest ?? item.service ?? "")}</span></div>)}</div> : <div className="admin-empty">No submissions yet. New inquiries and bookings will appear here.</div>}</section>
        <section className="admin-panel quick-actions"><header><div><span>SHORTCUTS</span><h2>Quick actions</h2></div></header><Link href="/admin/services/new">Add a service <ArrowUpRight /></Link><Link href="/admin/blog/new">Write a blog post <ArrowUpRight /></Link><Link href="/admin/gallery">Upload gallery images <ArrowUpRight /></Link><Link href="/admin/settings">Update contact details <ArrowUpRight /></Link></section>
      </div>
    </>
  );
}
