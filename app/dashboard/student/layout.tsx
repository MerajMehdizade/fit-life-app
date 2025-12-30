import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import type { ReactNode } from "react";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/dashboard/${user.role}`);
  if (!user.profileCompleted) redirect("/dashboard/complete-profile");

  return <>{children}</>;
}
