"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/UserContext";

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
  avatarUrl?: string;
  ariaLabel?: string;
  role?: string; // نقش داینامیک
};

export default function DropdownMenu({ items, avatarUrl, ariaLabel = "user menu", role }: Props) {
  const { user, logout, loading } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // آیتم‌های پیش‌فرض
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
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
        </svg>
      ),
      onClick: async () => await logout(),
      danger: true,
    },
  ];

  // اگر items داده نشد از default استفاده می‌کنیم
  const menuItems = items && items.length ? items : defaultItems;

  if (loading && !user && !(items && items.length)) {
    return (
      <div className="inline-block px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse" />
      </div>
    );
  }

  if (!user && (!items || items.length === 0)) return null;

  return (
    <div className="sticky top-0 left-0 z-50 bg-gray-900" ref={menuRef}>
      <div className="relative inline-block px-5 mt-5">
        {/* BUTTON */}
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={() => setOpen(!open)}
          className="flex text-sm bg-neutral-800 rounded-full focus:ring-4 focus:ring-neutral-600 transition-all duration-200"
        >
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={avatarUrl ?? user?.avatar ?? "/profileTest.webp"}
            alt="user photo"
          />
        </button>

        {/* MENU */}
        {open && (
          <div className="z-10 absolute bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg w-72 transition-all duration-200 translate-y-2">
            {/* USER INFO */}
            <div className="p-2">
              <div className="flex items-center px-2.5 p-2 gap-2 text-sm bg-neutral-700 rounded-lg">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={avatarUrl ?? user?.avatar ?? "/profileTest.webp"}
                  alt="user photo"
                />
                <div className="text-sm space-y-0.5">
                  <div className="font-medium capitalize text-white">{user?.name}</div>
                  <div className="truncate text-neutral-300 text-xs">{user?.email}</div>
                </div>
                <span className="border text-white text-xs font-medium px-2 py-1 rounded ms-auto">
                  {role ?? user?.role ?? "role"}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <ul className="px-2 pb-2 text-sm text-neutral-300 font-medium space-y-1">
              {menuItems.map((it, idx) =>
                it.label === "---" ? (
                  <li key={`sep-${idx}`} className="border-t border-neutral-700 pt-1" />
                ) : it.href ? (
                  <li key={it.id ?? it.label}>
                    <a
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className={`inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white rounded gap-2 ${it.className ?? ""}`}
                    >
                      {it.icon && <span>{it.icon}</span>}
                      {it.label}
                    </a>
                  </li>
                ) : (
                  <li key={it.id ?? it.label}>
                    <button
                      onClick={async () => {
                        setOpen(false);
                        if (it.onClick) await it.onClick();
                      }}
                      className={`inline-flex items-center w-full p-2 hover:bg-neutral-600 transition-colors duration-200 ease-out hover:text-white rounded gap-2 ${it.danger ? "text-red-400" : ""}`}
                    >
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
    </div>
  );
}
