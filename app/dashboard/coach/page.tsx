"use client";

import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserType {
  name: string;
  email: string;
  avatar: string | null;
}

export default function CoachDashboard() {
  const { user, logout, loading } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (loading || !user) {
    return <div className="text-white text-center mt-10">در حال بارگذاری...</div>;
  }

  const avatarSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("avatar", file);

    await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <DropdownMenu
        role="Coach"
        items={[
          { label: "شاگردا", href: "/dashboard/coach/students" },
          { label: "ترجیحات", href: "/preferences" },
          { label: "خروج", onClick: logout, danger: true },
        ]}
      />

      <div className="mt-10 text-center space-y-5 text-white">
        <h1 className="text-3xl font-bold">{user.name} Dashboard</h1>
        <p>جستجوی شاگردها و مدیریت برنامه‌ها</p>

        <div className="flex flex-col items-center mb-6 gap-3">
          <img
            src={avatarPreview || user.avatar || "/avatars/default.png"}
            className="w-28 h-28 rounded-full object-cover border-4 border-cyan-800"
          />

          <label className="cursor-pointer bg-cyan-900 px-4 py-2 rounded-lg hover:bg-cyan-800 transition">
            تغییر آواتار
            <input type="file" accept="image/*" hidden onChange={avatarSubmit} />
          </label>
        </div>

        <Link
          href="/dashboard/coach/students"
          className="p-2 bg-green-500 rounded-xl inline-block hover:bg-green-600 transition"
        >
          شاگرد ها
        </Link>
      </div>
    </div>
  );
}
