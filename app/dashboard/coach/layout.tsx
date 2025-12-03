// app/dashboard/coach/layout.tsx
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/getUser";

export default async function CoachLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const role = (user.role || (user as any).user?.role) ?? null;

  if (role !== "coach") {
    redirect(`/dashboard/${role ?? "student"}`);
  }

  return <>{children}</>;
}
