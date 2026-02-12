import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return children;
}
