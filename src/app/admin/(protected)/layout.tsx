import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
