"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/UserContext";
import AvatarCropper from "@/app/Components/AvatarCropper/AvatarCropper";
import { createCroppedBlob } from "@/lib/createCroppedBlob";
import Toast from "@/app/Components/toast/Toast";

type DropdownItem = {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  className?: string;
  icon?: React.ReactNode;
  danger?: boolean;
};

type Props = {
  items?: DropdownItem[];
  avatarUrl?:string;
  ariaLabel?: string;
  role?: string;
};

export default function DropdownMenu({ items, ariaLabel = "user menu", role }: Props) {
  const { user, logout, setUser, loading } = useUser();
  const [open, setOpen] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || "/avatars/default.webp");

  useEffect(() => {
    setAvatarSrc(user?.avatar ? `${user.avatar}?t=${Date.now()}` : "/avatars/default.webp");
  }, [user?.avatar]);

  // بستن منو وقتی کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setAvatarMenu(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAvatarUpload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("avatar", blob);
    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.success && data.avatar) {
        setAvatarSrc(data.avatar);
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : null);
        setCropFile(null);
        setAvatarMenu(false);
        setToast({ show: true, message: "آواتار با موفقیت آپلود شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در آپلود آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const res = await fetch("/api/user/avatar/delete", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAvatarSrc("/avatars/default.webp");
        setUser(prev => prev ? { ...prev, avatar: "" } : null);
        setAvatarMenu(false);
        setToast({ show: true, message: "آواتار حذف شد", type: "success" });
      } else {
        setToast({ show: true, message: data.error || "خطا در حذف آواتار", type: "error" });
      }
    } catch {
      setToast({ show: true, message: "خطا در ارتباط با سرور", type: "error" });
    }
  };

  const defaultItems: DropdownItem[] = [
    { id: "profile", label: "حساب کاربری", href: "/profile" },
    { id: "personal", label: "اطلاعات فردی", href: "/info" },
    { id: "stats", label: "آمار بدنی", href: "/stats" },
    { id: "train-pref", label: "ترجیحات تمرینی", href: "/training-preferences" },
    { id: "food", label: "تنظیمات تغذیه", href: "/nutrition" },
    { id: "sep-1", label: "---" },
    {
      id: "logout",
      label: "خروج",
      onClick: async () => await logout(),
      danger: true,
    },
  ];

  const menuItems = items && items.length ? items : defaultItems;

  if (loading && !user && !(items && items.length)) return <div className="inline-block w-10 h-10 rounded-full bg-neutral-700 animate-pulse" />;
  if (!user && (!items || items.length === 0)) return null;

  return (
    <div className="sticky top-0 left-0 z-50 bg-gray-900" ref={menuRef}>
      <div className="relative inline-block px-5 mt-5">
        {/* عکس آواتار اصلی داخل دراپ */}
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={() => setOpen(prev => !prev)}
          className="flex text-sm bg-neutral-800 rounded-full focus:ring-4 focus:ring-neutral-600 transition-all duration-200"
        >
          <img
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            src={avatarSrc}
            alt="user photo"
          />
        </button>

        {/* منو */}
        {open && (
          <div className="z-10 absolute bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg w-72 transition-all duration-200 translate-y-2">
            {/* Header */}
            <div className="p-2">
              <div className="flex items-center px-2.5 p-2 gap-2 text-sm bg-neutral-700 rounded-lg">
                <div className="relative">
                  <img
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    src={avatarSrc}
                    alt="user photo"
                    onClick={e => {
                      e.stopPropagation();
                      setAvatarMenu(prev => !prev);
                    }}
                  />
                  {/* منوی کوچک برای Edit/Delete */}
                  {avatarMenu && (
                    <div className="absolute top-full mt-2 right-0 bg-neutral-700 border border-neutral-600 rounded-lg shadow-lg w-32 z-20">
                      <button
                        className="w-full p-2 text-sm hover:bg-neutral-600"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = e => setCropFile((e.target as HTMLInputElement).files?.[0] || null);
                          input.click();
                        }}
                      >
                        ویرایش
                      </button>
                      <button
                        className="w-full p-2 text-sm hover:bg-red-600 text-white"
                        onClick={handleAvatarDelete}
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm space-y-0.5">
                  <div className="font-medium capitalize text-white">{user?.name}</div>
                  <div className="truncate text-neutral-300 text-xs">{user?.email}</div>
                </div>
                <span className="border text-white text-xs font-medium px-2 py-1 rounded ms-auto">{role ?? user?.role ?? "role"}</span>
              </div>
            </div>

            {/* سایر آیتم‌ها */}
            <ul className="px-2 pb-2 text-sm text-neutral-300 font-medium space-y-1">
              {menuItems.map((it, idx) =>
                it.label === "---" ? (
                  <li key={`sep-${idx}`} className="border-t border-neutral-700 pt-1" />
                ) : it.href ? (
                  <li key={it.id ?? it.label}>
                    <a href={it.href} onClick={() => setOpen(false)} className={`inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white rounded gap-2 ${it.className ?? ""}`}>
                      {it.icon && <span>{it.icon}</span>}
                      {it.label}
                    </a>
                  </li>
                ) : (
                  <li key={it.id ?? it.label}>
                    <button onClick={async () => { setOpen(false); if (it.onClick) await it.onClick(); }} className={`inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white rounded gap-2 ${it.danger ? "text-red-400" : ""}`}>
                      {it.icon && <span>{it.icon}</span>}
                      {it.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* کراپ و آپلود */}
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onConfirm={async area => {
            const blob = await createCroppedBlob(cropFile, area);
            handleAvatarUpload(blob);
          }}
          onCancel={() => setCropFile(null)}
        />
      )}

      {/* Toast */}
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
