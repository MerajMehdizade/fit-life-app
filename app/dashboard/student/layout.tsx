// app/dashboard/student/layout.tsx
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/getUser";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // در بعضی پروژه‌ها ممکن است role داخل user.user.role باشد
  const role = (user.role || (user as any).user?.role) ?? null;

  if (role !== "student") {
    redirect(`/dashboard/${role ?? "student"}`);
  }

  return <>{children}</>;
}
