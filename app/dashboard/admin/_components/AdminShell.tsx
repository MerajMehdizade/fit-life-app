"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState, type ReactNode, type JSX } from "react";
import NotificationBadge from "@/app/Components/NotificationBadge/NotificationBadge";

type SheetKey = "settings";
type NavKey = SheetKey | "coaches" | "students" | "admins" | "notifications";

type MobileNavItem = {
  key: NavKey;
  title: string;
  icon: JSX.Element;
  url?: string;
  badge?: ReactNode;
};

type SheetItem = {
  title: string;
  url?: string;
  action?: "logout";
  danger?: boolean;
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const [openSheet, setOpenSheet] = useState<SheetKey | null>(null);

  const isActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const handleNavClick = (item: MobileNavItem) => {
    if (item.key === "settings") {
      setOpenSheet(openSheet === "settings" ? null : "settings");
    } else if (item.url) {
      router.push(item.url);
    }
  };

  const sheets: Record<SheetKey, SheetItem[]> = {
    settings: [
      { title: "تنظیمات سیستم", url: "/dashboard/admin/settings" },
      { title: "لاگ", url: "/dashboard/admin/logs" },
      { title: "خروج از حساب", action: "logout", danger: true },
    ],
  };

  const mobileNavItem: MobileNavItem[] = [
    {
      key: "notifications",
      title: "اعلان‌ها",
      url: "/dashboard/admin/notifications",
      badge: <NotificationBadge />,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />    </svg>
      ),
    },
    {
      key: "coaches",
      title: "مربیان",
      url: "/dashboard/admin/coaches/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>

      ),
    },
    {
      key: "admins",
      title: "ادمین",
      url: "/dashboard/admin/admins/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>

      ),
    },
    {
      key: "students",
      title: "دانشجویان",
      url: "/dashboard/admin/students/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

      ),
    },


    {
      key: "settings",
      title: "تنظیمات",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-5 md:p-5 font-vazir relative">
      {/* Sheet */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${openSheet ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpenSheet(null)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${openSheet ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute bottom-0 inset-x-0 bg-gray-800 rounded-t-2xl p-4 transform transition-transform duration-300 ease-out text-white max-h-[90vh] overflow-y-auto ${openSheet ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-4" />
          {openSheet && (
            <ul className="space-y-3 ">
              {sheets[openSheet].map((item, i) => {
                if (item.action === "logout") {
                  return (
                    <li key={i} className="text-xs">
                      <button
                        onClick={() => {
                          logout();
                          setOpenSheet(null);
                        }}
                        className="w-full text-center p-3 rounded-xl text-white bg-red-500 active:bg-red-100 font-medium"
                      >
                        {item.title}
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={i}>
                    <Link
                      href={item.url!}
                      onClick={() => setOpenSheet(null)}
                      className={`block p-3 rounded-xl text-sm font-medium ${isActive(item.url) ? "bg-gray-500 text-white" : "bg-gray-700 text-white"}`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-950 shadow-lg rounded-t-xl z-30">
        <ul className="flex justify-around items-center h-16">
          {mobileNavItem.map((item) => (
            <li
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition w-32 ${isActive(item.url) ? "text-gray-100" : "text-gray-400"}`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && <span className="absolute -top-1 -right-1">{item.badge}</span>}
              </div>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </nav>

      <main className="p-4 pb-20 sm:p-10 bg-gray-900 text-gray-100">{children}</main>
    </div>
  );
}
