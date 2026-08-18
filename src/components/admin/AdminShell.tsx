"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen, CalendarCheck, ChevronLeft, CircleDollarSign, FileText, GalleryHorizontal,
  HelpCircle, LayoutDashboard, LogOut, Menu, MessageSquareText, MonitorUp, PanelLeftClose,
  Settings, Sparkles, UsersRound, X,
} from "lucide-react";
import { Logo } from "@/components/public/Logo";

const nav = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Pages", "/admin/pages", FileText],
  ["Services", "/admin/services", Sparkles],
  ["Gallery", "/admin/gallery", GalleryHorizontal],
  ["Testimonials", "/admin/testimonials", UsersRound],
  ["FAQs", "/admin/faqs", HelpCircle],
  ["Pricing", "/admin/pricing", CircleDollarSign],
  ["Blog", "/admin/blog", BookOpen],
  ["Inquiries", "/admin/inquiries", MessageSquareText],
  ["Bookings", "/admin/bookings", CalendarCheck],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const active = (href: string) => href === "/admin" ? pathname === href : pathname.startsWith(href);
  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <div className={`admin-shell ${collapsed ? "collapsed" : ""}`}>
      <aside className={mobile ? "mobile-open" : ""}>
        <div className="admin-logo"><Logo compact={collapsed} /><button onClick={() => setMobile(false)} className="admin-mobile-close"><X /></button></div>
        <nav>{nav.map(([label, href, Icon]) => <Link onClick={() => setMobile(false)} className={active(href) ? "active" : ""} href={href} key={href}><Icon /><span>{label}</span></Link>)}</nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank"><MonitorUp /><span>View website</span></a>
          <button onClick={logout}><LogOut /><span>Logout</span></button>
          <div className="admin-user"><i>{email.charAt(0).toUpperCase()}</i><span>{email}<small>Administrator</small></span></div>
          <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}><PanelLeftClose /><span>Collapse sidebar</span></button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><button onClick={() => setMobile(true)}><Menu /></button><span>CANAM CMS</span><a href="/" target="_blank">Live site <MonitorUp size={16} /></a></header>
        <main>{children}</main>
      </div>
      {mobile && <button className="admin-backdrop" aria-label="Close navigation" onClick={() => setMobile(false)} />}
    </div>
  );
}

export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="admin-page-header"><div><div className="admin-breadcrumb"><Link href="/admin">Dashboard</Link><ChevronLeft />{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>;
}
