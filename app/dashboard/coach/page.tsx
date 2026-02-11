"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import Toast from "@/app/Components/toast/Toast";
import Link from "next/link";
import { createCroppedBlob } from "@/lib/createCroppedBlob";
import Loading from "@/app/Components/LoadingSpin/Loading";

export default function CoachDashboard() {
  const { user, logout, loading, setUser } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  // ✅ Set avatarPreview on user load or change
  useEffect(() => {
    if (user) {
      setAvatarPreview(user.avatar || "/avatars/default.jpg");
    }
  }, [user?.avatar]);

  if (loading || !user) return <Loading />

  // ✅ Upload avatar
  async function uploadAvatar(blob: Blob) {
    const fd = new FormData();
    fd.append("avatar", blob);

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();

      if (res.ok && data.avatar) {
        setAvatarPreview(data.avatar);
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
        setToast({ show: true, message: "آواتار با موفقیت بروزرسانی شد", type: "success" });
        setCropFile(null);
      } else {
        setToast({ show: true, message: data.error || "خطا در آپلود آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: " لطفا اینترنت خود را بررسی کرده و دوباره تلاش کنید", type: "error" });
    }
  }

  // ✅ Delete avatar
  async function handleDeleteAvatar() {
    try {
      const res = await fetch("/api/user/avatar/delete", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAvatarPreview("/avatars/default.jpg");
        setUser(prev => prev ? { ...prev, avatar: "" } : null);
        setToast({ show: true, message: "آواتار حذف شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در حذف آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: " لطفا اینترنت خود را بررسی کرده و دوباره تلاش کنید", type: "error" });
    }
  }

  // ✅ Check if user has a custom avatar
  const hasCustomAvatar =
    user.avatar &&
    user.avatar !== "" &&
    !user.avatar.includes("default.jpg");

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mt-10 text-center space-y-6 text-white">
        <h1 className="text-3xl font-bold">{user.name}</h1>

        <div className="flex flex-col items-center gap-3">
          <img
            src={avatarPreview  || "/avatars/default.jpg"}
            className="w-28 h-28 rounded-full border-4 border-cyan-800 object-cover"
          />

          <div className="flex gap-2 mt-2 justify-center">
            {hasCustomAvatar && (
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                onClick={handleDeleteAvatar}
              >
                حذف آواتار
              </button>
            )}

            {!hasCustomAvatar && (
              <label className="cursor-pointer bg-cyan-900 px-4 py-2 rounded-lg hover:bg-cyan-800 transition">
                تغییر آواتار
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => setCropFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
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
