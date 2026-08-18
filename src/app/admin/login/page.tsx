import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="login-page">
      <div className="login-brand"><Logo /><div><span>CANAM CONTROL ROOM</span><h2>Keep every page,<br />request, and service<br /><em>moving.</em></h2></div></div>
      <div className="login-panel"><LoginForm /><Link href="/">← Back to website</Link></div>
    </main>
  );
}
