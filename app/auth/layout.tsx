// app/(auth)/layout.tsx
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getCookieValue } from "@/lib/serverCookies";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = await getCookieValue("token");

  if (token) {
    try {
      const decoded: any = verifyToken(token);
      const role = decoded?.role ?? "student";
      // اگر لاگین بود کاربر را به داشبورد خودش بفرست
      redirect(`/dashboard/${role}`);
    } catch {
      // توکن نامعتبر → اجازه بد نمایش صفحات auth
    }
  }

  return <>{children}</>;
}
