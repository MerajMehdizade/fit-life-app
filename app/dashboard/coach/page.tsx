"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import Link from "next/link";
import Toast from "@/app/Components/toast/Toast";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import { cropImage } from "@/lib/cropImage";

interface UserType {
  name: string;
  email: string;
  avatar: string | null;
}

export default function CoachDashboard() {
  const { user, logout, loading } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  if (loading || !user) {
    return <div className="text-white text-center mt-10">در حال بارگذاری...</div>;
  }

  const handleAvatarUpload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("avatar", blob);

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAvatarPreview(data.avatar);
        setToast({ show: true, message: "آواتار با موفقیت آپلود شد", type: "success" });
        setCropFile(null);
      } else {
        setToast({ show: true, message: "خطا در آپلود آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
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
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => setCropFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <Link
          href="/dashboard/coach/students"
          className="p-2 bg-green-500 rounded-xl inline-block hover:bg-green-600 transition"
        >
          شاگرد ها
        </Link>
      </div>

      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onDone={async (area: any) => {
            const blob = await cropImage(URL.createObjectURL(cropFile), area);
            await handleAvatarUpload(blob);
          }}
          onCancel={() => setCropFile(null)}
        />
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
