"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import { createCroppedBlob } from "@/lib/createCroppedBlob";
import Toast from "@/app/Components/toast/Toast";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [avatarSrc, setAvatarSrc] = useState("/avatars/default.webp");
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    if (user?.avatar) setAvatarSrc(user.avatar);
  }, [user]);

  const uploadAvatar = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("avatar", blob);
    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.success && data.avatar) {
        setUser(u => u ? { ...u, avatar: data.avatar } : null);
        setAvatarSrc(data.avatar);
        setToast({ show: true, message: "آواتار با موفقیت ذخیره شد", type: "success" });
      } else throw "";
    } catch {
      setToast({ show: true, message: "خطا در ذخیره آواتار", type: "error" });
    }
    setCropFile(null);
  };

  const deleteAvatar = async () => {
    try {
      const res = await fetch("/api/user/avatar/delete", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setUser(u => u ? { ...u, avatar: "" } : null);
        setAvatarSrc("/avatars/default.webp");
        setToast({ show: true, message: "آواتار حذف شد", type: "success" });
      }
    } catch {
      setToast({ show: true, message: "خطا در حذف آواتار", type: "error" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5 space-y-6">
      <h1 className="text-xl font-bold">حساب کاربری</h1>

      <div className="flex flex-col items-center gap-4">
        <img src={avatarSrc} className="w-28 h-28 rounded-full object-cover border-2 border-green-500" />
        <div className="flex gap-3">
          <button onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = e => setCropFile((e.target as HTMLInputElement).files?.[0] || null);
            input.click();
          }} className="px-4 py-2 rounded-xl bg-gray-700">
            تغییر تصویر
          </button>
          {avatarSrc !== "/avatars/default.webp" && (
            <button onClick={deleteAvatar} className="px-4 py-2 rounded-xl bg-red-500">
              حذف
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl space-y-2">
        <div>نام: {user.name}</div>
        <div>ایمیل: {user.email}</div>
        <div>نقش: {user.role}</div>
      </div>

      {cropFile && <AvatarCropper file={cropFile} onConfirm={async area => uploadAvatar(await createCroppedBlob(cropFile, area))} onCancel={() => setCropFile(null)} />}
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
