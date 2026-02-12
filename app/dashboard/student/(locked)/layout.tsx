export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import type { ReactNode } from "react";
import StudentShell from "../_Components/StudentShell";
import Link from "next/link";

export default async function LockedStudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "student") {
    redirect(`/dashboard/${user.role}`);
  }

  if (!user.profileCompleted) {
    redirect("/dashboard/complete-profile");
  }

  const isSuspended = user.status === "suspended";

  return (
    <div className="relative min-h-screen">
      <div
        className={
          isSuspended
            ? "blur-sm pointer-events-none select-none"
            : ""
        }
      >
        <StudentShell>{children}</StudentShell>
      </div>

      {isSuspended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-gray-900 text-white px-10 py-12 rounded-2xl shadow-2xl text-center max-w-md border border-yellow-500">

            <h1 className="text-2xl mb-4 text-yellow-400 font-bold">
              حساب شما غیرفعال شده است
            </h1>

            <p className="text-gray-300 mb-6">
              فقط امکان مشاهده پروفایل برای شما فعال است.
            </p>

            <Link
              href="/dashboard/student/profile"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 transition px-6 py-2 rounded-xl font-medium"
            >
              رفتن به پروفایل
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}
