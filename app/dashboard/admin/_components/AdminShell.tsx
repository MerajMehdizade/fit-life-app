
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState, type ReactNode } from "react";
import NotificationBadge from "@/app/Components/NotificationBadge/NotificationBadge";

import SettingsSheet from "@/app/Components/SettingsSheet/SettingsSheet";
import BottomNav from "@/app/Components/BottomNav/BottomNav";
import type { MobileNavItemType } from "@/app/Components/MobileNavItem/MobileNavItem";

type SheetKey = "settings";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const [openSheet, setOpenSheet] = useState<SheetKey | null>(null);

  const isActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const sheets = {
    settings: [
      { title: "تنظیمات سیستم", url: "/dashboard/admin/settings" },
      { title: "لاگ", url: "/dashboard/admin/logs" },
      { title: "خروج از حساب", action: "logout" as const, danger: true },
    ],
  };
  const mobileNavItems: MobileNavItemType[] = [
    {
      key: "notifications",
      title: "اعلان‌ها",
      url: "/dashboard/admin/notifications",
      badge: <NotificationBadge />,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bell"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
      ),
    },
    {
      key: "coaches",
      title: "مربیان",
      url: "/dashboard/admin/coaches/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>

      ),
    },
    {
      key: "admins",
      title: "ادمین",
      url: "/dashboard/admin/admins/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-shield"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 21v-2a4 4 0 0 1 4 -4h2" /><path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /></svg>

      ),
    },
    {
      key: "students",
      title: "دانشجویان",
      url: "/dashboard/admin/students/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
      ),
    },


    {
      key: "settings",
      title: "تنظیمات",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
      ),
    },
  ];


  const handleNavClick = (item: MobileNavItemType) => {
    if (item.key === "settings") {
      setOpenSheet(openSheet === "settings" ? null : "settings");
    } else if (item.url) {
      router.push(item.url);
    }
  };

  return (
    <div className="container mx-auto px-5 md:p-5 font-vazir relative">
      <SettingsSheet openSheet={openSheet} sheets={sheets} setOpenSheet={setOpenSheet} logout={logout} isActive={isActive} />
      <BottomNav items={mobileNavItems} isActive={isActive} handleNavClick={handleNavClick} />
      <main>{children}</main>
    </div>
  );
}
