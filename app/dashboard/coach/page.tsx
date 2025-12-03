"use client";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import { useUser } from "@/app/context/UserContext";

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
      </div>
    </div>
  );
}
