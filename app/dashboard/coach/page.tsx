"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import Toast from "@/app/Components/toast/Toast";
import Link from "next/link";
import { createCroppedBlob } from "@/lib/createCroppedBlob";

export default function CoachDashboard() {
  const { user, logout, loading, setUser } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  // set avatarPreview on user load or change
  useEffect(() => {
    if (user) {
      setAvatarPreview(user.avatar ? `${user.avatar}?t=${Date.now()}` : "/avatars/default.webp");
    }
  }, [user?.avatar]);

  if (loading || !user) return <div className="text-white text-center mt-10">در حال بارگذاری...</div>;

  // Upload avatar with cache-busting
  async function uploadAvatar(blob: Blob) {
    const fd = new FormData();
    fd.append("avatar", blob);

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();

      if (res.ok && data.avatar) {
        const newAvatarUrl = `${data.avatar}?t=${Date.now()}`;
        setAvatarPreview(newAvatarUrl);
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
        setToast({ show: true, message: "آواتار با موفقیت بروزرسانی شد", type: "success" });
        setCropFile(null);
      } else {
        setToast({ show: true, message: data.error || "خطا در آپلود آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  }

  // Delete avatar
  async function handleDeleteAvatar() {
    try {
      const res = await fetch("/api/user/avatar/delete", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const defaultAvatar = `/avatars/default.webp?t=${Date.now()}`;
        setAvatarPreview(defaultAvatar);
        setUser(prev => prev ? { ...prev, avatar: "" } : null);
        setToast({ show: true, message: "آواتار حذف شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در حذف آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* DropdownMenu با role مربی */}
      <DropdownMenu
        role="Coach"
        items={[
          { label: "شاگردها", href: "/dashboard/coach/students" },
          { label: "ترجیحات", href: "/preferences" },
          { label: "خروج", onClick: logout, danger: true },
        ]}
      />

      <div className="mt-10 text-center space-y-6 text-white">
        <h1 className="text-3xl font-bold">{user.name}</h1>

        <div className="flex flex-col items-center gap-3">
          <img
            src={avatarPreview || "/avatars/default.webp"}
            className="w-28 h-28 rounded-full border-4 border-cyan-800 object-cover"
          />
          <div className="flex gap-2 mt-2 justify-center">
            <button
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              onClick={handleDeleteAvatar}
            >
              حذف آواتار
            </button>
          </div>

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
          className="inline-block px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          شاگردها
        </Link>
      </div>

      {/* Avatar Cropper */}
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onConfirm={async area => {
            const blob = await createCroppedBlob(cropFile, area);
            await uploadAvatar(blob);
          }}
          onCancel={() => setCropFile(null)}
        />
      )}

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
