"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import { createCroppedBlob } from "@/lib/createCroppedBlob";
import Toast from "@/app/Components/toast/Toast";
import Loading from "@/app/Components/LoadingSpin/Loading";
import ProfileHeader from "../_Components/profile/ProfileHeader";
import BodyOverview from "../_Components/profile/BodyOverview";
import TrainingOverview from "../_Components/profile/TrainingOverview";
import NutritionOverview from "../_Components/profile/NutritionOverview";

export default function ProfilePage() {
  const { user, setUser, logout, loading } = useUser();
  const router = useRouter();
  const [avatarSrc, setAvatarSrc] = useState("/avatars/default.png");
  const [cropFile, setCropFile] = useState<File | null>(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (user?.avatar) setAvatarSrc(user.avatar);
  }, [user]);

  /* ================= Avatar Upload ================= */

  const uploadAvatar = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("avatar", blob);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setUser((u: any) => (u ? { ...u, avatar: data.avatar } : null));
      setAvatarSrc(data.avatar);

      setToast({
        show: true,
        message: "تصویر پروفایل با موفقیت ذخیره شد",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "خطا در ذخیره تصویر",
        type: "error",
      });
    }

    setCropFile(null);
  };

  /* ================= Avatar Delete ================= */

  const deleteAvatar = async () => {
    try {
      const res = await fetch("/api/user/avatar/delete", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setUser((u: any) => (u ? { ...u, avatar: "" } : null));
      setAvatarSrc("/avatars/default.png");

      setToast({
        show: true,
        message: "تصویر حذف شد",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "خطا در حذف تصویر",
        type: "error",
      });
    }
  };

  /* ================= Logout ================= */

  const handleLogout = async () => {
    await logout();

    setToast({
      show: true,
      message: "با موفقیت خارج شدید",
      type: "success",
    });

    setTimeout(() => {
      router.replace("/login");
    }, 800);
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className=" text-gray-100 py-10 px-6">

      <div className="max-w-6xl mx-auto space-y-8 mt-10">

        <ProfileHeader
          user={user}
          avatarSrc={avatarSrc}
          onChangeAvatar={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) =>
              setCropFile((e.target as HTMLInputElement).files?.[0] || null);
            input.click();
          }}
          onDeleteAvatar={deleteAvatar}
          onHandleLogOut={handleLogout}
        />
        <BodyOverview profile={user.profile} />
        <TrainingOverview profile={user.profile} />
        <NutritionOverview profile={user.profile} />
        
      </div>

      {/* ================= Avatar Cropper ================= */}

      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onConfirm={async (area: any) =>
            uploadAvatar(await createCroppedBlob(cropFile, area))
          }
          onCancel={() => setCropFile(null)}
        />
      )}

      {/* ================= Toast ================= */}

      <Toast
        {...toast}
        onClose={() => setToast({ ...toast, show: false })}
      />

    </div>
  );
}
