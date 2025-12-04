"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DropdownMenu from "@/app/Components/DropdownMenu/DropdownMenu";
import { useUser } from "@/app/context/UserContext";

export default function AdminDashboard() {
  const { logout } = useUser();
  return (
    <div className="bg-gray-900 min-h-screen text-white">

      <DropdownMenu
        role="Admin"
        items={[
          { label: "برنامه تمرینی", href: "/program" },
          { label: "ترجیحات", href: "/preferences" },
          { label: "خروج", onClick: logout, danger: true },
        ]}
      />

      <div className="mt-5 text-center space-y-5">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <p>مدیریت مربی‌ها و کاربران</p>
        <div className="space-x-4">
          <Link
          href="/dashboard/admin/users/create-user"
          className="p-2 bg-green-500 rounded-xl inline-block"
        >
          اضافه کردن نقش
        </Link>
        <Link
          href="/dashboard/admin/users"
          className="p-2 bg-green-500 rounded-xl inline-block"
        >
          مدیریت یوزر ها
        </Link>
        <Link
          href="/dashboard/admin/assign"
          className="p-2 bg-green-500 rounded-xl inline-block"
        >
         اختصاص دادن یوزر به مربی
        </Link>
        </div>
      </div>
    </div>

  );
}
