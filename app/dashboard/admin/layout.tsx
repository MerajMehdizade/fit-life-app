import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import AdminShell from "./_components/AdminShell";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const role = user.role ?? user.user?.role ?? null;
  if (role !== "admin") redirect(`/dashboard/${role ?? "student"}`);



  return (
    <>
      <AdminShell >
        {children}
      </AdminShell>
    </>
  );
}
