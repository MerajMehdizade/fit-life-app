/* فقط استایل‌ها اصلاح شده‌اند — ساختار کاملاً مثل نسخه خودت است */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";
import type { ReactNode } from "react";
import NotificationBadge from "@/app/Components/NotificationBadge/NotificationBadge";

export default function AdminShell({ children,userId }: { children: ReactNode,userId: string }) {
  const pathname = usePathname();
  const { logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStudents, setMenuStudents] = useState(false);
  const [menuCoaches, setMenuCoaches] = useState(false);
  const [menuAdmins, setMenuAdmins] = useState(false);
  const [menuLogs, setMenuLogs] = useState(false);

  // کلاس‌های آماده برای راحتی
  const hoverClass = "hover:bg-pink-100 hover:text-pink-800 transition";
  const activeClass = "bg-pink-200 text-pink-900 font-bold";

  const isActive = (route: string) => pathname === route;
  const isParentActive = (route: string) => pathname.includes(route);

  return (
    <div className="container mx-auto px-5 md:p-5 font-vazir relative min-h-screen">

      {/* Mobile Menu */}
      <div className="md:hidden flex justify-start sticky top-0 right-0 z-30">
        <div className="cursor-pointer my-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/30 md:hidden z-40"></div>
      )}

      <div className="flex place-items-start gap-5 flex-row">

        {/* === SIDEBAR === */}
        <aside className={`w-64 md:w-72 fixed md:static top-0 right-0 h-full  
           border border-gray-500 rounded-l-2xl shadow-lg
          transform transition-transform duration-300 z-50 bg-stone-100
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:rounded-2xl`}>

          {/* Header */}
          <div className="text-center py-5 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-700">
              پنل <span className="text-pink-500">ادمین</span>
            </h1>
          </div>

          <div className="p-3 space-y-2">

            {/* داشبورد */}
            <Link
              href="/dashboard/admin"
              className={`block p-3 rounded-md text-right 
                ${isActive("/dashboard/admin") ? activeClass : hoverClass}`}
            >
              داشبورد اصلی
            </Link>



            <div>
              <button
                onClick={() => setMenuAdmins(!menuAdmins)}
                className={`w-full flex justify-between items-center p-3 rounded-md
                  ${isParentActive("/dashboard/admin/admins") ? activeClass : hoverClass}`}
              >
                <span>مدیریت ادمین ها</span>
                <svg className={`w-4 h-4 transition-transform ${menuAdmins ? "rotate-180" : ""}`} fill="none"
                  stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuAdmins && (
                <div className="pr-4 mt-2 space-y-1">
                  <Link href="/dashboard/admin/admins/create" className={`block p-2 rounded-md ${hoverClass}`}>
                    ساخت ادمین
                  </Link>
                  <Link href="/dashboard/admin/admins/list" className={`block p-2 rounded-md ${hoverClass}`}>
                    لیست ادمین ها
                  </Link>
                </div>
              )}
            </div>
            {/* مدیریت مربیان */}
            <div>
              <button
                onClick={() => setMenuCoaches(!menuCoaches)}
                className={`w-full flex justify-between items-center p-3 rounded-md
                  ${isParentActive("/dashboard/admin/coaches") ? activeClass : hoverClass}`}
              >
                <span>مدیریت مربیان</span>
                <svg className={`w-4 h-4 transition-transform ${menuCoaches ? "rotate-180" : ""}`} fill="none"
                  stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuCoaches && (
                <div className="pr-4 mt-2 space-y-1">
                  <Link href="/dashboard/admin/coaches/list" className={`block p-2 rounded-md ${hoverClass}`}>
                    لیست مربیان
                  </Link>
                  <Link href="/dashboard/admin/coaches/create" className={`block p-2 rounded-md ${hoverClass}`}>
                    ساخت مربی
                  </Link>
                  <Link href="/dashboard/admin/coaches/permissions" className={`block p-2 rounded-md ${hoverClass}`}>
                    دسترسی مربیان
                  </Link>
                  <Link href="/dashboard/admin/coaches/status" className={`block p-2 rounded-md ${hoverClass}`}>
                    وضعیت مربیان
                  </Link>
                </div>
              )}
            </div>

            {/* مدیریت دانشجوها */}
            <div>
              <button
                onClick={() => setMenuStudents(!menuStudents)}
                className={`w-full flex justify-between items-center p-3 rounded-md
                  ${isParentActive("/dashboard/admin/students") ? activeClass : hoverClass}`}
              >
                <span>مدیریت دانشجوها</span>
                <svg className={`w-4 h-4 transition-transform ${menuStudents ? "rotate-180" : ""}`} fill="none"
                  stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuStudents && (
                <div className="pr-4 mt-2 space-y-1">
                  <Link href="/dashboard/admin/students/list" className={`block p-2 rounded-md ${hoverClass}`}>
                    لیست دانشجوها
                  </Link>
                  <Link href="/dashboard/admin/students/create" className={`block p-2 rounded-md ${hoverClass}`}>
                    ساخت دانشجو
                  </Link>
                  <Link href="/dashboard/admin/students/assign" className={`block p-2 rounded-md ${hoverClass}`}>
                    انتساب به مربی
                  </Link>
                  <Link href="/dashboard/admin/students/status" className={`block p-2 rounded-md ${hoverClass}`}>
                    وضعیت دانشجوها
                  </Link>
                  <Link href="/dashboard/admin/students/no-plan" className={`block p-2 rounded-md ${hoverClass}`}>
                    دانشجویان بدون برنامه
                  </Link>
                </div>
              )}
            </div>



            {/* گزارش‌ها */}
            <div>
              <button
                onClick={() => setMenuLogs(!menuLogs)}
                className={`w-full flex justify-between items-center p-3 rounded-md ${hoverClass}`}
              >
                <span>گزارش‌ها و لاگ‌ها</span>
                <svg className={`w-4 h-4 transition-transform ${menuLogs ? "rotate-180" : ""}`} fill="none"
                  stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuLogs && (
                <div className="pr-4 mt-2 space-y-1">
                  <Link href="/dashboard/admin/logs/login" className={`block p-2 rounded-md ${hoverClass}`}>
                    گزارش ورودها
                  </Link>
                  <Link href="/dashboard/admin/logs/actions" className={`block p-2 rounded-md ${hoverClass}`}>
                    لاگ تغییرات
                  </Link>
                  <Link href="/dashboard/admin/logs/coach-activity" className={`block p-2 rounded-md ${hoverClass}`}>
                    فعالیت مربیان
                  </Link>
                </div>
              )}
            </div>

            {/* اعلان‌ها */}
            <Link
              href="/dashboard/admin/notifications"
              className={` p-3 rounded-md text-right flex ${hoverClass}`}
            >
              اعلان‌ها
              <NotificationBadge userId={userId} />
            </Link>

            {/* تنظیمات */}
            <Link
              href="/dashboard/admin/settings"
              className={`block p-3 rounded-md text-right ${hoverClass}`}
            >
              تنظیمات سیستم
            </Link>


            {/* خروج */}
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="block w-full p-3 rounded-md text-right text-red-500 hover:text-red-800 transition"
            >
              خروج
            </button>
          </div>
        </aside>

        <main className="flex-1 border border-gray-500 rounded-2xl shadow-lg
           bg-stone-100 text-black p-5 mt-2 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
