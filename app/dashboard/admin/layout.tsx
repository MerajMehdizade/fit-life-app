import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import AdminShell from "./_components/AdminShell";
import { ReactNode } from "react";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jwtUser = await getCurrentUser();
  if (!jwtUser) redirect("/login");

  await dbConnect();
  const user = await User.findById(jwtUser.userId);
  if (!user) redirect("/login");

  if (user.role !== "admin") redirect(`/dashboard/${user.role ?? "student"}`);

  return <AdminShell>{children}</AdminShell>;
}

