"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import type { JSX, ReactNode } from "react";
import NotificationBadge from "@/app/Components/NotificationBadge/NotificationBadge";
import { useRouter } from "next/navigation";

type SheetKey = "users" | "actions" | "settings";
type NavKey = SheetKey | "dashboard" | "notifications";

function isSheetKey(key: NavKey): key is SheetKey {
  return key === "users" || key === "actions" || key === "settings";
}

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
  const { logout } = useUser();
  const [openUserStudents, setOpenUserStudents] = useState(false);
  const [openUserCoaches, setOpenUserCoaches] = useState(false);
  const [openSheet, setOpenSheet] = useState<SheetKey | null>(null);
  const router = useRouter();

  const handleNavClick = (item: MobileNavItem) => {
    if (isSheetKey(item.key)) {
      setOpenSheet(item.key);
    } else if (item.url) {
      router.push(item.url);
    }
  };

  const isActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };
  const sheets: Record<SheetKey, SheetItem[]> = {
    users: [
      { title: "مدیریت ادمین‌ها", url: "/dashboard/admin/admins/list" },
      { title: "مدیریت دانشجوها", url: "/dashboard/admin/students/list" },
      { title: "مدیریت مربی‌ها", url: "/dashboard/admin/coaches/list" },
    ],
    actions: [
      { title: "افزودن دانشجو", url: "/dashboard/admin/students/create" },
      { title: "افزودن مربی", url: "/dashboard/admin/coaches/create" },
      { title: "افزودن ادمین", url: "/dashboard/admin/admins/create" },
    ],
    settings: [
      { title: "تنظیمات سیستم", url: "/dashboard/admin/settings" },
      { title: "لاگ ورود", url: "/dashboard/admin/logs/login" },
      { title: "لاگ تغییرات", url: "/dashboard/admin/logs/actions" },
      { title: "فعالیت مربیان", url: "/dashboard/admin/logs/coach-activity" },
      {
        title: "خروج از حساب",
        action: "logout",
        danger: true,
      },
    ],
  };

  const isNavActive = (item: MobileNavItem) => {
    if (item.key === "dashboard") {
      return pathname === "/dashboard/admin";
    }

    if (item.key === "notifications") {
      return pathname.startsWith("/dashboard/admin/notifications");
    }

    if (item.key === "users") {
      return (
        pathname.startsWith("/dashboard/admin/students") ||
        pathname.startsWith("/dashboard/admin/coaches") ||
        pathname.startsWith("/dashboard/admin/admins")
      );
    }

    if (item.key === "actions") {
      return pathname.includes("/create");
    }

    if (item.key === "settings") {
      return (
        pathname.startsWith("/dashboard/admin/settings") ||
        pathname.startsWith("/dashboard/admin/logs") ||
        pathname.startsWith("/dashboard/admin/logs/coach-activity")
      );
    }

    return false;
  };

  const mobileNavItem: MobileNavItem[] = [
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
    {
      key: "notifications",
      title: "اعلان‌ها",
      url: "/dashboard/admin/notifications",
      badge: <NotificationBadge />,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      ),
    },
    {
      key: "dashboard",
      title: "داشبورد",
      url: "/dashboard/admin",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      key: "users",
      title: "کاربران",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      key: "actions",
      title: "عملیات",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-5 md:p-5 font-vazir relative min-h-screen">

      <div
        className={`fixed inset-0 z-40 transition-all duration-300
    ${openSheet ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpenSheet(null)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300
      ${openSheet ? "opacity-100" : "opacity-0"}`}
        />

        {/* Sheet */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-gray-800 rounded-t-2xl p-4
      transform transition-transform duration-300 ease-out text-white
      ${openSheet ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-4" />

          {openSheet === "users" ? (
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/admin/admins/list"
                  onClick={() => setOpenSheet(null)}
                  className="block p-3 rounded-xl bg-gray-700 text-white text-sm font-medium"
                >
                  مدیریت ادمین‌ها
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setOpenUserStudents(!openUserStudents)}
                  className="w-full flex justify-between items-center p-3 rounded-xl bg-gray-700 text-sm font-medium"
                >
                  <span>دانشجوها</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openUserStudents ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out
    ${openUserStudents ? "max-h-40 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}`}
                >
                  <div className="mt-2 pr-5 space-y-3 transform transition-transform duration-500">
                    <Link
                      href="/dashboard/admin/students/list"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/students/list")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      لیست دانشجوها
                    </Link>
                    <Link
                      href="/dashboard/admin/students/assign"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/students/assign")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      انتساب به مربی
                    </Link>
                    <Link
                      href="/dashboard/admin/students/status"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/students/status")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      وضعیت دانشجو
                    </Link>
                    <Link
                      href="/dashboard/admin/students/no-plan"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/students/no-plan")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      دانشجویان بدون برنامه
                    </Link>
                  </div>
                </div>

              </li>

              <li>
                <button
                  onClick={() => setOpenUserCoaches(!openUserCoaches)}
                  className="w-full flex justify-between items-center p-3 rounded-xl bg-gray-700 text-sm font-medium"
                >
                  <span>مربی‌ها</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openUserCoaches ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out
    ${openUserCoaches ? "max-h-32 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}`}
                >
                  <div className="mt-2 pr-5 space-y-3">
                    <Link
                      href="/dashboard/admin/coaches/list"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/coaches/list")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      لیست مربیان
                    </Link>
                    <Link
                      href="/dashboard/admin/coaches/permissions"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/coaches/permissions")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      دسترسی مربیان
                    </Link>
                    <Link
                      href="/dashboard/admin/coaches/status"
                      onClick={() => setOpenSheet(null)}
                      className={`block text-sm text-white
  ${isActive("/dashboard/admin/coaches/status")
                          ? "text-black font-medium"
                          : "text-gray-700"
                        }
`}

                    >
                      وضعیت مربیان
                    </Link>
                  </div>
                </div>

              </li>
            </ul>
          ) : (

            <ul className="space-y-3">
              {openSheet &&
                sheets[openSheet].map((item, i) => {
                  if (item.action === "logout") {
                    return (
                      <li key={i}>
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
                        className={`block p-3 rounded-xl text-sm font-medium
  ${isActive(item.url)
                            ? "bg-gray-500 text-white"
                            : "bg-gray-700 text-white"
                          }
`}
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

      <nav className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-950  shadow-lg rounded-t-xl z-30">
        <ul className="flex justify-around items-center h-16 ">
          {mobileNavItem.map((item) => (
            <li
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition
                ${isNavActive(item) ? "text-gray-100" : "text-gray-400"}
              `}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {children}
      </main>

    </div>
  );
}