import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import AdminShell from "./_components/AdminShell";
import SocketClient from "@/app/Components/SocketClient/SocketClient";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const role = user.role ?? user.user?.role ?? null;
  if (role !== "admin") redirect(`/dashboard/${role ?? "student"}`);

  const userId = user._id?.toString() || user.userId;

  // فعالسازی سوکت سمت سرور
  fetch("http://localhost:3000/api/socket");

  return (
    <>
      <SocketClient userId={userId} />

      <AdminShell userId={userId}>
        {children}
      </AdminShell>
    </>
  );
}
