"use client";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

export default function CoachDashboard() {
  const { user, logout, loading } = useUser();
  return (
    <div className="bg-gray-900 min-h-screen">
      <DropdownMenu role="Coach" items={[
        { label: "شاگردا", href: "/program" },
        { label: "ترجیحات", href: "/preferences" },
        { label: "خروج", onClick: logout, danger: true },
      ]} />
      <div className="mt-5 text-center space-y-5 text-white">
        <h1>Coach Dashboard</h1>
        <p>جستجوی شاگردها و مدیریت برنامه‌ها</p>
        <Link
          href="/dashboard/coach/students"
          className="p-2 bg-green-500 rounded-xl inline-block"
        >
         شاگرد ها
        </Link>
      </div>
    </div>
  );
}
