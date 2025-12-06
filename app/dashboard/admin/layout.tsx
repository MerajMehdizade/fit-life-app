// app/dashboard/admin/layout.tsx

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/getUser";
import AdminShell from "./_components/AdminShell";// ← اضافه شد

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const role = (user.role || (user as any).user?.role) ?? null;

  if (role !== "admin") {
    redirect(`/dashboard/${role ?? "student"}`);
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
